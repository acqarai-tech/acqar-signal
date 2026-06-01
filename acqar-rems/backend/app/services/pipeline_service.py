# import asyncio
# import logging
# from datetime import datetime, timezone
# from typing import Dict, List, Optional
# import sys
# import os
# import time

# sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

# logger = logging.getLogger(__name__)


# class PipelineService:
#     def __init__(self):
#         self.is_running = False
#         self.last_fetch_at: Optional[datetime] = None
#         self.events_fetched_today = 0
#         self.errors: List[str] = []
#         self._task: Optional[asyncio.Task] = None
#         self.app_state = None

#     async def start(self, app_state):
#         """Start the background pipeline loop"""
#         self.app_state = app_state
#         self.is_running = True
#         self._task = asyncio.create_task(self._run_loop())
#         logger.info("Pipeline started")

#     async def stop(self):
#         """Stop the pipeline"""
#         self.is_running = False
#         if self._task:
#             self._task.cancel()

#     async def _run_loop(self):
#         """Main loop: fetch every 3 minutes"""
#         while self.is_running:
#             try:
#                 await self._fetch_and_process()
#             except Exception as e:
#                 logger.error(f"Pipeline loop error: {e}")
#                 self.errors.append(str(e))
#                 if len(self.errors) > 10:
#                     self.errors = self.errors[-10:]
#             await asyncio.sleep(180)

#     async def _fetch_and_process(self):
#         """One fetch cycle: RSS + GDELT + classify + store + emit"""
#         logger.info("Starting fetch cycle...")
#         try:
#             import sys, os
#             backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
#             if backend_dir not in sys.path:
#                 sys.path.insert(0, backend_dir)

#             from data_pipeline.fetchers.rss_fetcher import RSSFetcher
#             from data_pipeline.fetchers.gdelt_fetcher import GDELTFetcher
#             from data_pipeline.fetchers.reddit_fetcher import RedditFetcher
#             from data_pipeline.fetchers.dld_fetcher import DLDFetcher
#             from data_pipeline.processors.classifier import EventClassifier

#             twitter = None
#             linkedin = None
#             try:
#                 from data_pipeline.fetchers.twitter_fetcher import TwitterFetcher
#                 twitter = TwitterFetcher()
#             except Exception as e:
#                 logger.debug(f"Twitter fetcher not available: {e}")

#             try:
#                 from data_pipeline.fetchers.linkedin_fetcher import LinkedInFetcher
#                 linkedin = LinkedInFetcher()
#             except Exception as e:
#                 logger.debug(f"LinkedIn fetcher not available: {e}")

#             rss = RSSFetcher()
#             gdelt = GDELTFetcher()
#             reddit = RedditFetcher()
#             dld = DLDFetcher()
#             classifier = EventClassifier()

#             fetch_tasks = [
#                 asyncio.create_task(rss.fetch_all()),
#                 asyncio.create_task(gdelt.fetch_dubai_events(hours_back=2)),
#                 asyncio.create_task(reddit.fetch_all()),
#                 asyncio.create_task(dld.fetch_google_news_transaction_signals()),
#             ]
#             if twitter:
#                 fetch_tasks.append(asyncio.create_task(twitter.fetch_all()))
#             if linkedin:
#                 fetch_tasks.append(asyncio.create_task(linkedin.fetch_all()))

#             fetch_results = await asyncio.gather(*fetch_tasks, return_exceptions=True)

#             articles = []
#             source_labels = ["RSS", "Dubai News", "Reddit", "DLD Transactions"]
#             if twitter:
#                 source_labels.append("Twitter")
#             if linkedin:
#                 source_labels.append("LinkedIn")

#             for i, result in enumerate(fetch_results):
#                 label = source_labels[i] if i < len(source_labels) else f"Source{i}"
#                 if isinstance(result, list):
#                     articles.extend(result)
#                     logger.info(f"{label} fetched {len(result)} articles")
#                 else:
#                     logger.warning(f"{label} fetch failed: {result}")

#             logger.info(f"Total articles fetched: {len(articles)}")

#             def _is_relevant(a: dict) -> bool:
#                 text = (a.get("title", "") + " " + a.get("summary", "")).lower()
#                 has_dubai = any(kw in text for kw in [
#                     "dubai", "dld", "rera", "emaar", "damac", "nakheel", "meraas",
#                     "bayut", "property finder", "abu dhabi", "uae", "sharjah"
#                 ])
#                 has_re = any(kw in text for kw in [
#                     "property", "real estate", "villa", "apartment", "tower",
#                     "transaction", "aed", "handover", "offplan", "rental",
#                     "developer", "launch", "residential", "commercial"
#                 ])
#                 return has_dubai and has_re

#             before = len(articles)
#             articles = [a for a in articles if _is_relevant(a)]
#             logger.info(f"Relevance filter: {before} to {len(articles)} articles")

#             if not articles:
#                 logger.info("No new articles this cycle")
#                 self.last_fetch_at = datetime.now(timezone.utc)
#                 return []

#             events = classifier.classify_batch(articles)
#             logger.info(f"Classified {len(events)} events")

