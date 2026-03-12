"""
Reddit fetcher for Dubai real estate sentiment signals.
Uses Reddit's free public JSON API — NO API KEY REQUIRED.
Monitors: r/DubaiRealEstate, r/dubai, r/UAEinvesting
"""
import httpx
import asyncio
import hashlib
import logging
from datetime import datetime, timezone
from typing import List, Dict

logger = logging.getLogger(__name__)

SUBREDDITS = [
    {"name": "DubaiRealEstate", "weight": 0.85},
    {"name": "dubai", "weight": 0.70},
    {"name": "UAEinvesting", "weight": 0.80},
    {"name": "expats", "weight": 0.65},
    {"name": "saudiarabia", "weight": 0.60},
]

RE_KEYWORDS = [
    "property", "real estate", "apartment", "villa", "rent", "buy", "sale",
    "emaar", "damac", "nakheel", "dubai marina", "palm jumeirah", "downtown",
    "jvc", "business bay", "difc", "dld", "rera", "off-plan", "offplan",
    "sqft", "aed", "mortgage", "handover", "developer", "yield", "renting",
    "landlord", "tenant", "listing", "price", "investment", "golden visa"
]


class RedditFetcher:
    def __init__(self):
        self.seen_ids = set()
        self.headers = {
            "User-Agent": "ACQAR-REMS/1.0 (Dubai Real Estate Intelligence Platform)"
        }

    async def fetch_subreddit(self, subreddit: str, weight: float, limit: int = 25) -> List[Dict]:
        """
        Fetch newest posts from a subreddit via the public JSON API.
        URL: https://www.reddit.com/r/{subreddit}/new.json?limit=25
        No auth required for public subreddits.
        """
        url = f"https://www.reddit.com/r/{subreddit}/new.json"
        articles = []

        try:
            async with httpx.AsyncClient(timeout=12, headers=self.headers, follow_redirects=True, trust_env=False) as client:
                resp = await client.get(url, params={"limit": limit})
                resp.raise_for_status()
                data = resp.json()

                posts = data.get("data", {}).get("children", [])

                for post_wrapper in posts:
                    post = post_wrapper.get("data", {})

                    title = post.get("title", "")
                    selftext = post.get("selftext", "")
                    url_link = post.get("url", "")
                    post_id = post.get("id", "")
                    score = post.get("score", 0)
                    num_comments = post.get("num_comments", 0)
                    created_utc = post.get("created_utc", 0)
                    permalink = "https://www.reddit.com" + post.get("permalink", "")
                    flair = post.get("link_flair_text", "") or ""

                    # Skip if already seen or removed/deleted
                    if not post_id or post_id in self.seen_ids:
                        continue
                    if selftext in ("[removed]", "[deleted]"):
                        continue

                    # Check relevance: title or flair must contain RE keywords
                    combined = (title + " " + selftext[:200] + " " + flair).lower()
                    if not any(kw in combined for kw in RE_KEYWORDS):
                        continue

                    # Skip very low-engagement posts (likely spam)
                    if score < 1 and num_comments == 0:
                        continue

                    # Generate stable ID
                    article_id = hashlib.md5(post_id.encode()).hexdigest()[:12]
                    self.seen_ids.add(post_id)

                    # Build summary from selftext snippet or title
                    summary = selftext[:300].strip() if selftext and selftext not in ("[removed]", "[deleted]") else title

                    # Published timestamp
                    if created_utc:
                        published_at = datetime.fromtimestamp(created_utc, tz=timezone.utc).isoformat()
                    else:
                        published_at = datetime.now(timezone.utc).isoformat()

                    # Boost weight for highly upvoted posts
                    effective_weight = min(1.0, weight + (score / 1000))

                    articles.append({
                        "id": article_id,
                        "title": title,
                        "summary": summary,
                        "url": permalink,
                        "published_at": published_at,
                        "source": f"Reddit/r/{subreddit}",
                        "source_weight": effective_weight,
                        "reddit_score": score,
                        "reddit_comments": num_comments,
                        "source_type": "reddit",
                    })

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.warning(f"Reddit rate limit hit for r/{subreddit}. Will retry next cycle.")
            else:
                logger.warning(f"Reddit HTTP error for r/{subreddit}: {e}")
        except Exception as e:
            logger.warning(f"Reddit fetch failed for r/{subreddit}: {e}")

        return articles

    async def fetch_all(self) -> List[Dict]:
        """Fetch from all configured subreddits concurrently."""
        tasks = [
            self.fetch_subreddit(sr["name"], sr["weight"])
            for sr in SUBREDDITS
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        all_articles = []
        for result in results:
            if isinstance(result, list):
                all_articles.extend(result)

        # Deduplicate
        seen = set()
        unique = []
        for a in all_articles:
            if a["id"] not in seen:
                unique.append(a)
                seen.add(a["id"])

        # Sort by published_at descending
        unique.sort(key=lambda x: x.get("published_at", ""), reverse=True)

        logger.info(f"Reddit: fetched {len(unique)} unique RE posts")
        return unique
