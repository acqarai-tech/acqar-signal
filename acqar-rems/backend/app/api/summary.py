# backend/app/api/summary.py

from fastapi import APIRouter, Request, HTTPException, Header
from datetime import datetime, timezone
import time
import os
import httpx
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/summary", tags=["summary"])

# In-memory cache
_cache = {
    "content": None,
    "generated_at": 0,
    "event_count": 0,
}
CACHE_TTL = 3600  # 60 minutes — reduces API calls


def _get_last_24h_events(store: dict) -> list:
    cutoff = time.time() - 86400
    events = [
        e for e in store.values()
        if e.get("created_at_ts", 0) >= cutoff
    ]
    events.sort(
        key=lambda x: (x.get("severity", 0), x.get("created_at_ts", 0)),
        reverse=True
    )
    return events[:60]


def _build_prompt(events: list) -> str:
    lines = []
    for e in events:
        cat   = e.get("category", "general").upper()
        area  = e.get("location_name", "Dubai")
        sev   = e.get("severity", 1)
        title = e.get("title", "")
        source = e.get("source", "")
        price = e.get("price_aed")

        price_str = ""
        if price and price >= 1_000_000:
            price_str = f" AED {price/1_000_000:.1f}M"
        elif price and price >= 1_000:
            price_str = f" AED {price/1_000:.0f}K"

        lines.append(
            f"[{cat}][{area}][S{sev}] {title}{price_str} ({source})"
        )

    feed_text = "\n".join(lines)

    return f"""You are a senior Dubai real estate market analyst for ACQAR SIGNAL.

Analyze the following {len(events)} market signals from the last 24 hours and write a structured intelligence briefing.

SIGNALS:
{feed_text}

Write the briefing with these exact sections:

**Market Overview**
2-3 sentences on overall market tone today.

**Top Developments**
The 3 most significant events with brief analysis.

**Hot Areas**
Which Dubai areas had the most activity and why.

**Sentiment**
Bullish / Neutral / Bearish with one clear reason.

**Watch List**
2-3 things to monitor in the next 48 hours.

Be concise and data-driven. Use AED figures where present."""


async def _call_gemini(prompt: str) -> str:
    """Call Gemini with fallback models if rate limited."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set in environment")

    # Try models in order — lite has higher free tier limits
    models = [
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
    ]

    last_error = None

    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "maxOutputTokens": 900,
                "temperature": 0.4,
            }
        }

        try:
            async with httpx.AsyncClient(timeout=45) as client:
                resp = await client.post(url, json=body)

                if resp.status_code == 429:
                    logger.warning(f"Rate limited on {model}, trying next...")
                    last_error = f"Rate limited on {model}"
                    continue

                resp.raise_for_status()
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                logger.info(f"Summary generated using {model}")
                return text

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                last_error = f"Rate limited on {model}"
                logger.warning(f"Rate limited on {model}, trying next...")
                continue
            raise

    raise Exception(
        f"All Gemini models rate limited. Try again in 1 minute. Last: {last_error}"
    )


@router.get("")
async def get_ai_summary(
    request: Request,
    x_user_plan: str = Header(default="free"),
):
    # Pro gate
    if x_user_plan.lower() != "pro":
        raise HTTPException(
            status_code=403,
            detail={
                "error": "pro_required",
                "message": "AI Daily Briefing is a Pro feature. Upgrade at acqar.ai",
            },
        )

    # Cache hit — serve cached if still fresh
    age = time.time() - _cache["generated_at"]
    if _cache["content"] and age < CACHE_TTL:
        return {
            "summary": _cache["content"],
            "cached": True,
            "generated_at": _cache["generated_at"],
            "event_count": _cache["event_count"],
            "cache_expires_in": int(CACHE_TTL - age),
        }

    # Get events
    store = request.app.state.events_store
    events = _get_last_24h_events(store)

    if len(events) < 3:
        return {
            "summary": "Insufficient market signals in the last 24 hours. Check back soon.",
            "cached": False,
            "event_count": len(events),
        }

    try:
        prompt = _build_prompt(events)
        summary = await _call_gemini(prompt)

        _cache["content"] = summary
        _cache["generated_at"] = time.time()
        _cache["event_count"] = len(events)

        logger.info(f"AI summary generated from {len(events)} events")

        return {
            "summary": summary,
            "cached": False,
            "generated_at": _cache["generated_at"],
            "event_count": len(events),
            "cache_expires_in": CACHE_TTL,
        }

    except Exception as e:
        logger.error(f"AI summary generation failed: {e}")

        # If we have old cached content, return it instead of erroring
        if _cache["content"]:
            logger.info("Returning stale cache due to error")
            return {
                "summary": _cache["content"],
                "cached": True,
                "stale": True,
                "generated_at": _cache["generated_at"],
                "event_count": _cache["event_count"],
                "cache_expires_in": 0,
            }

        raise HTTPException(
            status_code=503,
            detail={"error": "generation_failed", "message": str(e)},
        )


@router.post("/refresh")
async def force_refresh_summary(
    request: Request,
    x_user_plan: str = Header(default="free"),
):
    if x_user_plan.lower() != "pro":
        raise HTTPException(status_code=403, detail="Pro required")

    _cache["content"] = None
    _cache["generated_at"] = 0
    return {"message": "Cache cleared. Next GET /api/summary will regenerate."}