#             new_events = []
#             for event in events:
#                 event_id = event.get('id')
#                 if event_id and event_id not in self.app_state.events_store:
#                     event['created_at_ts'] = time.time()
#                     event['created_at'] = datetime.now(timezone.utc).isoformat()
#                     event['updated_at'] = datetime.now(timezone.utc).isoformat()
#                     if 'signals' not in event:
#                        event['signals'] = [{
#     'source': event.get('source', 'RSS'),
#     'url': event.get('url', ''),
#     'snippet': event.get('title', '')[:100],
#     'body': event.get('summary', '') or event.get('description', '') or event.get('title', '')
# }]
#                     self.app_state.events_store[event_id] = event
#                     new_events.append(event)
#                     self.events_fetched_today += 1

#             self.last_fetch_at = datetime.now(timezone.utc)
#             self.app_state.pipeline_status = self.get_status()
#             self.app_state.last_event_at = self.last_fetch_at.isoformat()

#             if new_events and hasattr(self.app_state, 'sio'):
#                 for event in new_events[:5]:
#                     await self.app_state.sio.emit('new_event', event)

#             if new_events and hasattr(self.app_state, 'sio'):
#                 try:
#                     await self.app_state.sio.emit("signal_row_update", {
#                         "ts": datetime.now(timezone.utc).isoformat()
#                     })
#                 except Exception as e:
#                     logger.debug(f"Failed to emit signal_row_update: {e}")

#             logger.info(f"Stored {len(new_events)} new events. Total in store: {len(self.app_state.events_store)}")
#             return new_events

#         except Exception as e:
#             logger.error(f"Error in fetch and process: {e}", exc_info=True)
#             raise

#     async def fetch_once(self):
#         """Manual trigger for immediate fetch"""
#         return await self._fetch_and_process()

#     def get_status(self) -> dict:
#         return {
#             "is_running": self.is_running,
#             "last_fetch_at": self.last_fetch_at.isoformat() if self.last_fetch_at else None,
#             "events_fetched_today": self.events_fetched_today,
#             "active_sources": [
#                 "Gulf News Property RSS",
#                 "The National Property RSS",
#                 "Arabian Business RE RSS",
#                 "Zawya RE RSS",
#                 "Property Finder Blog RSS",
#                 "Bayut Blog RSS",
#                 "Google News: DLD/RERA",
#                 "Google News: Emaar/DAMAC/Nakheel",
#                 "Google News: Dubai Transactions",
#                 "Google News: Palm/Marina/Downtown",
#                 "Google News: Off-Plan Launches",
#                 "Google News: Dubai Investment",
#                 "DLD Transaction Signals",
#                 "Reddit (r/DubaiRealEstate)",
#             ],
#             "errors": self.errors[-5:]
#         }














# import asyncio
# import logging
# from datetime import datetime, timezone
# from typing import Dict, List, Optional
# import sys
# import os
# import time

# sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

# logger = logging.getLogger(__name__)


# class PipelineService:
#     def __init__(self):
#         self.is_running = False
#         self.last_fetch_at: Optional[datetime] = None
#         self.events_fetched_today = 0
#         self.errors: List[str] = []
#         self._task: Optional[asyncio.Task] = None
#         self.app_state = None

#     async def start(self, app_state):
#         """Start the background pipeline loop"""
#         self.app_state = app_state
#         self.is_running = True
#         self._task = asyncio.create_task(self._run_loop())
#         logger.info("Pipeline started")

#     async def stop(self):
#         """Stop the pipeline"""
#         self.is_running = False
#         if self._task:
#             self._task.cancel()

#     async def _run_loop(self):
#         """Main loop: fetch every 3 minutes"""
#         while self.is_running:
#             try:
#                 await self._fetch_and_process()
#             except Exception as e:
#                 logger.error(f"Pipeline loop error: {e}")
#                 self.errors.append(str(e))
#                 if len(self.errors) > 10:
#                     self.errors = self.errors[-10:]
#             await asyncio.sleep(180)

#     async def _fetch_and_process(self):
#         """One fetch cycle: RSS + GDELT + NewsAPI + classify + store + emit"""
#         logger.info("Starting fetch cycle...")
#         try:
#             import sys, os
#             backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
#             if backend_dir not in sys.path:
#                 sys.path.insert(0, backend_dir)

#             from data_pipeline.fetchers.rss_fetcher import RSSFetcher
#             from data_pipeline.fetchers.gdelt_fetcher import GDELTFetcher
#             from data_pipeline.fetchers.reddit_fetcher import RedditFetcher
#             from data_pipeline.fetchers.dld_fetcher import DLDFetcher
#             from data_pipeline.processors.classifier import EventClassifier

#             twitter = None
#             linkedin = None
#             newsapi = None

#             try:
#                 from data_pipeline.fetchers.twitter_fetcher import TwitterFetcher
#                 twitter = TwitterFetcher()
#             except Exception as e:
#                 logger.debug(f"Twitter fetcher not available: {e}")

#             try:
#                 from data_pipeline.fetchers.linkedin_fetcher import LinkedInFetcher
#                 linkedin = LinkedInFetcher()
#             except Exception as e:
#                 logger.debug(f"LinkedIn fetcher not available: {e}")

#             try:
#                 from data_pipeline.fetchers.newsapi_fetcher import NewsAPIFetcher
#                 newsapi = NewsAPIFetcher()
#             except Exception as e:
#                 logger.debug(f"NewsAPI fetcher not available: {e}")

#             rss = RSSFetcher()
#             gdelt = GDELTFetcher()
#             reddit = RedditFetcher()
#             dld = DLDFetcher()
#             classifier = EventClassifier()

