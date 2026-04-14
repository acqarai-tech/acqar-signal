# backend/app/api/distress.py
from fastapi import APIRouter, Request
from datetime import datetime, timezone, timedelta
import httpx, hashlib, asyncio

router = APIRouter(prefix="/api/distress", tags=["distress"])

DISTRESS_KEYWORDS = [
    "distress", "urgent sale", "below market", "motivated seller",
    "must sell", "price drop", "deal alert", "below op price",
    "below original price", "offplan loss", "handover issue",
    "transfer ready", "urgent", "below asking", "quick sale",
    "investor loss", "distressed", "forced sale"
]

SUBREDDITS = ["DubaiRealEstate", "dubai", "dubaiRE", "dubairealestate"]

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

                    # Must match at least one distress keyword
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
            except Exception as e:
                continue

    deals.sort(key=lambda x: x["posted_at"], reverse=True)
    return deals

# Simple in-memory cache (1 hour)
_cache = {"data": [], "fetched_at": None}

@router.get("/deals")
async def get_distress_deals():
    global _cache
    now = datetime.now(timezone.utc)
    if _cache["fetched_at"] and (now - _cache["fetched_at"]).seconds < 3600:
        return {"deals": _cache["data"], "cached": True}

    deals = await fetch_distress_from_reddit()
    _cache = {"data": deals, "fetched_at": now}
    return {"deals": deals, "cached": False}
