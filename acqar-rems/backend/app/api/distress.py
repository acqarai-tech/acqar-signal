# from fastapi import APIRouter
# from datetime import datetime, timezone, timedelta
# import httpx, hashlib, re
# import xml.etree.ElementTree as ET
# from email.utils import parsedate_to_datetime
# from urllib.parse import urlparse, parse_qs, unquote

# router = APIRouter(prefix="/api/distress", tags=["distress"])

# DISTRESS_KEYWORDS = [
#     "distress", "urgent sale", "below market", "motivated seller",
#     "must sell", "price drop", "deal alert", "below op price",
#     "below original price", "offplan loss", "handover issue",
#     "transfer ready", "urgent", "below asking", "quick sale",
#     "investor loss", "distressed", "forced sale", "selling at loss",
#     "dubai", "property", "real estate"
# ]

# RSS_FEEDS = [
#     "https://news.google.com/rss/search?q=distress+deal+dubai+real+estate&hl=en&gl=AE&ceid=AE:en",
#     "https://news.google.com/rss/search?q=urgent+sale+dubai+property&hl=en&gl=AE&ceid=AE:en",
#     "https://news.google.com/rss/search?q=below+market+price+dubai+apartment&hl=en&gl=AE&ceid=AE:en",
#     "https://news.google.com/rss/search?q=motivated+seller+dubai+property&hl=en&gl=AE&ceid=AE:en",
#     "https://news.google.com/rss/search?q=dubai+property+price+drop+2026&hl=en&gl=AE&ceid=AE:en",
#     "https://news.google.com/rss/search?q=dubai+distressed+property+sale&hl=en&gl=AE&ceid=AE:en",
# ]

# def clean_text(text):
#     """Remove HTML tags and fix HTML entities"""
#     text = re.sub(r'<[^>]+>', '', text or '')
#     text = text.replace('&nbsp;', ' ')
#     text = text.replace('&amp;', '&')
#     text = text.replace('&lt;', '<')
#     text = text.replace('&gt;', '>')
#     text = text.replace('&quot;', '"')
#     return text.strip()

# async def resolve_google_news_url(client, google_url):
#     """
#     Try to get the real article URL from Google News redirect.
#     Google News URLs look like: https://news.google.com/rss/articles/CBMi...
#     We follow the redirect to get the real URL.
#     """
#     try:
#         resp = await client.get(
#             google_url,
#             follow_redirects=True,
#             timeout=8,
#             headers={"User-Agent": "Mozilla/5.0 (compatible; ACQAR/1.0)"}
#         )
#         # After redirects, the final URL is the real article
#         final_url = str(resp.url)
#         # If it's still a google URL, return original
#         if "google.com" in final_url:
#             return google_url
#         return final_url
#     except Exception:
#         return google_url  # fallback to Google News URL

# async def fetch_distress_deals():
#     deals = []
#     seen = set()
#     week_ago = datetime.now(timezone.utc) - timedelta(days=7)

#     async with httpx.AsyncClient(
#         timeout=15,
#         follow_redirects=True,
#         headers={"User-Agent": "Mozilla/5.0 (compatible; ACQAR-REMS/1.0)"}
#     ) as client:

#         for feed_url in RSS_FEEDS:
#             try:
#                 resp = await client.get(feed_url)
#                 if resp.status_code != 200:
#                     continue

#                 root = ET.fromstring(resp.content)
#                 items = root.findall(".//item")

#                 for item in items:
#                     title = clean_text(item.findtext("title", ""))
#                     description = clean_text(item.findtext("description", ""))
#                     google_link = item.findtext("link", "")
#                     pub_date_str = item.findtext("pubDate", "")
#                     source_tag = item.find("source")
#                     source_name = source_tag.text if source_tag is not None else "News"

#                     # Parse date
#                     try:
#                         pub_date = parsedate_to_datetime(pub_date_str)
#                         if pub_date.tzinfo is None:
#                             pub_date = pub_date.replace(tzinfo=timezone.utc)
#                         if pub_date < week_ago:
#                             continue
#                     except Exception:
#                         pub_date = datetime.now(timezone.utc)

#                     combined = (title + " " + description).lower()
#                     if not any(kw in combined for kw in DISTRESS_KEYWORDS):
#                         continue

#                     title_hash = hashlib.md5(title.encode()).hexdigest()[:12]
#                     if title_hash in seen:
#                         continue
#                     seen.add(title_hash)

#                     # ── Resolve real URL ──
#                     real_url = await resolve_google_news_url(client, google_link)

#                     deals.append({
#                         "id": title_hash,
#                         "title": title,
#                         "body": description[:800],
#                         "url": real_url,          # ← real article URL now
#                         "source": source_name,
#                         "score": 0,
#                         "posted_at": pub_date.isoformat(),
#                         "flair": "News",
#                     })

#             except Exception as e:
#                 print(f"RSS feed error: {e}")
#                 continue

