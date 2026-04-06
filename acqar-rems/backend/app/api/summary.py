# backend/app/api/summary.py

from fastapi import APIRouter, Request, HTTPException, Header
import time
import logging
from collections import Counter
from datetime import datetime, timezone

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/summary", tags=["summary"])

_cache = {
    "content": None,
    "generated_at": 0,
    "event_count": 0,
}
CACHE_TTL = 3600


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
    return events


def _generate_summary(events: list) -> str:
    if len(events) < 3:
        return "Insufficient market signals in the last 24 hours. Check back soon."

    categories = Counter(e.get("category", "general") for e in events)
    top_cat = categories.most_common(1)[0][0]

    areas = Counter(e.get("location_name", "Dubai") for e in events)
    top_areas = [a for a, _ in areas.most_common(3)]

    high_sev = [e for e in events if e.get("severity", 1) >= 4]
    critical = [e for e in events if e.get("severity", 1) == 5]
    avg_sev = sum(e.get("severity", 1) for e in events) / len(events)

    top_events = sorted(events, key=lambda x: x.get("severity", 0), reverse=True)[:3]

    bullish_cats = {"transaction", "investment", "offplan", "foreign_buyers"}
    bearish_cats = {"regulatory"}

    bullish_count = sum(1 for e in events if e.get("category") in bullish_cats)
    bearish_count = sum(1 for e in events if e.get("category") in bearish_cats)

    if avg_sev >= 3.5 or len(critical) >= 2:
        sentiment = "Bearish"
        sentiment_reason = str(len(high_sev)) + " high-severity signals detected in the last 24 hours indicate elevated market stress."
    elif bullish_count > bearish_count * 1.5:
        sentiment = "Bullish"
        sentiment_reason = "Transaction and investment signals dominate at " + str(bullish_count) + " events, outpacing regulatory concerns."
    elif bearish_count > bullish_count:
        sentiment = "Bearish"
        sentiment_reason = "Regulatory signals are elevated with " + str(bearish_count) + " events flagged in the monitoring window."
    else:
        sentiment = "Neutral"
        sentiment_reason = "Mixed signals across " + str(len(categories)) + " categories with no dominant trend direction."

    cat_labels = {
        "transaction": "Transaction Activity",
        "offplan": "Off-Plan Launches",
        "investment": "Investment Flow",
        "regulatory": "Regulatory",
        "infrastructure": "Infrastructure",
        "construction": "Construction",
        "price_signal": "Price Signals",
        "rental_yield": "Rental Yield",
        "foreign_buyers": "Foreign Buyer Activity",
        "freezone": "Free Zone Activity",
    }

    top_cat_label = cat_labels.get(top_cat, top_cat.title())
    top_areas_str = ", ".join(top_areas)

    overview = (
        "Dubai's real estate market generated "
        + str(len(events))
        + " signals over the last 24 hours, with "
        + top_cat_label
        + " emerging as the dominant theme. Activity is concentrated in "
        + top_areas_str
        + ", with "
        + str(len(high_sev))
        + " high-priority events requiring close attention."
    )

    dev_lines = []
    for i, e in enumerate(top_events, 1):
        title = e.get("title", "Untitled event")
        area = e.get("location_name", "Dubai")
        source = e.get("source", "")
        sev = e.get("severity", 1)
        price = e.get("price_aed")

        price_str = ""
        if price and price >= 1_000_000:
            price_str = " valued at AED " + str(round(price / 1_000_000, 1)) + "M"
        elif price and price >= 1_000:
            price_str = " valued at AED " + str(round(price / 1_000)) + "K"

        sev_label = {1: "Low", 2: "Low", 3: "Medium", 4: "High", 5: "Critical"}.get(sev, "Medium")
        src_str = " (" + source + ")" if source else ""

        dev_lines.append(
            str(i) + ". " + title + price_str + " in " + area + src_str + ". Severity: " + sev_label + "."
        )

    developments = "\n".join(dev_lines)

    area_details = []
    for area, count in areas.most_common(3):
        area_events = [e for e in events if e.get("location_name") == area]
        area_cats = Counter(e.get("category") for e in area_events)
        top_area_cat = cat_labels.get(area_cats.most_common(1)[0][0], "General")
        area_details.append(area + " (" + str(count) + " signals, led by " + top_area_cat + ")")

    hot_areas = ", ".join(area_details) + "."

    watch_items = []

    if len(critical) > 0:
        watch_items.append(
            "Monitor " + str(len(critical)) + " critical-severity signal(s) for escalation in the next 48 hours."
        )

    if "regulatory" in categories and categories["regulatory"] >= 2:
        watch_items.append(
            "Track regulatory developments. Multiple policy signals may indicate upcoming market rule changes."
        )

    if "offplan" in categories and categories["offplan"] >= 2:
        watch_items.append(
            "Watch off-plan launch momentum in " + top_areas[0] + ". " + str(categories["offplan"]) + " launches detected."
        )

    if "price_signal" in categories:
        watch_items.append(
            "Price signal activity detected. Monitor AED/sqft movements in active areas."
        )

    if len(watch_items) == 0:
        watch_items.append(
            "Continue monitoring " + top_areas[0] + " for follow-through on current activity levels."
        )
        watch_items.append(
            "Watch for any regulatory announcements that may impact transaction volumes."
        )

    watch_list = "\n".join(str(i + 1) + ". " + w for i, w in enumerate(watch_items[:3]))

    now = datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC")

    summary = (
        "**Market Overview**\n"
        + overview
        + "\n\n**Top Developments**\n"
        + developments
        + "\n\n**Hot Areas**\n"
        + hot_areas
        + "\n\n**Sentiment**\n"
        + sentiment + ". " + sentiment_reason
        + "\n\n**Watch List**\n"
        + watch_list
        + "\n\n---\nGenerated: " + now
        + " | " + str(len(events)) + " signals analysed"
    )

    return summary


@router.get("")
async def get_ai_summary(
    request: Request,
    x_user_plan: str = Header(default="free"),
):
    if x_user_plan.lower() != "pro":
        raise HTTPException(
            status_code=403,
            detail={
                "error": "pro_required",
                "message": "AI Daily Briefing is a Pro feature. Upgrade at acqar.ai",
            },
        )

    age = time.time() - _cache["generated_at"]
    if _cache["content"] and age < CACHE_TTL:
        return {
            "summary": _cache["content"],
            "cached": True,
            "generated_at": _cache["generated_at"],
            "event_count": _cache["event_count"],
            "cache_expires_in": int(CACHE_TTL - age),
        }

    store = request.app.state.events_store
    events = _get_last_24h_events(store)

    summary = _generate_summary(events)

    _cache["content"] = summary
    _cache["generated_at"] = time.time()
    _cache["event_count"] = len(events)

    return {
        "summary": summary,
        "cached": False,
        "generated_at": _cache["generated_at"],
        "event_count": len(events),
        "cache_expires_in": CACHE_TTL,
    }


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
