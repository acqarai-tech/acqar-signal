# """
# NewsAPI Fetcher.
# Fetches fresh Dubai real estate news from NewsAPI.org
# Free tier: 100 requests/day
# """
# import httpx
# import asyncio
# import logging
# import hashlib
# import os
# from datetime import datetime, timezone
# from typing import List, Dict

# logger = logging.getLogger(__name__)

# NEWSAPI_KEY = os.getenv("NEWS_API_KEY", "")
# NEWSAPI_BASE = "https://newsapi.org/v2/everything"

# QUERIES = [
#     "Dubai real estate",
#     "Dubai property market",
#     "Dubai Land Department",
#     "Emaar DAMAC Dubai property",
#     "Dubai offplan property",
#     "Dubai villa apartment sale",
#     "RERA Dubai property",
#     "Dubai rental market",
# ]

# AREA_MAP = {
#     # Premium / iconic
#     "palm jumeirah":            "Palm Jumeirah",
#     "palm deira":               "Palm Deira",
#     "bluewaters":               "Bluewaters Island",
#     "downtown dubai":           "Downtown Dubai",
#     "burj khalifa":             "Downtown Dubai",
#     "dubai marina":             "Dubai Marina",
#     "jumeirah lake towers":     "JLT",
#     "jlt":                      "JLT",
#     "emaar beachfront":         "Emaar Beachfront",
#     "maritime city":            "Dubai Maritime City",

#     # Business / commercial
#     "business bay":             "Business Bay",
#     "difc":                     "DIFC",
#     "dubai international financial": "DIFC",
#     "city walk":                "City Walk",
#     "la mer":                   "La Mer",
#     "expo city":                "Expo City",
#     "dubai south":              "Dubai South",
#     "dubai world central":      "Dubai South",
#     "dubai investments park":   "Dubai Investments Park",
#     "silicon oasis":            "Dubai Silicon Oasis",
#     "dso":                      "Dubai Silicon Oasis",
#     "internet city":            "Dubai Internet City",
#     "media city":               "Dubai Media City",
#     "knowledge park":           "Dubai Knowledge Park",
#     "production city":          "Dubai Production City",
#     "studio city":              "Dubai Studio City",
#     "motor city":               "Motor City",
#     "sports city":              "Dubai Sports City",

#     # Established communities
#     "jumeirah":                 "Jumeirah",
#     "umm suqeim":               "Umm Suqeim",
#     "al safa":                  "Al Safa",
#     "al wasl":                  "Al Wasl",
#     "al barsha":                "Al Barsha",
#     "al quoz":                  "Al Quoz",
#     "al furjan":                "Al Furjan",
#     "discovery gardens":        "Discovery Gardens",
#     "international city":       "International City",
#     "deira":                    "Deira",
#     "bur dubai":                "Bur Dubai",
#     "karama":                   "Karama",
#     "satwa":                    "Satwa",
#     "al nahda":                 "Al Nahda",
#     "al qusais":                "Al Qusais",
#     "muhaisnah":                "Muhaisnah",
#     "mirdif":                   "Mirdif",
#     "rashidiya":                "Rashidiya",
#     "al twar":                  "Al Twar",
#     "al mamzar":                "Al Mamzar",

