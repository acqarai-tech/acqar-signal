# """
# Seed data for ACQAR SIGNAL backend.
# Contains 50 realistic Dubai real estate events across all major areas.
# Includes 15+ S4/S5 events to populate the Reports tab.
# """

# from datetime import datetime, timezone, timedelta
# import time

# _base_time = datetime.now(timezone.utc)

# def _ts_hours_ago(hours: float) -> float:
#     dt = _base_time - timedelta(hours=hours)
#     return dt.timestamp()

# def _iso_hours_ago(hours: float) -> str:
#     dt = _base_time - timedelta(hours=hours)
#     return dt.isoformat()

# def _ev(id, title, summary, category, severity, loc, lat, lng, price=None, dev=None, hours_ago=1.0, confidence=0.85, source="Gulf News"):
#     return {
#         "id": f"seed_{id}",
#         "title": title,
#         "summary": summary,
#         "category": category,
#         "severity": severity,
#         "location_name": loc,
#         "lat": lat,
#         "lng": lng,
#         "price_aed": price,
#         "developer": dev,
#         "signal_count": severity * 4,
#         "confidence": confidence,
#         "source": source,
#         "source_url": "",
#         "is_seed": True,
#         "is_demo": True,
#         "signals": [
#             {"source": source, "url": "https://gulfnews.com/business/property", "snippet": title[:100]},
#         ],
#         "created_at": _iso_hours_ago(hours_ago),
#         "created_at_ts": _ts_hours_ago(hours_ago),
#         "updated_at": _iso_hours_ago(hours_ago),
#         "area_momentum": None,
#     }

# SEED_EVENTS = [
#     # ═══ HIGH SEVERITY S4/S5 — REPORTS TAB ═══
#     _ev("001", "Emaar launches Burj Khalifa-adjacent mega-tower with AED 3.2B GDV",
#         "Emaar Properties has unveiled a landmark AED 3.2 billion tower development adjacent to Burj Khalifa in Downtown Dubai. The 72-storey mixed-use tower offers 850 residences and 120,000 sqft of prime retail.",
#         "offplan", 5, "Downtown Dubai", 25.1972, 55.2744, price=3200000000, dev="Emaar", hours_ago=0.5, source="Arabian Business"),

#     _ev("002", "Record AED 65M penthouse sold on Palm Jumeirah — Dubai's highest-ever residential deal",
#         "A Palm Jumeirah penthouse has transacted at AED 65 million, setting a new Dubai record for residential price per sqft at AED 15,200. The buyer was a European family office.",
#         "transaction", 5, "Palm Jumeirah", 25.1124, 55.1390, price=65000000, hours_ago=1.2, source="The National"),

#     _ev("003", "RERA announces mandatory blockchain title deed registration effective Q3 2025",
#         "Dubai's Real Estate Regulatory Agency (RERA) has issued a directive requiring all property transactions to be registered on Dubai's blockchain-backed title deed system from July 2025. This affects all off-plan and secondary market transactions.",
#         "regulatory", 5, "DIFC", 25.2048, 55.2708, hours_ago=2.0, source="Gulf News"),

#     _ev("004", "DAMAC launches $2B Lagoons mega-project phase 3 — 3,000 units in Business Bay waterfront",
#         "DAMAC Properties has launched Phase 3 of its flagship Lagoons development with a total project value exceeding AED 7.3 billion. Phase 3 adds 3,000 units across six Venetian-themed clusters.",
#         "offplan", 5, "Business Bay", 25.1865, 55.2644, price=7300000000, dev="DAMAC", hours_ago=3.0, source="Zawya"),

#     _ev("005", "Dubai Marina prime apartment prices hit AED 2,100/sqft — 18% YoY increase",
#         "Dubai Marina has recorded an 18% year-on-year price increase with average transacted prices reaching AED 2,100 per sqft. Marina Gate and Cayan Tower show the highest appreciation.",
#         "price_signal", 4, "Dubai Marina", 25.0761, 55.1403, hours_ago=4.5, source="Property Finder Blog"),

#     _ev("006", "Nakheel confirms Palm Jebel Ali Phase 2 with AED 12B investment",
#         "Nakheel has confirmed a AED 12 billion Phase 2 expansion of Palm Jebel Ali featuring 9,000 villas and townhouses. Construction is scheduled to begin Q4 2025 with handovers from 2028.",
#         "offplan", 5, "Jebel Ali", 25.0069, 55.0556, price=12000000000, dev="Nakheel", hours_ago=5.0, source="Arabian Business"),

#     _ev("007", "DLD reports record AED 141.9B transactions in H1 2025 — 22% YoY growth",
#         "Dubai Land Department published its H1 2025 report showing total real estate transactions of AED 141.9 billion across 53,000 deals. Foreign buyers accounted for 62% of total value.",
#         "transaction", 5, "Downtown Dubai", 25.1972, 55.2744, price=141900000000, hours_ago=6.0, source="DLD Official"),

#     _ev("008", "Golden visa threshold unchanged at AED 2M — RERA circular clarifies rules",
#         "RERA has issued a clarification circular (Circular 44/2025) confirming the AED 2 million property investment threshold for UAE golden visa eligibility. Off-plan units with at least 50% payment qualify.",
#         "regulatory", 4, "DIFC", 25.2048, 55.2708, hours_ago=7.5, source="Khaleej Times"),

#     _ev("009", "Emaar reports 42% revenue surge — AED 8.9B in H1 2025 property sales",
#         "Emaar Properties Q2 2025 results show record AED 8.9 billion in property sales revenue, a 42% year-on-year increase. Dubai Hills and Creek Harbour projects drove most of the growth.",
#         "investment", 4, "Dubai Hills", 25.1017, 55.2314, price=8900000000, dev="Emaar", hours_ago=8.0, source="Reuters"),

#     _ev("010", "Foreign buyer surge: 71% of all off-plan buyers are non-UAE nationals",
#         "New CBRE Dubai Market Report reveals foreign buyers account for 71% of all off-plan property purchases in H1 2025. Russians, Indians, and British nationals lead transaction volumes.",
#         "foreign_buyers", 4, "Downtown Dubai", 25.1972, 55.2744, hours_ago=9.0, source="CBRE Research"),

#     _ev("011", "Sobha launches Hartland II towers — 1,200 units, AED 1.8B total value",
#         "Sobha Realty has launched Sobha Hartland II's final residential phase featuring 1,200 apartments across three towers with views of the Ras Al Khor Wildlife Sanctuary.",
#         "offplan", 4, "Mohammed Bin Rashid City", 25.1900, 55.3100, price=1800000000, dev="Sobha", hours_ago=10.0, source="Gulf News"),

#     _ev("012", "Binghatti Apex — world's fastest-selling luxury launch closes in 4 hours",
#         "Binghatti's latest ultra-luxury development Binghatti Apex on Sheikh Zayed Road sold all 180 units in under 4 hours. Starting price was AED 4.8 million for a 1-bedroom with Bugatti collaboration interiors.",
#         "offplan", 4, "Downtown Dubai", 25.1850, 55.2700, price=4800000, dev="Binghatti", hours_ago=11.0, source="The National"),

#     _ev("013", "JVC records highest-ever rental yield in Dubai at 9.1% — Q2 2025",
#         "Jumeirah Village Circle has posted a 9.1% gross rental yield in Q2 2025, the highest in any Dubai district according to Bayut Research. Studio and 1-bed units driving yield compression.",
#         "rental_yield", 4, "JVC", 25.0586, 55.2069, hours_ago=12.0, source="Bayut Blog"),

#     _ev("014", "Creek Harbour mega-sale: 500 units by Emaar absorbed in single-day launch event",
#         "Emaar's Creek Horizon Phase 3 launch event saw 500 apartments sold in a single day. Units ranged from AED 1.2M to AED 4.8M with expected 2027 handover.",
#         "offplan", 4, "Dubai Creek Harbour", 25.2000, 55.3200, price=1200000, dev="Emaar", hours_ago=13.5, source="Arabian Business"),

#     _ev("015", "DIFC property prices break AED 3,500/sqft — new luxury benchmark",
#         "DIFC Gate Village and ICD Brookfield Place residential listings have broken the AED 3,500/sqft barrier for the first time, making DIFC the most expensive Dubai micromarket outside Burj Khalifa.",
#         "price_signal", 4, "DIFC", 25.2048, 55.2708, hours_ago=14.0, source="CBRE"),

