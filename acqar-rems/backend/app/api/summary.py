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
CACHE_TTL = 86400  # 24 hours — updates once per day


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
    generated_at = now.strftime("%d %b %Y, %H:%M UTC")

    if len(events) < 3:
        return (
            "**ACQAR SIGNAL**\n"
            + "**Dubai Real Estate Intelligence Report**\n"
            + "**" + today + "**\n\n"
            + "Today's market briefing is being compiled. "
            + "Live signals are being collected from RSS feeds, "
            + "DLD transaction data, and market sources. "
            + "The full report will be ready within 15 minutes. "
            + "Please check back shortly or click the refresh button above."
        )

    categories = Counter(e.get("category", "general") for e in events)
    top_cat = categories.most_common(1)[0][0]

    areas = Counter(e.get("location_name", "Dubai") for e in events)
    top_areas = [a for a, _ in areas.most_common(5)]

    high_sev = [e for e in events if e.get("severity", 1) >= 4]
    critical = [e for e in events if e.get("severity", 1) == 5]
    avg_sev = sum(e.get("severity", 1) for e in events) / len(events)

    top_events = sorted(
        events, key=lambda x: x.get("severity", 0), reverse=True
    )[:6]

    bullish_cats = {"transaction", "investment", "offplan", "foreign_buyers"}
    bearish_cats = {"regulatory"}

    bullish_count = sum(1 for e in events if e.get("category") in bullish_cats)
    bearish_count = sum(1 for e in events if e.get("category") in bearish_cats)

    cat_labels = {
        "transaction": "Transaction Activity",
        "offplan": "Off-Plan Launches",
        "investment": "Investment Flow",
        "regulatory": "Regulatory Changes",
        "infrastructure": "Infrastructure",
        "construction": "Construction",
        "price_signal": "Price Movement",
        "rental_yield": "Rental Yield",
        "foreign_buyers": "Foreign Investment",
        "freezone": "Free Zone Activity",
    }

    top_cat_label = cat_labels.get(top_cat, top_cat.title())

    # Sentiment
    if avg_sev >= 3.5 or len(critical) >= 2:
        sentiment = "BEARISH"
        sentiment_para = (
            "Market sentiment today is bearish. "
            + str(len(high_sev))
            + " high-severity signals were recorded, "
            + "indicating elevated stress across key submarkets. "
            + "Investors and agents should exercise caution and monitor "
            + "developments closely over the next 48 hours."
        )
    elif bullish_count > bearish_count * 1.5:
        sentiment = "BULLISH"
        sentiment_para = (
            "Market sentiment today is bullish. "
            + "Transaction and investment activity is driving positive momentum "
            + "across Dubai's residential and commercial sectors. "
            + "Demand signals remain strong with " + str(bullish_count)
            + " positive market events recorded in the last 24 hours."
        )
    elif bearish_count > bullish_count:
        sentiment = "CAUTIOUS"
        sentiment_para = (
            "Market sentiment today is cautious. "
            + "Regulatory signals are elevated with " + str(bearish_count)
            + " policy-related events flagged. "
            + "While transaction activity continues, upcoming rule changes "
            + "may affect market dynamics in the short term."
        )
    else:
        sentiment = "NEUTRAL"
        sentiment_para = (
            "Market sentiment today is neutral. "
            + "Signals are balanced across multiple categories "
            + "with no single dominant trend emerging. "
            + "The market appears to be in a consolidation phase "
            + "as buyers and developers assess current conditions."
        )

    # Overview paragraph
    top_areas_str = ", ".join(top_areas[:3])
    if len(top_areas) > 3:
        top_areas_str = ", ".join(top_areas[:2]) + " and " + top_areas[2]

    overview_para = (
        "Dubai's real estate market remained active over the past 24 hours "
        + "with " + top_cat_label + " dominating today's signals. "
        + "The most active areas were " + top_areas_str + ", "
        + "where the bulk of today's market movement was recorded. "
    )

    if len(high_sev) > 0:
        overview_para += (
            str(len(high_sev))
            + " high-priority developments emerged that warrant close attention "
            + "from market participants, developers, and investors."
        )
    else:
        overview_para += (
            "Overall market activity remained within normal parameters "
            + "with no extreme disruptions recorded."
        )

    # Key Developments — narrative style
    dev_sections = []
    for i, e in enumerate(top_events, 1):
        title = e.get("title", "Untitled")
        area = e.get("location_name", "Dubai")
        source = e.get("source", "")
        sev = e.get("severity", 1)
        price = e.get("price_aed")
        summary_text = e.get("summary", "")

        price_str = ""
        if price and price >= 1_000_000:
            price_str = " (AED " + str(round(price / 1_000_000, 1)) + "M)"
        elif price and price >= 1_000:
            price_str = " (AED " + str(round(price / 1_000)) + "K)"

        sev_label = {
            1: "Low", 2: "Low", 3: "Medium", 4: "High", 5: "Critical"
        }.get(sev, "Medium")

        src_str = "Source: " + source if source else ""

        dev_section = (
            str(i) + ". " + title + price_str + "\n"
            + "   Location: " + area
            + " | Priority: " + sev_label
        )
        if src_str:
            dev_section += " | " + src_str
        if summary_text and len(summary_text) > 20:
            short_summary = summary_text[:200] + "..." if len(summary_text) > 200 else summary_text
            dev_section += "\n   " + short_summary

        dev_sections.append(dev_section)

    developments = "\n\n".join(dev_sections)

    # Area Analysis — narrative
    area_paras = []
    for area, count in areas.most_common(4):
        area_events = [e for e in events if e.get("location_name") == area]
        area_cats = Counter(e.get("category") for e in area_events)
        top_area_cat = cat_labels.get(
            area_cats.most_common(1)[0][0], "General Activity"
        )
        area_high = [e for e in area_events if e.get("severity", 1) >= 4]

        area_para = (
            top_area_cat + " was the primary driver in "
            + area + " today"
        )
        if len(area_high) > 0:
            area_para += (
                ", with " + str(len(area_high))
                + " high-priority event(s) recorded"
            )
        area_para += "."
        area_paras.append(area_para)

    area_analysis = " ".join(area_paras)

    # Watch List — narrative
    watch_items = []

    if len(critical) > 0:
        watch_items.append(
            str(len(critical)) + " critical signal(s) are active and require "
            + "monitoring over the next 48 hours for potential market impact."
        )

    if "regulatory" in categories and categories["regulatory"] >= 2:
        watch_items.append(
            "Multiple regulatory signals (" + str(categories["regulatory"])
            + ") were detected today. Track upcoming policy announcements "
            + "that may affect transaction processes or developer requirements."
        )

    if "offplan" in categories and categories["offplan"] >= 2:
        watch_items.append(
            "Off-plan launch momentum is building in " + top_areas[0]
            + " with " + str(categories["offplan"])
            + " new developments flagged. Monitor absorption rates "
            + "and developer pricing strategies."
        )

    if "price_signal" in categories:
        watch_items.append(
            "Price movement signals were detected across active submarkets. "
            + "Watch AED per sqft trends in the coming days for directional confirmation."
        )

    if "foreign_buyers" in categories:
        watch_items.append(
            "Foreign buyer activity signals were recorded today. "
            + "Track nationality-specific demand patterns "
            + "which may influence premium area pricing."
        )

    if len(watch_items) == 0:
        watch_items.append(
            "Continue monitoring " + top_areas[0]
            + " and " + (top_areas[1] if len(top_areas) > 1 else "key submarkets")
            + " for follow-through on today's activity levels."
        )
        watch_items.append(
            "Watch for any DLD or RERA announcements that may "
            + "affect transaction volumes or off-plan regulations."
        )

    watch_text = ""
    for i, w in enumerate(watch_items[:4], 1):
        watch_text += str(i) + ". " + w + "\n"
    watch_text = watch_text.strip()

    # Assemble full report
    report = (
        "**ACQAR SIGNAL**\n"
        + "**Dubai Real Estate Intelligence Report**\n"
        + "**" + today + "**\n\n"

        + "**EXECUTIVE SUMMARY**\n"
        + overview_para + "\n\n"

        + "**MARKET SENTIMENT: " + sentiment + "**\n"
        + sentiment_para + "\n\n"

        + "**KEY DEVELOPMENTS**\n"
        + developments + "\n\n"

        + "**AREA ANALYSIS**\n"
        + area_analysis + "\n\n"

        + "**WATCH LIST FOR NEXT 48 HOURS**\n"
        + watch_text + "\n\n"

        + "---\n"
        + "Report compiled: " + generated_at + "\n"
        + "Coverage period: Last 24 hours\n"
        + "Data sources: Gulf News, The National, Arabian Business, "
        + "Zawya, DLD Transactions, Reddit, GDELT\n"
       
    )

    return report


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