#     # New / master developments
#     "dubai hills":              "Dubai Hills Estate",
#     "dubai hills estate":       "Dubai Hills Estate",
#     "sobha hartland":           "Sobha Hartland",
#     "sobha":                    "Sobha Hartland",
#     "creek harbour":            "Dubai Creek Harbour",
#     "dubai creek harbour":      "Dubai Creek Harbour",
#     "ras al khor":              "Ras Al Khor",
#     "nad al sheba":             "Nad Al Sheba",
#     "meydan":                   "Meydan",
#     "arabian ranches":          "Arabian Ranches",
#     "damac hills":              "DAMAC Hills",
#     "damac lagoons":            "DAMAC Lagoons",
#     "town square":              "Town Square",
#     "jumeirah village circle":  "JVC",
#     "jvc":                      "JVC",
#     "jumeirah village triangle":"JVT",
#     "jvt":                      "JVT",
#     "jumeirah golf estates":    "Jumeirah Golf Estates",
#     "the springs":              "The Springs",
#     "the meadows":              "The Meadows",
#     "the lakes":                "The Lakes",
#     "the greens":               "The Greens",
#     "the views":                "The Views",
#     "emirates hills":           "Emirates Hills",
#     "emirates living":          "Emirates Living",
#     "victory heights":          "Victory Heights",
#     "mudon":                    "Mudon",
#     "serena":                   "Serena",
#     "reem":                     "Reem",
#     "tilal al ghaf":            "Tilal Al Ghaf",
#     "dubai land":               "Dubailand",
#     "dubailand":                "Dubailand",
#     "liwan":                    "Liwan",
#     "majan":                    "Majan",
#     "arjan":                    "Arjan",
#     "barsha heights":           "Barsha Heights",
#     "tecom":                    "Barsha Heights",
#     "al khail heights":         "Al Khail Heights",
#     "the villa":                "The Villa",
#     "living legends":           "Living Legends",
#     "falcon city":              "Falcon City",
#     "wadi al safa":             "Wadi Al Safa",
#     "nshama":                   "Town Square",
#     "emaar south":              "Emaar South",
#     "golf city":                "Golf City",
#     "dubai science park":       "Dubai Science Park",
#     "healthcare city":          "Dubai Healthcare City",
#     "al jadaf":                 "Al Jadaf",
#     "culture village":          "Culture Village",
#     "port saeed":               "Port Saeed",
#     "garhoud":                  "Garhoud",
#     "festival city":            "Dubai Festival City",
#     "al rigga":                 "Al Rigga",
#     "naif":                     "Naif",
#     "al ras":                   "Al Ras",
# }


# def _detect_area(text: str) -> str:
#     text_lower = text.lower()
#     for keyword, area in AREA_MAP.items():
#         if keyword in text_lower:
#             return area
#     return "Dubai"


# def _detect_severity(title: str) -> int:
#     title_lower = title.lower()
#     if any(w in title_lower for w in [
#         "record", "billion", "surge", "landmark", "historic",
#         "all-time", "highest", "unprecedented", "massive"
#     ]):
#         return 4
#     if any(w in title_lower for w in [
#         "million", "launch", "announce", "rise", "growth",
#         "strong", "demand", "rally", "boom", "jump"
#     ]):
#         return 3
#     if any(w in title_lower for w in [
#         "report", "market", "transaction", "sales",
#         "trend", "data", "index", "quarterly"
#     ]):
#         return 2
#     return 1


# def _detect_category(title: str) -> str:
#     title_lower = title.lower()
#     if any(w in title_lower for w in [
#         "off-plan", "offplan", "launch", "new project",
#         "new development", "new tower", "new community"
#     ]):
#         return "offplan"
#     if any(w in title_lower for w in [
#         "regulation", "rera", "law", "policy", "rule",
#         "dld", "land department", "decree", "authority"
#     ]):
#         return "regulatory"
#     if any(w in title_lower for w in [
#         "invest", "yield", "return", "fund", "portfolio",
#         "roi", "rental yield", "capital gain"
#     ]):
#         return "investment"
#     if any(w in title_lower for w in [
#         "infrastructure", "metro", "road", "construction",
#         "bridge", "highway", "airport", "transport"
#     ]):
#         return "infrastructure"
#     if any(w in title_lower for w in [
#         "distress", "below market", "motivated seller",
#         "urgent sale", "forced sale", "price reduced",
#         "rent", "rental", "tenant", "landlord", "lease"
#     ]):
#         return "investment"   # map to valid category
#     return "transaction"
# class NewsAPIFetcher:
#     """Fetches Dubai RE news from NewsAPI.org"""

#     def __init__(self):
#         self.headers = {
#             "User-Agent": "Mozilla/5.0 (compatible; ACQAR/1.0)",
#         }

#     async def _fetch_query(self, client: httpx.AsyncClient, query: str) -> List[Dict]:
#         articles = []
#         try:
#             params = {
#                 "q": query,
#                 "language": "en",
#                 "sortBy": "publishedAt",
#                 "pageSize": 20,
#                 "apiKey": NEWSAPI_KEY,
#             }
#             resp = await client.get(NEWSAPI_BASE, params=params, timeout=10)
#             if resp.status_code != 200:
#                 logger.warning(f"NewsAPI error {resp.status_code} for query: {query}")
#                 return []

#             data = resp.json()
#             for item in data.get("articles", []):
#                 title = (item.get("title") or "").strip()
#                 url = (item.get("url") or "").strip()
#                 description = (item.get("description") or title).strip()
#                 source_name = item.get("source", {}).get("name", "NewsAPI")
#                 published_at = item.get("publishedAt") or datetime.now(timezone.utc).isoformat()