#     # ═══ MEDIUM SEVERITY S3 ═══
#     _ev("016", "Dubai Hills Estate Villa sold for AED 12.5M — 4BR Golf View",
#         "A 4-bedroom villa in Dubai Hills Estate with direct golf course views transacted at AED 12.5M. The transaction was brokered by Allsopp & Allsopp with buyer from Saudi Arabia.",
#         "transaction", 3, "Dubai Hills", 25.1017, 55.2314, price=12500000, dev="Emaar", hours_ago=15.0, source="Property Finder"),

#     _ev("017", "Meydan One Mall tower construction reaches 50% completion",
#         "The Meydan One residential tower in Meydan City has reached 50% structural completion. The 75-storey mixed-use development includes Dubai's longest indoor ski slope at 1.2km.",
#         "construction", 3, "Meydan", 25.1718, 55.3092, dev="Meydan", hours_ago=16.0, source="Construction Week"),

#     _ev("018", "Deira Islands waterfront units — AED 850/sqft attract Asia-Pacific investors",
#         "Deira Islands redevelopment is attracting significant Asian investment with units starting at AED 850/sqft. Malaysian and Singaporean family offices have purchased 120+ units in the past quarter.",
#         "foreign_buyers", 3, "Deira", 25.2697, 55.3094, hours_ago=17.0, source="Zawya"),

#     _ev("019", "Motor City mid-market apartments see 14% price jump in 6 months",
#         "Motor City residential units have appreciated 14% over the past 6 months driven by demand from Dubai's growing tech workforce. Automotive-themed community amenities are a key draw.",
#         "price_signal", 3, "Motor City", 25.0367, 55.2158, hours_ago=18.0, source="Bayut Blog"),

#     _ev("020", "Azizi Venice Phase 4 handover begins — 1,800 units delivered in Dubai South",
#         "Azizi Developments has commenced handover of Phase 4 of Azizi Venice in Dubai South. The canal-front development features 1,800 units with Venetian architecture and a 700m water canal.",
#         "construction", 3, "Dubai South", 24.8974, 55.1650, dev="Azizi", hours_ago=19.0, source="Gulf News"),

#     _ev("021", "Jumeirah Beach Residence penthouse sells for AED 18M",
#         "A penthouse in JBR's Rimal tower sold for AED 18 million. The 4-bedroom unit spans 5,200 sqft with panoramic Arabian Gulf views and private pool terrace.",
#         "transaction", 3, "JBR", 25.0796, 55.1331, price=18000000, hours_ago=20.0, source="The National"),

#     _ev("022", "Arabian Ranches III completes 600-villa handover ahead of schedule",
#         "Emaar has completed handover of 600 villas in Arabian Ranches III, two months ahead of the contractual completion date. Residents cite strong community infrastructure as key satisfaction driver.",
#         "construction", 3, "Arabian Ranches", 25.0539, 55.2740, dev="Emaar", hours_ago=21.0, source="Gulf News"),

#     _ev("023", "Danube Properties launches Elitz 3 — 1,000 units with instalment scheme",
#         "Danube Properties has launched Elitz 3 in JVC with 1,000 apartments across two towers. The developer is offering a 1% monthly instalment plan post-handover, targeting first-time buyers.",
#         "offplan", 3, "JVC", 25.0586, 55.2069, dev="Danube", hours_ago=22.5, source="Khaleej Times"),

#     _ev("024", "Bluewaters Island retail occupancy hits 98% — drives residential premium",
#         "Bluewaters Island has achieved 98% retail occupancy with Ain Dubai operator confirming full-year operations. Residential units on the island now command a 35% premium over comparable Marina properties.",
#         "investment", 3, "Bluewaters Island", 25.0800, 55.1200, hours_ago=24.0, source="Arabian Business"),

#     _ev("025", "Sports City townhouses — highest transaction volume quarter in 3 years",
#         "Dubai Sports City recorded its highest quarterly transaction volume since 2022 with 342 deals worth AED 380M. Affordable townhouses and proximity to Al Maktoum Airport are driving demand.",
#         "transaction", 3, "Sports City", 25.0398, 55.2280, hours_ago=26.0, source="Bayut Blog"),

#     _ev("026", "Tilal Al Ghaf resort-style villas sell out second phase within 24 hours",
#         "Majid Al Futtaim's Tilal Al Ghaf development sold all 240 villas in Phase 2 within 24 hours of launch. The resort community features an 18-hectare lagoon as its centrepiece.",
#         "offplan", 3, "Tilal Al Ghaf", 25.0300, 55.2200, hours_ago=28.0, source="Gulf News"),

#     _ev("027", "Business Bay office-to-residential conversions approved — 1,200 units planned",
#         "Dubai Municipality has approved conversion of 8 commercial towers in Business Bay to residential use, adding approximately 1,200 units to the market by 2026.",
#         "regulatory", 3, "Business Bay", 25.1865, 55.2644, hours_ago=30.0, source="Gulf News"),

#     _ev("028", "Al Barsha villas see rental demand spike following new American School campus",
#         "Al Barsha villa rentals have increased 22% following the announcement of American School of Dubai's new campus. 3-bedroom units now command AED 200,000/year.",
#         "rental_yield", 3, "Al Barsha", 25.1122, 55.2011, hours_ago=32.0, source="Khaleej Times"),

#     _ev("029", "City Walk Phase 3 residential launch — Meraas priced from AED 2.8M",
#         "Meraas has launched the residential component of City Walk Phase 3 with apartments starting at AED 2.8M. The development sits above a 250,000 sqft open-air retail district.",
#         "offplan", 3, "City Walk", 25.2018, 55.2511, price=2800000, dev="Meraas", hours_ago=34.0, source="Arabian Business"),

#     _ev("030", "Umm Suqeim villa market — AED 5,000/sqft achieved for beachfront plots",
#         "Beachfront land plots in Umm Suqeim 3 have achieved AED 5,000 per sqft in a government-brokered sale, setting a new benchmark for this established residential neighbourhood.",
#         "transaction", 3, "Umm Suqeim", 25.1500, 55.2100, hours_ago=36.0, source="The National"),

#     # ═══ STANDARD SEVERITY S1/S2 ═══
#     _ev("031", "Mirdif Hills — 2BR apartment rental yield stabilises at 6.8%",
#         "Mirdif Hills residential tower data shows rental yield stabilisation at 6.8% after rapid growth. The community remains popular with families due to proximity to City Centre Mirdif.",
#         "rental_yield", 2, "Mirdif", 25.2149, 55.4150, hours_ago=38.0, source="Bayut"),

#     _ev("032", "Sobha Hartland villas — 5BR units in high demand from South Asian HNIs",
#         "Sobha Realty reports that 5-bedroom villas in Hartland are primarily being purchased by high-net-worth Indian and Pakistani nationals. Average transaction value: AED 7.8M.",
#         "transaction", 2, "Mohammed Bin Rashid City", 25.1900, 55.3100, price=7800000, dev="Sobha", hours_ago=40.0, source="Zawya"),

#     _ev("033", "Ras Al Khor industrial zone permits expanded to allow mixed-use development",
#         "The Ras Al Khor free zone has received regulatory approval to allow mixed-use development, opening the area to residential towers adjacent to the wildlife sanctuary.",
#         "regulatory", 2, "Ras Al Khor", 25.1800, 55.3500, hours_ago=42.0, source="Gulf News"),

#     _ev("034", "Dubai Internet City residences — tech workers drive premium rental demand",
#         "Internet City adjacent towers (Tecom, IMPZ area) are seeing tech worker rental demand. Average rents for 2BR units now AED 120,000-140,000/year, up 12% from Q4 2024.",
#         "rental_yield", 2, "Dubai Internet City", 25.0952, 55.1581, hours_ago=44.0, source="Property Finder"),

#     _ev("035", "The Springs — S&P 500 expat community, low vacancy pushes rents higher",
#         "The Springs community in Dubai has recorded near-zero vacancy rates with rents for 3BR townhouses reaching AED 185,000/year. The established community is popular with Western expats.",
#         "rental_yield", 2, "The Springs", 25.0367, 55.1528, hours_ago=46.0, source="Bayut"),

#     _ev("036", "Al Quoz creative district — 15 new commercial-to-art studio conversions approved",
#         "Dubai Culture & Arts Authority has approved 15 warehouse conversions in Al Quoz Industrial 4 to art galleries and studios, continuing the area's transformation into Dubai's creative hub.",
#         "regulatory", 2, "Al Quoz", 25.1503, 55.2341, hours_ago=48.0, source="Dubai Media Office"),

