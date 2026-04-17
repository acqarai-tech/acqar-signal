# """
# Dubai Real Estate News Aggregator - replaces GDELT.
# Uses curated Dubai/UAE property news RSS feeds that are reliably Dubai RE focused.
# """
# import httpx
# import asyncio
# import hashlib
# import xml.etree.ElementTree as ET
# from datetime import datetime, timezone
# from typing import List, Dict
# import logging

# logger = logging.getLogger(__name__)

# # Curated Dubai RE RSS feeds - these reliably produce Dubai property content
# DUBAI_RE_FEEDS = {
#     "gulf_news_property": {
#         "url": "https://gulfnews.com/rss/business/property",
#         "source": "Gulf News Property",
#         "weight": 0.92,
#     },
#     "the_national_property": {
#         "url": "https://www.thenationalnews.com/rss/business/property.xml",
#         "source": "The National Property",
#         "weight": 0.90,
#     },
#     "arabian_business_re": {
#         "url": "https://www.arabianbusiness.com/rss/topic/real-estate.rss",
#         "source": "Arabian Business RE",
#         "weight": 0.85,
#     },
#     "zawya_realestate": {
#         "url": "https://www.zawya.com/mena/en/rss/realestate/",
#         "source": "Zawya RE",
#         "weight": 0.85,
#     },
#     "propertyfinder_blog": {
#         "url": "https://blog.propertyfinder.ae/feed/",
#         "source": "Property Finder Blog",
#         "weight": 0.88,
#     },
#     "bayut_blog": {
#         "url": "https://www.bayut.com/mybayut/feed/",
#         "source": "Bayut Blog",
#         "weight": 0.88,
#     },
#     "dld_google_news": {
#         "url": "https://news.google.com/rss/search?q=Dubai+Land+Department+DLD+RERA+2025&hl=en-AE&gl=AE&ceid=AE:en",
#         "source": "DLD/RERA News",
#         "weight": 0.90,
#     },
#     "emaar_damac_news": {
#         "url": "https://news.google.com/rss/search?q=Emaar+DAMAC+Nakheel+Dubai+property+launch+2025&hl=en-AE&gl=AE&ceid=AE:en",
#         "source": "Developer News",
#         "weight": 0.88,
#     },
#     "dubai_transaction_news": {
#         "url": "https://news.google.com/rss/search?q=Dubai+property+transaction+AED+villa+apartment+sold+2025&hl=en-AE&gl=AE&ceid=AE:en",
#         "source": "Dubai Transactions",
#         "weight": 0.87,
#     },
#     "palm_marina_downtown": {
#         "url": "https://news.google.com/rss/search?q=Palm+Jumeirah+Dubai+Marina+Downtown+Dubai+real+estate+2025&hl=en-AE&gl=AE&ceid=AE:en",
#         "source": "Prime Areas News",
#         "weight": 0.85,
#     },
#     "dubai_offplan": {
#         "url": "https://news.google.com/rss/search?q=Dubai+off-plan+launch+new+development+handover+2025&hl=en-AE&gl=AE&ceid=AE:en",
#         "source": "Off-Plan News",
#         "weight": 0.86,
#     },
#     "dubai_rental_investment": {
#         "url": "https://news.google.com/rss/search?q=Dubai+rental+yield+investment+ROI+property+market+2025&hl=en-AE&gl=AE&ceid=AE:en",
#         "source": "Investment News",
#         "weight": 0.84,
#     },
# }

# # Hard Dubai RE relevance filter - any article MUST contain at least one term from each group
# MUST_CONTAIN_ANY = [
#     ["dubai", "dld", "rera", "damac", "emaar", "nakheel", "meraas", "dubai land", "bayut", "property finder", "dubailand"],
# ]
# MUST_CONTAIN_PROPERTY = [
#     "property", "real estate", "villa", "apartment", "flat", "tower", "residence",
#     "development", "project", "transaction", "aed", "handover", "offplan", "off-plan",
#     "rental", "yield", "investment", "developer", "launch", "sqft", "residential",
#     "commercial", "district", "community", "marina", "palm", "downtown", "jvc",
#     "business bay", "difc", "dld", "rera", "land department", "title deed"
# ]


# def _is_dubai_re_relevant(title: str, summary: str) -> bool:
#     """Returns True only if this is genuinely about Dubai real estate."""
#     text = (title + " " + summary).lower()
#     has_dubai = any(term in text for term in MUST_CONTAIN_ANY[0])
#     has_re = any(term in text for term in MUST_CONTAIN_PROPERTY)
#     return has_dubai and has_re


# class GDELTFetcher:
#     """
#     Replacement for GDELT - now uses curated Dubai RE RSS feeds.
#     Kept class name for backward compatibility with pipeline_service.py.
#     """