#                 if not title or not url:
#                     continue
#                 if "[Removed]" in title:
#                     continue

#                 full_text = title + " " + description
#                 articles.append({
#                     "id": hashlib.md5(url.encode()).hexdigest()[:12],
#                     "title": title[:200],
#                     "summary": description[:500],
#                     "url": url,
#                     "published_at": published_at,
#                     "source": source_name,
#                     "area": _detect_area(full_text),
#                     "category": _detect_category(title),
#                     "severity": _detect_severity(title),
#                     "source_weight": 0.80,
#                     "lat": 25.2048,
#                     "lng": 55.2708,
#                 })
#         except Exception as e:
#             logger.warning(f"NewsAPI fetch failed for '{query}': {e}")
#         return articles

#     async def fetch_all(self) -> List[Dict]:
#         if not NEWSAPI_KEY:
#             logger.warning("NewsAPI: NEWS_API_KEY not set, skipping")
#             return []

#         all_articles = []
#         async with httpx.AsyncClient(headers=self.headers) as client:
#             tasks = [self._fetch_query(client, q) for q in QUERIES]
#             results = await asyncio.gather(*tasks, return_exceptions=True)
#             for r in results:
#                 if isinstance(r, list):
#                     all_articles.extend(r)

#         # Deduplicate by URL
#         seen = set()
#         unique = []
#         for a in all_articles:
#             if a["url"] not in seen:
#                 seen.add(a["url"])
#                 unique.append(a)

#         # Sort newest first
#         unique.sort(key=lambda x: x["published_at"], reverse=True)

#         logger.info(f"NewsAPIFetcher: fetched {len(unique)} unique articles")
#         return unique














"""
NewsAPI Fetcher.
Fetches fresh Dubai real estate news from NewsAPI.org
Free tier: 100 requests/day = ~1 request per 15 minutes max

Strategy: rotate through queries one at a time, one per fetch cycle.
Cache results and reuse between cycles.
"""
import httpx
import asyncio
import logging
import hashlib
import os
import time
from datetime import datetime, timezone
from typing import List, Dict

logger = logging.getLogger(__name__)

NEWSAPI_KEY = os.getenv("NEWS_API_KEY", "")
NEWSAPI_BASE = "https://newsapi.org/v2/everything"

# Only 4 best queries — rotated one per cycle (every 3 min = 20/hr = 480/day on free)
# With 1 query per cycle at 3min intervals = 480 calls/day — still too many.
# We limit to 1 call per 15 minutes = 96/day, safely under 100.
QUERIES = [
    "Dubai real estate",
    "Dubai Land Department",
    "Emaar DAMAC Dubai property",
    "Dubai offplan property",
]

# Module-level state (shared across instances)
_query_index = 0           # which query to use next
_last_called = 0.0         # last time we actually hit the API
_cache: List[Dict] = []    # cached results
_MIN_INTERVAL = 900        # 15 minutes between API calls (96 calls/day max)