#     _ev("037", "JVT affordable housing demand rises — sub-AED 600K apartments 3x oversubscribed",
#         "Jumeirah Village Triangle affordable 1-bedroom units priced below AED 600,000 received 3x oversubscription at latest developer launches, reflecting strong end-user demand.",
#         "offplan", 2, "JVT", 25.0450, 55.1950, hours_ago=50.0, source="Khaleej Times"),

#     _ev("038", "Mudon community sports park construction starts — adds amenity value",
#         "Construction has started on a 40,000 sqft sports park in Mudon community. The project by Dubai Properties is expected to add 8-12% premium to adjacent villa prices upon completion.",
#         "construction", 2, "Mudon", 25.0300, 55.2800, dev="Dubai Properties", hours_ago=52.0, source="Gulf News"),

#     _ev("039", "Discovery Gardens metro proximity drives AED 450/sqft average price",
#         "Discovery Gardens continues to offer Dubai's best affordability-connectivity balance at AED 450/sqft. Direct metro access to Ibn Battuta station drives consistent occupancy above 94%.",
#         "price_signal", 2, "Discovery Gardens", 25.0300, 55.1450, hours_ago=54.0, source="Bayut"),

#     _ev("040", "Rashidiya townhouses — heritage area properties appreciated 28% in 2024",
#         "Rashidiya heritage townhouses have appreciated 28% in 2024 as buyers seek authentic Dubai architecture. Limited supply and preservation orders cap new development.",
#         "price_signal", 2, "Rashidiya", 25.2302, 55.3600, hours_ago=56.0, source="The National"),

#     _ev("041", "Studio City — film production hub attracts media company leases",
#         "Dubai Studio City has signed 12 new corporate leases with international media production companies. The concentration of media businesses is driving demand for adjacent residential units.",
#         "investment", 2, "Studio City", 25.0600, 55.2100, hours_ago=58.0, source="Gulf News"),

#     _ev("042", "Deira Gold Souk area — heritage district regeneration plan submitted to DDA",
#         "Dubai Development Authority has received the heritage district regeneration plan for Deira's Gold Souk area. The proposal includes 400 boutique hotel rooms and 200 heritage-preservation residential units.",
#         "regulatory", 2, "Deira", 25.2697, 55.3094, hours_ago=60.0, source="Gulf News"),

#     _ev("043", "Emirates Hills — ultra-luxury villa leases reach AED 1.2M/year",
#         "Emirates Hills villas are now commanding annual lease values up to AED 1.2 million, putting them on par with prime London townhouse rentals. GCC royals are primary tenants.",
#         "rental_yield", 2, "Emirates Hills", 25.0654, 55.1619, hours_ago=62.0, source="Arabian Business"),

#     _ev("044", "La Mer beachfront — Meraas reports 100% occupancy in summer 2025",
#         "La Mer beachfront community has recorded unprecedented 100% occupancy in summer 2025 driven by staycation demand. Short-term rental yields averaging 11% for beachfront units.",
#         "rental_yield", 2, "La Mer", 25.2300, 55.2700, dev="Meraas", hours_ago=64.0, source="Bayut Blog"),

#     _ev("045", "Town Square community Phase 6 starts — 800 townhouses, AED 1.1M starting",
#         "Nshama has commenced Phase 6 of Town Square Dubai with 800 townhouses at prices from AED 1.1 million. The community now houses over 18,000 residents.",
#         "offplan", 2, "Town Square", 24.9900, 55.2500, dev="Nshama", hours_ago=66.0, source="Gulf News"),

#     _ev("046", "Al Sufouh — tech company HQ acquisitions near Dubai Internet City",
#         "Three major technology firms have acquired office floors in Al Sufouh towers adjacent to Dubai Internet City for a combined AED 340M. The transactions reflect confidence in Dubai as a tech hub.",
#         "transaction", 2, "Al Sufouh", 25.1000, 55.1800, price=340000000, hours_ago=68.0, source="Arabian Business"),

#     _ev("047", "Bur Dubai heritage property — traditional courtyard house sells for AED 22M",
#         "A traditional wind-tower courtyard house in Bur Dubai's Heritage Village area transacted for AED 22 million to a UAE heritage investor. One of only 40 remaining traditional houses in the city.",
#         "transaction", 2, "Bur Dubai", 25.2532, 55.2868, price=22000000, hours_ago=70.0, source="The National"),

#     _ev("048", "MAG 330 Wellness City — launches healthcare-residential hybrid in Meydan",
#         "MAG Group has launched MAG 330 Wellness City in Meydan, a 1.2 million sqft mixed-use development integrating residential units with a full-service medical centre and wellness resort.",
#         "offplan", 2, "Meydan", 25.1718, 55.3092, dev="MAG", hours_ago=72.0, source="Zawya"),

#     _ev("049", "DAMAC Hills 2 (Akoya Oxygen) — 2,000-villa community reaches full occupancy",
#         "DAMAC Hills 2, Dubai's largest affordable villa community, has reached full occupancy for the first time since its 2019 launch. Average villa price has tripled from AED 700K to AED 2.1M.",
#         "price_signal", 2, "Damac Hills", 25.0419, 55.2453, price=2100000, dev="DAMAC", hours_ago=74.0, source="Gulf News"),

#     _ev("050", "Ellington Properties — boutique luxury Jumeirah 2 project, AED 3,200/sqft",
#         "Ellington Properties has launched a 120-unit boutique residential development in Jumeirah 2 priced at AED 3,200 per sqft. The project targets European HNW buyers seeking coastal Dubai living.",
#         "offplan", 2, "Jumeirah", 25.2000, 55.2400, price=3200, dev="Ellington", hours_ago=76.0, source="Arabian Business"),
# ]


# def get_seed_events() -> list:
#     """Returns all seed events. Called by PipelineService on startup."""
#     return SEED_EVENTS





















# """
# Seed data for ACQAR SIGNAL backend.
# Contains 50 realistic Dubai real estate events across all major areas.
# Includes 15+ S4/S5 events to populate the Reports tab.
# """

# from datetime import datetime, timezone, timedelta
# import time


# def _ts_hours_ago(hours: float) -> float:
#     dt = _base_time - timedelta(hours=hours)
#     return dt.timestamp()

# def _iso_hours_ago(hours: float) -> str:
#     dt = _base_time - timedelta(hours=hours)
#     return dt.isoformat()

# def _ev(id, title, summary, category, severity, loc, lat, lng, price=None, dev=None, hours_ago=1.0, confidence=0.85, source="Gulf News"):
#     return {
#         "id": f"seed_{id}",
#         "title": title,
#         "summary": summary,
#         "category": category,
#         "severity": severity,
#         "location_name": loc,
#         "lat": lat,
#         "lng": lng,
#         "price_aed": price,
#         "developer": dev,
#         "signal_count": severity * 4,
#         "confidence": confidence,
#         "source": source,
#         "source_url": "",
#         "is_seed": True,
#         "is_demo": True,
#         "signals": [
#             {"source": source, "url": "https://gulfnews.com/business/property", "snippet": title[:100]},
#         ],
#         "created_at": _iso_hours_ago(hours_ago),
#         "created_at_ts": _ts_hours_ago(hours_ago),
#         "updated_at": _iso_hours_ago(hours_ago),
#         "area_momentum": None,
#     }

# SEED_EVENTS = [
#     # ═══ HIGH SEVERITY S4/S5 — REPORTS TAB ═══
#     _ev("001", "Emaar launches Burj Khalifa-adjacent mega-tower with AED 3.2B GDV",
#         "Emaar Properties has unveiled a landmark AED 3.2 billion tower development adjacent to Burj Khalifa in Downtown Dubai. The 72-storey mixed-use tower offers 850 residences and 120,000 sqft of prime retail.",
#         "offplan", 5, "Downtown Dubai", 25.1972, 55.2744, price=3200000000, dev="Emaar", hours_ago=0.5, source="Arabian Business"),

#     _ev("002", "Record AED 65M penthouse sold on Palm Jumeirah — Dubai's highest-ever residential deal",
#         "A Palm Jumeirah penthouse has transacted at AED 65 million, setting a new Dubai record for residential price per sqft at AED 15,200. The buyer was a European family office.",
#         "transaction", 5, "Palm Jumeirah", 25.1124, 55.1390, price=65000000, hours_ago=1.2, source="The National"),

