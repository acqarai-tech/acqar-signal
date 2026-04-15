"""
LinkedIn Signal Fetcher.
Uses GDELT Doc API (which indexes LinkedIn) and Google News RSS
to capture Dubai RE signals from LinkedIn. No API key required.
"""
import httpx
import asyncio
import logging
import hashlib
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import List, Dict
import urllib.parse

logger = logging.getLogger(__name__)

GDELT_BASE = "https://api.gdeltproject.org/api/v2/doc/doc"

# Google News RSS for LinkedIn Dubai RE content
GOOGLE_NEWS_QUERIES = [
    "Dubai real estate investment site:linkedin.com",
    "Dubai property market LinkedIn",
    "UAE real estate LinkedIn insights",
]

GDELT_LINKEDIN_QUERIES = [
    "Dubai real estate LinkedIn",
    "UAE property investment LinkedIn",
    "Emaar DAMAC Nakheel LinkedIn",
]


class LinkedInFetcher:
    """Fetches Dubai RE LinkedIn signals via GDELT + Google News RSS."""

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (compatible; ACQAR/1.0)",
            "Accept": "application/rss+xml, application/xml, text/xml, application/json"
        }

    async def _fetch_gdelt_linkedin(self, client: httpx.AsyncClient, query: str) -> List[Dict]:
        """Fetch LinkedIn-related articles from GDELT."""
        articles = []
        try:
            params = {
                "query": query,
                "mode": "artlist",
                "maxrecords": 25,
                "format": "json",
                "timespan": "6h",
                "sort": "DateDesc"
            }
            resp = await client.get(GDELT_BASE, params=params, timeout=10)
            if resp.status_code != 200:
                return []
            data = resp.json()
            for item in data.get("articles", []):
                url = item.get("url", "")
                title = item.get("title", "")
                if not url or not title:
                    continue
                # Slightly boost if actually from LinkedIn
                weight = 0.8 if "linkedin.com" in url else 0.6
                seendate = item.get("seendate", "")
                published_at = datetime.now(timezone.utc).isoformat()
                if seendate and len(seendate) >= 14:
                    try:
                        published_at = datetime.strptime(seendate[:14], "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc).isoformat()
                    except Exception:
                        pass
                articles.append({
                    "id": hashlib.md5(url.encode()).hexdigest()[:12],
                    "title": title[:200],
                    "summary": title[:200],
                    "url": url,
                    "published_at": published_at,
                    "source": "LinkedIn/GDELT",
                    "source_weight": weight
                })
        except Exception as e:
            logger.debug(f"GDELT LinkedIn query failed: {e}")
        return articles

    async def _fetch_google_news_rss(self, client: httpx.AsyncClient, query: str) -> List[Dict]:
        """Fetch via Google News RSS."""
        articles = []
        try:
            encoded = urllib.parse.quote(query)
            url = f"https://news.google.com/rss/search?q={encoded}&hl=en-AE&gl=AE&ceid=AE:en"
            resp = await client.get(url, timeout=10, follow_redirects=True)
            if resp.status_code != 200:
                return []
            root = ET.fromstring(resp.text)
            channel = root.find("channel")
            if channel is None:
                return []
            for item in channel.findall("item")[:15]:
                title_el = item.find("title")
                link_el = item.find("link")
                pubdate_el = item.find("pubDate")
                title = title_el.text.strip() if title_el is not None and title_el.text else ""
                link = link_el.text.strip() if link_el is not None and link_el.text else ""
                if not title or not link:
                    continue
                published_at = datetime.now(timezone.utc).isoformat()
                if pubdate_el is not None and pubdate_el.text:
                    try:
                        from email.utils import parsedate_to_datetime
                        published_at = parsedate_to_datetime(pubdate_el.text).isoformat()
                    except Exception:
                        pass
                articles.append({
                    "id": hashlib.md5(link.encode()).hexdigest()[:12],
                    "title": title[:200],
                    "summary": title[:200],
                    "url": link,
                    "published_at": published_at,
                    "source": "LinkedIn/Google News",
                    "source_weight": 0.65
                })
        except Exception as e:
            logger.debug(f"Google News LinkedIn RSS failed: {e}")
        return articles

    async def fetch_all(self) -> List[Dict]:
        """Fetch all LinkedIn signals."""
        all_articles = []
        async with httpx.AsyncClient(headers=self.headers) as client:
            tasks = []
            for q in GDELT_LINKEDIN_QUERIES:
                tasks.append(self._fetch_gdelt_linkedin(client, q))
            for q in GOOGLE_NEWS_QUERIES:
                tasks.append(self._fetch_google_news_rss(client, q))
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for r in results:
                if isinstance(r, list):
                    all_articles.extend(r)

        seen = set()
        unique = []
        for a in all_articles:
            if a["url"] not in seen:
                seen.add(a["url"])
                unique.append(a)

        logger.info(f"LinkedInFetcher: fetched {len(unique)} unique signals")
        return unique





# """
# LinkedIn Signal Fetcher.
# Uses GDELT Doc API (which indexes LinkedIn) and Google News RSS
# to capture Dubai RE signals from LinkedIn. No API key required.
# """
# import httpx
# import asyncio
# import logging
# import hashlib
# import time
# import xml.etree.ElementTree as ET
# from datetime import datetime, timezone
# from typing import List, Dict
# from email.utils import parsedate_to_datetime
# import urllib.parse

# logger = logging.getLogger(__name__)

# GDELT_BASE = "https://api.gdeltproject.org/api/v2/doc/doc"

# GOOGLE_NEWS_QUERIES = [
#     "Dubai real estate investment site:linkedin.com",
#     "Dubai property market LinkedIn 2026",
#     "UAE real estate LinkedIn insights 2026",
# ]

# GDELT_LINKEDIN_QUERIES = [
#     "Dubai real estate LinkedIn 2026",
#     "UAE property investment LinkedIn 2026",
#     "Emaar DAMAC Nakheel LinkedIn 2026",
# ]


# class LinkedInFetcher:

#     def __init__(self):
#         self.headers = {
#             "User-Agent": "Mozilla/5.0 (compatible; ACQAR/1.0)",
#             "Accept": "application/rss+xml, application/xml, text/xml, application/json"
#         }
#         self.cutoff_ts = time.time() - (48 * 3600)  # 48 hour cutoff

#     async def _fetch_gdelt_linkedin(self, client: httpx.AsyncClient, query: str) -> List[Dict]:
#         articles = []
#         try:
#             params = {
#                 "query": query,
#                 "mode": "artlist",
#                 "maxrecords": 25,
#                 "format": "json",
#                 "timespan": "48h",
#                 "sort": "DateDesc"
#             }
#             resp = await client.get(GDELT_BASE, params=params, timeout=10)
#             if resp.status_code != 200:
#                 return []

#             data = resp.json()
#             for item in data.get("articles", []):
#                 url = item.get("url", "")
#                 title = item.get("title", "")
#                 if not url or not title:
#                     continue

#                 weight = 0.8 if "linkedin.com" in url else 0.6

#                 seendate = item.get("seendate", "")
#                 pub_ts = time.time()
#                 published_at = datetime.now(timezone.utc).isoformat()

#                 if seendate and len(seendate) >= 14:
#                     try:
#                         pub_ts = datetime.strptime(seendate[:14], "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc).timestamp()
#                         published_at = datetime.fromtimestamp(pub_ts, tz=timezone.utc).isoformat()
#                     except Exception:
#                         pub_ts = time.time()

#                 # Skip articles older than 48 hours
#                 if pub_ts < self.cutoff_ts:
#                     continue

#                 articles.append({
#                     "id": hashlib.md5(url.encode()).hexdigest()[:12],
#                     "title": title[:200],
#                     "summary": title[:200],
#                     "url": url,
#                     "published_at": published_at,
#                     "published_ts": pub_ts,
#                     "source": "LinkedIn/GDELT",
#                     "source_weight": weight
#                 })

#         except Exception as e:
#             logger.debug(f"GDELT LinkedIn query failed: {e}")

#         return articles

#     async def _fetch_google_news_rss(self, client: httpx.AsyncClient, query: str) -> List[Dict]:
#         articles = []
#         try:
#             encoded = urllib.parse.quote(query)
#             url = f"https://news.google.com/rss/search?q={encoded}&hl=en-AE&gl=AE&ceid=AE:en"
#             resp = await client.get(url, timeout=10, follow_redirects=True)
#             if resp.status_code != 200:
#                 return []

#             root = ET.fromstring(resp.text)
#             channel = root.find("channel")
#             if channel is None:
#                 return []

#             for item in channel.findall("item")[:15]:
#                 title_el = item.find("title")
#                 link_el = item.find("link")
#                 pubdate_el = item.find("pubDate")

#                 title = title_el.text.strip() if title_el is not None and title_el.text else ""
#                 link = link_el.text.strip() if link_el is not None and link_el.text else ""

#                 if not title or not link:
#                     continue

#                 pub_ts = time.time()
#                 published_at = datetime.now(timezone.utc).isoformat()

#                 if pubdate_el is not None and pubdate_el.text:
#                     try:
#                         pub_ts = parsedate_to_datetime(pubdate_el.text).timestamp()
#                         published_at = datetime.fromtimestamp(pub_ts, tz=timezone.utc).isoformat()
#                     except Exception:
#                         pub_ts = time.time()

#                 # Skip articles older than 48 hours
#                 if pub_ts < self.cutoff_ts:
#                     continue

#                 articles.append({
#                     "id": hashlib.md5(link.encode()).hexdigest()[:12],
#                     "title": title[:200],
#                     "summary": title[:200],
#                     "url": link,
#                     "published_at": published_at,
#                     "published_ts": pub_ts,
#                     "source": "LinkedIn/Google News",
#                     "source_weight": 0.65
#                 })

#         except Exception as e:
#             logger.debug(f"Google News LinkedIn RSS failed: {e}")

#         return articles

#     async def fetch_all(self) -> List[Dict]:
#         # Refresh cutoff on each fetch call
#         self.cutoff_ts = time.time() - (48 * 3600)

#         all_articles = []
#         async with httpx.AsyncClient(headers=self.headers) as client:
#             tasks = []
#             for q in GDELT_LINKEDIN_QUERIES:
#                 tasks.append(self._fetch_gdelt_linkedin(client, q))
#             for q in GOOGLE_NEWS_QUERIES:
#                 tasks.append(self._fetch_google_news_rss(client, q))

#             results = await asyncio.gather(*tasks, return_exceptions=True)
#             for r in results:
#                 if isinstance(r, list):
#                     all_articles.extend(r)

#         seen = set()
#         unique = []
#         for a in all_articles:
#             if a["url"] not in seen:
#                 seen.add(a["url"])
#                 unique.append(a)

#         unique.sort(key=lambda x: x.get("published_ts", 0), reverse=True)
#         logger.info(f"LinkedInFetcher: fetched {len(unique)} unique signals")
#         return unique