AREA_MAP = {
    # Premium / iconic
    "palm jumeirah":            "Palm Jumeirah",
    "palm deira":               "Palm Deira",
    "bluewaters":               "Bluewaters Island",
    "downtown dubai":           "Downtown Dubai",
    "burj khalifa":             "Downtown Dubai",
    "dubai marina":             "Dubai Marina",
    "jumeirah lake towers":     "JLT",
    "jlt":                      "JLT",
    "emaar beachfront":         "Emaar Beachfront",
    "maritime city":            "Dubai Maritime City",

    # Business / commercial
    "business bay":             "Business Bay",
    "difc":                     "DIFC",
    "dubai international financial": "DIFC",
    "city walk":                "City Walk",
    "la mer":                   "La Mer",
    "expo city":                "Expo City",
    "dubai south":              "Dubai South",
    "dubai world central":      "Dubai South",
    "dubai investments park":   "Dubai Investments Park",
    "silicon oasis":            "Dubai Silicon Oasis",
    "dso":                      "Dubai Silicon Oasis",
    "internet city":            "Dubai Internet City",
    "media city":               "Dubai Media City",
    "knowledge park":           "Dubai Knowledge Park",
    "production city":          "Dubai Production City",
    "studio city":              "Dubai Studio City",
    "motor city":               "Motor City",
    "sports city":              "Dubai Sports City",

    # Established communities
    "jumeirah":                 "Jumeirah",
    "umm suqeim":               "Umm Suqeim",
    "al safa":                  "Al Safa",
    "al wasl":                  "Al Wasl",
    "al barsha":                "Al Barsha",
    "al quoz":                  "Al Quoz",
    "al furjan":                "Al Furjan",
    "discovery gardens":        "Discovery Gardens",
    "international city":       "International City",
    "deira":                    "Deira",
    "bur dubai":                "Bur Dubai",
    "karama":                   "Karama",
    "satwa":                    "Satwa",
    "al nahda":                 "Al Nahda",
    "al qusais":                "Al Qusais",
    "muhaisnah":                "Muhaisnah",
    "mirdif":                   "Mirdif",
    "rashidiya":                "Rashidiya",
    "al twar":                  "Al Twar",
    "al mamzar":                "Al Mamzar",

    # New / master developments
    "dubai hills":              "Dubai Hills Estate",
    "dubai hills estate":       "Dubai Hills Estate",
    "sobha hartland":           "Sobha Hartland",
    "sobha":                    "Sobha Hartland",
    "creek harbour":            "Dubai Creek Harbour",
    "dubai creek harbour":      "Dubai Creek Harbour",
    "ras al khor":              "Ras Al Khor",
    "nad al sheba":             "Nad Al Sheba",
    "meydan":                   "Meydan",
    "arabian ranches":          "Arabian Ranches",
    "damac hills":              "DAMAC Hills",
    "damac lagoons":            "DAMAC Lagoons",
    "town square":              "Town Square",
    "jumeirah village circle":  "JVC",
    "jvc":                      "JVC",
    "jumeirah village triangle":"JVT",
    "jvt":                      "JVT",
    "jumeirah golf estates":    "Jumeirah Golf Estates",
    "the springs":              "The Springs",
    "the meadows":              "The Meadows",
    "the lakes":                "The Lakes",
    "the greens":               "The Greens",
    "the views":                "The Views",
    "emirates hills":           "Emirates Hills",
    "emirates living":          "Emirates Living",
    "victory heights":          "Victory Heights",
    "mudon":                    "Mudon",
    "serena":                   "Serena",
    "reem":                     "Reem",
    "tilal al ghaf":            "Tilal Al Ghaf",
    "dubai land":               "Dubailand",
    "dubailand":                "Dubailand",
    "liwan":                    "Liwan",
    "majan":                    "Majan",
    "arjan":                    "Arjan",
    "barsha heights":           "Barsha Heights",
    "tecom":                    "Barsha Heights",
    "al khail heights":         "Al Khail Heights",
    "the villa":                "The Villa",
    "living legends":           "Living Legends",
    "falcon city":              "Falcon City",
    "wadi al safa":             "Wadi Al Safa",
    "nshama":                   "Town Square",
    "emaar south":              "Emaar South",
    "golf city":                "Golf City",
    "dubai science park":       "Dubai Science Park",
    "healthcare city":          "Dubai Healthcare City",
    "al jadaf":                 "Al Jadaf",
    "culture village":          "Culture Village",
    "port saeed":               "Port Saeed",
    "garhoud":                  "Garhoud",
    "festival city":            "Dubai Festival City",
    "al rigga":                 "Al Rigga",
    "naif":                     "Naif",
    "al ras":                   "Al Ras",
}


def _detect_area(text: str) -> str:
    text_lower = text.lower()
    for keyword, area in AREA_MAP.items():
        if keyword in text_lower:
            return area
    return "Dubai"


def _detect_severity(title: str) -> int:
    title_lower = title.lower()
    if any(w in title_lower for w in [
        "record", "billion", "surge", "landmark", "historic",
        "all-time", "highest", "unprecedented", "massive"
    ]):
        return 4
    if any(w in title_lower for w in [
        "million", "launch", "announce", "rise", "growth",
        "strong", "demand", "rally", "boom", "jump"
    ]):
        return 3
    if any(w in title_lower for w in [
        "report", "market", "transaction", "sales",
        "trend", "data", "index", "quarterly"
    ]):
        return 2
    return 1