#     async def _fetch_rss_feed(self, name: str, config: dict) -> List[Dict]:
#         articles = []
#         try:
#             async with httpx.AsyncClient(timeout=12, trust_env=False, follow_redirects=True,
#                                          headers={"User-Agent": "ACQAR-REMS/1.0"}) as client:
#                 resp = await client.get(config["url"])
#                 if resp.status_code != 200:
#                     return articles
#                 root = ET.fromstring(resp.text)
#                 channel = root.find("channel")
#                 if channel is None:
#                     return articles
#                 for item in channel.findall("item"):
#                     t_el = item.find("title")
#                     l_el = item.find("link")
#                     d_el = item.find("description")
#                     if t_el is None or l_el is None:
#                         continue
#                     title = (t_el.text or "").strip()
#                     link = (l_el.text or "").strip()
#                     summary = (d_el.text or title).strip() if d_el is not None else title
#                     # Strip HTML tags from summary
#                     import re
#                     summary = re.sub(r'<[^>]+>', '', summary)[:500]
#                     if not title or not link:
#                         continue
#                     # RELEVANCE GATE: skip non-Dubai-RE content
#                     if not _is_dubai_re_relevant(title, summary):
#                         continue
#                     article_id = hashlib.md5(link.encode()).hexdigest()[:12]
#                     pub_date = item.find("pubDate")
#                     published_at = datetime.now(timezone.utc).isoformat()
#                     if pub_date is not None and pub_date.text:
#                         try:
#                             from email.utils import parsedate_to_datetime
#                             published_at = parsedate_to_datetime(pub_date.text).isoformat()
#                         except Exception:
#                             pass
#                     articles.append({
#                         "id": article_id,
#                         "title": title,
#                         "summary": summary,
#                         "url": link,
#                         "published_at": published_at,
#                         "source": config["source"],
#                         "source_weight": config["weight"],
#                     })
#         except Exception as e:
#             logger.debug(f"Feed {name} failed: {e}")
#         return articles

#     async def fetch_dubai_events(self, hours_back: int = 2) -> List[Dict]:
#         """Fetch Dubai RE news. Drop-in replacement for old GDELT method."""
#         tasks = [
#             self._fetch_rss_feed(name, cfg)
#             for name, cfg in DUBAI_RE_FEEDS.items()
#         ]
#         results = await asyncio.gather(*tasks, return_exceptions=True)
#         articles = []
#         seen = set()
#         for r in results:
#             if isinstance(r, list):
#                 for a in r:
#                     if a["id"] not in seen:
#                         seen.add(a["id"])
#                         articles.append(a)
#         articles.sort(key=lambda x: x.get("published_at", ""), reverse=True)
#         logger.info(f"DubaiNewsAggregator fetched {len(articles)} Dubai RE articles")
#         return articles

#     async def fetch_market_events(self, hours_back: int = 6) -> List[Dict]:
#         """Alias kept for backward compatibility."""
#         return await self.fetch_dubai_events(hours_back=hours_back)





"""
Dubai Real Estate News Aggregator - replaces GDELT.
Uses curated Dubai/UAE property news RSS feeds that are reliably Dubai RE focused.
"""
import httpx
import asyncio
import hashlib
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import List, Dict
from email.utils import parsedate_to_datetime
import logging

logger = logging.getLogger(__name__)

DUBAI_RE_FEEDS = {
    "gulf_news_property": {
        "url": "https://gulfnews.com/rss/business/property",
        "source": "Gulf News Property",
        "weight": 0.92,
    },
    "the_national_property": {
        "url": "https://www.thenationalnews.com/rss/business/property.xml",
        "source": "The National Property",
        "weight": 0.90,
    },
    "arabian_business_re": {
        "url": "https://www.arabianbusiness.com/rss/topic/real-estate.rss",
        "source": "Arabian Business RE",
        "weight": 0.85,
    },
    "zawya_realestate": {
        "url": "https://www.zawya.com/mena/en/rss/realestate/",
        "source": "Zawya RE",
        "weight": 0.85,
    },
    "propertyfinder_blog": {
        "url": "https://blog.propertyfinder.ae/feed/",
        "source": "Property Finder Blog",
        "weight": 0.88,
    },
    "bayut_blog": {
        "url": "https://www.bayut.com/mybayut/feed/",
        "source": "Bayut Blog",
        "weight": 0.88,
    },
    "khaleej_times_re": {
        "url": "https://www.khaleejtimes.com/rss/business/real-estate",
        "source": "Khaleej Times",
        "weight": 0.86,
    },
    "mediaoffice_uae": {
        "url": "https://www.mediaoffice.ae/en/rss/",
        "source": "Dubai Media Office",
        "weight": 0.90,
    },
    "construction_week": {
        "url": "https://www.constructionweekonline.com/feed",
        "source": "Construction Week",
        "weight": 0.84,
    },
    "wam_uae": {
        "url": "https://wam.ae/en/rss.xml",
        "source": "WAM UAE",
        "weight": 0.88,
    },
    "arab_news_property": {
        "url": "https://www.arabnews.com/taxonomy/term/8712/feed",
        "source": "Arab News Property",
        "weight": 0.85,
    },
    "tradearabia_re": {
        "url": "https://www.tradearabia.com/rss/REAL.xml",
        "source": "Trade Arabia",
        "weight": 0.82,
    },
    "the_national_business": {
        "url": "https://www.thenationalnews.com/rss/business.xml",
        "source": "The National Business",
        "weight": 0.87,
    },
    "reuters_business": {
        "url": "https://feeds.reuters.com/reuters/businessNews",
        "source": "Reuters",
        "weight": 0.90,
    },
}

