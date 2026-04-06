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
    current_year = str(datetime.now(timezone.utc).year)

    events = []
    for e in store.values():
        if e.get("is_seed", False) or e.get("is_demo", False):
            continue

        if e.get("created_at_ts", 0) < cutoff:
            continue

        title = e.get("title", "").lower()
        summary_text = e.get("summary", "").lower()
        text = title + " " + summary_text

        skip = False
        for old_year in ["2020", "2021", "2022", "2023", "2024", "2025"]:
            if old_year in text and current_year not in text:
                skip = True
                break

        if not skip:
            events.append(e)

    events.sort(
        key=lambda x: (x.get("severity", 0), x.get("created_at_ts", 0)),
        reverse=True
    )
    return events


def _generate_summary(events: list) -> str:
    now = datetime.now(timezone.utc)
    today = now.strftime("%d %B %Y")

    if len(events) < 3:
        return (
            "ACQAR SIGNAL - Dubai Real Estate Daily Briefing\n"
            + today + "\n\n"
            + "Live market signals are still being collected for today. "
            + "The full briefing auto-generates once sufficient real-time data is available. "
            + "Check back in 15 minutes or click refresh."
        )

    categories = Counter(e.get("category", "general") for e in events)
    top_cat = categories.most_common(1)[0][0]

    areas = Counter(e.get("location_name", "Dubai") for e in events)
    top_areas = [a for a, _ in areas.most_common(3)]

    high_sev = [e for e in events if e.get("severity", 1) >= 4]
    critical = [e for e in events if e.get("severity", 1) == 5]
    avg_sev = sum(e.get("severity", 1) for e in events) / len(events)

    top_events = sorted(events, key=lambda x: x.get("severity", 0), reverse=True)[:5]

    bullish_cats = {"transaction", "investment", "offplan", "foreign_buyers"}
    bearish_cats = {"regulatory"}

    bullish_count = sum(1 for e in events if e.get("category") in bullish_cats)
    bearish_count = sum(1 for e in events if e.get("category") in bearish_cats)

    if avg_sev >= 3.5 or len(critical) >= 2:
        sentiment = "Bearish"
        sentiment_reason = (
            str(len(high_sev))
            + " high-severity signals indicate elevated market stress today."
        )
    elif bullish_count > bearish_count * 1.5:
        sentiment = "Bullish"
        sentiment_reason = (
            "Transaction and investment signals dominate with "
            + str(bullish_count)
            + " positive events today."
        )
    elif bearish_count > bullish_count:
        sentiment = "Bearish"
        sentiment_reason = (
            "Regulatory signals elevated with "
            + str(bearish_count)
            + " policy events flagged today."
        )
    else:
        sentiment = "Neutral"
        sentiment_reason = (
            "Balanced signals across "
            + str(len(categories))
            + " categories with no dominant trend."
        )

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

    header = (
        "ACQAR SIGNAL - Dubai Real Estate Daily Briefing\n"
        + today
    )

    overview = (
        "Dubai's property market recorded "
        + str(len(events))
        + " verified signals today. "
        + top_cat_label
        + " is the dominant theme, with concentrated activity in "
        + top_areas_str + ". "
        + str(len(high_sev))
        + " high-priority signals were flagged requiring immediate attention."
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
            price_str = " - AED " + str(round(price / 1_000_000, 1)) + "M"
        elif price and price >= 1_000:
            price_str = " - AED " + str(round(price / 1_000)) + "K"

        sev_label = {
            1: "Low", 2: "Low", 3: "Medium", 4: "High", 5: "Critical"
        }.get(sev, "Medium")

        src_str = " | " + source if source else ""

        dev_lines.append(
            str(i) + ". " + title + price_str
            + "\n   " + area + src_str
            + " | Severity: " + sev_label
        )

    developments = "\n\n".join(dev_lines)

    area_details = []
    for area, count in areas.most_common(3):
        area_events = [e for e in events if e.get("location_name") == area]
        area_cats = Counter(e.get("category") for e in area_events)
        top_area_cat = cat_labels.get(
            area_cats.most_common(1)[0][0], "General"
        )
        area_details.append(
            area + " - " + str(count) + " signals | " + top_area_cat
        )

    hot_areas = "\n".join(area_details)

    cat_breakdown_lines = []
    for cat, count in categories.most_common():
        label = cat_labels.get(cat, cat.title())
        cat_breakdown_lines.append(label + ": " + str(count) + " signals")

    cat_breakdown = "\n".join(cat_breakdown_lines)

    watch_items = []

    if len(critical) > 0:
        watch_items.append(
            "Monitor " + str(len(critical))
            + " critical-severity signal(s) for escalation in next 48 hours."
        )

    if "regulatory" in categories and categories["regulatory"] >= 2:
        watch_items.append(
            "Track regulatory developments - "
            + str(categories["regulatory"])
            + " policy signals may indicate upcoming rule changes."
        )

    if "offplan" in categories and categories["offplan"] >= 2:
        watch_items.append(
            "Watch off-plan momentum in " + top_areas[0]
            + " - " + str(categories["offplan"]) + " launches active."
        )

    if "price_signal" in categories:
        watch_items.append(
            "Price signal activity detected - monitor AED/sqft in active areas."
        )

    if len(watch_items) == 0:
        watch_items.append(
            "Monitor " + top_areas[0] + " for follow-through activity."
        )
        watch_items.append(
            "Watch for regulatory announcements affecting transaction volumes."
        )

    watch_list = "\n".join(
        str(i + 1) + ". " + w for i, w in enumerate(watch_items[:4])
    )

    generated_at = now.strftime("%d %b %Y, %H:%M UTC")

    summary = (
        "**" + header + "**\n\n"
        + "**Market Overview**\n"
        + overview
        + "\n\n**Top Developments**\n"
        + developments
        + "\n\n**Hot Areas**\n"
        + hot_areas
        + "\n\n**Signal Breakdown**\n"
        + cat_breakdown
        + "\n\n**Overall Sentiment: " + sentiment + "**\n"
        + sentiment_reason
        + "\n\n**Watch List**\n"
        + watch_list
        + "\n\n---\n"
        + "Generated: " + generated_at
        + " | " + str(len(events)) + " signals"
        + " | Next update in 60 min"
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