#             fetch_tasks = [
#                 asyncio.create_task(rss.fetch_all()),
#                 asyncio.create_task(gdelt.fetch_dubai_events(hours_back=2)),
#                 asyncio.create_task(reddit.fetch_all()),
#                 asyncio.create_task(dld.fetch_google_news_transaction_signals()),
#             ]
#             if twitter:
#                 fetch_tasks.append(asyncio.create_task(twitter.fetch_all()))
#             if linkedin:
#                 fetch_tasks.append(asyncio.create_task(linkedin.fetch_all()))
#             if newsapi:
#                 fetch_tasks.append(asyncio.create_task(newsapi.fetch_all()))

#             fetch_results = await asyncio.gather(*fetch_tasks, return_exceptions=True)

#             articles = []
#             source_labels = ["RSS", "Dubai News", "Reddit", "DLD Transactions"]
#             if twitter:
#                 source_labels.append("Twitter")
#             if linkedin:
#                 source_labels.append("LinkedIn")
#             if newsapi:
#                 source_labels.append("NewsAPI")

#             for i, result in enumerate(fetch_results):
#                 label = source_labels[i] if i < len(source_labels) else f"Source{i}"
#                 if isinstance(result, list):
#                     articles.extend(result)
#                     logger.info(f"{label} fetched {len(result)} articles")
#                 else:
#                     logger.warning(f"{label} fetch failed: {result}")

#             logger.info(f"Total articles fetched: {len(articles)}")

#             def _is_relevant(a: dict) -> bool:
#                 text = (a.get("title", "") + " " + a.get("summary", "")).lower()
#                 has_dubai = any(kw in text for kw in [
#                     "dubai", "dld", "rera", "emaar", "damac", "nakheel", "meraas",
#                     "bayut", "property finder", "abu dhabi", "uae", "sharjah"
#                 ])
#                 has_re = any(kw in text for kw in [
#                     "property", "real estate", "villa", "apartment", "tower",
#                     "transaction", "aed", "handover", "offplan", "rental",
#                     "developer", "launch", "residential", "commercial"
#                 ])
#                 return has_dubai and has_re

#             before = len(articles)
#             articles = [a for a in articles if _is_relevant(a)]
#             logger.info(f"Relevance filter: {before} to {len(articles)} articles")

#             if not articles:
#                 logger.info("No new articles this cycle")
#                 self.last_fetch_at = datetime.now(timezone.utc)
#                 return []

#             events = classifier.classify_batch(articles)
#             logger.info(f"Classified {len(events)} events")

#             new_events = []
#             for event in events:
#                 event_id = event.get('id')
#                 if event_id and event_id not in self.app_state.events_store:
#                     event['created_at_ts'] = time.time()
#                     event['created_at'] = datetime.now(timezone.utc).isoformat()
#                     event['updated_at'] = datetime.now(timezone.utc).isoformat()
#                     if 'signals' not in event:
#                         event['signals'] = [{
#                             'source': event.get('source', 'RSS'),
#                             'url': event.get('url', ''),
#                             'snippet': event.get('title', '')[:100],
#                             'body': event.get('summary', '') or event.get('description', '') or event.get('title', '')
#                         }]
#                     self.app_state.events_store[event_id] = event
#                     new_events.append(event)
#                     self.events_fetched_today += 1

#             self.last_fetch_at = datetime.now(timezone.utc)
#             self.app_state.pipeline_status = self.get_status()
#             self.app_state.last_event_at = self.last_fetch_at.isoformat()

#             if new_events and hasattr(self.app_state, 'sio'):
#                 for event in new_events[:5]:
#                     await self.app_state.sio.emit('new_event', event)

#             if new_events and hasattr(self.app_state, 'sio'):
#                 try:
#                     await self.app_state.sio.emit("signal_row_update", {
#                         "ts": datetime.now(timezone.utc).isoformat()
#                     })
#                 except Exception as e:
#                     logger.debug(f"Failed to emit signal_row_update: {e}")

#             logger.info(f"Stored {len(new_events)} new events. Total in store: {len(self.app_state.events_store)}")
#             return new_events

#         except Exception as e:
#             logger.error(f"Error in fetch and process: {e}", exc_info=True)
#             raise

#     async def fetch_once(self):
#         """Manual trigger for immediate fetch"""
#         return await self._fetch_and_process()

#     def get_status(self) -> dict:
#         return {
#             "is_running": self.is_running,
#             "last_fetch_at": self.last_fetch_at.isoformat() if self.last_fetch_at else None,
#             "events_fetched_today": self.events_fetched_today,
#             "active_sources": [
#                 "Gulf News Property RSS",
#                 "The National Property RSS",
#                 "Arabian Business RE RSS",
#                 "Zawya RE RSS",
#                 "Property Finder Blog RSS",
#                 "Bayut Blog RSS",
#                 "Google News: DLD/RERA",
#                 "Google News: Emaar/DAMAC/Nakheel",
#                 "Google News: Dubai Transactions",
#                 "Google News: Palm/Marina/Downtown",
#                 "Google News: Off-Plan Launches",
#                 "Google News: Dubai Investment",
#                 "DLD Transaction Signals",
#                 "Reddit (r/DubaiRealEstate)",
#                 "NewsAPI: Dubai Real Estate",
#             ],
#             "errors": self.errors[-5:]
#         }