#     # Fallback mock data
#     if not deals:
#         now_iso = datetime.now(timezone.utc).isoformat()
#         deals = [
#             {
#                 "id": "mock1",
#                 "title": "DISTRESS DEAL ALERT – 1BR JVC Below Original Price | Urgent AED 650K",
#                 "body": "Owner relocating urgently. Bought off-plan at AED 780K. Accepting AED 650K for quick transfer.",
#                 "url": "https://www.reddit.com/r/DubaiRealEstate",
#                 "source": "r/DubaiRealEstate",
#                 "score": 47,
#                 "posted_at": now_iso,
#                 "flair": "Distress Sale",
#             },
#             {
#                 "id": "mock2",
#                 "title": "Motivated Seller – 2BR Dubai Marina 15% Below Market",
#                 "body": "Relocating to London. Marina Gate 1,200 sqft. Market AED 2.1M, asking AED 1.78M.",
#                 "url": "https://www.reddit.com/r/DubaiRealEstate",
#                 "source": "r/DubaiRealEstate",
#                 "score": 83,
#                 "posted_at": now_iso,
#                 "flair": "For Sale",
#             },
#         ]

#     deals.sort(key=lambda x: x["posted_at"], reverse=True)
#     return deals


# # ── Cache ──
# _cache = {"data": [], "fetched_at": None}

# @router.get("/deals/clear-cache")
# async def clear_cache():
#     global _cache
#     _cache = {"data": [], "fetched_at": None}
#     return {"cleared": True}

# @router.get("/deals")
# async def get_distress_deals():
#     global _cache
#     now = datetime.now(timezone.utc)
#     if _cache["fetched_at"] and (now - _cache["fetched_at"]) < timedelta(hours=1):
#         return {"deals": _cache["data"], "cached": True}
#     deals = await fetch_distress_deals()
#     _cache = {"data": deals, "fetched_at": now}
#     return {"deals": deals, "cached": False}












from fastapi import APIRouter
from datetime import datetime, timezone, timedelta
import httpx, re

router = APIRouter(prefix="/api/distress", tags=["distress"])

DISTRESS_KEYWORDS = [
    'distress deal', 'distress sale', 'panic sell', 'panic sale',
    'forced sale', 'urgent sale', 'must sell', 'need to sell',
    'quick sale', 'below op', 'below original price', 'below market',
    'selling at loss', 'below asking', 'price reduced', 'motivated seller',
    'investor exit', 'relocation sale', 'genuine seller', 'sp below',
    'transfer in 3', 'transfer in 7',
]

SUBREDDITS = ['DubaiRealEstate', 'dubairealestate', 'dubai']

def normalize_title(title: str) -> str:
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9\s]', '', title.lower())).strip()

async def fetch_distress_deals():
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    week_ago_ts = week_ago.timestamp()
    all_deals = []
    seen = set()

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.reddit.com/",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        for sub in SUBREDDITS:
            try:
                resp = await client.get(
                    f"https://www.reddit.com/r/{sub}/new.json?limit=100&raw_json=1",
                    headers=headers,
                )
                if resp.status_code != 200:
                    print(f"Reddit returned {resp.status_code} for r/{sub}")
                    continue

                posts = resp.json().get("data", {}).get("children", [])

                for item in posts:
                    post = item.get("data", {})
                    if not post:
                        continue
                    if post.get("created_utc", 0) < week_ago_ts:
                        continue
                    if post.get("selftext") in ("[removed]", "[deleted]"):
                        continue

                    combined = (post.get("title", "") + " " + post.get("selftext", "")).lower()
                    if not any(kw in combined for kw in DISTRESS_KEYWORDS):
                        continue

                    norm_title = normalize_title(post.get("title", ""))
                    body_snippet = post.get("selftext", "")[:100].lower().strip()

                    if norm_title in seen or (body_snippet and body_snippet in seen):
                        continue

                    seen.add(norm_title)
                    if body_snippet:
                        seen.add(body_snippet)

                    all_deals.append({
                        "id": post.get("id"),
                        "title": post.get("title"),
                        "body": post.get("selftext", "")[:800],
                        "url": "https://www.reddit.com" + post.get("permalink", ""),
                        "source": f"r/{sub}",
                        "score": post.get("score", 0),
                        "posted_at": datetime.utcfromtimestamp(
                            post.get("created_utc", 0)
                        ).replace(tzinfo=timezone.utc).isoformat(),
                        "flair": post.get("link_flair_text") or "",
                    })

            except Exception as e:
                print(f"Reddit fetch failed for r/{sub}: {e}")
                continue

    all_deals.sort(key=lambda x: x["posted_at"], reverse=True)
    return all_deals


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
    if _cache["fetched_at"] and (now - _cache["fetched_at"]) < timedelta(minutes=15):
        return {"deals": _cache["data"], "cached": True}
    deals = await fetch_distress_deals()
    _cache = {"data": deals, "fetched_at": now}
    return {"deals": deals, "cached": False}

@router.get("/deals/debug")
async def debug_reddit():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.reddit.com/",
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(
            "https://www.reddit.com/r/DubaiRealEstate/new.json?limit=5&raw_json=1",
            headers=headers,
        )
        return {
            "status_code": resp.status_code,
            "response_preview": resp.text[:500],
        }

