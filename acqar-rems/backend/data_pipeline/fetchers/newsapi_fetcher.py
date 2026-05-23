"""
NewsAPI Fetcher.
Fetches fresh Dubai real estate news from NewsAPI.org
Free tier: 100 requests/day
"""
import httpx
import asyncio
import logging
import hashlib
import os
from datetime import datetime, timezone
from typing import List, Dict

logger = logging.getLogger(__name__)

NEWSAPI_KEY = os.getenv("NEWS_API_KEY", "")
NEWSAPI_BASE = "https://newsapi.org/v2/everything"

QUERIES = [
    "Dubai real estate",
    "Dubai property market",
    "Dubai Land Department",
    "Emaar DAMAC Dubai property",
    "Dubai offplan property",
    "Dubai villa apartment sale",
    "RERA Dubai property",
    "Dubai rental market",
]

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
        "urgent sale", "forced sale", "price reduced"
    ]):
        return "distress_deal"
    if any(w in title_lower for w in [
        "rent", "rental", "tenant", "landlord", "lease"
    ]):
        return "rental"
    return "transaction"


class NewsAPIFetcher:
    """Fetches Dubai RE news from NewsAPI.org"""

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (compatible; ACQAR/1.0)",
        }

    async def _fetch_query(self, client: httpx.AsyncClient, query: str) -> List[Dict]:
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
        if not NEWSAPI_KEY:
            logger.warning("NewsAPI: NEWS_API_KEY not set, skipping")
            return []

        all_articles = []
        async with httpx.AsyncClient(headers=self.headers) as client:
            tasks = [self._fetch_query(client, q) for q in QUERIES]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for r in results:
                if isinstance(r, list):
                    all_articles.extend(r)

        # Deduplicate by URL
        seen = set()
        unique = []
        for a in all_articles:
            if a["url"] not in seen:
                seen.add(a["url"])
                unique.append(a)

        # Sort newest first
        unique.sort(key=lambda x: x["published_at"], reverse=True)

        logger.info(f"NewsAPIFetcher: fetched {len(unique)} unique articles")
        return unique