# import asyncio
# import logging
# from datetime import datetime, timezone
# from typing import Dict, List, Optional
# import sys
# import os
# import time

# sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

# logger = logging.getLogger(__name__)


# class PipelineService:
#     def __init__(self):
#         self.is_running = False
#         self.last_fetch_at: Optional[datetime] = None
#         self.events_fetched_today = 0
#         self.errors: List[str] = []
#         self._task: Optional[asyncio.Task] = None
#         self.app_state = None

#     async def start(self, app_state):
#         """Start the background pipeline loop"""
#         self.app_state = app_state
#         self.is_running = True
#         self._task = asyncio.create_task(self._run_loop())
#         logger.info("Pipeline started")

#     async def stop(self):
#         """Stop the pipeline"""
#         self.is_running = False
#         if self._task:
#             self._task.cancel()

#     async def _run_loop(self):
#         """Main loop: fetch every 3 minutes"""
#         while self.is_running:
#             try:
#                 await self._fetch_and_process()
#             except Exception as e:
#                 logger.error(f"Pipeline loop error: {e}")
#                 self.errors.append(str(e))
#                 if len(self.errors) > 10:
#                     self.errors = self.errors[-10:]
#             await asyncio.sleep(180)

#     async def _fetch_and_process(self):
#         """One fetch cycle: RSS + GDELT + NewsAPI + Distress + classify + store + emit"""
#         logger.info("Starting fetch cycle...")
#         try:
#             import sys, os
#             backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
#             if backend_dir not in sys.path:
#                 sys.path.insert(0, backend_dir)

#             from data_pipeline.fetchers.rss_fetcher import RSSFetcher
#             from data_pipeline.fetchers.gdelt_fetcher import GDELTFetcher
#             from data_pipeline.fetchers.reddit_fetcher import RedditFetcher
#             from data_pipeline.fetchers.dld_fetcher import DLDFetcher
#             from data_pipeline.processors.classifier import EventClassifier

#             twitter = None
#             linkedin = None
#             newsapi = None

#             try:
#                 from data_pipeline.fetchers.twitter_fetcher import TwitterFetcher
#                 twitter = TwitterFetcher()
#             except Exception as e:
#                 logger.debug(f"Twitter fetcher not available: {e}")

#             try:
#                 from data_pipeline.fetchers.linkedin_fetcher import LinkedInFetcher
#                 linkedin = LinkedInFetcher()
#             except Exception as e:
#                 logger.debug(f"LinkedIn fetcher not available: {e}")

#             try:
#                 from data_pipeline.fetchers.newsapi_fetcher import NewsAPIFetcher
#                 newsapi = NewsAPIFetcher()
#             except Exception as e:
#                 logger.debug(f"NewsAPI fetcher not available: {e}")

#             rss = RSSFetcher()
#             gdelt = GDELTFetcher()
#             reddit = RedditFetcher()
#             dld = DLDFetcher()
#             classifier = EventClassifier()

#             fetch_tasks = [
#                 asyncio.create_task(rss.fetch_all()),
#                 asyncio.create_task(gdelt.fetch_dubai_events(hours_back=2)),
#                 asyncio.create_task(reddit.fetch_all()),
#                 asyncio.create_task(dld.fetch_google_news_transaction_signals()),
#             ]
#             if twitter:
#                 fetch_tasks.append(asyncio.create_task(twitter.fetch_all()))
#             if linkedin:
#                 fetch_tasks.append(asyncio.create_task(linkedin.fetch_all()))
#             if newsapi:
#                 fetch_tasks.append(asyncio.create_task(newsapi.fetch_all()))

#             fetch_results = await asyncio.gather(*fetch_tasks, return_exceptions=True)

#             articles = []
#             source_labels = ["RSS", "Dubai News", "Reddit", "DLD Transactions"]
#             if twitter:
#                 source_labels.append("Twitter")
#             if linkedin:
#                 source_labels.append("LinkedIn")
#             if newsapi:
#                 source_labels.append("NewsAPI")

#             for i, result in enumerate(fetch_results):
#                 label = source_labels[i] if i < len(source_labels) else f"Source{i}"
#                 if isinstance(result, list):
#                     articles.extend(result)
#                     logger.info(f"{label} fetched {len(result)} articles")
#                 else:
#                     logger.warning(f"{label} fetch failed: {result}")

#             # ✅ ADD distress deals from Reddit scraper
#             try:
#                 from app.api.distress import fetch_distress_deals
#                 distress_deals = await fetch_distress_deals()
#                 for deal in distress_deals:
#                     articles.append({
#                         "id": deal["id"],
#                         "title": deal["title"],
#                         "summary": deal["body"][:500] if deal.get("body") else deal["title"],
#                         "url": deal["url"],
#                         "source": deal["source"],
#                         "published_at": deal["posted_at"],
#                         "category": "investment",
#                         "severity": 3,
#                         "area": "Dubai",
#                         "location_name": "Dubai",
#                         "lat": 25.2048,
#                         "lng": 55.2708,
#                     })
#                 logger.info(f"Distress deals fetched: {len(distress_deals)}")
#             except Exception as e:
#                 logger.warning(f"Distress fetch failed: {e}")

#             logger.info(f"Total articles fetched: {len(articles)}")