#     _ev("003", "RERA announces mandatory blockchain title deed registration effective Q3 2026",
#         "Dubai's Real Estate Regulatory Agency (RERA) has issued a directive requiring all property transactions to be registered on Dubai's blockchain-backed title deed system from July 2025. This affects all off-plan and secondary market transactions.",
#         "regulatory", 5, "DIFC", 25.2048, 55.2708, hours_ago=2.0, source="Gulf News"),

#     _ev("004", "DAMAC launches $2B Lagoons mega-project phase 3 — 3,000 units in Business Bay waterfront",
#         "DAMAC Properties has launched Phase 3 of its flagship Lagoons development with a total project value exceeding AED 7.3 billion. Phase 3 adds 3,000 units across six Venetian-themed clusters.",
#         "offplan", 5, "Business Bay", 25.1865, 55.2644, price=7300000000, dev="DAMAC", hours_ago=3.0, source="Zawya"),

#     _ev("005", "Dubai Marina prime apartment prices hit AED 2,100/sqft — 18% YoY increase",
#         "Dubai Marina has recorded an 18% year-on-year price increase with average transacted prices reaching AED 2,100 per sqft. Marina Gate and Cayan Tower show the highest appreciation.",
#         "price_signal", 4, "Dubai Marina", 25.0761, 55.1403, hours_ago=4.5, source="Property Finder Blog"),

#     _ev("006", "Nakheel confirms Palm Jebel Ali Phase 2 with AED 12B investment",
#         "Nakheel has confirmed a AED 12 billion Phase 2 expansion of Palm Jebel Ali featuring 9,000 villas and townhouses. Construction is scheduled to begin Q4 2025 with handovers from 2028.",
#         "offplan", 5, "Jebel Ali", 25.0069, 55.0556, price=12000000000, dev="Nakheel", hours_ago=5.0, source="Arabian Business"),

#     _ev("007", "DLD reports record AED 141.9B transactions in H1 2025 — 22% YoY growth",
#         "Dubai Land Department published its H1 2025 report showing total real estate transactions of AED 141.9 billion across 53,000 deals. Foreign buyers accounted for 62% of total value.",
#         "transaction", 5, "Downtown Dubai", 25.1972, 55.2744, price=141900000000, hours_ago=6.0, source="DLD Official"),

#     _ev("008", "Golden visa threshold unchanged at AED 2M — RERA circular clarifies rules",
#         "RERA has issued a clarification circular (Circular 44/2025) confirming the AED 2 million property investment threshold for UAE golden visa eligibility. Off-plan units with at least 50% payment qualify.",
#         "regulatory", 4, "DIFC", 25.2048, 55.2708, hours_ago=7.5, source="Khaleej Times"),

#     _ev("009", "Emaar reports 42% revenue surge — AED 8.9B in H1 2025 property sales",
#         "Emaar Properties Q2 2025 results show record AED 8.9 billion in property sales revenue, a 42% year-on-year increase. Dubai Hills and Creek Harbour projects drove most of the growth.",
#         "investment", 4, "Dubai Hills", 25.1017, 55.2314, price=8900000000, dev="Emaar", hours_ago=8.0, source="Reuters"),

#     _ev("010", "Foreign buyer surge: 71% of all off-plan buyers are non-UAE nationals",
#         "New CBRE Dubai Market Report reveals foreign buyers account for 71% of all off-plan property purchases in H1 2025. Russians, Indians, and British nationals lead transaction volumes.",
#         "foreign_buyers", 4, "Downtown Dubai", 25.1972, 55.2744, hours_ago=9.0, source="CBRE Research"),

#     _ev("011", "Sobha launches Hartland II towers — 1,200 units, AED 1.8B total value",
#         "Sobha Realty has launched Sobha Hartland II's final residential phase featuring 1,200 apartments across three towers with views of the Ras Al Khor Wildlife Sanctuary.",
#         "offplan", 4, "Mohammed Bin Rashid City", 25.1900, 55.3100, price=1800000000, dev="Sobha", hours_ago=10.0, source="Gulf News"),

#     _ev("012", "Binghatti Apex — world's fastest-selling luxury launch closes in 4 hours",
#         "Binghatti's latest ultra-luxury development Binghatti Apex on Sheikh Zayed Road sold all 180 units in under 4 hours. Starting price was AED 4.8 million for a 1-bedroom with Bugatti collaboration interiors.",
#         "offplan", 4, "Downtown Dubai", 25.1850, 55.2700, price=4800000, dev="Binghatti", hours_ago=11.0, source="The National"),

#     _ev("013", "JVC records highest-ever rental yield in Dubai at 9.1% — Q2 2025",
#         "Jumeirah Village Circle has posted a 9.1% gross rental yield in Q2 2025, the highest in any Dubai district according to Bayut Research. Studio and 1-bed units driving yield compression.",
#         "rental_yield", 4, "JVC", 25.0586, 55.2069, hours_ago=12.0, source="Bayut Blog"),

#     _ev("014", "Creek Harbour mega-sale: 500 units by Emaar absorbed in single-day launch event",
#         "Emaar's Creek Horizon Phase 3 launch event saw 500 apartments sold in a single day. Units ranged from AED 1.2M to AED 4.8M with expected 2027 handover.",
#         "offplan", 4, "Dubai Creek Harbour", 25.2000, 55.3200, price=1200000, dev="Emaar", hours_ago=13.5, source="Arabian Business"),

#     _ev("015", "DIFC property prices break AED 3,500/sqft — new luxury benchmark",
#         "DIFC Gate Village and ICD Brookfield Place residential listings have broken the AED 3,500/sqft barrier for the first time, making DIFC the most expensive Dubai micromarket outside Burj Khalifa.",
#         "price_signal", 4, "DIFC", 25.2048, 55.2708, hours_ago=14.0, source="CBRE"),

#     # ═══ MEDIUM SEVERITY S3 ═══
#     _ev("016", "Dubai Hills Estate Villa sold for AED 12.5M — 4BR Golf View",
#         "A 4-bedroom villa in Dubai Hills Estate with direct golf course views transacted at AED 12.5M. The transaction was brokered by Allsopp & Allsopp with buyer from Saudi Arabia.",
#         "transaction", 3, "Dubai Hills", 25.1017, 55.2314, price=12500000, dev="Emaar", hours_ago=15.0, source="Property Finder"),

#     _ev("017", "Meydan One Mall tower construction reaches 50% completion",
#         "The Meydan One residential tower in Meydan City has reached 50% structural completion. The 75-storey mixed-use development includes Dubai's longest indoor ski slope at 1.2km.",
#         "construction", 3, "Meydan", 25.1718, 55.3092, dev="Meydan", hours_ago=16.0, source="Construction Week"),

#     _ev("018", "Deira Islands waterfront units — AED 850/sqft attract Asia-Pacific investors",
#         "Deira Islands redevelopment is attracting significant Asian investment with units starting at AED 850/sqft. Malaysian and Singaporean family offices have purchased 120+ units in the past quarter.",
#         "foreign_buyers", 3, "Deira", 25.2697, 55.3094, hours_ago=17.0, source="Zawya"),

#     _ev("019", "Motor City mid-market apartments see 14% price jump in 6 months",
#         "Motor City residential units have appreciated 14% over the past 6 months driven by demand from Dubai's growing tech workforce. Automotive-themed community amenities are a key draw.",
#         "price_signal", 3, "Motor City", 25.0367, 55.2158, hours_ago=18.0, source="Bayut Blog"),

#     _ev("020", "Azizi Venice Phase 4 handover begins — 1,800 units delivered in Dubai South",
#         "Azizi Developments has commenced handover of Phase 4 of Azizi Venice in Dubai South. The canal-front development features 1,800 units with Venetian architecture and a 700m water canal.",
#         "construction", 3, "Dubai South", 24.8974, 55.1650, dev="Azizi", hours_ago=19.0, source="Gulf News"),

#     _ev("021", "Jumeirah Beach Residence penthouse sells for AED 18M",
#         "A penthouse in JBR's Rimal tower sold for AED 18 million. The 4-bedroom unit spans 5,200 sqft with panoramic Arabian Gulf views and private pool terrace.",
#         "transaction", 3, "JBR", 25.0796, 55.1331, price=18000000, hours_ago=20.0, source="The National"),

