"""
Twitter/X Data Fetcher via Nitter RSS.
Uses public Nitter instances to fetch tweets about Dubai real estate.
No API key required.
"""
import httpx
import asyncio
import logging
import hashlib
from datetime import datetime, timezone
from typing import List, Dict
import xml.etree.ElementTree as ET
import urllib.parse
import re

logger = logging.getLogger(__name__)

# Nitter instances (try in order)
NITTER_INSTANCES = [
    "https://nitter.net",
    "https://nitter.cz",
    "https://nitter.poast.org",
]

# Search queries via Nitter search RSS
SEARCH_QUERIES = [
    "Dubai real estate",
    "Dubai property",
    "DLD transaction",
    "RERA Dubai",
    "Emaar launch",
    "Dubai offplan",
]

# Key real estate accounts to monitor
KEY_ACCOUNTS = [
    "EmaarPropertiesUA",
    "DAMAC_Official",
    "DubaiLandDept",
]


class TwitterFetcher:
    """Fetches real-time Dubai RE tweets via Nitter RSS (no API key)."""

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (compatible; ACQAR/1.0)",
            "Accept": "application/rss+xml, application/xml, text/xml"
        }

    async def _fetch_nitter_rss(self, client: httpx.AsyncClient, url: str) -> List[Dict]:
        """Fetch and parse a Nitter RSS feed."""
        articles = []
        try:
            resp = await client.get(url, timeout=10, follow_redirects=True)
            if resp.status_code != 200:
                return []

            root = ET.fromstring(resp.text)
            ns = {"media": "http://search.yahoo.com/mrss/"}

            channel = root.find("channel")
            if channel is None:
                return []

            for item in channel.findall("item")[:20]:
                try:
                    title_el = item.find("title")
                    link_el = item.find("link")
                    pubdate_el = item.find("pubDate")
                    desc_el = item.find("description")

                    title = title_el.text.strip() if title_el is not None and title_el.text else ""
                    link = link_el.text.strip() if link_el is not None and link_el.text else ""

                    if not title or not link:
                        continue

                    # Parse date
                    published_at = datetime.now(timezone.utc).isoformat()
                    if pubdate_el is not None and pubdate_el.text:
                        try:
                            from email.utils import parsedate_to_datetime
                            published_at = parsedate_to_datetime(pubdate_el.text).isoformat()
                        except Exception:
                            pass

                    article_id = hashlib.md5(link.encode()).hexdigest()[:12]

                    # Clean description
                    summary = ""
                    if desc_el is not None and desc_el.text:
                        summary = re.sub(r'<[^>]+>', '', desc_el.text).strip()[:200]

                    articles.append({
                        "id": article_id,
                        "title": title[:200],
                        "summary": summary or title[:200],
                        "url": link,
                        "published_at": published_at,
                        "source": "Twitter/X",
                        "source_weight": 0.65
                    })
                except Exception:
                    continue
        except Exception as e:
            logger.debug(f"Nitter RSS failed for {url}: {e}")
        return articles

    async def _try_nitter_search(self, client: httpx.AsyncClient, query: str) -> List[Dict]:
        """Try search RSS across all Nitter instances."""
        encoded = urllib.parse.quote(query)
        for instance in NITTER_INSTANCES:
            url = f"{instance}/search/rss?q={encoded}&f=tweets"
            articles = await self._fetch_nitter_rss(client, url)
            if articles:
                return articles
        return []

    async def _try_nitter_user(self, client: httpx.AsyncClient, username: str) -> List[Dict]:
        """Try user timeline RSS across all Nitter instances."""
        for instance in NITTER_INSTANCES:
            url = f"{instance}/{username}/rss"
            articles = await self._fetch_nitter_rss(client, url)
            if articles:
                # Tag with account source
                for a in articles:
                    a["source"] = f"Twitter/@{username}"
                    a["source_weight"] = 0.75
                return articles
        return []

    async def fetch_all(self) -> List[Dict]:
        """Fetch tweets from search queries and key accounts."""
        all_articles = []

        async with httpx.AsyncClient(headers=self.headers, timeout=15) as client:
            # Run searches and account fetches concurrently
            tasks = []
            for query in SEARCH_QUERIES[:4]:  # Limit to avoid rate limiting
                tasks.append(self._try_nitter_search(client, query))
            for account in KEY_ACCOUNTS[:3]:
                tasks.append(self._try_nitter_user(client, account))

            results = await asyncio.gather(*tasks, return_exceptions=True)

            for result in results:
                if isinstance(result, list):
                    all_articles.extend(result)

        # Deduplicate
        seen = set()
        unique = []
        for a in all_articles:
            if a["url"] not in seen:
                seen.add(a["url"])
                unique.append(a)

        logger.info(f"TwitterFetcher: fetched {len(unique)} unique tweets")
        return unique