#             def _is_relevant(a: dict) -> bool:
#                 text = (a.get("title", "") + " " + a.get("summary", "")).lower()
#                 has_dubai = any(kw in text for kw in [
#                     "dubai", "dld", "rera", "emaar", "damac", "nakheel", "meraas",
#                     "bayut", "property finder", "abu dhabi", "uae", "sharjah"
#                 ])
#                 has_re = any(kw in text for kw in [
#                     "property", "real estate", "villa", "apartment", "tower",
#                     "transaction", "aed", "handover", "offplan", "rental",
#                     "developer", "launch", "residential", "commercial"
#                 ])
#                 return has_dubai and has_re

#             before = len(articles)
#             articles = [a for a in articles if _is_relevant(a)]
#             logger.info(f"Relevance filter: {before} to {len(articles)} articles")

#             if not articles:
#                 logger.info("No new articles this cycle")
#                 self.last_fetch_at = datetime.now(timezone.utc)
#                 return []

#             events = classifier.classify_batch(articles)
#             logger.info(f"Classified {len(events)} events")

#             new_events = []
#             for event in events:
#                 event_id = event.get('id')
#                 if event_id and event_id not in self.app_state.events_store:
#                     event['created_at_ts'] = time.time()
#                     event['created_at'] = datetime.now(timezone.utc).isoformat()
#                     event['updated_at'] = datetime.now(timezone.utc).isoformat()
#                     if 'signals' not in event:
#                         event['signals'] = [{
#                             'source': event.get('source', 'RSS'),
#                             'url': event.get('url', ''),
#                             'snippet': event.get('title', '')[:100],
#                             'body': event.get('summary', '') or event.get('description', '') or event.get('title', '')
#                         }]
#                     self.app_state.events_store[event_id] = event
#                     new_events.append(event)
#                     self.events_fetched_today += 1

#             self.last_fetch_at = datetime.now(timezone.utc)
#             self.app_state.pipeline_status = self.get_status()
#             self.app_state.last_event_at = self.last_fetch_at.isoformat()

#             if new_events and hasattr(self.app_state, 'sio'):
#                 for event in new_events[:5]:
#                     await self.app_state.sio.emit('new_event', event)

#             if new_events and hasattr(self.app_state, 'sio'):
#                 try:
#                     await self.app_state.sio.emit("signal_row_update", {
#                         "ts": datetime.now(timezone.utc).isoformat()
#                     })
#                 except Exception as e:
#                     logger.debug(f"Failed to emit signal_row_update: {e}")

#             logger.info(f"Stored {len(new_events)} new events. Total in store: {len(self.app_state.events_store)}")
#             return new_events

#         except Exception as e:
#             logger.error(f"Error in fetch and process: {e}", exc_info=True)
#             raise

#     async def fetch_once(self):
#         """Manual trigger for immediate fetch"""
#         return await self._fetch_and_process()

#     def get_status(self) -> dict:
#         return {
#             "is_running": self.is_running,
#             "last_fetch_at": self.last_fetch_at.isoformat() if self.last_fetch_at else None,
#             "events_fetched_today": self.events_fetched_today,
#             "active_sources": [
#                 "Gulf News Property RSS",
#                 "The National Property RSS",
#                 "Arabian Business RE RSS",
#                 "Zawya RE RSS",
#                 "Property Finder Blog RSS",
#                 "Bayut Blog RSS",
#                 "Google News: DLD/RERA",
#                 "Google News: Emaar/DAMAC/Nakheel",
#                 "Google News: Dubai Transactions",
#                 "Google News: Palm/Marina/Downtown",
#                 "Google News: Off-Plan Launches",
#                 "Google News: Dubai Investment",
#                 "DLD Transaction Signals",
#                 "Reddit (r/DubaiRealEstate)",
#                 "NewsAPI: Dubai Real Estate",
#                 "Reddit Distress Deals",
#             ],
#             "errors": self.errors[-5:]
#         }


















# import asyncio
# import logging
# from datetime import datetime, timezone
# from typing import Dict, List, Optional
# import sys
# import os
# import time

# sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

# logger = logging.getLogger(__name__)


# class PipelineService:
#     def __init__(self):
#         self.is_running = False
#         self.last_fetch_at: Optional[datetime] = None
#         self.events_fetched_today = 0
#         self.errors: List[str] = []
#         self._task: Optional[asyncio.Task] = None
#         self.app_state = None

#     async def start(self, app_state):
#         """Start the background pipeline loop"""
#         self.app_state = app_state
#         self.is_running = True
#         self._task = asyncio.create_task(self._run_loop())
#         logger.info("Pipeline started")

#     async def stop(self):
#         """Stop the pipeline"""
#         self.is_running = False
#         if self._task:
#             self._task.cancel()

#     async def _run_loop(self):
#         """Main loop: fetch every 3 minutes"""
#         while self.is_running:
#             try:
#                 await self._fetch_and_process()
#             except Exception as e:
#                 logger.error(f"Pipeline loop error: {e}")
#                 self.errors.append(str(e))
#                 if len(self.errors) > 10:
#                     self.errors = self.errors[-10:]
#             await asyncio.sleep(180)

#     async def _fetch_and_process(self):
#         """One fetch cycle: RSS + GDELT + NewsAPI + classify + store + emit"""
#         logger.info("Starting fetch cycle...")
#         try:
#             import sys, os
#             backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
#             if backend_dir not in sys.path:
#                 sys.path.insert(0, backend_dir)

