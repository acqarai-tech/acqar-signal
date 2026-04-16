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
        """One fetch cycle: RSS + GDELT + classify + store + emit"""
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

            rss = RSSFetcher()
            gdelt = GDELTFetcher()
            reddit = RedditFetcher()
            dld = DLDFetcher()
            classifier = EventClassifier()

            fetch_tasks = [
                asyncio.create_task(rss.fetch_all()),
                asyncio.create_task(gdelt.fetch_dubai_events(hours_back=2)),
                asyncio.create_task(reddit.fetch_all()),
                asyncio.create_task(dld.fetch_google_news_transaction_signals()),
            ]
            if twitter:
                fetch_tasks.append(asyncio.create_task(twitter.fetch_all()))
            if linkedin:
                fetch_tasks.append(asyncio.create_task(linkedin.fetch_all()))

            fetch_results = await asyncio.gather(*fetch_tasks, return_exceptions=True)

            articles = []
            source_labels = ["RSS", "Dubai News", "Reddit", "DLD Transactions"]
            if twitter:
                source_labels.append("Twitter")
            if linkedin:
                source_labels.append("LinkedIn")

            for i, result in enumerate(fetch_results):
                label = source_labels[i] if i < len(source_labels) else f"Source{i}"
                if isinstance(result, list):
                    articles.extend(result)
                    logger.info(f"{label} fetched {len(result)} articles")
                else:
                    logger.warning(f"{label} fetch failed: {result}")

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
        return {
            "is_running": self.is_running,
            "last_fetch_at": self.last_fetch_at.isoformat() if self.last_fetch_at else None,
            "events_fetched_today": self.events_fetched_today,
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
            ],
            "errors": self.errors[-5:]
        }





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

#         # Load seed events with fresh timestamps on every startup
#         try:
#             from app.services.seed_data import get_seed_events
#             seed_events = get_seed_events()
#             loaded = 0
#             for event in seed_events:
#                 eid = event.get('id')
#                 if eid:
#                     self.app_state.events_store[eid] = event
#                     loaded += 1
#             logger.info(f"✓ Loaded {loaded} seed events into store")
#         except Exception as e:
#             logger.error(f"Failed to load seed data: {e}")

#         self._task = asyncio.create_task(self._run_loop())
#         logger.info("Pipeline started")

#     async def stop(self):
#         """Stop the pipeline"""
#         self.is_running = False
#         if self._task:
#             self._task.cancel()

#     async def _run_loop(self):
#         """Main loop: fetch every 3 minutes"""
#         _seed_refresh_counter = 0
#         while self.is_running:
#             try:
#                 await self._fetch_and_process()
#             except Exception as e:
#                 logger.error(f"Pipeline loop error: {e}")
#                 self.errors.append(str(e))
#                 if len(self.errors) > 10:
#                     self.errors = self.errors[-10:]

#             # Refresh seed timestamps every 20 cycles (~1 hour)
#             _seed_refresh_counter += 1
#             if _seed_refresh_counter >= 20:
#                 try:
#                     from app.services.seed_data import get_seed_events
#                     for event in get_seed_events():
#                         eid = event.get('id')
#                         if eid:
#                             self.app_state.events_store[eid] = event
#                     logger.info("✓ Seed timestamps refreshed")
#                 except Exception as e:
#                     logger.warning(f"Seed refresh failed: {e}")
#                 _seed_refresh_counter = 0

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
#                         event['signals'] = [{'source': event.get('source', 'RSS'), 'url': event.get('url', ''), 'snippet': event.get('title', '')[:100]}]
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
# from datetime import datetime, timezone, timedelta
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
#         """Start the background pipeline loop."""
#         self.app_state = app_state
#         self.is_running = True
#         self._task = asyncio.create_task(self._run_loop())
#         logger.info("Pipeline started")

#     async def stop(self):
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
#         """One fetch cycle: RSS + GDELT → classify → store → emit"""
#         logger.info("Starting fetch cycle...")
#         try:
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

#             rss    = RSSFetcher()
#             gdelt  = GDELTFetcher()
#             reddit = RedditFetcher()
#             dld    = DLDFetcher()
#             classifier = EventClassifier()

#             fetch_tasks = [
#                 asyncio.create_task(rss.fetch_all()),
#                 asyncio.create_task(gdelt.fetch_dubai_events(hours_back=72)),
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

#             # Dubai RE relevance filter
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

#             before   = len(articles)
#             articles = [a for a in articles if _is_relevant(a)]
#             logger.info(f"Relevance filter: {before} → {len(articles)} articles")

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
#                     # Use the article's real published_at as created_at_ts so
#                     # the frontend time filters work correctly
#                     pub_str = event.get('published_at') or event.get('created_at')
#                     try:
#                         pub_dt  = datetime.fromisoformat(pub_str.replace("Z", "+00:00"))
#                         if pub_dt.tzinfo is None:
#                             pub_dt = pub_dt.replace(tzinfo=timezone.utc)
#                         created_ts = pub_dt.timestamp()
#                     except Exception:
#                         created_ts = time.time()

#                     event['created_at_ts'] = created_ts
#                     event['created_at']    = datetime.fromtimestamp(created_ts, tz=timezone.utc).isoformat()
#                     event['updated_at']    = datetime.now(timezone.utc).isoformat()

#                     if 'signals' not in event:
#                         event['signals'] = [{
#                             'source':  event.get('source', 'RSS'),
#                             'url':     event.get('url', ''),
#                             'snippet': event.get('title', '')[:100]
#                         }]

#                     self.app_state.events_store[event_id] = event
#                     new_events.append(event)
#                     self.events_fetched_today += 1

#             self.last_fetch_at              = datetime.now(timezone.utc)
#             self.app_state.pipeline_status  = self.get_status()
#             self.app_state.last_event_at    = self.last_fetch_at.isoformat()

#             # Emit new events via Socket.io (max 5 per cycle)
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

#             logger.info(f"Stored {len(new_events)} new events. Total: {len(self.app_state.events_store)}")
#             return new_events

#         except Exception as e:
#             logger.error(f"Error in fetch and process: {e}", exc_info=True)
#             raise

#     async def fetch_once(self):
#         """Manual trigger for immediate fetch"""
#         return await self._fetch_and_process()

#     def get_status(self) -> dict:
#         return {
#             "is_running":           self.is_running,
#             "last_fetch_at":        self.last_fetch_at.isoformat() if self.last_fetch_at else None,
#             "events_fetched_today": self.events_fetched_today,
#             "active_sources": [
#                 "Gulf News Property RSS",
#                 "The National Property RSS",
#                 "Arabian Business RE RSS",
#                 "Zawya RE RSS",
#                 "Property Finder Blog RSS",
#                 "Bayut Blog RSS",
#                 "Google News: DLD/RERA (dynamic year)",
#                 "Google News: Emaar/DAMAC/Nakheel (dynamic year)",
#                 "Google News: Dubai Transactions (dynamic year)",
#                 "Google News: Palm/Marina/Downtown (dynamic year)",
#                 "Google News: Off-Plan Launches (dynamic year)",
#                 "Google News: Dubai Investment (dynamic year)",
#                 "DLD Transaction Signals (dynamic year)",
#                 "Reddit (r/DubaiRealEstate)",
#             ],
#             "errors": self.errors[-5:]
#         }