#     _ev("022", "Arabian Ranches III completes 600-villa handover ahead of schedule",
#         "Emaar has completed handover of 600 villas in Arabian Ranches III, two months ahead of the contractual completion date. Residents cite strong community infrastructure as key satisfaction driver.",
#         "construction", 3, "Arabian Ranches", 25.0539, 55.2740, dev="Emaar", hours_ago=21.0, source="Gulf News"),

#     _ev("023", "Danube Properties launches Elitz 3 — 1,000 units with instalment scheme",
#         "Danube Properties has launched Elitz 3 in JVC with 1,000 apartments across two towers. The developer is offering a 1% monthly instalment plan post-handover, targeting first-time buyers.",
#         "offplan", 3, "JVC", 25.0586, 55.2069, dev="Danube", hours_ago=22.5, source="Khaleej Times"),

#     _ev("024", "Bluewaters Island retail occupancy hits 98% — drives residential premium",
#         "Bluewaters Island has achieved 98% retail occupancy with Ain Dubai operator confirming full-year operations. Residential units on the island now command a 35% premium over comparable Marina properties.",
#         "investment", 3, "Bluewaters Island", 25.0800, 55.1200, hours_ago=24.0, source="Arabian Business"),

#     _ev("025", "Sports City townhouses — highest transaction volume quarter in 3 years",
#         "Dubai Sports City recorded its highest quarterly transaction volume since 2022 with 342 deals worth AED 380M. Affordable townhouses and proximity to Al Maktoum Airport are driving demand.",
#         "transaction", 3, "Sports City", 25.0398, 55.2280, hours_ago=26.0, source="Bayut Blog"),

#     _ev("026", "Tilal Al Ghaf resort-style villas sell out second phase within 24 hours",
#         "Majid Al Futtaim's Tilal Al Ghaf development sold all 240 villas in Phase 2 within 24 hours of launch. The resort community features an 18-hectare lagoon as its centrepiece.",
#         "offplan", 3, "Tilal Al Ghaf", 25.0300, 55.2200, hours_ago=28.0, source="Gulf News"),

#     _ev("027", "Business Bay office-to-residential conversions approved — 1,200 units planned",
#         "Dubai Municipality has approved conversion of 8 commercial towers in Business Bay to residential use, adding approximately 1,200 units to the market by 2026.",
#         "regulatory", 3, "Business Bay", 25.1865, 55.2644, hours_ago=30.0, source="Gulf News"),

#     _ev("028", "Al Barsha villas see rental demand spike following new American School campus",
#         "Al Barsha villa rentals have increased 22% following the announcement of American School of Dubai's new campus. 3-bedroom units now command AED 200,000/year.",
#         "rental_yield", 3, "Al Barsha", 25.1122, 55.2011, hours_ago=32.0, source="Khaleej Times"),

#     _ev("029", "City Walk Phase 3 residential launch — Meraas priced from AED 2.8M",
#         "Meraas has launched the residential component of City Walk Phase 3 with apartments starting at AED 2.8M. The development sits above a 250,000 sqft open-air retail district.",
#         "offplan", 3, "City Walk", 25.2018, 55.2511, price=2800000, dev="Meraas", hours_ago=34.0, source="Arabian Business"),

#     _ev("030", "Umm Suqeim villa market — AED 5,000/sqft achieved for beachfront plots",
#         "Beachfront land plots in Umm Suqeim 3 have achieved AED 5,000 per sqft in a government-brokered sale, setting a new benchmark for this established residential neighbourhood.",
#         "transaction", 3, "Umm Suqeim", 25.1500, 55.2100, hours_ago=36.0, source="The National"),

#     # ═══ STANDARD SEVERITY S1/S2 ═══
#     _ev("031", "Mirdif Hills — 2BR apartment rental yield stabilises at 6.8%",
#         "Mirdif Hills residential tower data shows rental yield stabilisation at 6.8% after rapid growth. The community remains popular with families due to proximity to City Centre Mirdif.",
#         "rental_yield", 2, "Mirdif", 25.2149, 55.4150, hours_ago=38.0, source="Bayut"),

#     _ev("032", "Sobha Hartland villas — 5BR units in high demand from South Asian HNIs",
#         "Sobha Realty reports that 5-bedroom villas in Hartland are primarily being purchased by high-net-worth Indian and Pakistani nationals. Average transaction value: AED 7.8M.",
#         "transaction", 2, "Mohammed Bin Rashid City", 25.1900, 55.3100, price=7800000, dev="Sobha", hours_ago=40.0, source="Zawya"),

#     _ev("033", "Ras Al Khor industrial zone permits expanded to allow mixed-use development",
#         "The Ras Al Khor free zone has received regulatory approval to allow mixed-use development, opening the area to residential towers adjacent to the wildlife sanctuary.",
#         "regulatory", 2, "Ras Al Khor", 25.1800, 55.3500, hours_ago=42.0, source="Gulf News"),

#     _ev("034", "Dubai Internet City residences — tech workers drive premium rental demand",
#         "Internet City adjacent towers (Tecom, IMPZ area) are seeing tech worker rental demand. Average rents for 2BR units now AED 120,000-140,000/year, up 12% from Q4 2024.",
#         "rental_yield", 2, "Dubai Internet City", 25.0952, 55.1581, hours_ago=44.0, source="Property Finder"),

#     _ev("035", "The Springs — S&P 500 expat community, low vacancy pushes rents higher",
#         "The Springs community in Dubai has recorded near-zero vacancy rates with rents for 3BR townhouses reaching AED 185,000/year. The established community is popular with Western expats.",
#         "rental_yield", 2, "The Springs", 25.0367, 55.1528, hours_ago=46.0, source="Bayut"),

#     _ev("036", "Al Quoz creative district — 15 new commercial-to-art studio conversions approved",
#         "Dubai Culture & Arts Authority has approved 15 warehouse conversions in Al Quoz Industrial 4 to art galleries and studios, continuing the area's transformation into Dubai's creative hub.",
#         "regulatory", 2, "Al Quoz", 25.1503, 55.2341, hours_ago=48.0, source="Dubai Media Office"),

#     _ev("037", "JVT affordable housing demand rises — sub-AED 600K apartments 3x oversubscribed",
#         "Jumeirah Village Triangle affordable 1-bedroom units priced below AED 600,000 received 3x oversubscription at latest developer launches, reflecting strong end-user demand.",
#         "offplan", 2, "JVT", 25.0450, 55.1950, hours_ago=50.0, source="Khaleej Times"),

#     _ev("038", "Mudon community sports park construction starts — adds amenity value",
#         "Construction has started on a 40,000 sqft sports park in Mudon community. The project by Dubai Properties is expected to add 8-12% premium to adjacent villa prices upon completion.",
#         "construction", 2, "Mudon", 25.0300, 55.2800, dev="Dubai Properties", hours_ago=52.0, source="Gulf News"),

#     _ev("039", "Discovery Gardens metro proximity drives AED 450/sqft average price",
#         "Discovery Gardens continues to offer Dubai's best affordability-connectivity balance at AED 450/sqft. Direct metro access to Ibn Battuta station drives consistent occupancy above 94%.",
#         "price_signal", 2, "Discovery Gardens", 25.0300, 55.1450, hours_ago=54.0, source="Bayut"),

#     _ev("040", "Rashidiya townhouses — heritage area properties appreciated 28% in 2024",
#         "Rashidiya heritage townhouses have appreciated 28% in 2024 as buyers seek authentic Dubai architecture. Limited supply and preservation orders cap new development.",
#         "price_signal", 2, "Rashidiya", 25.2302, 55.3600, hours_ago=56.0, source="The National"),

#     _ev("041", "Studio City — film production hub attracts media company leases",
#         "Dubai Studio City has signed 12 new corporate leases with international media production companies. The concentration of media businesses is driving demand for adjacent residential units.",
#         "investment", 2, "Studio City", 25.0600, 55.2100, hours_ago=58.0, source="Gulf News"),

#     _ev("042", "Deira Gold Souk area — heritage district regeneration plan submitted to DDA",
#         "Dubai Development Authority has received the heritage district regeneration plan for Deira's Gold Souk area. The proposal includes 400 boutique hotel rooms and 200 heritage-preservation residential units.",
#         "regulatory", 2, "Deira", 25.2697, 55.3094, hours_ago=60.0, source="Gulf News"),