#             from data_pipeline.fetchers.rss_fetcher import RSSFetcher
#             from data_pipeline.fetchers.gdelt_fetcher import GDELTFetcher
#             from data_pipeline.fetchers.reddit_fetcher import RedditFetcher
#             from data_pipeline.fetchers.dld_fetcher import DLDFetcher
#             from data_pipeline.processors.classifier import EventClassifier

#             twitter = None
#             linkedin = None
#             newsapi = None

#             try:
#                 from data_pipeline.fetchers.twitter_fetcher import TwitterFetcher
#                 twitter = TwitterFetcher()
#             except Exception as e:
#                 logger.debug(f"Twitter fetcher not available: {e}")

#             try:
#                 from data_pipeline.fetchers.linkedin_fetcher import LinkedInFetcher
#                 linkedin = LinkedInFetcher()
#             except Exception as e:
#                 logger.debug(f"LinkedIn fetcher not available: {e}")

#             try:
#                 from data_pipeline.fetchers.newsapi_fetcher import NewsAPIFetcher
#                 newsapi = NewsAPIFetcher()
#             except Exception as e:
#                 logger.debug(f"NewsAPI fetcher not available: {e}")

#             rss = RSSFetcher()
#             gdelt = GDELTFetcher()
#             reddit = RedditFetcher()
#             dld = DLDFetcher()
#             classifier = EventClassifier()

#             fetch_tasks = [
#                 asyncio.create_task(rss.fetch_all()),
#                 asyncio.create_task(gdelt.fetch_dubai_events(hours_back=2)),
#                 asyncio.create_task(reddit.fetch_all()),
#                 asyncio.create_task(dld.fetch_google_news_transaction_signals()),
#             ]
#             if twitter:
#                 fetch_tasks.append(asyncio.create_task(twitter.fetch_all()))
#             if linkedin:
#                 fetch_tasks.append(asyncio.create_task(linkedin.fetch_all()))
#             if newsapi:
#                 fetch_tasks.append(asyncio.create_task(newsapi.fetch_all()))

#             fetch_results = await asyncio.gather(*fetch_tasks, return_exceptions=True)

#             articles = []
#             source_labels = ["RSS", "Dubai News", "Reddit", "DLD Transactions"]
#             if twitter:
#                 source_labels.append("Twitter")
#             if linkedin:
#                 source_labels.append("LinkedIn")
#             if newsapi:
#                 source_labels.append("NewsAPI")

#             for i, result in enumerate(fetch_results):
#                 label = source_labels[i] if i < len(source_labels) else f"Source{i}"
#                 if isinstance(result, list):
#                     articles.extend(result)
#                     logger.info(f"{label} fetched {len(result)} articles")
#                 else:
#                     logger.warning(f"{label} fetch failed: {result}")

#             logger.info(f"Total articles fetched: {len(articles)}")

#             def _is_relevant(a: dict) -> bool:
#                 text = (a.get("title", "") + " " + a.get("summary", "")).lower()
#                 has_dubai = any(kw in text for kw in [
#                     "dubai", "dld", "rera", "emaar", "damac", "nakheel", "meraas",
#                     "bayut", "property finder", "abu dhabi", "uae", "sharjah"
#                 ])
#                 has_re = any(kw in text for kw in [
#                     "property", "real estate", "villa", "apartment", "tower",
#                     "transaction", "aed", "handover", "offplan", "rental",
#                     "developer", "launch", "residential", "commercial"
#                 ])
#                 return has_dubai and has_re

#             before = len(articles)
#             articles = [a for a in articles if _is_relevant(a)]
#             logger.info(f"Relevance filter: {before} to {len(articles)} articles")

#             if not articles:
#                 logger.info("No new articles this cycle")
#                 self.last_fetch_at = datetime.now(timezone.utc)
#                 return []

#             events = classifier.classify_batch(articles)
#             logger.info(f"Classified {len(events)} events")

#             new_events = []
#             for event in events:
#                 event_id = event.get('id')
#                 if event_id and event_id not in self.app_state.events_store:
#                     event['created_at_ts'] = time.time()
#                     event['created_at'] = datetime.now(timezone.utc).isoformat()
#                     event['updated_at'] = datetime.now(timezone.utc).isoformat()
#                     if 'signals' not in event:
#                         event['signals'] = [{
#                             'source': event.get('source', 'RSS'),
#                             'url': event.get('url', ''),
#                             'snippet': event.get('title', '')[:100],
#                             'body': event.get('summary', '') or event.get('description', '') or event.get('title', '')
#                         }]
#                     self.app_state.events_store[event_id] = event
#                     new_events.append(event)
#                     self.events_fetched_today += 1

#             self.last_fetch_at = datetime.now(timezone.utc)
#             self.app_state.pipeline_status = self.get_status()
#             self.app_state.last_event_at = self.last_fetch_at.isoformat()

#             if new_events and hasattr(self.app_state, 'sio'):
#                 for event in new_events[:5]:
#                     await self.app_state.sio.emit('new_event', event)

#             if new_events and hasattr(self.app_state, 'sio'):
#                 try:
#                     await self.app_state.sio.emit("signal_row_update", {
#                         "ts": datetime.now(timezone.utc).isoformat()
#                     })
#                 except Exception as e:
#                     logger.debug(f"Failed to emit signal_row_update: {e}")