MUST_CONTAIN_ANY = [
    ["dubai", "dld", "rera", "damac", "emaar", "nakheel", "meraas", "dubai land", "bayut", "property finder", "dubailand"],
]
MUST_CONTAIN_PROPERTY = [
    "property", "real estate", "villa", "apartment", "flat", "tower", "residence",
    "development", "project", "transaction", "aed", "handover", "offplan", "off-plan",
    "rental", "yield", "investment", "developer", "launch", "sqft", "residential",
    "commercial", "district", "community", "marina", "palm", "downtown", "jvc",
    "business bay", "difc", "dld", "rera", "land department", "title deed"
]


def _is_dubai_re_relevant(title: str, summary: str) -> bool:
    text = (title + " " + summary).lower()
    has_dubai = any(term in text for term in MUST_CONTAIN_ANY[0])
    has_re = any(term in text for term in MUST_CONTAIN_PROPERTY)
    return has_dubai and has_re


class GDELTFetcher:

    async def _fetch_rss_feed(self, name: str, config: dict) -> List[Dict]:
        articles = []
        cutoff_ts = time.time() - (48 * 3600)  # 48 hour cutoff

        try:
            async with httpx.AsyncClient(timeout=12, trust_env=False, follow_redirects=True,
                                         headers={"User-Agent": "ACQAR-REMS/1.0"}) as client:
                resp = await client.get(config["url"])
                if resp.status_code != 200:
                    return articles

                root = ET.fromstring(resp.text)
                channel = root.find("channel")
                if channel is None:
                    return articles

                for item in channel.findall("item"):
                    t_el = item.find("title")
                    l_el = item.find("link")
                    d_el = item.find("description")

                    if t_el is None or l_el is None:
                        continue

                    title = (t_el.text or "").strip()
                    link = (l_el.text or "").strip()
                    summary = (d_el.text or title).strip() if d_el is not None else title

                    import re
                    summary = re.sub(r'<[^>]+>', '', summary)[:500]

                    if not title or not link:
                        continue

                    if not _is_dubai_re_relevant(title, summary):
                        continue

                    article_id = hashlib.md5(link.encode()).hexdigest()[:12]

                    # Parse publish date
                    pub_ts = time.time()
                    published_at = datetime.now(timezone.utc).isoformat()
                    pub_date = item.find("pubDate")
                    if pub_date is not None and pub_date.text:
                        try:
                            pub_ts = parsedate_to_datetime(pub_date.text).timestamp()
                            published_at = datetime.fromtimestamp(pub_ts, tz=timezone.utc).isoformat()
                        except Exception:
                            pub_ts = time.time()

                    # Skip articles older than 48 hours
                    if pub_ts < cutoff_ts:
                        continue

                    articles.append({
                        "id": article_id,
                        "title": title,
                        "summary": summary,
                        "url": link,
                        "published_at": published_at,
                        "published_ts": pub_ts,
                        "source": config["source"],
                        "source_weight": config["weight"],
                    })

        except Exception as e:
            logger.debug(f"Feed {name} failed: {e}")

        return articles

    async def fetch_dubai_events(self, hours_back: int = 2) -> List[Dict]:
        tasks = [
            self._fetch_rss_feed(name, cfg)
            for name, cfg in DUBAI_RE_FEEDS.items()
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        articles = []
        seen = set()
        for r in results:
            if isinstance(r, list):
                for a in r:
                    if a["id"] not in seen:
                        seen.add(a["id"])
                        articles.append(a)

        articles.sort(key=lambda x: x.get("published_ts", 0), reverse=True)
        logger.info(f"DubaiNewsAggregator fetched {len(articles)} Dubai RE articles")
        return articles

    async def fetch_market_events(self, hours_back: int = 6) -> List[Dict]:
        return await self.fetch_dubai_events(hours_back=hours_back)