#     _ev("043", "Emirates Hills — ultra-luxury villa leases reach AED 1.2M/year",
#         "Emirates Hills villas are now commanding annual lease values up to AED 1.2 million, putting them on par with prime London townhouse rentals. GCC royals are primary tenants.",
#         "rental_yield", 2, "Emirates Hills", 25.0654, 55.1619, hours_ago=62.0, source="Arabian Business"),

#     _ev("044", "La Mer beachfront — Meraas reports 100% occupancy in summer 2025",
#         "La Mer beachfront community has recorded unprecedented 100% occupancy in summer 2025 driven by staycation demand. Short-term rental yields averaging 11% for beachfront units.",
#         "rental_yield", 2, "La Mer", 25.2300, 55.2700, dev="Meraas", hours_ago=64.0, source="Bayut Blog"),

#     _ev("045", "Town Square community Phase 6 starts — 800 townhouses, AED 1.1M starting",
#         "Nshama has commenced Phase 6 of Town Square Dubai with 800 townhouses at prices from AED 1.1 million. The community now houses over 18,000 residents.",
#         "offplan", 2, "Town Square", 24.9900, 55.2500, dev="Nshama", hours_ago=66.0, source="Gulf News"),

#     _ev("046", "Al Sufouh — tech company HQ acquisitions near Dubai Internet City",
#         "Three major technology firms have acquired office floors in Al Sufouh towers adjacent to Dubai Internet City for a combined AED 340M. The transactions reflect confidence in Dubai as a tech hub.",
#         "transaction", 2, "Al Sufouh", 25.1000, 55.1800, price=340000000, hours_ago=68.0, source="Arabian Business"),

#     _ev("047", "Bur Dubai heritage property — traditional courtyard house sells for AED 22M",
#         "A traditional wind-tower courtyard house in Bur Dubai's Heritage Village area transacted for AED 22 million to a UAE heritage investor. One of only 40 remaining traditional houses in the city.",
#         "transaction", 2, "Bur Dubai", 25.2532, 55.2868, price=22000000, hours_ago=70.0, source="The National"),

#     _ev("048", "MAG 330 Wellness City — launches healthcare-residential hybrid in Meydan",
#         "MAG Group has launched MAG 330 Wellness City in Meydan, a 1.2 million sqft mixed-use development integrating residential units with a full-service medical centre and wellness resort.",
#         "offplan", 2, "Meydan", 25.1718, 55.3092, dev="MAG", hours_ago=72.0, source="Zawya"),

#     _ev("049", "DAMAC Hills 2 (Akoya Oxygen) — 2,000-villa community reaches full occupancy",
#         "DAMAC Hills 2, Dubai's largest affordable villa community, has reached full occupancy for the first time since its 2019 launch. Average villa price has tripled from AED 700K to AED 2.1M.",
#         "price_signal", 2, "Damac Hills", 25.0419, 55.2453, price=2100000, dev="DAMAC", hours_ago=74.0, source="Gulf News"),

#     _ev("050", "Ellington Properties — boutique luxury Jumeirah 2 project, AED 3,200/sqft",
#         "Ellington Properties has launched a 120-unit boutique residential development in Jumeirah 2 priced at AED 3,200 per sqft. The project targets European HNW buyers seeking coastal Dubai living.",
#         "offplan", 2, "Jumeirah", 25.2000, 55.2400, price=3200, dev="Ellington", hours_ago=76.0, source="Arabian Business"),
# ]


# def get_seed_events() -> list:
#     """Returns all seed events. Called by PipelineService on startup."""
#     return SEED_EVENTS






"""
Seed data for ACQAR SIGNAL backend.
Contains 50 realistic Dubai real estate events across all major areas.
Includes 15+ S4/S5 events to populate the Reports tab.
"""

from datetime import datetime, timezone, timedelta
import time


def _ts_hours_ago(hours: float) -> float:
    return (datetime.now(timezone.utc) - timedelta(hours=hours)).timestamp()


