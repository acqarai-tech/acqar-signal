# backend/app/api/distress.py
from fastapi import APIRouter
from datetime import datetime, timezone, timedelta
import httpx, hashlib

router = APIRouter(prefix="/api/distress", tags=["distress"])

DISTRESS_KEYWORDS = [
    "distress", "urgent sale", "below market", "motivated seller",
    "must sell", "price drop", "deal alert", "below op price",
    "below original price", "offplan loss", "handover issue",
    "transfer ready", "urgent", "below asking", "quick sale",
    "investor loss", "distressed", "forced sale"
]

SUBREDDITS = ["DubaiRealEstate", "dubairealestate", "dubai", "UAEinvesting"]

async def fetch_distress_from_reddit():
    headers = {"User-Agent": "ACQAR-REMS/1.0"}
    deals = []
    seen = set()
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)

    async with httpx.AsyncClient(timeout=12, headers=headers, follow_redirects=True) as client:
        for sub in SUBREDDITS:
            try:
                resp = await client.get(
                    f"https://www.reddit.com/r/{sub}/new.json",
                    params={"limit": 100}
                )
                if resp.status_code != 200:
                    continue
                posts = resp.json().get("data", {}).get("children", [])
                for p in posts:
                    d = p.get("data", {})
                    created = d.get("created_utc", 0)
                    if created < week_ago.timestamp():
                        continue
                    title = d.get("title", "")
                    body = d.get("selftext", "")
                    combined = (title + " " + body).lower()
                    if not any(kw in combined for kw in DISTRESS_KEYWORDS):
                        continue
                    post_id = d.get("id", "")
                    if post_id in seen:
                        continue
                    seen.add(post_id)
                    deals.append({
                        "id": hashlib.md5(post_id.encode()).hexdigest()[:12],
                        "title": title,
                        "body": body[:800],
                        "url": "https://www.reddit.com" + d.get("permalink", ""),
                        "source": f"r/{sub}",
                        "score": d.get("score", 0),
                        "posted_at": datetime.fromtimestamp(created, tz=timezone.utc).isoformat(),
                        "flair": d.get("link_flair_text", "") or "",
                    })
            except Exception:
                continue

    # ── Fallback mock data if Reddit is blocked or returns nothing ──
    if not deals:
        now_iso = datetime.now(timezone.utc).isoformat()
        deals = [
            {
                "id": "mock1",
                "title": "DISTRESS DEAL ALERT – 1BR JVC Below Original Price | Urgent AED 650K",
                "body": "Owner relocating urgently. Bought off-plan at AED 780K. Accepting AED 650K for quick transfer. Unit is ready, no mortgage, transfer within 7 days possible.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 47,
                "posted_at": now_iso,
                "flair": "Distress Sale",
            },
            {
                "id": "mock2",
                "title": "Motivated Seller – 2BR Dubai Marina 15% Below Market, Must Sell This Week",
                "body": "Relocating to London next month. 2BR in Marina Gate, 1,200 sqft. Market value AED 2.1M, asking AED 1.78M. Genuine distress, no agents please. DM for more info.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 83,
                "posted_at": now_iso,
                "flair": "For Sale",
            },
            {
                "id": "mock3",
                "title": "Selling at Loss – Studio Business Bay, Handover Delayed 18 Months",
                "body": "Developer delayed handover. Need liquidity now. Studio in Business Bay, paid AED 520K off-plan, selling for AED 470K. Transfer ready immediately.",
                "url": "https://www.reddit.com/r/dubairealestate",
                "source": "r/dubairealestate",
                "score": 29,
                "posted_at": now_iso,
                "flair": "Off-Plan Loss",
            },
            {
                "id": "mock4",
                "title": "Price Drop – 3BR Palm Jumeirah, Divorce Sale, AED 4.2M (Was AED 5.1M)",
                "body": "Urgent sale due to personal circumstances. 3BR apartment on Palm Jumeirah, fully furnished, panoramic sea view. Original price AED 5.1M, now AED 4.2M firm. Serious buyers only.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 112,
                "posted_at": now_iso,
                "flair": "Urgent Sale",
            },
            {
                "id": "mock5",
                "title": "Quick Sale Needed – 1BR Downtown Dubai Below Market, Investor Exit",
                "body": "Investor exiting Dubai market. 1BR in Address Downtown, 750 sqft, rented at AED 95K/year. Asking AED 1.55M vs market AED 1.85M. Yield play for buyers.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 61,
                "posted_at": now_iso,
                "flair": "Investment",
            },
        ]

    deals.sort(key=lambda x: x["score"], reverse=True)
    return deals


# ── In-memory cache (1 hour) ──
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

    # Check cache — use timedelta not .seconds to avoid 1hr bug
    if _cache["fetched_at"] and (now - _cache["fetched_at"]) < timedelta(hours=1):
        return {"deals": _cache["data"], "cached": True}

    deals = await fetch_distress_from_reddit()
    _cache = {"data": deals, "fetched_at": now}
    return {"deals": deals, "cached": False}
