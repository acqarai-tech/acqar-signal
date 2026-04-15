import feedparser
import httpx
import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Optional
import hashlib

RSS_FEEDS = {
    "gulf_news_property": {
        "url": "https://gulfnews.com/rss/business/property",
        "source": "Gulf News",
        "weight": 0.9
    },
    "khaleej_times_realestate": {
        "url": "https://www.khaleejtimes.com/rss/business/real-estate",
        "source": "Khaleej Times",
        "weight": 0.85
    },
    "the_national_property": {
        "url": "https://www.thenationalnews.com/rss/business/property.xml",
        "source": "The National",
        "weight": 0.9
    },
    "arabian_business_property": {
        "url": "https://www.arabianbusiness.com/rss/topic/real-estate.rss",
        "source": "Arabian Business",
        "weight": 0.8
    },
    "zawya_property": {
        "url": "https://www.zawya.com/mena/en/rss/realestate/",
        "source": "Zawya",
        "weight": 0.8
    },
    "propertyfinder_blog": {
        "url": "https://blog.propertyfinder.ae/feed/",
        "source": "Property Finder Blog",
        "weight": 0.85
    },
    "bayut_blog": {
        "url": "https://www.bayut.com/mybayut/feed/",
        "source": "Bayut Blog",
        "weight": 0.85
    },
    "dubai_media_office": {
        "url": "https://www.mediaoffice.ae/en/rss/",
        "source": "Dubai Media Office",
        "weight": 0.9
    },
    "google_news_dubai_re": {
        "url": "https://news.google.com/rss/search?q=Dubai+real+estate+property&hl=en-AE&gl=AE&ceid=AE:en",
        "source": "Google News Dubai RE",
        "weight": 0.75
    },
    "google_news_dld_rera": {
        "url": "https://news.google.com/rss/search?q=Dubai+Land+Department+RERA+real+estate&hl=en-AE&gl=AE&ceid=AE:en",
        "source": "Google News DLD RERA",
        "weight": 0.8
    }
}


class RSSFetcher:
    def __init__(self):
        self.seen_ids = set()  # dedup

    async def fetch_feed(self, feed_name: str, feed_config: dict) -> List[Dict]:
        """
        Fetch and parse a single RSS feed, return list of raw article dicts.

        Returns articles with fields:
        - id: MD5 hash of URL (first 12 chars)
        - title: Article title
        - summary: Article summary/description
        - url: Article link
        - published_at: ISO format publish datetime
        - source: Source name
        - source_weight: Source credibility weight
        """
        articles = []
        try:
            async with httpx.AsyncClient(timeout=10, trust_env=False) as client:
                response = await client.get(feed_config['url'])
                response.raise_for_status()

                # Parse with feedparser
                feed = feedparser.parse(response.text)

                if not feed.entries:
                    return articles

                for entry in feed.entries:
                    try:
                        # Extract basic fields
                        title = entry.get('title', '')
                        summary = entry.get('summary', '')
                        link = entry.get('link', '')

                        # Skip if no link
                        if not link:
                            continue

                        # Generate ID from link
                        article_id = hashlib.md5(link.encode()).hexdigest()[:12]

                        # Skip duplicates
                        if article_id in self.seen_ids:
                            continue

                        # Filter: only relevant articles (Dubai/UAE/property/real estate)
                        combined_text = (title + ' ' + summary).lower()
                        relevant_keywords = ['dubai', 'uae', 'property', 'real estate', 'housing',
                                           'apartment', 'villa', 'developer', 'emaar', 'damac',
                                           'nakheel', 'residential', 'commercial', 'transaction',
                                           'dld', 'rera', 'realty']

                        if not any(keyword in combined_text for keyword in relevant_keywords):
                            continue

                        # Extract published date
                        published_at = None
                        if hasattr(entry, 'published_parsed') and entry.published_parsed:
                            try:
                                published_at = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).isoformat()
                            except:
                                published_at = datetime.now(timezone.utc).isoformat()
                        else:
                            published_at = datetime.now(timezone.utc).isoformat()

                        # Create article dict
                        article = {
                            'id': article_id,
                            'title': title,
                            'summary': summary,
                            'url': link,
                            'published_at': published_at,
                            'source': feed_config['source'],
                            'source_weight': feed_config['weight']
                        }

                        articles.append(article)
                        self.seen_ids.add(article_id)

                    except Exception as entry_error:
                        # Skip problematic entries gracefully
                        continue

        except httpx.TimeoutException:
            # Timeout - return empty list
            return []
        except httpx.HTTPError as http_error:
            # HTTP errors - return empty list
            return []
        except Exception as e:
            # Other errors - return empty list
            return []

        return articles

    async def fetch_all(self) -> List[Dict]:
        """
        Fetch all RSS feeds concurrently.

        Returns:
        - List of all articles from all feeds
        - Deduplicated by id
        - Sorted by published_at descending (newest first)
        """
        # Create fetch tasks for all feeds
        tasks = [
            self.fetch_feed(feed_name, feed_config)
            for feed_name, feed_config in RSS_FEEDS.items()
        ]

        # Run all tasks concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Flatten results and filter out exceptions
        all_articles = []
        for result in results:
            if isinstance(result, list):
                all_articles.extend(result)

        # Remove duplicates by id (shouldn't happen, but be safe)
        seen = set()
        unique_articles = []
        for article in all_articles:
            if article['id'] not in seen:
                unique_articles.append(article)
                seen.add(article['id'])

        # Sort by published_at descending (newest first)
        unique_articles.sort(
            key=lambda x: x.get('published_at', ''),
            reverse=True
        )

        return unique_articles



