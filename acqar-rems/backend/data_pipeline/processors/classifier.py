import re
from typing import Dict, Tuple, List
from datetime import datetime, timezone

# Keyword-based NLP classifier for real estate events
# No external ML models needed — pure regex + keyword matching

CATEGORY_KEYWORDS = {
    "transaction": [
        "sold", "sale", "transaction", "deal", "purchase", "bought", "AED", "million",
        "billion", "record price", "highest price", "luxury home", "villa sold",
        "apartment sold", "handover", "title deed", "DLD"
    ],
    "offplan": [
        "off-plan", "off plan", "launch", "launched", "new project", "pre-launch",
        "under construction", "completion", "phase", "tower launch", "development launch",
        "new development", "upcoming", "unveil", "announce"
    ],
    "construction": [
        "construction", "built", "building", "structure", "foundation", "concrete",
        "complete", "completion date", "handover", "topping out", "infrastructure",
        "contractor", "JLL", "CBRE"
    ],
    "regulatory": [
        "regulation", "law", "decree", "RERA", "DLD", "government", "ministry",
        "policy", "visa", "golden visa", "residency", "tax", "fee", "registration",
        "circular", "amendment", "new rule"
    ],
    "infrastructure": [
        "metro", "road", "highway", "bridge", "airport", "port", "utility",
        "water", "electricity", "DEWA", "RTA", "transport", "connectivity",
        "infrastructure project", "expansion"
    ],
    "investment": [
        "investment", "ROI", "yield", "return", "fund", "REIT", "IPO", "investor",
        "foreign investment", "FDI", "market", "price index", "valuation",
        "report", "forecast", "outlook", "trend"
    ]
}

DEVELOPER_NAMES = [
    "Emaar", "DAMAC", "Nakheel", "Meraas", "Sobha", "Aldar", "Azizi",
    "Select Group", "Ellington", "MAG", "Deyaar", "Union Properties",
    "Wasl", "Dubai Holding", "Omniyat", "DIFC",
    "Binghatti", "Danube", "Reportage", "Tiger Properties",
    "Imtiaz", "Object 1", "Samana", "Vincitore",
    "Bloom", "RAK Properties", "Sharjah Asset Management",
    "Arada", "Eagle Hills", "Dubai Properties",
    "Ginco Properties", "Oro24", "Peace Homes",
]