def _iso_hours_ago(hours: float) -> str:
    return (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()


def _ev(id, title, summary, category, severity, loc, lat, lng, price=None, dev=None, hours_ago=1.0, confidence=0.85, source="Gulf News"):
    return {
        "id": f"seed_{id}",
        "title": title,
        "summary": summary,
        "category": category,
        "severity": severity,
        "location_name": loc,
        "lat": lat,
        "lng": lng,
        "price_aed": price,
        "developer": dev,
        "signal_count": severity * 4,
        "confidence": confidence,
        "source": source,
        "source_url": "",
        "is_seed": True,
        "is_demo": True,
        "signals": [
            {"source": source, "url": "https://gulfnews.com/business/property", "snippet": title[:100]},
        ],
        "created_at": _iso_hours_ago(hours_ago),
        "created_at_ts": _ts_hours_ago(hours_ago),
        "updated_at": _iso_hours_ago(hours_ago),
        "area_momentum": None,
    }


def get_seed_events() -> list:
    """Returns all seed events. Called by PipelineService on startup."""
    return [
        _ev("001", "Emaar launches Burj Khalifa-adjacent mega-tower with AED 3.2B GDV",
            "Emaar Properties has unveiled a landmark AED 3.2 billion tower development adjacent to Burj Khalifa in Downtown Dubai. The 72-storey mixed-use tower offers 850 residences and 120,000 sqft of prime retail.",
            "offplan", 5, "Downtown Dubai", 25.1972, 55.2744, price=3200000000, dev="Emaar", hours_ago=0.5, source="Arabian Business"),

        _ev("002", "Record AED 65M penthouse sold on Palm Jumeirah — Dubai highest-ever residential deal",
            "A Palm Jumeirah penthouse has transacted at AED 65 million, setting a new Dubai record for residential price per sqft at AED 15,200. The buyer was a European family office.",
            "transaction", 5, "Palm Jumeirah", 25.1124, 55.1390, price=65000000, hours_ago=1.2, source="The National"),

        _ev("003", "RERA announces mandatory blockchain title deed registration effective Q3 2026",
            "Dubai Real Estate Regulatory Agency (RERA) has issued a directive requiring all property transactions to be registered on Dubai blockchain-backed title deed system from July 2026. This affects all off-plan and secondary market transactions.",
            "regulatory", 5, "DIFC", 25.2048, 55.2708, hours_ago=2.0, source="Gulf News"),

        _ev("004", "DAMAC launches $2B Lagoons mega-project phase 3 — 3,000 units in Business Bay waterfront",
            "DAMAC Properties has launched Phase 3 of its flagship Lagoons development with a total project value exceeding AED 7.3 billion. Phase 3 adds 3,000 units across six Venetian-themed clusters.",
            "offplan", 5, "Business Bay", 25.1865, 55.2644, price=7300000000, dev="DAMAC", hours_ago=3.0, source="Zawya"),

        _ev("005", "Dubai Marina prime apartment prices hit AED 2,100/sqft — 18% YoY increase",
            "Dubai Marina has recorded an 18% year-on-year price increase with average transacted prices reaching AED 2,100 per sqft. Marina Gate and Cayan Tower show the highest appreciation.",
            "price_signal", 4, "Dubai Marina", 25.0761, 55.1403, hours_ago=4.5, source="Property Finder Blog"),

        _ev("006", "Nakheel confirms Palm Jebel Ali Phase 2 with AED 12B investment",
            "Nakheel has confirmed a AED 12 billion Phase 2 expansion of Palm Jebel Ali featuring 9,000 villas and townhouses. Construction is scheduled to begin Q4 2026 with handovers from 2028.",
            "offplan", 5, "Jebel Ali", 25.0069, 55.0556, price=12000000000, dev="Nakheel", hours_ago=5.0, source="Arabian Business"),

        _ev("007", "DLD reports record AED 141.9B transactions in H1 2026 — 22% YoY growth",
            "Dubai Land Department published its H1 2026 report showing total real estate transactions of AED 141.9 billion across 53,000 deals. Foreign buyers accounted for 62% of total value.",
            "transaction", 5, "Downtown Dubai", 25.1972, 55.2744, price=141900000000, hours_ago=6.0, source="DLD Official"),

        _ev("008", "Golden visa threshold unchanged at AED 2M — RERA circular clarifies rules",
            "RERA has issued a clarification circular (Circular 44/2026) confirming the AED 2 million property investment threshold for UAE golden visa eligibility. Off-plan units with at least 50% payment qualify.",
            "regulatory", 4, "DIFC", 25.2048, 55.2708, hours_ago=7.5, source="Khaleej Times"),

        _ev("009", "Emaar reports 42% revenue surge — AED 8.9B in H1 2026 property sales",
            "Emaar Properties Q2 2026 results show record AED 8.9 billion in property sales revenue, a 42% year-on-year increase. Dubai Hills and Creek Harbour projects drove most of the growth.",
            "investment", 4, "Dubai Hills", 25.1017, 55.2314, price=8900000000, dev="Emaar", hours_ago=8.0, source="Reuters"),

        _ev("010", "Foreign buyer surge: 71% of all off-plan buyers are non-UAE nationals",
            "New CBRE Dubai Market Report reveals foreign buyers account for 71% of all off-plan property purchases in H1 2026. Russians, Indians, and British nationals lead transaction volumes.",
            "foreign_buyers", 4, "Downtown Dubai", 25.1972, 55.2744, hours_ago=9.0, source="CBRE Research"),

        _ev("011", "Sobha launches Hartland II towers — 1,200 units, AED 1.8B total value",
            "Sobha Realty has launched Sobha Hartland II final residential phase featuring 1,200 apartments across three towers with views of the Ras Al Khor Wildlife Sanctuary.",
            "offplan", 4, "Mohammed Bin Rashid City", 25.1900, 55.3100, price=1800000000, dev="Sobha", hours_ago=10.0, source="Gulf News"),

        _ev("012", "Binghatti Apex — world fastest-selling luxury launch closes in 4 hours",
            "Binghatti latest ultra-luxury development Binghatti Apex on Sheikh Zayed Road sold all 180 units in under 4 hours. Starting price was AED 4.8 million for a 1-bedroom with Bugatti collaboration interiors.",
            "offplan", 4, "Downtown Dubai", 25.1850, 55.2700, price=4800000, dev="Binghatti", hours_ago=11.0, source="The National"),

        _ev("013", "JVC records highest-ever rental yield in Dubai at 9.1% — Q2 2026",
            "Jumeirah Village Circle has posted a 9.1% gross rental yield in Q2 2026, the highest in any Dubai district according to Bayut Research. Studio and 1-bed units driving yield compression.",
            "rental_yield", 4, "JVC", 25.0586, 55.2069, hours_ago=12.0, source="Bayut Blog"),

        _ev("014", "Creek Harbour mega-sale: 500 units by Emaar absorbed in single-day launch event",
            "Emaar Creek Horizon Phase 3 launch event saw 500 apartments sold in a single day. Units ranged from AED 1.2M to AED 4.8M with expected 2028 handover.",
            "offplan", 4, "Dubai Creek Harbour", 25.2000, 55.3200, price=1200000, dev="Emaar", hours_ago=13.5, source="Arabian Business"),

        _ev("015", "DIFC property prices break AED 3,500/sqft — new luxury benchmark",
            "DIFC Gate Village and ICD Brookfield Place residential listings have broken the AED 3,500/sqft barrier for the first time, making DIFC the most expensive Dubai micromarket outside Burj Khalifa.",
            "price_signal", 4, "DIFC", 25.2048, 55.2708, hours_ago=14.0, source="CBRE"),

        _ev("016", "Dubai Hills Estate Villa sold for AED 12.5M — 4BR Golf View",
            "A 4-bedroom villa in Dubai Hills Estate with direct golf course views transacted at AED 12.5M. The transaction was brokered by Allsopp and Allsopp with buyer from Saudi Arabia.",
            "transaction", 3, "Dubai Hills", 25.1017, 55.2314, price=12500000, dev="Emaar", hours_ago=15.0, source="Property Finder"),

        _ev("017", "Meydan One Mall tower construction reaches 50% completion",
            "The Meydan One residential tower in Meydan City has reached 50% structural completion. The 75-storey mixed-use development includes Dubai longest indoor ski slope at 1.2km.",
            "construction", 3, "Meydan", 25.1718, 55.3092, dev="Meydan", hours_ago=16.0, source="Construction Week"),

        _ev("018", "Deira Islands waterfront units — AED 850/sqft attract Asia-Pacific investors",
            "Deira Islands redevelopment is attracting significant Asian investment with units starting at AED 850/sqft. Malaysian and Singaporean family offices have purchased 120+ units in the past quarter.",
            "foreign_buyers", 3, "Deira", 25.2697, 55.3094, hours_ago=17.0, source="Zawya"),

        _ev("019", "Motor City mid-market apartments see 14% price jump in 6 months",
            "Motor City residential units have appreciated 14% over the past 6 months driven by demand from Dubai growing tech workforce. Automotive-themed community amenities are a key draw.",
            "price_signal", 3, "Motor City", 25.0367, 55.2158, hours_ago=18.0, source="Bayut Blog"),

        _ev("020", "Azizi Venice Phase 4 handover begins — 1,800 units delivered in Dubai South",
            "Azizi Developments has commenced handover of Phase 4 of Azizi Venice in Dubai South. The canal-front development features 1,800 units with Venetian architecture and a 700m water canal.",
            "construction", 3, "Dubai South", 24.8974, 55.1650, dev="Azizi", hours_ago=19.0, source="Gulf News"),

        _ev("021", "Jumeirah Beach Residence penthouse sells for AED 18M",
            "A penthouse in JBR Rimal tower sold for AED 18 million. The 4-bedroom unit spans 5,200 sqft with panoramic Arabian Gulf views and private pool terrace.",
            "transaction", 3, "JBR", 25.0796, 55.1331, price=18000000, hours_ago=20.0, source="The National"),

        _ev("022", "Arabian Ranches III completes 600-villa handover ahead of schedule",
            "Emaar has completed handover of 600 villas in Arabian Ranches III, two months ahead of the contractual completion date. Residents cite strong community infrastructure as key satisfaction driver.",
            "construction", 3, "Arabian Ranches", 25.0539, 55.2740, dev="Emaar", hours_ago=21.0, source="Gulf News"),

        _ev("023", "Danube Properties launches Elitz 3 — 1,000 units with instalment scheme",
            "Danube Properties has launched Elitz 3 in JVC with 1,000 apartments across two towers. The developer is offering a 1% monthly instalment plan post-handover, targeting first-time buyers.",
            "offplan", 3, "JVC", 25.0586, 55.2069, dev="Danube", hours_ago=22.5, source="Khaleej Times"),

        _ev("024", "Bluewaters Island retail occupancy hits 98% — drives residential premium",
            "Bluewaters Island has achieved 98% retail occupancy with Ain Dubai operator confirming full-year operations. Residential units on the island now command a 35% premium over comparable Marina properties.",
            "investment", 3, "Bluewaters Island", 25.0800, 55.1200, hours_ago=24.0, source="Arabian Business"),

        _ev("025", "Sports City townhouses — highest transaction volume quarter in 3 years",
            "Dubai Sports City recorded its highest quarterly transaction volume in three years with 342 deals worth AED 380M. Affordable townhouses and proximity to Al Maktoum Airport are driving demand.",
            "transaction", 3, "Sports City", 25.0398, 55.2280, hours_ago=26.0, source="Bayut Blog"),

        _ev("026", "Tilal Al Ghaf resort-style villas sell out second phase within 24 hours",
            "Majid Al Futtaim Tilal Al Ghaf development sold all 240 villas in Phase 2 within 24 hours of launch. The resort community features an 18-hectare lagoon as its centrepiece.",
            "offplan", 3, "Tilal Al Ghaf", 25.0300, 55.2200, hours_ago=28.0, source="Gulf News"),

        _ev("027", "Business Bay office-to-residential conversions approved — 1,200 units planned",
            "Dubai Municipality has approved conversion of 8 commercial towers in Business Bay to residential use, adding approximately 1,200 units to the market by 2027.",
            "regulatory", 3, "Business Bay", 25.1865, 55.2644, hours_ago=30.0, source="Gulf News"),

        _ev("028", "Al Barsha villas see rental demand spike following new American School campus",
            "Al Barsha villa rentals have increased 22% following the announcement of American School of Dubai new campus. 3-bedroom units now command AED 200,000/year.",
            "rental_yield", 3, "Al Barsha", 25.1122, 55.2011, hours_ago=32.0, source="Khaleej Times"),

        _ev("029", "City Walk Phase 3 residential launch — Meraas priced from AED 2.8M",
            "Meraas has launched the residential component of City Walk Phase 3 with apartments starting at AED 2.8M. The development sits above a 250,000 sqft open-air retail district.",
            "offplan", 3, "City Walk", 25.2018, 55.2511, price=2800000, dev="Meraas", hours_ago=34.0, source="Arabian Business"),

        _ev("030", "Umm Suqeim villa market — AED 5,000/sqft achieved for beachfront plots",
            "Beachfront land plots in Umm Suqeim 3 have achieved AED 5,000 per sqft in a government-brokered sale, setting a new benchmark for this established residential neighbourhood.",
            "transaction", 3, "Umm Suqeim", 25.1500, 55.2100, hours_ago=36.0, source="The National"),

        _ev("031", "Mirdif Hills — 2BR apartment rental yield stabilises at 6.8%",
            "Mirdif Hills residential tower data shows rental yield stabilisation at 6.8% after rapid growth. The community remains popular with families due to proximity to City Centre Mirdif.",
            "rental_yield", 2, "Mirdif", 25.2149, 55.4150, hours_ago=38.0, source="Bayut"),

        _ev("032", "Sobha Hartland villas — 5BR units in high demand from South Asian HNIs",
            "Sobha Realty reports that 5-bedroom villas in Hartland are primarily being purchased by high-net-worth Indian and Pakistani nationals. Average transaction value: AED 7.8M.",
            "transaction", 2, "Mohammed Bin Rashid City", 25.1900, 55.3100, price=7800000, dev="Sobha", hours_ago=40.0, source="Zawya"),

        _ev("033", "Ras Al Khor industrial zone permits expanded to allow mixed-use development",
            "The Ras Al Khor free zone has received regulatory approval to allow mixed-use development, opening the area to residential towers adjacent to the wildlife sanctuary.",
            "regulatory", 2, "Ras Al Khor", 25.1800, 55.3500, hours_ago=42.0, source="Gulf News"),

        _ev("034", "Dubai Internet City residences — tech workers drive premium rental demand",
            "Internet City adjacent towers (Tecom, IMPZ area) are seeing tech worker rental demand. Average rents for 2BR units now AED 120,000-140,000/year, up 12% from last quarter.",
            "rental_yield", 2, "Dubai Internet City", 25.0952, 55.1581, hours_ago=44.0, source="Property Finder"),

        _ev("035", "The Springs — expat community low vacancy pushes rents higher",
            "The Springs community in Dubai has recorded near-zero vacancy rates with rents for 3BR townhouses reaching AED 185,000/year. The established community is popular with Western expats.",
            "rental_yield", 2, "The Springs", 25.0367, 55.1528, hours_ago=46.0, source="Bayut"),

        _ev("036", "Al Quoz creative district — 15 new commercial-to-art studio conversions approved",
            "Dubai Culture and Arts Authority has approved 15 warehouse conversions in Al Quoz Industrial 4 to art galleries and studios, continuing the area transformation into Dubai creative hub.",
            "regulatory", 2, "Al Quoz", 25.1503, 55.2341, hours_ago=48.0, source="Dubai Media Office"),

        _ev("037", "JVT affordable housing demand rises — sub-AED 600K apartments 3x oversubscribed",
            "Jumeirah Village Triangle affordable 1-bedroom units priced below AED 600,000 received 3x oversubscription at latest developer launches, reflecting strong end-user demand.",
            "offplan", 2, "JVT", 25.0450, 55.1950, hours_ago=50.0, source="Khaleej Times"),

        _ev("038", "Mudon community sports park construction starts — adds amenity value",
            "Construction has started on a 40,000 sqft sports park in Mudon community. The project by Dubai Properties is expected to add 8-12% premium to adjacent villa prices upon completion.",
            "construction", 2, "Mudon", 25.0300, 55.2800, dev="Dubai Properties", hours_ago=52.0, source="Gulf News"),

        _ev("039", "Discovery Gardens metro proximity drives AED 450/sqft average price",
            "Discovery Gardens continues to offer Dubai best affordability-connectivity balance at AED 450/sqft. Direct metro access to Ibn Battuta station drives consistent occupancy above 94%.",
            "price_signal", 2, "Discovery Gardens", 25.0300, 55.1450, hours_ago=54.0, source="Bayut"),

        _ev("040", "Rashidiya townhouses — heritage area properties appreciated 28% over the past year",
            "Rashidiya heritage townhouses have appreciated 28% over the past year as buyers seek authentic Dubai architecture. Limited supply and preservation orders cap new development.",
            "price_signal", 2, "Rashidiya", 25.2302, 55.3600, hours_ago=56.0, source="The National"),

        _ev("041", "Studio City — film production hub attracts media company leases",
            "Dubai Studio City has signed 12 new corporate leases with international media production companies. The concentration of media businesses is driving demand for adjacent residential units.",
            "investment", 2, "Studio City", 25.0600, 55.2100, hours_ago=58.0, source="Gulf News"),

        _ev("042", "Deira Gold Souk area — heritage district regeneration plan submitted to DDA",
            "Dubai Development Authority has received the heritage district regeneration plan for Deira Gold Souk area. The proposal includes 400 boutique hotel rooms and 200 heritage-preservation residential units.",
            "regulatory", 2, "Deira", 25.2697, 55.3094, hours_ago=60.0, source="Gulf News"),

        _ev("043", "Emirates Hills — ultra-luxury villa leases reach AED 1.2M/year",
            "Emirates Hills villas are now commanding annual lease values up to AED 1.2 million, putting them on par with prime London townhouse rentals. GCC royals are primary tenants.",
            "rental_yield", 2, "Emirates Hills", 25.0654, 55.1619, hours_ago=62.0, source="Arabian Business"),

        _ev("044", "La Mer beachfront — Meraas reports 100% occupancy in summer 2026",
            "La Mer beachfront community has recorded unprecedented 100% occupancy in summer 2026 driven by staycation demand. Short-term rental yields averaging 11% for beachfront units.",
            "rental_yield", 2, "La Mer", 25.2300, 55.2700, dev="Meraas", hours_ago=64.0, source="Bayut Blog"),

        _ev("045", "Town Square community Phase 6 starts — 800 townhouses, AED 1.1M starting",
            "Nshama has commenced Phase 6 of Town Square Dubai with 800 townhouses at prices from AED 1.1 million. The community now houses over 18,000 residents.",
            "offplan", 2, "Town Square", 24.9900, 55.2500, dev="Nshama", hours_ago=66.0, source="Gulf News"),

        _ev("046", "Al Sufouh — tech company HQ acquisitions near Dubai Internet City",
            "Three major technology firms have acquired office floors in Al Sufouh towers adjacent to Dubai Internet City for a combined AED 340M. The transactions reflect confidence in Dubai as a tech hub.",
            "transaction", 2, "Al Sufouh", 25.1000, 55.1800, price=340000000, hours_ago=68.0, source="Arabian Business"),

        _ev("047", "Bur Dubai heritage property — traditional courtyard house sells for AED 22M",
            "A traditional wind-tower courtyard house in Bur Dubai Heritage Village area transacted for AED 22 million to a UAE heritage investor. One of only 40 remaining traditional houses in the city.",
            "transaction", 2, "Bur Dubai", 25.2532, 55.2868, price=22000000, hours_ago=70.0, source="The National"),

        _ev("048", "MAG 330 Wellness City — launches healthcare-residential hybrid in Meydan",
            "MAG Group has launched MAG 330 Wellness City in Meydan, a 1.2 million sqft mixed-use development integrating residential units with a full-service medical centre and wellness resort.",
            "offplan", 2, "Meydan", 25.1718, 55.3092, dev="MAG", hours_ago=72.0, source="Zawya"),

        _ev("049", "DAMAC Hills 2 (Akoya Oxygen) — 2,000-villa community reaches full occupancy",
            "DAMAC Hills 2, Dubai largest affordable villa community, has reached full occupancy for the first time since its 2019 launch. Average villa price has tripled from AED 700K to AED 2.1M.",
            "price_signal", 2, "Damac Hills", 25.0419, 55.2453, price=2100000, dev="DAMAC", hours_ago=74.0, source="Gulf News"),

        _ev("050", "Ellington Properties — boutique luxury Jumeirah 2 project, AED 3,200/sqft",
            "Ellington Properties has launched a 120-unit boutique residential development in Jumeirah 2 priced at AED 3,200 per sqft. The project targets European HNW buyers seeking coastal Dubai living.",
            "offplan", 2, "Jumeirah", 25.2000, 55.2400, price=3200, dev="Ellington", hours_ago=76.0, source="Arabian Business"),
    ]