#             logger.info(f"Stored {len(new_events)} new events. Total in store: {len(self.app_state.events_store)}")
#             return new_events

#         except Exception as e:
#             logger.error(f"Error in fetch and process: {e}", exc_info=True)
#             raise

#     async def fetch_once(self):
#         """Manual trigger for immediate fetch"""
#         return await self._fetch_and_process()

#     def get_status(self) -> dict:
#         return {
#             "is_running": self.is_running,
#             "last_fetch_at": self.last_fetch_at.isoformat() if self.last_fetch_at else None,
#             "events_fetched_today": self.events_fetched_today,
#             "active_sources": [
#                 "Gulf News Property RSS",
#                 "The National Property RSS",
#                 "Arabian Business RE RSS",
#                 "Zawya RE RSS",
#                 "Property Finder Blog RSS",
#                 "Bayut Blog RSS",
#                 "Google News: DLD/RERA",
#                 "Google News: Emaar/DAMAC/Nakheel",
#                 "Google News: Dubai Transactions",
#                 "Google News: Palm/Marina/Downtown",
#                 "Google News: Off-Plan Launches",
#                 "Google News: Dubai Investment",
#                 "DLD Transaction Signals",
#                 "Reddit (r/DubaiRealEstate)",
#                 "NewsAPI: Dubai Real Estate",
#             ],
#             "errors": self.errors[-5:]
#         }













import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional
import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

logger = logging.getLogger(__name__)


