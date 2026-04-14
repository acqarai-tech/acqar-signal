# backend/app/api/distress.py
from fastapi import APIRouter
from datetime import datetime, timezone, timedelta
import httpx, hashlib
import xml.etree.ElementTree as ET
import re

router = APIRouter(prefix="/api/distress", tags=["distress"])

DISTRESS_KEYWORDS = [
    "distress", "urgent sale", "below market", "motivated seller",
    "must sell", "price drop", "deal alert", "below op price",
    "below original price", "offplan loss", "handover issue",
    "transfer ready", "urgent", "below asking", "quick sale",
    "investor loss", "distressed", "forced sale", "selling at loss"
]

# Google News RSS searches — always works, never blocked
RSS_FEEDS = [
    "https://news.google.com/rss/search?q=distress+deal+dubai+real+estate&hl=en&gl=AE&ceid=AE:en",
    "https://news.google.com/rss/search?q=urgent+sale+dubai+property&hl=en&gl=AE&ceid=AE:en",
    "https://news.google.com/rss/search?q=below+market+price+dubai+apartment&hl=en&gl=AE&ceid=AE:en",
    "https://news.google.com/rss/search?q=motivated+seller+dubai+property&hl=en&gl=AE&ceid=AE:en",
    "https://news.google.com/rss/search?q=dubai+property+price+drop+2025&hl=en&gl=AE&ceid=AE:en",
]

def clean_html(text):
    """Remove HTML tags from text"""
    return re.sub(r'<[^>]+>', '', text or '').strip()

async def fetch_distress_deals():
    deals = []
    seen = set()
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)

    async with httpx.AsyncClient(
        timeout=15,
        follow_redirects=True,
        headers={"User-Agent": "Mozilla/5.0 (compatible; ACQAR-REMS/1.0)"}
    ) as client:

        for feed_url in RSS_FEEDS:
            try:
                resp = await client.get(feed_url)
                if resp.status_code != 200:
                    continue

                root = ET.fromstring(resp.content)
                items = root.findall(".//item")

                for item in items:
                    title = clean_html(item.findtext("title", ""))
                    description = clean_html(item.findtext("description", ""))
                    link = item.findtext("link", "")
                    pub_date_str = item.findtext("pubDate", "")
                    source_tag = item.find("source")
                    source_name = source_tag.text if source_tag is not None else "News"

                    # Parse date
                    try:
                        from email.utils import parsedate_to_datetime
                        pub_date = parsedate_to_datetime(pub_date_str)
                        if pub_date.tzinfo is None:
                            pub_date = pub_date.replace(tzinfo=timezone.utc)
                        # Skip if older than 7 days
                        if pub_date < week_ago:
                            continue
                    except Exception:
                        pub_date = datetime.now(timezone.utc)

                    combined = (title + " " + description).lower()

                    # Must match at least one distress keyword
                    if not any(kw in combined for kw in DISTRESS_KEYWORDS):
                        continue

                    # Deduplicate by title
                    title_hash = hashlib.md5(title.encode()).hexdigest()[:12]
                    if title_hash in seen:
                        continue
                    seen.add(title_hash)

                    deals.append({
                        "id": title_hash,
                        "title": title,
                        "body": description[:800],
                        "url": link,
                        "source": source_name,
                        "score": 0,
                        "posted_at": pub_date.isoformat(),
                        "flair": "News",
                    })

            except Exception as e:
                print(f"RSS feed error [{feed_url}]: {e}")
                continue

    # Fallback mock data
    if not deals:
        now_iso = datetime.now(timezone.utc).isoformat()
        deals = [
            {
                "id": "mock1",
                "title": "DISTRESS DEAL ALERT – 1BR JVC Below Original Price | Urgent AED 650K",
                "body": "Owner relocating urgently. Bought off-plan at AED 780K. Accepting AED 650K for quick transfer. Unit ready, no mortgage.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 47,
                "posted_at": now_iso,
                "flair": "Distress Sale",
            },
            {
                "id": "mock2",
                "title": "Motivated Seller – 2BR Dubai Marina 15% Below Market",
                "body": "Relocating to London. Marina Gate 1,200 sqft. Market AED 2.1M, asking AED 1.78M.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 83,
                "posted_at": now_iso,
                "flair": "For Sale",
            },
            {
                "id": "mock3",
                "title": "Price Drop – Studio Business Bay, Handover Delayed, Selling at Loss",
                "body": "Paid AED 520K off-plan, selling for AED 470K. Transfer ready immediately.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 29,
                "posted_at": now_iso,
                "flair": "Off-Plan Loss",
            },
        ]

    deals.sort(key=lambda x: x["posted_at"], reverse=True)
    return deals


# ── Cache ──
_cache = {"data": [], "fetched_at": None}

@router.get("/deals/clear-cache")
async def clear_cache():
    global _cache
    _cache = {"data": [], "fetched_at": None}
    return {"cleared": True}

@router.get("/deals")
async def get_distress_deals():
    global _cache
    now = datetime.now(timezone.utc)
    if _cache["fetched_at"] and (now - _cache["fetched_at"]) < timedelta(hours=1):
        return {"deals": _cache["data"], "cached": True}
    deals = await fetch_distress_deals()
    _cache = {"data": deals, "fetched_at": now}
    return {"deals": deals, "cached": False}
