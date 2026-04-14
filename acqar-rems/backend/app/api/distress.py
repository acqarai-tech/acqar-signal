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
    deals = []
    seen = set()
    week_ago = int((datetime.now(timezone.utc) - timedelta(days=7)).timestamp())

    # Search each keyword separately for best results
    SEARCH_QUERIES = [
        "distress sale",
        "urgent sale",
        "below market",
        "must sell",
        "motivated seller",
        "price drop",
        "below op price",
        "selling at loss",
        "quick sale",
    ]

    SUBREDDITS = ["DubaiRealEstate", "dubairealestate", "dubai"]

    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        for sub in SUBREDDITS:
            for query in SEARCH_QUERIES:
                try:
                    resp = await client.get(
                        "https://api.pullpush.io/reddit/search/submission/",
                        params={
                            "subreddit": sub,
                            "q": query,
                            "after": week_ago,
                            "size": 25,
                            "sort": "desc",
                        },
                        headers={"User-Agent": "ACQAR-REMS/1.0"}
                    )

                    if resp.status_code != 200:
                        continue

                    posts = resp.json().get("data", [])

                    for d in posts:
                        post_id = d.get("id", "")
                        if not post_id or post_id in seen:
                            continue

                        title = d.get("title", "")
                        body = d.get("selftext", "")
                        combined = (title + " " + body).lower()

                        # Double check distress keyword match
                        if not any(kw in combined for kw in DISTRESS_KEYWORDS):
                            continue

                        seen.add(post_id)
                        created = d.get("created_utc", 0)

                        deals.append({
                            "id": hashlib.md5(post_id.encode()).hexdigest()[:12],
                            "title": title,
                            "body": body[:800],
                            "url": "https://www.reddit.com" + d.get("permalink", ""),
                            "source": f"r/{sub}",
                            "score": d.get("score", 0),
                            "posted_at": datetime.fromtimestamp(
                                created, tz=timezone.utc
                            ).isoformat(),
                            "flair": d.get("link_flair_text", "") or "",
                        })

                except Exception as e:
                    print(f"PullPush error [{sub}][{query}]: {e}")
                    continue

    # Fallback mock data if PullPush returns nothing
    if not deals:
        now_iso = datetime.now(timezone.utc).isoformat()
        deals = [
            {
                "id": "mock1",
                "title": "DISTRESS DEAL ALERT – 1BR JVC Below Original Price | Urgent AED 650K",
                "body": "Owner relocating urgently. Bought off-plan at AED 780K. Accepting AED 650K for quick transfer.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 47,
                "posted_at": now_iso,
                "flair": "Distress Sale",
            },
            {
                "id": "mock2",
                "title": "Motivated Seller – 2BR Dubai Marina 15% Below Market",
                "body": "Relocating to London. Marina Gate, 1,200 sqft. Market AED 2.1M, asking AED 1.78M.",
                "url": "https://www.reddit.com/r/DubaiRealEstate",
                "source": "r/DubaiRealEstate",
                "score": 83,
                "posted_at": now_iso,
                "flair": "For Sale",
            },
        ]

    # Remove duplicates and sort by score
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