class PipelineService:
    def __init__(self):
        self.is_running = False
        self.last_fetch_at: Optional[datetime] = None
        self.events_fetched_today = 0
        self.errors: List[str] = []
        self._task: Optional[asyncio.Task] = None
        self.app_state = None
        self._gdelt_last_called = 0        # rate limit tracking
        self._gdelt_cache: List[dict] = [] # cached results between calls
        self._gdelt_min_interval = 300     # 5 minutes between GDELT calls

    async def start(self, app_state):
        """Start the background pipeline loop"""
        self.app_state = app_state
        self.is_running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info("Pipeline started")

    async def stop(self):
        """Stop the pipeline"""
        self.is_running = False
        if self._task:
            self._task.cancel()

    async def _run_loop(self):
        """Main loop: fetch every 3 minutes"""
        while self.is_running:
            try:
                await self._fetch_and_process()
            except Exception as e:
                logger.error(f"Pipeline loop error: {e}")
                self.errors.append(str(e))
                if len(self.errors) > 10:
                    self.errors = self.errors[-10:]
            await asyncio.sleep(180)

    async def _fetch_and_process(self):
        """One fetch cycle: RSS + GDELT + NewsAPI + classify + store + emit"""
        logger.info("Starting fetch cycle...")
        try:
            import sys, os
            backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            if backend_dir not in sys.path:
                sys.path.insert(0, backend_dir)

            from data_pipeline.fetchers.rss_fetcher import RSSFetcher
            from data_pipeline.fetchers.gdelt_fetcher import GDELTFetcher
            from data_pipeline.fetchers.reddit_fetcher import RedditFetcher
            from data_pipeline.fetchers.dld_fetcher import DLDFetcher
            from data_pipeline.processors.classifier import EventClassifier

            twitter = None
            linkedin = None
            newsapi = None

            try:
                from data_pipeline.fetchers.twitter_fetcher import TwitterFetcher
                twitter = TwitterFetcher()
            except Exception as e:
                logger.debug(f"Twitter fetcher not available: {e}")

            try:
                from data_pipeline.fetchers.linkedin_fetcher import LinkedInFetcher
                linkedin = LinkedInFetcher()
            except Exception as e:
                logger.debug(f"LinkedIn fetcher not available: {e}")

            try:
                from data_pipeline.fetchers.newsapi_fetcher import NewsAPIFetcher
                newsapi = NewsAPIFetcher()
            except Exception as e:
                logger.debug(f"NewsAPI fetcher not available: {e}")

            rss = RSSFetcher()
            gdelt = GDELTFetcher()
            reddit = RedditFetcher()
            dld = DLDFetcher()
            classifier = EventClassifier()

            # ── GDELT rate limiting: call at most once every 5 minutes ──
            now = time.time()
            time_since_gdelt = now - self._gdelt_last_called
            use_gdelt = time_since_gdelt >= self._gdelt_min_interval

            if use_gdelt:
                logger.info("GDELT: calling API (rate limit window elapsed)")
                self._gdelt_last_called = now
            else:
                remaining = int(self._gdelt_min_interval - time_since_gdelt)
                logger.info(f"GDELT: skipped (rate limited, next call in {remaining}s, using {len(self._gdelt_cache)} cached articles)")

            # ── Build fetch tasks (GDELT only if allowed) ──
            fetch_tasks = [
                asyncio.create_task(rss.fetch_all()),
                asyncio.create_task(reddit.fetch_all()),
                asyncio.create_task(dld.fetch_google_news_transaction_signals()),
            ]
            source_labels = ["RSS", "Reddit", "DLD Transactions"]

            if use_gdelt:
                fetch_tasks.insert(1, asyncio.create_task(gdelt.fetch_dubai_events(hours_back=2)))
                source_labels.insert(1, "Dubai News")

            if twitter:
                fetch_tasks.append(asyncio.create_task(twitter.fetch_all()))
                source_labels.append("Twitter")
            if linkedin:
                fetch_tasks.append(asyncio.create_task(linkedin.fetch_all()))
                source_labels.append("LinkedIn")
            if newsapi:
                fetch_tasks.append(asyncio.create_task(newsapi.fetch_all()))
                source_labels.append("NewsAPI")

            fetch_results = await asyncio.gather(*fetch_tasks, return_exceptions=True)

            articles = []

            for i, result in enumerate(fetch_results):
                label = source_labels[i] if i < len(source_labels) else f"Source{i}"
                if isinstance(result, list):
                    # If this is the GDELT result, update cache
                    if use_gdelt and label == "Dubai News":
                        self._gdelt_cache = result
                        logger.info(f"GDELT cache updated with {len(result)} articles")
                    articles.extend(result)
                    logger.info(f"{label} fetched {len(result)} articles")
                else:
                    logger.warning(f"{label} fetch failed: {result}")
                    # If GDELT failed, keep using old cache
                    if use_gdelt and label == "Dubai News":
                        logger.info(f"GDELT failed — injecting {len(self._gdelt_cache)} cached articles")
                        articles.extend(self._gdelt_cache)
                        # Reset timer so we retry sooner (2 min instead of 5)
                        self._gdelt_last_called = now - (self._gdelt_min_interval - 120)

            # If GDELT was skipped, inject cached results
            if not use_gdelt and self._gdelt_cache:
                articles.extend(self._gdelt_cache)
                logger.info(f"GDELT cache injected {len(self._gdelt_cache)} cached articles")

            logger.info(f"Total articles fetched: {len(articles)}")

            def _is_relevant(a: dict) -> bool:
                text = (a.get("title", "") + " " + a.get("summary", "")).lower()
                has_dubai = any(kw in text for kw in [
                    "dubai", "dld", "rera", "emaar", "damac", "nakheel", "meraas",
                    "bayut", "property finder", "abu dhabi", "uae", "sharjah"
                ])
                has_re = any(kw in text for kw in [
                    "property", "real estate", "villa", "apartment", "tower",
                    "transaction", "aed", "handover", "offplan", "rental",
                    "developer", "launch", "residential", "commercial"
                ])
                return has_dubai and has_re

            before = len(articles)
            articles = [a for a in articles if _is_relevant(a)]
            logger.info(f"Relevance filter: {before} to {len(articles)} articles")

            if not articles:
                logger.info("No new articles this cycle")
                self.last_fetch_at = datetime.now(timezone.utc)
                return []

            events = classifier.classify_batch(articles)
            logger.info(f"Classified {len(events)} events")

            new_events = []
            for event in events:
                event_id = event.get('id')
                if event_id and event_id not in self.app_state.events_store:
                    event['created_at_ts'] = time.time()
                    event['created_at'] = datetime.now(timezone.utc).isoformat()
                    event['updated_at'] = datetime.now(timezone.utc).isoformat()
                    if 'signals' not in event:
                        event['signals'] = [{
                            'source': event.get('source', 'RSS'),
                            'url': event.get('url', ''),
                            'snippet': event.get('title', '')[:100],
                            'body': event.get('summary', '') or event.get('description', '') or event.get('title', '')
                        }]
                    self.app_state.events_store[event_id] = event
                    new_events.append(event)
                    self.events_fetched_today += 1

            self.last_fetch_at = datetime.now(timezone.utc)
            self.app_state.pipeline_status = self.get_status()
            self.app_state.last_event_at = self.last_fetch_at.isoformat()

            if new_events and hasattr(self.app_state, 'sio'):
                for event in new_events[:5]:
                    await self.app_state.sio.emit('new_event', event)

            if new_events and hasattr(self.app_state, 'sio'):
                try:
                    await self.app_state.sio.emit("signal_row_update", {
                        "ts": datetime.now(timezone.utc).isoformat()
                    })
                except Exception as e:
                    logger.debug(f"Failed to emit signal_row_update: {e}")

            logger.info(f"Stored {len(new_events)} new events. Total in store: {len(self.app_state.events_store)}")
            return new_events

        except Exception as e:
            logger.error(f"Error in fetch and process: {e}", exc_info=True)
            raise

    async def fetch_once(self):
        """Manual trigger for immediate fetch"""
        return await self._fetch_and_process()

    def get_status(self) -> dict:
        now = time.time()
        gdelt_next_in = max(0, int(self._gdelt_min_interval - (now - self._gdelt_last_called)))
        return {
            "is_running": self.is_running,
            "last_fetch_at": self.last_fetch_at.isoformat() if self.last_fetch_at else None,
            "events_fetched_today": self.events_fetched_today,
            "gdelt_cache_size": len(self._gdelt_cache),
            "gdelt_next_call_in_seconds": gdelt_next_in,
            "active_sources": [
                "Gulf News Property RSS",
                "The National Property RSS",
                "Arabian Business RE RSS",
                "Zawya RE RSS",
                "Property Finder Blog RSS",
                "Bayut Blog RSS",
                "Google News: DLD/RERA",
                "Google News: Emaar/DAMAC/Nakheel",
                "Google News: Dubai Transactions",
                "Google News: Palm/Marina/Downtown",
                "Google News: Off-Plan Launches",
                "Google News: Dubai Investment",
                "DLD Transaction Signals",
                "Reddit (r/DubaiRealEstate)",
                "NewsAPI: Dubai Real Estate",
            ],
            "errors": self.errors[-5:]
        }