LOCATION_KEYWORDS = {
    # Prime/Iconic Areas
    "Downtown Dubai": (25.1972, 55.2744),
    "Burj Khalifa": (25.1972, 55.2744),
    "Dubai Mall": (25.1972, 55.2744),
    "Dubai Marina": (25.0761, 55.1403),
    "Palm Jumeirah": (25.1124, 55.1390),
    "Palm": (25.1124, 55.1390),
    "DIFC": (25.2048, 55.2708),
    "Emirates Hills": (25.0654, 55.1619),
    "Jumeirah Bay Island": (25.2000, 55.2600),
    # Business/Commercial
    "Business Bay": (25.1865, 55.2644),
    "Dubai Internet City": (25.0952, 55.1581),
    "Dubai Media City": (25.1001, 55.1568),
    "Tecom": (25.1001, 55.1568),
    "DAFZA": (25.2624, 55.3547),
    "Jebel Ali": (25.0069, 55.0556),
    "Dubai South": (24.8974, 55.1650),
    "Dubai World Central": (24.8974, 55.1650),
    # North Dubai
    "Deira": (25.2697, 55.3094),
    "Al Rigga": (25.2697, 55.3094),
    "Bur Dubai": (25.2532, 55.2868),
    "Karama": (25.2532, 55.2868),
    "Oud Metha": (25.2300, 55.3100),
    "Al Quoz": (25.1503, 55.2341),
    "Al Barsha": (25.1122, 55.2011),
    "Al Barsha South": (25.0900, 55.2100),
    "Rashidiya": (25.2302, 55.3600),
    "Mirdif": (25.2149, 55.4150),
    "Muhaisnah": (25.2500, 55.3400),
    # Creek / East
    "Dubai Creek Harbour": (25.2000, 55.3200),
    "Creek Harbour": (25.2000, 55.3200),
    "Dubai Creek": (25.2200, 55.3200),
    "Ras Al Khor": (25.1800, 55.3500),
    "Meydan": (25.1718, 55.3092),
    "Meydan City": (25.1718, 55.3092),
    "Mohammed Bin Rashid City": (25.1900, 55.3100),
    "MBR City": (25.1900, 55.3100),
    "Sobha Hartland": (25.1900, 55.3100),
    # South/Communities
    "Dubai Hills": (25.1017, 55.2314),
    "Dubai Hills Estate": (25.1017, 55.2314),
    "Arabian Ranches": (25.0539, 55.2740),
    "Arabian Ranches 2": (25.0539, 55.2700),
    "Arabian Ranches 3": (25.0500, 55.2700),
    "Damac Hills": (25.0419, 55.2453),
    "Tilal Al Ghaf": (25.0300, 55.2200),
    "Town Square": (24.9900, 55.2500),
    "Reem": (25.0400, 55.2600),
    "Mudon": (25.0300, 55.2800),
    "Motor City": (25.0367, 55.2158),
    "Sports City": (25.0398, 55.2280),
    "Studio City": (25.0600, 55.2100),
    # West
    "JVC": (25.0586, 55.2069),
    "Jumeirah Village Circle": (25.0586, 55.2069),
    "JVT": (25.0450, 55.1950),
    "Jumeirah Village Triangle": (25.0450, 55.1950),
    "Discovery Gardens": (25.0300, 55.1450),
    "The Springs": (25.0367, 55.1528),
    "The Lakes": (25.0500, 55.1600),
    "The Meadows": (25.0600, 55.1700),
    "The Villa": (25.0700, 55.2800),
    "IMPZ": (25.0200, 55.2200),
    "International Media Production Zone": (25.0200, 55.2200),
    # Beach/Coast
    "Jumeirah": (25.2048, 55.2419),
    "Jumeirah 1": (25.2100, 55.2500),
    "Jumeirah 2": (25.2000, 55.2400),
    "Jumeirah 3": (25.1900, 55.2300),
    "Umm Suqeim": (25.1500, 55.2100),
    "Al Sufouh": (25.1000, 55.1800),
    "Dubai Frame": (25.2337, 55.3003),
    "City Walk": (25.2018, 55.2511),
    "La Mer": (25.2300, 55.2700),
    "Bluewaters Island": (25.0800, 55.1200),
    "JBR": (25.0796, 55.1331),
    "Jumeirah Beach Residence": (25.0796, 55.1331),
}