# import feedparser
# import httpx
# import asyncio
# import time
# from datetime import datetime, timezone
# from typing import List, Dict, Optional
# import hashlib

# RSS_FEEDS = {
#     "gulf_news_property": {
#         "url": "https://gulfnews.com/rss/business/property",
#         "source": "Gulf News",
#         "weight": 0.9
#     },
#     "khaleej_times_realestate": {
#         "url": "https://www.khaleejtimes.com/rss/business/real-estate",
#         "source": "Khaleej Times",
#         "weight": 0.85
#     },
#     "the_national_property": {
#         "url": "https://www.thenationalnews.com/rss/business/property.xml",
#         "source": "The National",
#         "weight": 0.9
#     },
#     "arabian_business_property": {
#         "url": "https://www.arabianbusiness.com/rss/topic/real-estate.rss",
#         "source": "Arabian Business",
#         "weight": 0.8
#     },
#     "zawya_property": {
#         "url": "https://www.zawya.com/mena/en/rss/realestate/",
#         "source": "Zawya",
#         "weight": 0.8
#     },
#     "propertyfinder_blog": {
#         "url": "https://blog.propertyfinder.ae/feed/",
#         "source": "Property Finder Blog",
#         "weight": 0.85
#     },
#     "bayut_blog": {
#         "url": "https://www.bayut.com/mybayut/feed/",
#         "source": "Bayut Blog",
#         "weight": 0.85
#     },
#     "dubai_media_office": {
#         "url": "https://www.mediaoffice.ae/en/rss/",
#         "source": "Dubai Media Office",
#         "weight": 0.9
#     },
#     "google_news_dubai_re": {
#         "url": "https://news.google.com/rss/search?q=Dubai+real+estate+property&hl=en-AE&gl=AE&ceid=AE:en",
#         "source": "Google News Dubai RE",
#         "weight": 0.75
#     },
#     "google_news_dld_rera": {
#         "url": "https://news.google.com/rss/search?q=Dubai+Land+Department+RERA+real+estate&hl=en-AE&gl=AE&ceid=AE:en",
#         "source": "Google News DLD RERA",
#         "weight": 0.8
#     }
# }


# class RSSFetcher:
#     def __init__(self):
#         self.seen_ids = set()

#     async def fetch_feed(self, feed_name: str, feed_config: dict) -> List[Dict]:
#         articles = []
#         try:
#             async with httpx.AsyncClient(timeout=10, trust_env=False) as client:
#                 response = await client.get(feed_config['url'])
#                 response.raise_for_status()

#                 feed = feedparser.parse(response.text)

#                 if not feed.entries:
#                     return articles

#                 for entry in feed.entries:
#                     try:
#                         title = entry.get('title', '')
#                         summary = entry.get('summary', '')
#                         link = entry.get('link', '')

#                         if not link:
#                             continue

#                         article_id = hashlib.md5(link.encode()).hexdigest()[:12]

#                         if article_id in self.seen_ids:
#                             continue

#                         combined_text = (title + ' ' + summary).lower()
#                         relevant_keywords = [
#                             'dubai', 'uae', 'property', 'real estate', 'housing',
#                             'apartment', 'villa', 'developer', 'emaar', 'damac',
#                             'nakheel', 'residential', 'commercial', 'transaction',
#                             'dld', 'rera', 'realty'
#                         ]

#                         if not any(keyword in combined_text for keyword in relevant_keywords):
#                             continue

#                         # Extract published date and timestamp
#                         published_at = None
#                         pub_ts = None

#                         if hasattr(entry, 'published_parsed') and entry.published_parsed:
#                             try:
#                                 pub_ts = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).timestamp()
#                                 published_at = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).isoformat()
#                             except:
#                                 pub_ts = time.time()
#                                 published_at = datetime.now(timezone.utc).isoformat()
#                         else:
#                             pub_ts = time.time()
#                             published_at = datetime.now(timezone.utc).isoformat()

#                         # Skip articles older than 48 hours
#                         if pub_ts < time.time() - (48 * 3600):
#                             continue

#                         article = {
#                             'id': article_id,
#                             'title': title,
#                             'summary': summary,
#                             'url': link,
#                             'published_at': published_at,
#                             'published_ts': pub_ts,
#                             'source': feed_config['source'],
#                             'source_weight': feed_config['weight']
#                         }

#                         articles.append(article)
#                         self.seen_ids.add(article_id)

#                     except Exception:
#                         continue

#         except httpx.TimeoutException:
#             return []
#         except httpx.HTTPError:
#             return []
#         except Exception:
#             return []

#         return articles

#     async def fetch_all(self) -> List[Dict]:
#         tasks = [
#             self.fetch_feed(feed_name, feed_config)
#             for feed_name, feed_config in RSS_FEEDS.items()
#         ]

#         results = await asyncio.gather(*tasks, return_exceptions=True)

#         all_articles = []
#         for result in results:
#             if isinstance(result, list):
#                 all_articles.extend(result)

#         seen = set()
#         unique_articles = []
#         for article in all_articles:
#             if article['id'] not in seen:
#                 unique_articles.append(article)
#                 seen.add(article['id'])

#         unique_articles.sort(
#             key=lambda x: x.get('published_ts', 0),
#             reverse=True
#         )

#         return unique_articles