def _detect_category(title: str) -> str:
    title_lower = title.lower()
    if any(w in title_lower for w in [
        "off-plan", "offplan", "launch", "new project",
        "new development", "new tower", "new community"
    ]):
        return "offplan"
    if any(w in title_lower for w in [
        "regulation", "rera", "law", "policy", "rule",
        "dld", "land department", "decree", "authority"
    ]):
        return "regulatory"
    if any(w in title_lower for w in [
        "invest", "yield", "return", "fund", "portfolio",
        "roi", "rental yield", "capital gain"
    ]):
        return "investment"
    if any(w in title_lower for w in [
        "infrastructure", "metro", "road", "construction",
        "bridge", "highway", "airport", "transport"
    ]):
        return "infrastructure"
    if any(w in title_lower for w in [
        "distress", "below market", "motivated seller",
        "urgent sale", "forced sale", "price reduced",
        "rent", "rental", "tenant", "landlord", "lease"
    ]):
        return "investment"
    return "transaction"


class NewsAPIFetcher:
    """
    Fetches Dubai RE news from NewsAPI.org
    
    Rate limiting strategy:
    - Free tier = 100 requests/day
    - We call at most once every 15 minutes (96/day)
    - Rotate through queries one at a time
    - Cache results and return cache between calls
    """

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (compatible; ACQAR/1.0)",
        }

    async def _fetch_one_query(self, client: httpx.AsyncClient, query: str) -> List[Dict]:
        """Fetch a single query from NewsAPI"""
        articles = []
        try:
            params = {
                "q": query,
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": 20,
                "apiKey": NEWSAPI_KEY,
            }
            resp = await client.get(NEWSAPI_BASE, params=params, timeout=10)
            if resp.status_code == 429:
                logger.warning(f"NewsAPI 429 rate limit hit — will skip for {_MIN_INTERVAL}s")
                return []
            if resp.status_code != 200:
                logger.warning(f"NewsAPI error {resp.status_code} for query: {query}")
                return []

            data = resp.json()
            for item in data.get("articles", []):
                title = (item.get("title") or "").strip()
                url = (item.get("url") or "").strip()
                description = (item.get("description") or title).strip()
                source_name = item.get("source", {}).get("name", "NewsAPI")
                published_at = item.get("publishedAt") or datetime.now(timezone.utc).isoformat()

                if not title or not url:
                    continue
                if "[Removed]" in title:
                    continue

                full_text = title + " " + description
                articles.append({
                    "id": hashlib.md5(url.encode()).hexdigest()[:12],
                    "title": title[:200],
                    "summary": description[:500],
                    "url": url,
                    "published_at": published_at,
                    "source": source_name,
                    "area": _detect_area(full_text),
                    "category": _detect_category(title),
                    "severity": _detect_severity(title),
                    "source_weight": 0.80,
                    "lat": 25.2048,
                    "lng": 55.2708,
                })
        except Exception as e:
            logger.warning(f"NewsAPI fetch failed for '{query}': {e}")
        return articles

    async def fetch_all(self) -> List[Dict]:
        global _query_index, _last_called, _cache

        if not NEWSAPI_KEY:
            logger.warning("NewsAPI: NEWS_API_KEY not set, skipping")
            return []

        now = time.time()
        time_since_last = now - _last_called

        # Rate limit: only call API once every 15 minutes
        if time_since_last < _MIN_INTERVAL:
            remaining = int(_MIN_INTERVAL - time_since_last)
            logger.info(f"NewsAPI: skipped (rate limit, next call in {remaining}s, returning {len(_cache)} cached articles)")
            return list(_cache)  # return cached copy

        # Pick the next query in rotation
        query = QUERIES[_query_index % len(QUERIES)]
        _query_index += 1

        logger.info(f"NewsAPI: calling API with query '{query}' (rotation {_query_index}/{len(QUERIES)})")

        new_articles = []
        async with httpx.AsyncClient(headers=self.headers) as client:
            new_articles = await self._fetch_one_query(client, query)

        if new_articles:
            # Merge new articles into cache, deduplicate by URL
            existing_urls = {a["url"] for a in _cache}
            added = [a for a in new_articles if a["url"] not in existing_urls]
            _cache = (_cache + added)[-200:]  # keep last 200 total
            _last_called = now
            logger.info(f"NewsAPIFetcher: {len(added)} new articles added, {len(_cache)} total cached")
        else:
            # API returned nothing or errored — update timer anyway to avoid hammering
            _last_called = now
            logger.info(f"NewsAPIFetcher: 0 new articles, returning {len(_cache)} cached")

        # Sort newest first and return
        result = sorted(_cache, key=lambda x: x["published_at"], reverse=True)
        logger.info(f"NewsAPIFetcher: returning {len(result)} articles total")
        return result