class EventClassifier:
    def classify(self, article: Dict) -> Dict:
        """
        Takes a raw article dict and returns an enriched event dict with:
        - category: transaction/offplan/construction/regulatory/infrastructure/investment
        - severity: 1-5 based on signal strength, price mentions, etc.
        - location_name: best matching Dubai area
        - lat, lng: coordinates from LOCATION_KEYWORDS or default Dubai center
        - developer: developer name if mentioned
        - price_aed: extracted AED price if mentioned
        - confidence: 0.0-1.0
        - signal_count: estimated based on source weight
        """
        text = (article.get('title', '') + ' ' + article.get('summary', '')).lower()
        original_text = article.get('title', '') + ' ' + article.get('summary', '')

        # 1. Classify category
        category = self._classify_category(text)

        # 2. Detect location
        location_name, lat, lng = self._detect_location(original_text)

        # 3. Detect developer
        developer = self._detect_developer(original_text)

        # 4. Extract price
        price_aed = self._extract_price(original_text)

        # 5. Calculate severity
        severity = self._calculate_severity(text, price_aed, category, article.get('source_weight', 0.7))

        # 6. Calculate confidence
        confidence = self._calculate_confidence(text, category, location_name)

        # 7. Estimate signal count
        signal_count = int(severity * 12 * article.get('source_weight', 0.7) + 3)

        return {
            **article,
            'category': category,
            'severity': severity,
            'location_name': location_name,
            'lat': lat,
            'lng': lng,
            'developer': developer,
            'price_aed': price_aed,
            'confidence': round(confidence, 2),
            'signal_count': signal_count,
            'is_active': True,
            'source_types': ['news'],
            'classified_at': datetime.now(timezone.utc).isoformat()
        }

    def _classify_category(self, text: str) -> str:
        """Score each category by keyword matches, return highest scorer"""
        scores = {}
        for category, keywords in CATEGORY_KEYWORDS.items():
            score = sum(1 for kw in keywords if kw.lower() in text)
            scores[category] = score
        best = max(scores, key=scores.get)
        return best if scores[best] > 0 else 'investment'

    def _detect_location(self, text: str) -> Tuple[str, float, float]:
        """Find Dubai area mentioned in text, return name + coordinates with jitter"""
        import random
        text_lower = text.lower()

        # 1. Exact match (longest first to prefer specific areas)
        for location in sorted(LOCATION_KEYWORDS.keys(), key=len, reverse=True):
            if location.lower() in text_lower:
                coords = LOCATION_KEYWORDS[location]
                # Add tiny jitter so events don't all stack exactly on the same dot
                jitter = lambda: random.uniform(-0.008, 0.008)
                return location, coords[0] + jitter(), coords[1] + jitter()

        # 2. No location found - distribute across Dubai instead of stacking at center
        # Use a weighted random selection from major areas
        fallback_areas = [
            ("Downtown Dubai", 25.1972, 55.2744),
            ("Dubai Marina", 25.0761, 55.1403),
            ("Business Bay", 25.1865, 55.2644),
            ("Palm Jumeirah", 25.1124, 55.1390),
            ("JVC", 25.0586, 55.2069),
            ("Dubai Hills", 25.1017, 55.2314),
            ("Deira", 25.2697, 55.3094),
            ("DIFC", 25.2048, 55.2708),
            ("Jumeirah", 25.2048, 55.2419),
            ("Meydan", 25.1718, 55.3092),
        ]
        # Use hash of text to deterministically assign location (not random each time)
        idx = hash(text[:50]) % len(fallback_areas)
        area = fallback_areas[idx]
        jitter = lambda: random.uniform(-0.012, 0.012)
        return area[0], area[1] + jitter(), area[2] + jitter()

    def _detect_developer(self, text: str) -> str:
        """Find developer name in text"""
        for dev in DEVELOPER_NAMES:
            if dev.lower() in text.lower():
                return dev
        return None

    def _extract_price(self, text: str) -> float:
        """Extract AED price from text"""
        # Match patterns like "AED 2.5 million", "AED 500,000", "Dh 1.2bn"
        patterns = [
            r'AED\s*([\d,\.]+)\s*(?:billion|bn)',
            r'AED\s*([\d,\.]+)\s*(?:million|m)',
            r'AED\s*([\d,\.]+)',
            r'Dh\s*([\d,\.]+)\s*(?:billion|bn)',
            r'Dh\s*([\d,\.]+)\s*(?:million|m)',
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                num_str = match.group(1).replace(',', '')
                try:
                    num = float(num_str)
                    if 'billion' in pattern or 'bn' in pattern:
                        return num * 1_000_000_000
                    elif 'million' in pattern or '\sm' in pattern:
                        return num * 1_000_000
                    return num
                except:
                    pass
        return None

    def _calculate_severity(self, text: str, price_aed: float, category: str, source_weight: float) -> int:
        """Calculate severity 1-5"""
        score = 1

        # Price-based severity
        if price_aed:
            if price_aed >= 1_000_000_000:
                score = max(score, 5)
            elif price_aed >= 100_000_000:
                score = max(score, 4)
            elif price_aed >= 10_000_000:
                score = max(score, 3)
            elif price_aed >= 1_000_000:
                score = max(score, 2)

        # Keyword-based severity boosters
        high_impact = ['record', 'billion', 'largest', 'mega', 'landmark', 'historic', 'unprecedented']
        medium_impact = ['million', 'major', 'significant', 'announce', 'launch', 'award']

        for word in high_impact:
            if word in text:
                score = min(5, score + 1)

        for word in medium_impact:
            if word in text and score < 3:
                score = min(5, score + 1)

        # Category-based floor
        if category == 'regulatory':
            score = max(score, 2)
        if category == 'transaction' and price_aed and price_aed > 5_000_000:
            score = max(score, 3)

        # Apply source weight
        if source_weight < 1:
            final_score = int(score * source_weight + 0.5)
        else:
            final_score = score

        return min(5, max(1, final_score))

    def _calculate_confidence(self, text: str, category: str, location_name: str) -> float:
        """Calculate confidence 0.0-1.0"""
        confidence = 0.5

        if location_name != "Dubai":
            confidence += 0.2  # specific location found

        keywords = CATEGORY_KEYWORDS.get(category, [])
        matches = sum(1 for kw in keywords if kw.lower() in text)
        confidence += min(0.3, matches * 0.05)

        return min(1.0, confidence)

    def classify_batch(self, articles: List[Dict]) -> List[Dict]:
        """Classify a list of articles"""
        return [self.classify(a) for a in articles]
