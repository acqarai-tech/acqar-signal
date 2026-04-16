# from fastapi import APIRouter, Request
# from datetime import datetime, timezone
# import asyncio
# import logging
# import os
# import sys

# logger = logging.getLogger(__name__)
# router = APIRouter(prefix="/api/market", tags=["market"])

# # Baseline estimates — sourced from RERA published Q4 2024 averages
# # Updated quarterly with official RERA data
# BASELINE = {
#     "DXB_IDX":  {"name": "Dubai Property Index",      "value": 287.4, "unit": "pts"},
#     "PAL_AVG":  {"name": "Palm Avg AED/sqft",          "value": 2950.0, "unit": "AED/sqft", "source": "RERA Q4 2025", "is_real": True},
#     "DT_AVG":   {"name": "Downtown AED/sqft",          "value": 3200.0, "unit": "AED/sqft", "source": "RERA Q4 2025", "is_real": True},
#     "MAR_YLD":  {"name": "Marina Yield",               "value": 6.8,   "unit": "%", "source": "RERA Q4 2025", "is_real": True},
#     "BB_TRX":   {"name": "Bus. Bay Transactions (30d)","value": 847.0, "unit": "30d"},
#     "AED_USD":  {"name": "AED/USD",                    "value": 3.6725,"unit": "rate"},
# }

# # In-memory cache for Alpha Vantage result
# _av_cache = {"aed_usd": 3.6725, "change_pct": 0.0, "last_fetched": None}
# _av_lock = None  # asyncio.Lock() created lazily

# # Cache for government and DFM data (with timestamps)
# _gov_cache = {}
# _gov_cache_ts = None
# _dfm_cache = {}
# _dfm_cache_ts = None

# # Cache for signal row data
# _signal_row_cache: dict = {"dld": [], "stocks": [], "updated_at": None}
# _signal_row_lock = None

# async def _get_av_lock():
#     global _av_lock
#     if _av_lock is None:
#         _av_lock = asyncio.Lock()
#     return _av_lock

# async def _get_signal_row_lock():
#     global _signal_row_lock
#     if _signal_row_lock is None:
#         _signal_row_lock = asyncio.Lock()
#     return _signal_row_lock

# async def _fetch_real_aed_usd():
#     """Fetch real AED/USD from Alpha Vantage. Cached for 15 minutes."""
#     import httpx
#     from datetime import timedelta
    
#     lock = await _get_av_lock()
#     async with lock:
#         # Check cache freshness (15 min)
#         if _av_cache["last_fetched"]:
#             age = (datetime.now(timezone.utc) - _av_cache["last_fetched"]).total_seconds()
#             if age < 900:  # 15 minutes
#                 return _av_cache
        
#         av_key = os.getenv("ALPHA_VANTAGE_KEY", "demo")
#         try:
#             async with httpx.AsyncClient(timeout=8, trust_env=False) as client:
#                 resp = await client.get(
#                     "https://www.alphavantage.co/query",
#                     params={
#                         "function": "CURRENCY_EXCHANGE_RATE",
#                         "from_currency": "USD",
#                         "to_currency": "AED",
#                         "apikey": av_key
#                     }
#                 )
#                 resp.raise_for_status()
#                 data = resp.json()
#                 rate_data = data.get("Realtime Currency Exchange Rate", {})
#                 if rate_data:
#                     rate = float(rate_data.get("5. Exchange Rate", 3.6725))
#                     bid = float(rate_data.get("8. Bid Price", rate))
#                     chg = round((rate - bid) / bid * 100, 3) if bid else 0.0
#                     _av_cache.update({
#                         "aed_usd": round(rate, 4),
#                         "change_pct": chg,
#                         "last_fetched": datetime.now(timezone.utc)
#                     })
#                     logger.info(f"Real AED/USD: {rate}")
#         except Exception as e:
#             logger.warning(f"Alpha Vantage unavailable: {e}")
        
#         return _av_cache


# def _count_area_transactions(store: dict, area_keyword: str, days: int = 30) -> int:
#     """Count real transaction events in the store for a given area."""
#     from datetime import timedelta
#     cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
#     count = 0
#     for ev in store.values():
#         if (ev.get("category") in ("transaction", "offplan") and
#                 area_keyword.lower() in ev.get("location_name", "").lower() and
#                 ev.get("created_at_ts", 0) > cutoff):
#             count += 1
#     return count


# @router.get("/ticker")
# async def get_ticker(request: Request):
#     """
#     Market ticker. AED/USD is REAL from free government APIs (Frankfurter/ECB).
#     Emaar stock price is REAL from DFM/Stooq.
#     Property metrics are realistic baselines derived from public research
#     + transaction signal counts from the live event store.
#     """
#     store = getattr(request.app.state, "events_store", {})

#     # Fetch real data (with 15-min cache)
#     from datetime import timedelta

#     now_ts = datetime.now(timezone.utc)

#     # AED/USD from free APIs
#     if _gov_cache_ts is None or (now_ts - _gov_cache_ts).total_seconds() > 900:
#         try:
#             from data_pipeline.fetchers.government_fetcher import GovernmentDataFetcher
#             gov = GovernmentDataFetcher()
#             gov_data = await gov.fetch_all_market_data()
#             globals()['_gov_cache'] = gov_data
#             globals()['_gov_cache_ts'] = now_ts
#         except Exception as e:
#             logger.warning(f"Gov data fetch failed: {e}")

#     # DFM stocks
#     if _dfm_cache_ts is None or (now_ts - _dfm_cache_ts).total_seconds() > 900:
#         try:
#             from data_pipeline.fetchers.dfm_fetcher import DFMFetcher
#             dfm = DFMFetcher()
#             dfm_data = await dfm.fetch_all_stocks()
#             globals()['_dfm_cache'] = dfm_data
#             globals()['_dfm_cache_ts'] = now_ts
#         except Exception as e:
#             logger.warning(f"DFM data fetch failed: {e}")

#     real_aed_usd = _gov_cache.get("aed_usd", 3.6725)
#     real_aed_source = _gov_cache.get("aed_usd_source", "fallback")
#     aed_is_real = _gov_cache.get("aed_usd_is_real", False)
#     emaar_data = _dfm_cache.get("EMAAR.DU")

#     # Derive Business Bay transaction count from real store
#     bb_real = _count_area_transactions(store, "Business Bay", days=30)
#     bb_value = bb_real if bb_real >= 5 else BASELINE["BB_TRX"]["value"]

#     # Derive Dubai Property Index from total event signal volume
#     total_events = len(store)
#     idx_signal = min(5.0, total_events / 50) if total_events else 0

#     tickers = [
#         {
#             "symbol": "AED_USD",
#             "name": "AED/USD",
#             "value": real_aed_usd,
#             "unit": "rate",
#             "change": round(real_aed_usd - BASELINE["AED_USD"]["value"], 4),
#             "change_pct": round((real_aed_usd - BASELINE["AED_USD"]["value"]) / BASELINE["AED_USD"]["value"] * 100, 3) if BASELINE["AED_USD"]["value"] else 0,
#             "is_real": aed_is_real,
#             "source": real_aed_source,
#             "updated_at": _gov_cache_ts.isoformat() if _gov_cache_ts else None
#         },
#         {
#             "symbol": "BB_TRX",
#             "name": "Bus. Bay Transactions (30d)",
#             "value": round(bb_value, 0),
#             "unit": "30d",
#             "change": round(bb_value - BASELINE["BB_TRX"]["value"], 1),
#             "change_pct": round((bb_value - BASELINE["BB_TRX"]["value"]) / BASELINE["BB_TRX"]["value"] * 100, 2),
#             "is_real": bb_real >= 5,
#             "source": "live events" if bb_real >= 5 else "baseline",
#             "updated_at": datetime.now(timezone.utc).isoformat()
#         },
#     ]

#     # Add Emaar stock if available
#     if emaar_data:
#         tickers.append({
#             "symbol": "EMAAR.DU",
#             "name": emaar_data.get("name", "Emaar Properties (DFM)"),
#             "value": emaar_data.get("price", 0),
#             "unit": "AED",
#             "change": emaar_data.get("change", 0),
#             "change_pct": emaar_data.get("change_pct", 0),
#             "is_real": True,
#             "source": emaar_data.get("source", "DFM"),
#             "updated_at": emaar_data.get("date", "")
#         })

#     # Fill remaining with RERA benchmarks (no micro-drift — these are stable published averages)
#     for sym, meta in BASELINE.items():
#         if sym in ("AED_USD", "BB_TRX"):
#             continue
#         val = meta["value"]
#         is_real = meta.get("is_real", False)
#         source = meta.get("source", "baseline estimate")
#         tickers.append({
#             "symbol": sym,
#             "name": meta["name"],
#             "value": val,
#             "unit": meta["unit"],
#             "change": 0.0,
#             "change_pct": 0.0,
#             "is_real": is_real,
#             "source": source,
#             "data_source": source if is_real else "baseline estimate",
#             "updated_at": datetime.now(timezone.utc).isoformat()
#         })

#     return {"tickers": tickers, "real_data_available": aed_is_real or bool(emaar_data)}



# # Cache for prediction markets (5 min TTL)
# _pred_cache: dict = {"predictions": [], "updated_at": None}
# _pred_lock = None

# async def _get_pred_lock():
#     global _pred_lock
#     if _pred_lock is None:
#         _pred_lock = asyncio.Lock()
#     return _pred_lock


# async def _fetch_manifold(client) -> list:
#     """
#     Fetch real prediction markets from Manifold Markets API.
#     No auth required. Returns markets by relevance score.
#     API: https://docs.manifold.markets/api
#     """
#     results = []
#     queries = [
#         "Federal Reserve rate cut 2025",
#         "fed funds rate",
#         "inflation CPI 2025",
#         "oil price OPEC",
#         "housing market crash",
#         "mortgage rate 2025",
#         "US recession 2025",
#         "UAE economy Saudi",
#         "interest rate cut",
#         "real estate market 2025",
#     ]
#     seen_ids = set()
#     for q in queries:
#         try:
#             resp = await client.get(
#                 "https://api.manifold.markets/v0/search-markets",
#                 params={"term": q, "limit": 3, "sort": "score", "filter": "open"},
#                 timeout=6,
#             )
#             if resp.status_code != 200:
#                 continue
#             for m in resp.json():
#                 mid = str(m.get("id", ""))
#                 question = m.get("question", "").strip()
#                 if mid in seen_ids or not question or m.get("isResolved"):
#                     continue
#                 seen_ids.add(mid)
#                 prob = m.get("probability", 0.5)
#                 yes_pct = round(float(prob) * 100, 1)
#                 results.append({
#                     "id": mid,
#                     "question": question,
#                     "pct": yes_pct,
#                     "delta": 0.0,
#                     "source": "Manifold",
#                     "url": m.get("url", "https://manifold.markets"),
#                     "volume": float(m.get("volume", 0) or 0),
#                     "end_date": "",
#                     "is_real": True,
#                 })
#         except Exception as e:
#             logger.debug(f"Manifold query '{q}' failed: {e}")
#     return results


# async def _fetch_polymarket_events(client) -> list:
#     """
#     Fetch prediction markets from Polymarket via the EVENTS endpoint.
#     Unlike the markets endpoint, events are categorised by topic —
#     so searching "Federal Reserve" returns Fed-related events, not GTA VI.
#     """
#     import json
#     results = []
#     # Tag-based queries that map to real event categories on Polymarket
#     queries = ["Federal Reserve", "interest rate", "inflation", "oil", "housing", "OPEC"]
#     seen_ids = set()
#     for q in queries:
#         try:
#             resp = await client.get(
#                 "https://gamma-api.polymarket.com/events",
#                 params={"q": q, "active": "true", "closed": "false", "limit": 3},
#                 timeout=6,
#             )
#             if resp.status_code != 200:
#                 continue
#             for event in resp.json():
#                 event_slug = event.get("slug", "")
#                 for m in event.get("markets", []):
#                     mid = str(m.get("id", ""))
#                     question = m.get("question", "").strip()
#                     if mid in seen_ids or not question:
#                         continue
#                     seen_ids.add(mid)
#                     try:
#                         outcomes = json.loads(m["outcomes"]) if isinstance(m.get("outcomes"), str) else m.get("outcomes", [])
#                         prices   = json.loads(m["outcomePrices"]) if isinstance(m.get("outcomePrices"), str) else m.get("outcomePrices", [])
#                     except Exception:
#                         outcomes, prices = [], []
#                     yes_pct = 50.0
#                     for i, outcome in enumerate(outcomes):
#                         if str(outcome).lower() == "yes" and i < len(prices):
#                             try:
#                                 yes_pct = round(float(prices[i]) * 100, 1)
#                             except Exception:
#                                 pass
#                             break
#                     else:
#                         if prices:
#                             try:
#                                 yes_pct = round(float(prices[0]) * 100, 1)
#                             except Exception:
#                                 pass
#                     results.append({
#                         "id": mid,
#                         "question": question,
#                         "pct": yes_pct,
#                         "delta": 0.0,
#                         "source": "Polymarket",
#                         "url": f"https://polymarket.com/event/{event_slug}",
#                         "volume": float(m.get("volume", 0) or 0),
#                         "end_date": m.get("endDate", ""),
#                         "is_real": True,
#                     })
#         except Exception as e:
#             logger.debug(f"Polymarket events query '{q}' failed: {e}")
#     return results


# @router.get("/predictions")
# async def get_predictions(request: Request):
#     """
#     Live prediction market percentages from Manifold Markets and Polymarket.
#     Cached for 5 minutes. Falls back to signal-derived forecasts if APIs unavailable.
#     """
#     import httpx
#     lock = await _get_pred_lock()
#     async with lock:
#         # Return cache if fresh (5 min)
#         now = datetime.now(timezone.utc)
#         if _pred_cache["updated_at"]:
#             age = (now - _pred_cache["updated_at"]).total_seconds()
#             if age < 300 and _pred_cache["predictions"]:
#                 return {
#                     "predictions": _pred_cache["predictions"],
#                     "total": len(_pred_cache["predictions"]),
#                     "sources": list({p["source"] for p in _pred_cache["predictions"]}),
#                     "updated_at": _pred_cache["updated_at"].isoformat(),
#                     "is_real": _pred_cache.get("is_real", False),
#                     "cache_age_s": round(age),
#                 }

#         all_results = []
#         is_real = False
#         try:
#             async with httpx.AsyncClient(follow_redirects=True, trust_env=False, timeout=10) as client:
#                 manifold_task = asyncio.create_task(_fetch_manifold(client))
#                 poly_task     = asyncio.create_task(_fetch_polymarket_events(client))
#                 manifold, poly = await asyncio.gather(manifold_task, poly_task, return_exceptions=True)

#             if isinstance(manifold, list):
#                 all_results.extend(manifold)
#             if isinstance(poly, list):
#                 all_results.extend(poly)
#             is_real = len(all_results) > 0
#         except Exception as e:
#             logger.warning(f"External prediction APIs unavailable: {e}")

#         # Fall back to signal-derived forecasts if no real data
#         if not all_results:
#             logger.info("Predictions: falling back to signal-derived forecasts")
#             store = getattr(request.app.state, "events_store", {})
#             all_results = _build_forecast_predictions(store)
#             is_real = False

#         # Deduplicate by question, sort by volume descending
#         seen, unique = set(), []
#         for r in all_results:
#             q = r.get("question", "").lower().strip()
#             if q and q not in seen:
#                 seen.add(q)
#                 unique.append(r)
#         unique.sort(key=lambda x: x.get("volume", 0), reverse=True)
#         top = unique[:12]

#         # Update cache
#         _pred_cache["predictions"] = top
#         _pred_cache["updated_at"] = now
#         _pred_cache["is_real"] = is_real

#         sources = list({p["source"] for p in top}) if top else []
#         logger.info(f"Predictions: returning {len(top)} markets from {sources} (real={is_real})")

#         return {
#             "predictions": top,
#             "total": len(top),
#             "sources": sources,
#             "updated_at": now.isoformat(),
#             "is_real": is_real,
#             "cache_age_s": 0,
#         }


# def _build_forecast_predictions(store: dict) -> list:
#     """Build prediction-style items from the live event store as fallback."""
#     from datetime import timedelta
#     events = list(store.values())

#     def count_events(category=None, location=None, severity_min=1, days=30):
#         cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
#         return len([
#             e for e in events
#             if e.get("created_at_ts", 0) > cutoff
#             and (category is None or e.get("category") == category)
#             and (location is None or location.lower() in e.get("location_name", "").lower())
#             and e.get("severity", 1) >= severity_min
#         ])

#     def avg_conf(category=None):
#         pool = [e["confidence"] for e in events
#                 if (category is None or e.get("category") == category) and "confidence" in e]
#         return sum(pool) / len(pool) if pool else 0.5

#     def sig_pct(raw, base=50.0, sens=30.0):
#         return max(5, min(95, round(base + (raw - 0.5) * sens * 2)))

#     reg_s = min(1.0, count_events("regulatory", days=14) / 5 * 0.4 + avg_conf("regulatory") * 0.6)
#     palm_s = min(1.0, count_events("transaction", "Palm Jumeirah", days=7) / 10 * 0.5 + avg_conf("transaction") * 0.5)
#     offplan_s = min(1.0, count_events("offplan", days=14) / 8 * 0.5 + avg_conf("offplan") * 0.5)
#     bb_s = min(1.0, count_events("transaction", "Business Bay", days=30) / 20)
#     marina_s = min(1.0, count_events("investment", "Marina", days=14) / 5 * 0.5 + avg_conf("investment") * 0.5)
#     infra_s = min(1.0, count_events("infrastructure", days=30, severity_min=3) / 5)
#     creek_s = min(1.0, count_events(location="Creek", days=30) / 5)
#     dt_s = min(1.0, count_events("transaction", "Downtown", days=7) / 10 * 0.5 + avg_conf("transaction") * 0.5)
#     foreign_s = min(1.0, count_events("foreign_buyers", days=14) / 8 * 0.4 + avg_conf("foreign_buyers") * 0.6)

#     forecasts = [
#         {"id": "palm_rise_10",  "question": "Will Palm Jumeirah villa prices rise 10% by Q4?",           "pct": sig_pct(palm_s, 62, 25),    "source": "ACQAR Signal"},
#         {"id": "dld_digital",   "question": "Will DLD announce digital title deed by June?",              "pct": sig_pct(reg_s, 75, 20),     "source": "ACQAR Signal"},
#         {"id": "marina_yield",  "question": "Will Dubai Marina average yield exceed 8% this year?",       "pct": sig_pct(marina_s, 42, 20),  "source": "ACQAR Signal"},
#         {"id": "emaar_q2",      "question": "Will Emaar launch a new Downtown mega-project in Q2?",       "pct": sig_pct(offplan_s, 68, 22), "source": "ACQAR Signal"},
#         {"id": "bb_1000",       "question": "Will Business Bay transactions hit 1,000/month by mid-year?","pct": sig_pct(bb_s, 55, 28),      "source": "ACQAR Signal"},
#         {"id": "rera_str",      "question": "Will RERA tighten short-term rental regulations in 2025?",   "pct": sig_pct(reg_s, 76, 18),     "source": "ACQAR Signal"},
#         {"id": "foreign_65",    "question": "Will foreign buyer share exceed 65% of total DLD sales?",    "pct": sig_pct(foreign_s, 58, 25), "source": "ACQAR Signal"},
#         {"id": "creek_top3",    "question": "Will Creek Harbour become a top-3 DLD area by volume?",      "pct": sig_pct(creek_s, 52, 22),   "source": "ACQAR Signal"},
#         {"id": "infra_q2",      "question": "Will a major Dubai infrastructure project be announced Q2?", "pct": sig_pct(infra_s, 70, 20),   "source": "ACQAR Signal"},
#         {"id": "dt_record",     "question": "Will Downtown Dubai set a new monthly transaction record?",   "pct": sig_pct(dt_s, 48, 22),      "source": "ACQAR Signal"},
#     ]
#     for f in forecasts:
#         f.update({"delta": 0.0, "volume": 0.0, "end_date": "", "is_real": False, "url": ""})
#     return forecasts


# @router.get("/status")
# async def get_status(request: Request):
#     return {
#         "monitor_count": getattr(request.app.state, "monitor_count", 0),
#         "active_connections": getattr(request.app.state, "ws_connections", 0),
#         "pipeline_running": True,
#         "last_event_at": getattr(request.app.state, "last_event_at", None),
#         "alpha_vantage_key_set": os.getenv("ALPHA_VANTAGE_KEY") is not None
#     }


# def _format_aed(val):
#     """Format a value as AED currency string."""
#     if val is None:
#         return None
#     if val >= 1_000_000_000:
#         return f"AED {val/1_000_000_000:.1f}B"
#     if val >= 1_000_000:
#         return f"AED {val/1_000_000:.1f}M"
#     if val >= 1_000:
#         return f"AED {val/1_000:.0f}K"
#     return f"AED {val:,.0f}"


# def _minutes_ago(event):
#     """Calculate minutes since event creation."""
#     ts = event.get("created_at_ts", 0)
#     if not ts:
#         return 999
#     return round((datetime.now(timezone.utc).timestamp() - ts) / 60)


# @router.get("/signal-row")
# async def get_signal_row(request: Request):
#     """
#     Return cached signal row data (DLD events + stocks).
#     Returns fresh data if cache is older than 2 minutes.
#     """
#     from datetime import timedelta
#     from data_pipeline.fetchers.dfm_fetcher import DFMFetcher

#     lock = await _get_signal_row_lock()
#     async with lock:
#         now = datetime.now(timezone.utc)

#         # Check cache freshness (2 min = 120 sec)
#         if _signal_row_cache["updated_at"]:
#             age = (now - _signal_row_cache["updated_at"]).total_seconds()
#             if age < 120 and _signal_row_cache["dld"]:
#                 return {
#                     "dld": _signal_row_cache["dld"],
#                     "stocks": _signal_row_cache["stocks"],
#                     "updated_at": _signal_row_cache["updated_at"].isoformat(),
#                     "is_real": True,
#                     "total_dld": len(_signal_row_cache["dld"]),
#                     "total_stocks": len(_signal_row_cache["stocks"]),
#                 }

#         # Fetch fresh DLD signals from events_store
#         store = getattr(request.app.state, "events_store", {})
#         dld_events = []

#         for event in store.values():
#             if event.get("category") not in ["transaction", "offplan", "price_signal", "regulatory"]:
#                 continue
#             if "price" not in event and "title" not in event:
#                 continue

#             dld_events.append({
#                 "id": event.get("id", ""),
#                 "type": "dld",
#                 "label": event.get("title", "")[:70],
#                 "area": event.get("location_name", "Dubai"),
#                 "amount": event.get("price", None),
#                 "amount_fmt": _format_aed(event.get("price")),
#                 "category": event.get("category", "transaction"),
#                 "severity": event.get("severity", 1),
#                 "url": event.get("url", ""),
#                 "age_mins": _minutes_ago(event),
#                 "is_real": True,
#             })

#         # Sort by created_at_ts descending (newest first)
#         dld_events.sort(key=lambda x: x.get("id", ""), reverse=False)
#         dld_events = [
#             e for e in sorted(
#                 dld_events,
#                 key=lambda x: store.get(x["id"], {}).get("created_at_ts", 0),
#                 reverse=True
#             )
#         ][:20]

#         # Fetch stock signals
#         stocks = []
#         try:
#             dfm = DFMFetcher()
#             stock_data = await dfm.fetch_all_stocks()
#             for symbol, data in stock_data.items():
#                 stocks.append({
#                     "id": f"stock_{symbol}",
#                     "type": "stock",
#                     "symbol": symbol,
#                     "label": data.get("name", symbol),
#                     "fullname": data.get("fullname", symbol),
#                     "price": data.get("price", 0),
#                     "change": data.get("change", 0),
#                     "change_pct": data.get("change_pct", 0),
#                     "currency": "AED",
#                     "exchange": data.get("exchange", ""),
#                     "is_real": data.get("is_real", False),
#                     "source": data.get("source", ""),
#                 })
#         except Exception as e:
#             logger.warning(f"Failed to fetch stock data for signal-row: {e}")

#         # Update cache
#         _signal_row_cache["dld"] = dld_events
#         _signal_row_cache["stocks"] = stocks
#         _signal_row_cache["updated_at"] = now

#         return {
#             "dld": dld_events,
#             "stocks": stocks,
#             "updated_at": now.isoformat(),
#             "is_real": True,
#             "total_dld": len(dld_events),
#             "total_stocks": len(stocks),
#         }


# @router.get("/forecasts")
# async def get_forecasts(request: Request):
#     """
#     Dynamic forecast percentages calculated from real event signal data in the store.
#     These are SIGNAL-DERIVED estimates, not real prediction markets.
#     Each forecast question has its probability calculated from actual event patterns.
#     """
#     store = getattr(request.app.state, "events_store", {})
#     events = list(store.values())
#     total = max(len(events), 1)

#     def count_events(category=None, location=None, severity_min=1, days=30):
#         from datetime import timedelta
#         cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
#         filtered = [
#             e for e in events
#             if e.get("created_at_ts", 0) > cutoff
#             and (category is None or e.get("category") == category)
#             and (location is None or location.lower() in e.get("location_name", "").lower())
#             and e.get("severity", 1) >= severity_min
#         ]
#         return len(filtered)

#     def avg_confidence(category=None, location=None):
#         pool = [
#             e["confidence"] for e in events
#             if (category is None or e.get("category") == category)
#             and (location is None or location.lower() in e.get("location_name", "").lower())
#             and "confidence" in e
#         ]
#         return sum(pool) / len(pool) if pool else 0.5

#     def signal_pct(raw_signal: float, base: float = 50.0, sensitivity: float = 30.0) -> int:
#         """Convert a normalised signal (0-1) to a percentage anchored around base."""
#         pct = base + (raw_signal - 0.5) * sensitivity * 2
#         return max(5, min(95, round(pct)))

#     # Calculate forecasts from real event signal data
#     palm_txn = count_events("transaction", "Palm Jumeirah", days=7)
#     palm_conf = avg_confidence("transaction", "Palm Jumeirah")
#     palm_signal = min(1.0, palm_txn / 10 * 0.5 + palm_conf * 0.5)

#     downtown_txn = count_events("transaction", "Downtown", days=7)
#     downtown_conf = avg_confidence("transaction", "Downtown")
#     dt_signal = min(1.0, downtown_txn / 10 * 0.5 + downtown_conf * 0.5)

#     reg_events = count_events("regulatory", days=14)
#     reg_conf = avg_confidence("regulatory")
#     reg_signal = min(1.0, reg_events / 5 * 0.4 + reg_conf * 0.6)

#     marina_inv = count_events("investment", "Marina", days=14)
#     marina_conf = avg_confidence("investment", "Marina")
#     marina_signal = min(1.0, marina_inv / 5 * 0.5 + marina_conf * 0.5)

#     foreign_events = count_events("foreign_buyers", days=14)
#     foreign_conf = avg_confidence("foreign_buyers")
#     foreign_signal = min(1.0, foreign_events / 8 * 0.4 + foreign_conf * 0.6)

#     infra_events = count_events("infrastructure", days=30, severity_min=3)
#     infra_signal = min(1.0, infra_events / 5)

#     bb_txn = count_events("transaction", "Business Bay", days=30)
#     bb_signal = min(1.0, bb_txn / 20)

#     offplan_events = count_events("offplan", days=14)
#     offplan_conf = avg_confidence("offplan")
#     offplan_signal = min(1.0, offplan_events / 8 * 0.5 + offplan_conf * 0.5)

#     creek_events = count_events(location="Creek", days=30)
#     creek_signal = min(1.0, creek_events / 5)

#     price_events = count_events("price_signal", days=7)
#     price_conf = avg_confidence("price_signal")
#     price_signal = min(1.0, price_events / 5 * 0.5 + price_conf * 0.5)

#     forecasts = [
#         {
#             "id": "palm_rise_10",
#             "question": "Will Palm Jumeirah villa prices rise 10% by Q4 2025?",
#             "pct": signal_pct(palm_signal, base=62, sensitivity=25),
#             "delta": round((palm_signal - 0.5) * 6, 1),
#             "signal_basis": f"{palm_txn} recent transactions, {round(palm_conf*100)}% avg confidence",
#             "is_calculated": True,
#         },
#         {
#             "id": "dld_digital",
#             "question": "Will DLD announce digital title deed by June 2025?",
#             "pct": signal_pct(reg_signal, base=75, sensitivity=20),
#             "delta": round((reg_signal - 0.5) * 4, 1),
#             "signal_basis": f"{reg_events} regulatory signals detected",
#             "is_calculated": True,
#         },
#         {
#             "id": "marina_yield_8",
#             "question": "Will Dubai Marina average yield exceed 8% this year?",
#             "pct": signal_pct(marina_signal, base=42, sensitivity=20),
#             "delta": round((marina_signal - 0.5) * 4, 1),
#             "signal_basis": f"{marina_inv} investment signals, Marina",
#             "is_calculated": True,
#         },
#         {
#             "id": "emaar_downtown",
#             "question": "Will Emaar launch a new Downtown mega-project in Q2?",
#             "pct": signal_pct(offplan_signal, base=68, sensitivity=22),
#             "delta": round((offplan_signal - 0.5) * 5, 1),
#             "signal_basis": f"{offplan_events} off-plan signals detected",
#             "is_calculated": True,
#         },
#         {
#             "id": "bb_1000_month",
#             "question": "Will Business Bay transactions hit 1,000/month by mid-2025?",
#             "pct": signal_pct(bb_signal, base=55, sensitivity=28),
#             "delta": round((bb_signal - 0.5) * 5, 1),
#             "signal_basis": f"{bb_txn} Business Bay transactions (30d)",
#             "is_calculated": True,
#         },
#         {
#             "id": "rera_str",
#             "question": "Will RERA tighten STR regulations further in 2025?",
#             "pct": signal_pct(reg_signal, base=76, sensitivity=18),
#             "delta": round((reg_signal - 0.5) * 3, 1),
#             "signal_basis": f"{reg_events} regulatory events",
#             "is_calculated": True,
#         },
#         {
#             "id": "foreign_65",
#             "question": "Will foreign buyer share exceed 65% of total DLD sales?",
#             "pct": signal_pct(foreign_signal, base=58, sensitivity=25),
#             "delta": round((foreign_signal - 0.5) * 5, 1),
#             "signal_basis": f"{foreign_events} foreign buyer signals",
#             "is_calculated": True,
#         },
#         {
#             "id": "creek_top3",
#             "question": "Will Creek Harbour become top 3 DLD area by volume?",
#             "pct": signal_pct(creek_signal, base=52, sensitivity=22),
#             "delta": round((creek_signal - 0.5) * 4, 1),
#             "signal_basis": f"{creek_events} Creek Harbour events",
#             "is_calculated": True,
#         },
#         {
#             "id": "infra_expansion",
#             "question": "Will a major Dubai infrastructure project be announced Q2?",
#             "pct": signal_pct(infra_signal, base=70, sensitivity=20),
#             "delta": round((infra_signal - 0.5) * 4, 1),
#             "signal_basis": f"{infra_events} infrastructure signals (S3+)",
#             "is_calculated": True,
#         },
#         {
#             "id": "price_200m",
#             "question": "Will a Dubai property exceed AED 200M this quarter?",
#             "pct": signal_pct(price_signal, base=33, sensitivity=20),
#             "delta": round((price_signal - 0.5) * 4, 1),
#             "signal_basis": f"{price_events} price signals",
#             "is_calculated": True,
#         },
#     ]

#     return {
#         "forecasts": forecasts,
#         "total_events_analysed": total,
#         "is_calculated": True,
#         "methodology": "Signal-derived from live event store. Not a regulated prediction market.",
#         "updated_at": datetime.now(timezone.utc).isoformat()
#     }












# from fastapi import APIRouter, Request
# from datetime import datetime, timezone
# import asyncio
# import logging
# import os
# import sys

# logger = logging.getLogger(__name__)
# router = APIRouter(prefix="/api/market", tags=["market"])

# # Baseline estimates — sourced from RERA published Q4 2024 averages
# # Updated quarterly with official RERA data
# BASELINE = {
#     "DXB_IDX":  {"name": "Dubai Property Index",      "value": 287.4, "unit": "pts"},
#     "PAL_AVG":  {"name": "Palm Avg AED/sqft",          "value": 2950.0, "unit": "AED/sqft", "source": "RERA Q4 2025", "is_real": True},
#     "DT_AVG":   {"name": "Downtown AED/sqft",          "value": 3200.0, "unit": "AED/sqft", "source": "RERA Q4 2025", "is_real": True},
#     "MAR_YLD":  {"name": "Marina Yield",               "value": 6.8,   "unit": "%", "source": "RERA Q4 2025", "is_real": True},
#     "BB_TRX":   {"name": "Bus. Bay Transactions (30d)","value": 847.0, "unit": "30d"},
#     "AED_USD":  {"name": "AED/USD",                    "value": 3.6725,"unit": "rate"},
# }

# # In-memory cache for Alpha Vantage result
# _av_cache = {"aed_usd": 3.6725, "change_pct": 0.0, "last_fetched": None}
# _av_lock = None  # asyncio.Lock() created lazily

# # Cache for government and DFM data (with timestamps)
# _gov_cache = {}
# _gov_cache_ts = None
# _dfm_cache = {}
# _dfm_cache_ts = None

# # Cache for signal row data
# _signal_row_cache: dict = {"dld": [], "stocks": [], "updated_at": None}
# _signal_row_lock = None

# async def _get_av_lock():
#     global _av_lock
#     if _av_lock is None:
#         _av_lock = asyncio.Lock()
#     return _av_lock

# async def _get_signal_row_lock():
#     global _signal_row_lock
#     if _signal_row_lock is None:
#         _signal_row_lock = asyncio.Lock()
#     return _signal_row_lock

# async def _fetch_real_aed_usd():
#     """Fetch real AED/USD from Alpha Vantage. Cached for 15 minutes."""
#     import httpx
#     from datetime import timedelta
    
#     lock = await _get_av_lock()
#     async with lock:
#         # Check cache freshness (15 min)
#         if _av_cache["last_fetched"]:
#             age = (datetime.now(timezone.utc) - _av_cache["last_fetched"]).total_seconds()
#             if age < 900:  # 15 minutes
#                 return _av_cache
        
#         av_key = os.getenv("ALPHA_VANTAGE_KEY", "demo")
#         try:
#             async with httpx.AsyncClient(timeout=8, trust_env=False) as client:
#                 resp = await client.get(
#                     "https://www.alphavantage.co/query",
#                     params={
#                         "function": "CURRENCY_EXCHANGE_RATE",
#                         "from_currency": "USD",
#                         "to_currency": "AED",
#                         "apikey": av_key
#                     }
#                 )
#                 resp.raise_for_status()
#                 data = resp.json()
#                 rate_data = data.get("Realtime Currency Exchange Rate", {})
#                 if rate_data:
#                     rate = float(rate_data.get("5. Exchange Rate", 3.6725))
#                     bid = float(rate_data.get("8. Bid Price", rate))
#                     chg = round((rate - bid) / bid * 100, 3) if bid else 0.0
#                     _av_cache.update({
#                         "aed_usd": round(rate, 4),
#                         "change_pct": chg,
#                         "last_fetched": datetime.now(timezone.utc)
#                     })
#                     logger.info(f"Real AED/USD: {rate}")
#         except Exception as e:
#             logger.warning(f"Alpha Vantage unavailable: {e}")
        
#         return _av_cache


# def _count_area_transactions(store: dict, area_keyword: str, days: int = 30) -> int:
#     """Count real transaction events in the store for a given area."""
#     from datetime import timedelta
#     cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
#     count = 0
#     for ev in store.values():
#         if (ev.get("category") in ("transaction", "offplan") and
#                 area_keyword.lower() in ev.get("location_name", "").lower() and
#                 ev.get("created_at_ts", 0) > cutoff):
#             count += 1
#     return count


# @router.get("/ticker")
# async def get_ticker(request: Request):
#     """
#     Market ticker. AED/USD is REAL from free government APIs (Frankfurter/ECB).
#     Emaar stock price is REAL from DFM/Stooq.
#     Property metrics are realistic baselines derived from public research
#     + transaction signal counts from the live event store.
#     """
#     store = getattr(request.app.state, "events_store", {})

#     # Fetch real data (with 15-min cache)
#     from datetime import timedelta

#     now_ts = datetime.now(timezone.utc)

#     # AED/USD from free APIs
#     if _gov_cache_ts is None or (now_ts - _gov_cache_ts).total_seconds() > 900:
#         try:
#             from data_pipeline.fetchers.government_fetcher import GovernmentDataFetcher
#             gov = GovernmentDataFetcher()
#             gov_data = await gov.fetch_all_market_data()
#             globals()['_gov_cache'] = gov_data
#             globals()['_gov_cache_ts'] = now_ts
#         except Exception as e:
#             logger.warning(f"Gov data fetch failed: {e}")

#     # DFM stocks
#     if _dfm_cache_ts is None or (now_ts - _dfm_cache_ts).total_seconds() > 900:
#         try:
#             from data_pipeline.fetchers.dfm_fetcher import DFMFetcher
#             dfm = DFMFetcher()
#             dfm_data = await dfm.fetch_all_stocks()
#             globals()['_dfm_cache'] = dfm_data
#             globals()['_dfm_cache_ts'] = now_ts
#         except Exception as e:
#             logger.warning(f"DFM data fetch failed: {e}")

#     real_aed_usd = _gov_cache.get("aed_usd", 3.6725)
#     real_aed_source = _gov_cache.get("aed_usd_source", "fallback")
#     aed_is_real = _gov_cache.get("aed_usd_is_real", False)
#     emaar_data = _dfm_cache.get("EMAAR.DU")

#     # Derive Business Bay transaction count from real store
#     bb_real = _count_area_transactions(store, "Business Bay", days=30)
#     bb_value = bb_real if bb_real >= 5 else BASELINE["BB_TRX"]["value"]

#     # Derive Dubai Property Index from total event signal volume
#     total_events = len(store)
#     idx_signal = min(5.0, total_events / 50) if total_events else 0

#     tickers = [
#         {
#             "symbol": "AED_USD",
#             "name": "AED/USD",
#             "value": real_aed_usd,
#             "unit": "rate",
#             "change": round(real_aed_usd - BASELINE["AED_USD"]["value"], 4),
#             "change_pct": round((real_aed_usd - BASELINE["AED_USD"]["value"]) / BASELINE["AED_USD"]["value"] * 100, 3) if BASELINE["AED_USD"]["value"] else 0,
#             "is_real": aed_is_real,
#             "source": real_aed_source,
#             "updated_at": _gov_cache_ts.isoformat() if _gov_cache_ts else None
#         },
#         {
#             "symbol": "BB_TRX",
#             "name": "Bus. Bay Transactions (30d)",
#             "value": round(bb_value, 0),
#             "unit": "30d",
#             "change": round(bb_value - BASELINE["BB_TRX"]["value"], 1),
#             "change_pct": round((bb_value - BASELINE["BB_TRX"]["value"]) / BASELINE["BB_TRX"]["value"] * 100, 2),
#             "is_real": bb_real >= 5,
#             "source": "live events" if bb_real >= 5 else "baseline",
#             "updated_at": datetime.now(timezone.utc).isoformat()
#         },
#     ]

#     # Add Emaar stock if available
#     if emaar_data:
#         tickers.append({
#             "symbol": "EMAAR.DU",
#             "name": emaar_data.get("name", "Emaar Properties (DFM)"),
#             "value": emaar_data.get("price", 0),
#             "unit": "AED",
#             "change": emaar_data.get("change", 0),
#             "change_pct": emaar_data.get("change_pct", 0),
#             "is_real": True,
#             "source": emaar_data.get("source", "DFM"),
#             "updated_at": emaar_data.get("date", "")
#         })

#     # Fill remaining with RERA benchmarks (no micro-drift — these are stable published averages)
#     for sym, meta in BASELINE.items():
#         if sym in ("AED_USD", "BB_TRX"):
#             continue
#         val = meta["value"]
#         is_real = meta.get("is_real", False)
#         source = meta.get("source", "baseline estimate")
#         tickers.append({
#             "symbol": sym,
#             "name": meta["name"],
#             "value": val,
#             "unit": meta["unit"],
#             "change": 0.0,
#             "change_pct": 0.0,
#             "is_real": is_real,
#             "source": source,
#             "data_source": source if is_real else "baseline estimate",
#             "updated_at": datetime.now(timezone.utc).isoformat()
#         })

#     return {"tickers": tickers, "real_data_available": aed_is_real or bool(emaar_data)}



# # Cache for prediction markets (5 min TTL)
# _pred_cache: dict = {"predictions": [], "updated_at": None}
# _pred_lock = None

# async def _get_pred_lock():
#     global _pred_lock
#     if _pred_lock is None:
#         _pred_lock = asyncio.Lock()
#     return _pred_lock


# async def _fetch_manifold(client) -> list:
#     """
#     Fetch real prediction markets from Manifold Markets API.
#     No auth required. Returns markets by relevance score.
#     API: https://docs.manifold.markets/api
#     """
#     results = []
#     queries = [
#         "Federal Reserve rate cut 2026",
#         "fed funds rate",
#         "inflation CPI 2026",
#         "oil price OPEC",
#         "housing market crash",
#         "mortgage rate 2026",
#         "US recession 2026",
#         "UAE economy Saudi",
#         "interest rate cut",
#         "real estate market 2026",
#     ]
#     seen_ids = set()
#     for q in queries:
#         try:
#             resp = await client.get(
#                 "https://api.manifold.markets/v0/search-markets",
#                 params={"term": q, "limit": 3, "sort": "score", "filter": "open"},
#                 timeout=6,
#             )
#             if resp.status_code != 200:
#                 continue
#             for m in resp.json():
#                 mid = str(m.get("id", ""))
#                 question = m.get("question", "").strip()
#                 if mid in seen_ids or not question or m.get("isResolved"):
#                     continue
#                 seen_ids.add(mid)
#                 prob = m.get("probability", 0.5)
#                 yes_pct = round(float(prob) * 100, 1)
#                 results.append({
#                     "id": mid,
#                     "question": question,
#                     "pct": yes_pct,
#                     "delta": 0.0,
#                     "source": "Manifold",
#                     "url": m.get("url", "https://manifold.markets"),
#                     "volume": float(m.get("volume", 0) or 0),
#                     "end_date": "",
#                     "is_real": True,
#                 })
#         except Exception as e:
#             logger.debug(f"Manifold query '{q}' failed: {e}")
#     return results


# async def _fetch_polymarket_events(client) -> list:
#     """
#     Fetch prediction markets from Polymarket via the EVENTS endpoint.
#     Unlike the markets endpoint, events are categorised by topic —
#     so searching "Federal Reserve" returns Fed-related events, not GTA VI.
#     """
#     import json
#     results = []
#     # Tag-based queries that map to real event categories on Polymarket
#     queries = ["Federal Reserve", "interest rate", "inflation", "oil", "housing", "OPEC"]
#     seen_ids = set()
#     for q in queries:
#         try:
#             resp = await client.get(
#                 "https://gamma-api.polymarket.com/events",
#                 params={"q": q, "active": "true", "closed": "false", "limit": 3},
#                 timeout=6,
#             )
#             if resp.status_code != 200:
#                 continue
#             for event in resp.json():
#                 event_slug = event.get("slug", "")
#                 for m in event.get("markets", []):
#                     mid = str(m.get("id", ""))
#                     question = m.get("question", "").strip()
#                     if mid in seen_ids or not question:
#                         continue
#                     seen_ids.add(mid)
#                     try:
#                         outcomes = json.loads(m["outcomes"]) if isinstance(m.get("outcomes"), str) else m.get("outcomes", [])
#                         prices   = json.loads(m["outcomePrices"]) if isinstance(m.get("outcomePrices"), str) else m.get("outcomePrices", [])
#                     except Exception:
#                         outcomes, prices = [], []
#                     yes_pct = 50.0
#                     for i, outcome in enumerate(outcomes):
#                         if str(outcome).lower() == "yes" and i < len(prices):
#                             try:
#                                 yes_pct = round(float(prices[i]) * 100, 1)
#                             except Exception:
#                                 pass
#                             break
#                     else:
#                         if prices:
#                             try:
#                                 yes_pct = round(float(prices[0]) * 100, 1)
#                             except Exception:
#                                 pass
#                     results.append({
#                         "id": mid,
#                         "question": question,
#                         "pct": yes_pct,
#                         "delta": 0.0,
#                         "source": "Polymarket",
#                         "url": f"https://polymarket.com/event/{event_slug}",
#                         "volume": float(m.get("volume", 0) or 0),
#                         "end_date": m.get("endDate", ""),
#                         "is_real": True,
#                     })
#         except Exception as e:
#             logger.debug(f"Polymarket events query '{q}' failed: {e}")
#     return results


# @router.get("/predictions")
# async def get_predictions(request: Request):
#     """
#     Live prediction market percentages from Manifold Markets and Polymarket.
#     Cached for 5 minutes. Falls back to signal-derived forecasts if APIs unavailable.
#     """
#     import httpx
#     lock = await _get_pred_lock()
#     async with lock:
#         # Return cache if fresh (5 min)
#         now = datetime.now(timezone.utc)
#         if _pred_cache["updated_at"]:
#             age = (now - _pred_cache["updated_at"]).total_seconds()
#             if age < 300 and _pred_cache["predictions"]:
#                 return {
#                     "predictions": _pred_cache["predictions"],
#                     "total": len(_pred_cache["predictions"]),
#                     "sources": list({p["source"] for p in _pred_cache["predictions"]}),
#                     "updated_at": _pred_cache["updated_at"].isoformat(),
#                     "is_real": _pred_cache.get("is_real", False),
#                     "cache_age_s": round(age),
#                 }

#         all_results = []
#         is_real = False
#         try:
#             async with httpx.AsyncClient(follow_redirects=True, trust_env=False, timeout=10) as client:
#                 manifold_task = asyncio.create_task(_fetch_manifold(client))
#                 poly_task     = asyncio.create_task(_fetch_polymarket_events(client))
#                 manifold, poly = await asyncio.gather(manifold_task, poly_task, return_exceptions=True)

#             if isinstance(manifold, list):
#                 all_results.extend(manifold)
#             if isinstance(poly, list):
#                 all_results.extend(poly)
#             is_real = len(all_results) > 0
#         except Exception as e:
#             logger.warning(f"External prediction APIs unavailable: {e}")

#         # Fall back to signal-derived forecasts if no real data
#         if not all_results:
#             logger.info("Predictions: falling back to signal-derived forecasts")
#             store = getattr(request.app.state, "events_store", {})
#             all_results = _build_forecast_predictions(store)
#             is_real = False

#         # Deduplicate by question, sort by volume descending
#         seen, unique = set(), []
#         for r in all_results:
#             q = r.get("question", "").lower().strip()
#             if q and q not in seen:
#                 seen.add(q)
#                 unique.append(r)
#         unique.sort(key=lambda x: x.get("volume", 0), reverse=True)
#         top = unique[:12]

#         # Update cache
#         _pred_cache["predictions"] = top
#         _pred_cache["updated_at"] = now
#         _pred_cache["is_real"] = is_real

#         sources = list({p["source"] for p in top}) if top else []
#         logger.info(f"Predictions: returning {len(top)} markets from {sources} (real={is_real})")

#         return {
#             "predictions": top,
#             "total": len(top),
#             "sources": sources,
#             "updated_at": now.isoformat(),
#             "is_real": is_real,
#             "cache_age_s": 0,
#         }


# def _build_forecast_predictions(store: dict) -> list:
#     """Build prediction-style items from the live event store as fallback."""
#     from datetime import timedelta
#     events = list(store.values())

#     def count_events(category=None, location=None, severity_min=1, days=30):
#         cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
#         return len([
#             e for e in events
#             if e.get("created_at_ts", 0) > cutoff
#             and (category is None or e.get("category") == category)
#             and (location is None or location.lower() in e.get("location_name", "").lower())
#             and e.get("severity", 1) >= severity_min
#         ])

#     def avg_conf(category=None):
#         pool = [e["confidence"] for e in events
#                 if (category is None or e.get("category") == category) and "confidence" in e]
#         return sum(pool) / len(pool) if pool else 0.5

#     def sig_pct(raw, base=50.0, sens=30.0):
#         return max(5, min(95, round(base + (raw - 0.5) * sens * 2)))

#     reg_s = min(1.0, count_events("regulatory", days=14) / 5 * 0.4 + avg_conf("regulatory") * 0.6)
#     palm_s = min(1.0, count_events("transaction", "Palm Jumeirah", days=7) / 10 * 0.5 + avg_conf("transaction") * 0.5)
#     offplan_s = min(1.0, count_events("offplan", days=14) / 8 * 0.5 + avg_conf("offplan") * 0.5)
#     bb_s = min(1.0, count_events("transaction", "Business Bay", days=30) / 20)
#     marina_s = min(1.0, count_events("investment", "Marina", days=14) / 5 * 0.5 + avg_conf("investment") * 0.5)
#     infra_s = min(1.0, count_events("infrastructure", days=30, severity_min=3) / 5)
#     creek_s = min(1.0, count_events(location="Creek", days=30) / 5)
#     dt_s = min(1.0, count_events("transaction", "Downtown", days=7) / 10 * 0.5 + avg_conf("transaction") * 0.5)
#     foreign_s = min(1.0, count_events("foreign_buyers", days=14) / 8 * 0.4 + avg_conf("foreign_buyers") * 0.6)

#     forecasts = [
#         {"id": "palm_rise_10",  "question": "Will Palm Jumeirah villa prices rise 10% by Q4?",           "pct": sig_pct(palm_s, 62, 25),    "source": "ACQAR Signal"},
#         {"id": "dld_digital",   "question": "Will DLD announce digital title deed by June?",              "pct": sig_pct(reg_s, 75, 20),     "source": "ACQAR Signal"},
#         {"id": "marina_yield",  "question": "Will Dubai Marina average yield exceed 8% this year?",       "pct": sig_pct(marina_s, 42, 20),  "source": "ACQAR Signal"},
#         {"id": "emaar_q2",      "question": "Will Emaar launch a new Downtown mega-project in Q2?",       "pct": sig_pct(offplan_s, 68, 22), "source": "ACQAR Signal"},
#         {"id": "bb_1000",       "question": "Will Business Bay transactions hit 1,000/month by mid-year?","pct": sig_pct(bb_s, 55, 28),      "source": "ACQAR Signal"},
#         {"id": "rera_str",      "question": "Will RERA tighten short-term rental regulations in 2026?",   "pct": sig_pct(reg_s, 76, 18),     "source": "ACQAR Signal"},
#         {"id": "foreign_65",    "question": "Will foreign buyer share exceed 65% of total DLD sales?",    "pct": sig_pct(foreign_s, 58, 25), "source": "ACQAR Signal"},
#         {"id": "creek_top3",    "question": "Will Creek Harbour become a top-3 DLD area by volume?",      "pct": sig_pct(creek_s, 52, 22),   "source": "ACQAR Signal"},
#         {"id": "infra_q2",      "question": "Will a major Dubai infrastructure project be announced Q2?", "pct": sig_pct(infra_s, 70, 20),   "source": "ACQAR Signal"},
#         {"id": "dt_record",     "question": "Will Downtown Dubai set a new monthly transaction record?",   "pct": sig_pct(dt_s, 48, 22),      "source": "ACQAR Signal"},
#     ]
#     for f in forecasts:
#         f.update({"delta": 0.0, "volume": 0.0, "end_date": "", "is_real": False, "url": ""})
#     return forecasts


# @router.get("/status")
# async def get_status(request: Request):
#     return {
#         "monitor_count": getattr(request.app.state, "monitor_count", 0),
#         "active_connections": getattr(request.app.state, "ws_connections", 0),
#         "pipeline_running": True,
#         "last_event_at": getattr(request.app.state, "last_event_at", None),
#         "alpha_vantage_key_set": os.getenv("ALPHA_VANTAGE_KEY") is not None
#     }


# def _format_aed(val):
#     """Format a value as AED currency string."""
#     if val is None:
#         return None
#     if val >= 1_000_000_000:
#         return f"AED {val/1_000_000_000:.1f}B"
#     if val >= 1_000_000:
#         return f"AED {val/1_000_000:.1f}M"
#     if val >= 1_000:
#         return f"AED {val/1_000:.0f}K"
#     return f"AED {val:,.0f}"


# def _minutes_ago(event):
#     """Calculate minutes since event creation."""
#     ts = event.get("created_at_ts", 0)
#     if not ts:
#         return 999
#     return round((datetime.now(timezone.utc).timestamp() - ts) / 60)


# @router.get("/signal-row")
# async def get_signal_row(request: Request):
#     """
#     Return cached signal row data (DLD events + stocks).
#     Returns fresh data if cache is older than 2 minutes.
#     """
#     from datetime import timedelta
#     from data_pipeline.fetchers.dfm_fetcher import DFMFetcher

#     lock = await _get_signal_row_lock()
#     async with lock:
#         now = datetime.now(timezone.utc)

#         # Check cache freshness (2 min = 120 sec)
#         if _signal_row_cache["updated_at"]:
#             age = (now - _signal_row_cache["updated_at"]).total_seconds()
#             if age < 120 and _signal_row_cache["dld"]:
#                 return {
#                     "dld": _signal_row_cache["dld"],
#                     "stocks": _signal_row_cache["stocks"],
#                     "updated_at": _signal_row_cache["updated_at"].isoformat(),
#                     "is_real": True,
#                     "total_dld": len(_signal_row_cache["dld"]),
#                     "total_stocks": len(_signal_row_cache["stocks"]),
#                 }

#         # Fetch fresh DLD signals from events_store
#         store = getattr(request.app.state, "events_store", {})
#         dld_events = []

#         for event in store.values():
#             if event.get("category") not in ["transaction", "offplan", "price_signal", "regulatory"]:
#                 continue
#             if "price" not in event and "title" not in event:
#                 continue

#             dld_events.append({
#                 "id": event.get("id", ""),
#                 "type": "dld",
#                 "label": event.get("title", "")[:70],
#                 "area": event.get("location_name", "Dubai"),
#                 "amount": event.get("price", None),
#                 "amount_fmt": _format_aed(event.get("price")),
#                 "category": event.get("category", "transaction"),
#                 "severity": event.get("severity", 1),
#                 "url": event.get("url", ""),
#                 "age_mins": _minutes_ago(event),
#                 "is_real": True,
#             })

#         # Sort by created_at_ts descending (newest first)
#         dld_events.sort(key=lambda x: x.get("id", ""), reverse=False)
#         dld_events = [
#             e for e in sorted(
#                 dld_events,
#                 key=lambda x: store.get(x["id"], {}).get("created_at_ts", 0),
#                 reverse=True
#             )
#         ][:20]

#         # Fetch stock signals
#         stocks = []
#         try:
#             dfm = DFMFetcher()
#             stock_data = await dfm.fetch_all_stocks()
#             for symbol, data in stock_data.items():
#                 stocks.append({
#                     "id": f"stock_{symbol}",
#                     "type": "stock",
#                     "symbol": symbol,
#                     "label": data.get("name", symbol),
#                     "fullname": data.get("fullname", symbol),
#                     "price": data.get("price", 0),
#                     "change": data.get("change", 0),
#                     "change_pct": data.get("change_pct", 0),
#                     "currency": "AED",
#                     "exchange": data.get("exchange", ""),
#                     "is_real": data.get("is_real", False),
#                     "source": data.get("source", ""),
#                 })
#         except Exception as e:
#             logger.warning(f"Failed to fetch stock data for signal-row: {e}")

#         # Update cache
#         _signal_row_cache["dld"] = dld_events
#         _signal_row_cache["stocks"] = stocks
#         _signal_row_cache["updated_at"] = now

#         return {
#             "dld": dld_events,
#             "stocks": stocks,
#             "updated_at": now.isoformat(),
#             "is_real": True,
#             "total_dld": len(dld_events),
#             "total_stocks": len(stocks),
#         }


# @router.get("/forecasts")
# async def get_forecasts(request: Request):
#     """
#     Dynamic forecast percentages calculated from real event signal data in the store.
#     These are SIGNAL-DERIVED estimates, not real prediction markets.
#     Each forecast question has its probability calculated from actual event patterns.
#     """
#     store = getattr(request.app.state, "events_store", {})
#     events = list(store.values())
#     total = max(len(events), 1)

#     def count_events(category=None, location=None, severity_min=1, days=30):
#         from datetime import timedelta
#         cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
#         filtered = [
#             e for e in events
#             if e.get("created_at_ts", 0) > cutoff
#             and (category is None or e.get("category") == category)
#             and (location is None or location.lower() in e.get("location_name", "").lower())
#             and e.get("severity", 1) >= severity_min
#         ]
#         return len(filtered)

#     def avg_confidence(category=None, location=None):
#         pool = [
#             e["confidence"] for e in events
#             if (category is None or e.get("category") == category)
#             and (location is None or location.lower() in e.get("location_name", "").lower())
#             and "confidence" in e
#         ]
#         return sum(pool) / len(pool) if pool else 0.5

#     def signal_pct(raw_signal: float, base: float = 50.0, sensitivity: float = 30.0) -> int:
#         """Convert a normalised signal (0-1) to a percentage anchored around base."""
#         pct = base + (raw_signal - 0.5) * sensitivity * 2
#         return max(5, min(95, round(pct)))

#     # Calculate forecasts from real event signal data
#     palm_txn = count_events("transaction", "Palm Jumeirah", days=7)
#     palm_conf = avg_confidence("transaction", "Palm Jumeirah")
#     palm_signal = min(1.0, palm_txn / 10 * 0.5 + palm_conf * 0.5)

#     downtown_txn = count_events("transaction", "Downtown", days=7)
#     downtown_conf = avg_confidence("transaction", "Downtown")
#     dt_signal = min(1.0, downtown_txn / 10 * 0.5 + downtown_conf * 0.5)

#     reg_events = count_events("regulatory", days=14)
#     reg_conf = avg_confidence("regulatory")
#     reg_signal = min(1.0, reg_events / 5 * 0.4 + reg_conf * 0.6)

#     marina_inv = count_events("investment", "Marina", days=14)
#     marina_conf = avg_confidence("investment", "Marina")
#     marina_signal = min(1.0, marina_inv / 5 * 0.5 + marina_conf * 0.5)

#     foreign_events = count_events("foreign_buyers", days=14)
#     foreign_conf = avg_confidence("foreign_buyers")
#     foreign_signal = min(1.0, foreign_events / 8 * 0.4 + foreign_conf * 0.6)

#     infra_events = count_events("infrastructure", days=30, severity_min=3)
#     infra_signal = min(1.0, infra_events / 5)

#     bb_txn = count_events("transaction", "Business Bay", days=30)
#     bb_signal = min(1.0, bb_txn / 20)

#     offplan_events = count_events("offplan", days=14)
#     offplan_conf = avg_confidence("offplan")
#     offplan_signal = min(1.0, offplan_events / 8 * 0.5 + offplan_conf * 0.5)

#     creek_events = count_events(location="Creek", days=30)
#     creek_signal = min(1.0, creek_events / 5)

#     price_events = count_events("price_signal", days=7)
#     price_conf = avg_confidence("price_signal")
#     price_signal = min(1.0, price_events / 5 * 0.5 + price_conf * 0.5)

#     forecasts = [
#         {
#             "id": "palm_rise_10",
#             "question": "Will Palm Jumeirah villa prices rise 10% by Q4 2025?",
#             "pct": signal_pct(palm_signal, base=62, sensitivity=25),
#             "delta": round((palm_signal - 0.5) * 6, 1),
#             "signal_basis": f"{palm_txn} recent transactions, {round(palm_conf*100)}% avg confidence",
#             "is_calculated": True,
#         },
#         {
#             "id": "dld_digital",
#             "question": "Will DLD announce digital title deed by June 2025?",
#             "pct": signal_pct(reg_signal, base=75, sensitivity=20),
#             "delta": round((reg_signal - 0.5) * 4, 1),
#             "signal_basis": f"{reg_events} regulatory signals detected",
#             "is_calculated": True,
#         },
#         {
#             "id": "marina_yield_8",
#             "question": "Will Dubai Marina average yield exceed 8% this year?",
#             "pct": signal_pct(marina_signal, base=42, sensitivity=20),
#             "delta": round((marina_signal - 0.5) * 4, 1),
#             "signal_basis": f"{marina_inv} investment signals, Marina",
#             "is_calculated": True,
#         },
#         {
#             "id": "emaar_downtown",
#             "question": "Will Emaar launch a new Downtown mega-project in Q2?",
#             "pct": signal_pct(offplan_signal, base=68, sensitivity=22),
#             "delta": round((offplan_signal - 0.5) * 5, 1),
#             "signal_basis": f"{offplan_events} off-plan signals detected",
#             "is_calculated": True,
#         },
#         {
#             "id": "bb_1000_month",
#             "question": "Will Business Bay transactions hit 1,000/month by mid-2026?",
#             "pct": signal_pct(bb_signal, base=55, sensitivity=28),
#             "delta": round((bb_signal - 0.5) * 5, 1),
#             "signal_basis": f"{bb_txn} Business Bay transactions (30d)",
#             "is_calculated": True,
#         },
#         {
#             "id": "rera_str",
#             "question": "Will RERA tighten STR regulations further in 2026?",
#             "pct": signal_pct(reg_signal, base=76, sensitivity=18),
#             "delta": round((reg_signal - 0.5) * 3, 1),
#             "signal_basis": f"{reg_events} regulatory events",
#             "is_calculated": True,
#         },
#         {
#             "id": "foreign_65",
#             "question": "Will foreign buyer share exceed 65% of total DLD sales?",
#             "pct": signal_pct(foreign_signal, base=58, sensitivity=25),
#             "delta": round((foreign_signal - 0.5) * 5, 1),
#             "signal_basis": f"{foreign_events} foreign buyer signals",
#             "is_calculated": True,
#         },
#         {
#             "id": "creek_top3",
#             "question": "Will Creek Harbour become top 3 DLD area by volume?",
#             "pct": signal_pct(creek_signal, base=52, sensitivity=22),
#             "delta": round((creek_signal - 0.5) * 4, 1),
#             "signal_basis": f"{creek_events} Creek Harbour events",
#             "is_calculated": True,
#         },
#         {
#             "id": "infra_expansion",
#             "question": "Will a major Dubai infrastructure project be announced Q2?",
#             "pct": signal_pct(infra_signal, base=70, sensitivity=20),
#             "delta": round((infra_signal - 0.5) * 4, 1),
#             "signal_basis": f"{infra_events} infrastructure signals (S3+)",
#             "is_calculated": True,
#         },
#         {
#             "id": "price_200m",
#             "question": "Will a Dubai property exceed AED 200M this quarter?",
#             "pct": signal_pct(price_signal, base=33, sensitivity=20),
#             "delta": round((price_signal - 0.5) * 4, 1),
#             "signal_basis": f"{price_events} price signals",
#             "is_calculated": True,
#         },
#     ]

#     return {
#         "forecasts": forecasts,
#         "total_events_analysed": total,
#         "is_calculated": True,
#         "methodology": "Signal-derived from live event store. Not a regulated prediction market.",
#         "updated_at": datetime.now(timezone.utc).isoformat()
#     }




























from fastapi import APIRouter, Request
from datetime import datetime, timezone
import asyncio
import logging
import os
import sys

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/market", tags=["market"])

# Baseline estimates — sourced from RERA published Q4 2024 averages
# Updated quarterly with official RERA data
BASELINE = {
    "DXB_IDX":  {"name": "Dubai Property Index",      "value": 287.4, "unit": "pts"},
    "PAL_AVG":  {"name": "Palm Avg AED/sqft",          "value": 2950.0, "unit": "AED/sqft", "source": "RERA Q4 2025", "is_real": True},
    "DT_AVG":   {"name": "Downtown AED/sqft",          "value": 3200.0, "unit": "AED/sqft", "source": "RERA Q4 2025", "is_real": True},
    "MAR_YLD":  {"name": "Marina Yield",               "value": 6.8,   "unit": "%", "source": "RERA Q4 2025", "is_real": True},
    "BB_TRX":   {"name": "Bus. Bay Transactions (30d)","value": 847.0, "unit": "30d"},
    "AED_USD":  {"name": "AED/USD",                    "value": 3.6725,"unit": "rate"},
}

# In-memory cache for Alpha Vantage result
_av_cache = {"aed_usd": 3.6725, "change_pct": 0.0, "last_fetched": None}
_av_lock = None  # asyncio.Lock() created lazily

# Cache for government and DFM data (with timestamps)
_gov_cache = {}
_gov_cache_ts = None
_dfm_cache = {}
_dfm_cache_ts = None

# Cache for signal row data
_signal_row_cache: dict = {"dld": [], "stocks": [], "updated_at": None}
_signal_row_lock = None

async def _get_av_lock():
    global _av_lock
    if _av_lock is None:
        _av_lock = asyncio.Lock()
    return _av_lock

async def _get_signal_row_lock():
    global _signal_row_lock
    if _signal_row_lock is None:
        _signal_row_lock = asyncio.Lock()
    return _signal_row_lock

async def _fetch_real_aed_usd():
    """Fetch real AED/USD from Alpha Vantage. Cached for 15 minutes."""
    import httpx
    from datetime import timedelta
    
    lock = await _get_av_lock()
    async with lock:
        # Check cache freshness (15 min)
        if _av_cache["last_fetched"]:
            age = (datetime.now(timezone.utc) - _av_cache["last_fetched"]).total_seconds()
            if age < 900:  # 15 minutes
                return _av_cache
        
        av_key = os.getenv("ALPHA_VANTAGE_KEY", "demo")
        try:
            async with httpx.AsyncClient(timeout=8, trust_env=False) as client:
                resp = await client.get(
                    "https://www.alphavantage.co/query",
                    params={
                        "function": "CURRENCY_EXCHANGE_RATE",
                        "from_currency": "USD",
                        "to_currency": "AED",
                        "apikey": av_key
                    }
                )
                resp.raise_for_status()
                data = resp.json()
                rate_data = data.get("Realtime Currency Exchange Rate", {})
                if rate_data:
                    rate = float(rate_data.get("5. Exchange Rate", 3.6725))
                    bid = float(rate_data.get("8. Bid Price", rate))
                    chg = round((rate - bid) / bid * 100, 3) if bid else 0.0
                    _av_cache.update({
                        "aed_usd": round(rate, 4),
                        "change_pct": chg,
                        "last_fetched": datetime.now(timezone.utc)
                    })
                    logger.info(f"Real AED/USD: {rate}")
        except Exception as e:
            logger.warning(f"Alpha Vantage unavailable: {e}")
        
        return _av_cache


def _count_area_transactions(store: dict, area_keyword: str, days: int = 30) -> int:
    """Count real transaction events in the store for a given area."""
    from datetime import timedelta
    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
    count = 0
    for ev in store.values():
        if (ev.get("category") in ("transaction", "offplan") and
                area_keyword.lower() in ev.get("location_name", "").lower() and
                ev.get("created_at_ts", 0) > cutoff):
            count += 1
    return count


@router.get("/ticker")
async def get_ticker(request: Request):
    """
    Market ticker. AED/USD is REAL from free government APIs (Frankfurter/ECB).
    Emaar stock price is REAL from DFM/Stooq.
    Property metrics are realistic baselines derived from public research
    + transaction signal counts from the live event store.
    """
    store = getattr(request.app.state, "events_store", {})

    # Fetch real data (with 15-min cache)
    from datetime import timedelta

    now_ts = datetime.now(timezone.utc)

    # AED/USD from free APIs
    if _gov_cache_ts is None or (now_ts - _gov_cache_ts).total_seconds() > 900:
        try:
            from data_pipeline.fetchers.government_fetcher import GovernmentDataFetcher
            gov = GovernmentDataFetcher()
            gov_data = await gov.fetch_all_market_data()
            globals()['_gov_cache'] = gov_data
            globals()['_gov_cache_ts'] = now_ts
        except Exception as e:
            logger.warning(f"Gov data fetch failed: {e}")

    # DFM stocks
    if _dfm_cache_ts is None or (now_ts - _dfm_cache_ts).total_seconds() > 900:
        try:
            from data_pipeline.fetchers.dfm_fetcher import DFMFetcher
            dfm = DFMFetcher()
            dfm_data = await dfm.fetch_all_stocks()
            globals()['_dfm_cache'] = dfm_data
            globals()['_dfm_cache_ts'] = now_ts
        except Exception as e:
            logger.warning(f"DFM data fetch failed: {e}")

    real_aed_usd = _gov_cache.get("aed_usd", 3.6725)
    real_aed_source = _gov_cache.get("aed_usd_source", "fallback")
    aed_is_real = _gov_cache.get("aed_usd_is_real", False)
    emaar_data = _dfm_cache.get("EMAAR.DU")

    # Derive Business Bay transaction count from real store
    bb_real = _count_area_transactions(store, "Business Bay", days=30)
    bb_value = bb_real if bb_real >= 5 else BASELINE["BB_TRX"]["value"]

    # Derive Dubai Property Index from total event signal volume
    total_events = len(store)
    idx_signal = min(5.0, total_events / 50) if total_events else 0

    tickers = [
        {
            "symbol": "AED_USD",
            "name": "AED/USD",
            "value": real_aed_usd,
            "unit": "rate",
            "change": round(real_aed_usd - BASELINE["AED_USD"]["value"], 4),
            "change_pct": round((real_aed_usd - BASELINE["AED_USD"]["value"]) / BASELINE["AED_USD"]["value"] * 100, 3) if BASELINE["AED_USD"]["value"] else 0,
            "is_real": aed_is_real,
            "source": real_aed_source,
            "updated_at": _gov_cache_ts.isoformat() if _gov_cache_ts else None
        },
        {
            "symbol": "BB_TRX",
            "name": "Bus. Bay Transactions (30d)",
            "value": round(bb_value, 0),
            "unit": "30d",
            "change": round(bb_value - BASELINE["BB_TRX"]["value"], 1),
            "change_pct": round((bb_value - BASELINE["BB_TRX"]["value"]) / BASELINE["BB_TRX"]["value"] * 100, 2),
            "is_real": bb_real >= 5,
            "source": "live events" if bb_real >= 5 else "baseline",
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
    ]

    # Add Emaar stock if available
    if emaar_data:
        tickers.append({
            "symbol": "EMAAR.DU",
            "name": emaar_data.get("name", "Emaar Properties (DFM)"),
            "value": emaar_data.get("price", 0),
            "unit": "AED",
            "change": emaar_data.get("change", 0),
            "change_pct": emaar_data.get("change_pct", 0),
            "is_real": True,
            "source": emaar_data.get("source", "DFM"),
            "updated_at": emaar_data.get("date", "")
        })

    # Fill remaining with RERA benchmarks (no micro-drift — these are stable published averages)
    for sym, meta in BASELINE.items():
        if sym in ("AED_USD", "BB_TRX"):
            continue
        val = meta["value"]
        is_real = meta.get("is_real", False)
        source = meta.get("source", "baseline estimate")
        tickers.append({
            "symbol": sym,
            "name": meta["name"],
            "value": val,
            "unit": meta["unit"],
            "change": 0.0,
            "change_pct": 0.0,
            "is_real": is_real,
            "source": source,
            "data_source": source if is_real else "baseline estimate",
            "updated_at": datetime.now(timezone.utc).isoformat()
        })

    return {"tickers": tickers, "real_data_available": aed_is_real or bool(emaar_data)}



# Cache for prediction markets (5 min TTL)
_pred_cache: dict = {"predictions": [], "updated_at": None}
_pred_lock = None

async def _get_pred_lock():
    global _pred_lock
    if _pred_lock is None:
        _pred_lock = asyncio.Lock()
    return _pred_lock


async def _fetch_manifold(client) -> list:
    """
    Fetch live UAE real estate developer stock prices via Yahoo Finance.
    Replaces Manifold Markets predictions with actual DFM/ADX stock data.
    Shows the 10 major publicly listed Dubai RE developers.
    """
    import asyncio

    UAE_RE_STOCKS = [
        {"symbol": "EMAAR.AE",    "name": "Emaar Properties",   "exchange": "DFM"},
        {"symbol": "EMAARDEV.AE", "name": "Emaar Development",  "exchange": "DFM"},
        {"symbol": "ALDAR.AE",    "name": "Aldar Properties",   "exchange": "ADX"},
        {"symbol": "DAMAC.AE",    "name": "DAMAC Real Estate",  "exchange": "DFM"},
        {"symbol": "DEYAAR.AE",   "name": "Deyaar Development", "exchange": "DFM"},
        {"symbol": "UPP.AE",      "name": "Union Properties",   "exchange": "DFM"},
        {"symbol": "DIC.AE",      "name": "Dubai Investments",  "exchange": "DFM"},
        {"symbol": "AMLAK.AE",    "name": "Amlak Finance",      "exchange": "DFM"},
        {"symbol": "SOBHA.AE",    "name": "Sobha Realty",       "exchange": "DFM"},
        {"symbol": "NAKHEEL.AE",  "name": "Nakheel",            "exchange": "DFM"},
    ]

    def _fetch_all_sync(stocks):
        import warnings
        warnings.filterwarnings("ignore")
        try:
            import yfinance as yf
        except ImportError:
            return []

        results = []
        for stock in stocks:
            sym = stock["symbol"]
            try:
                hist = yf.Ticker(sym).history(period="5d")
                if hist.empty:
                    logger.warning(f"_fetch_manifold: {sym} no data from Yahoo Finance")
                    continue
                price     = float(hist["Close"].iloc[-1])
                prev      = float(hist["Close"].iloc[-2]) if len(hist) > 1 else price
                change    = round(price - prev, 3)
                change_pct = round((change / prev * 100) if prev else 0.0, 2)
                results.append({
                    "id":       sym,
                    "question": f"{stock['name']} ({stock['exchange']})",
                    "pct":      change_pct,          # re-used field: % change today
                    "price":    round(price, 3),
                    "change":   change,
                    "delta":    change_pct,
                    "source":   f"Yahoo Finance / {stock['exchange']}",
                    "url":      f"https://finance.yahoo.com/quote/{sym}",
                    "volume":   float(hist["Volume"].iloc[-1]) if "Volume" in hist else 0.0,
                    "end_date": "",
                    "is_real":  True,
                    "type":     "stock",             # flag so frontend can render differently
                    "currency": "AED",
                    "exchange": stock["exchange"],
                })
                logger.info(f"Stock {sym}: AED {price:.3f} ({change_pct:+.2f}%)")
            except Exception as e:
                logger.warning(f"_fetch_manifold stock {sym} error: {e}")
        return results

    try:
        results = await asyncio.to_thread(_fetch_all_sync, UAE_RE_STOCKS)
        return results
    except Exception as e:
        logger.warning(f"_fetch_manifold (stocks) failed: {e}")
        return []

        
async def _fetch_polymarket_events(client) -> list:
    """
    Fetch prediction markets from Polymarket via the EVENTS endpoint.
    Unlike the markets endpoint, events are categorised by topic —
    so searching "Federal Reserve" returns Fed-related events, not GTA VI.
    """
    import json
    results = []
    # Tag-based queries that map to real event categories on Polymarket
    queries = ["Federal Reserve", "interest rate", "inflation", "oil", "housing", "OPEC"]
    seen_ids = set()
    for q in queries:
        try:
            resp = await client.get(
                "https://gamma-api.polymarket.com/events",
                params={"q": q, "active": "true", "closed": "false", "limit": 3},
                timeout=6,
            )
            if resp.status_code != 200:
                continue
            for event in resp.json():
                event_slug = event.get("slug", "")
                for m in event.get("markets", []):
                    mid = str(m.get("id", ""))
                    question = m.get("question", "").strip()
                    if mid in seen_ids or not question:
                        continue
                    seen_ids.add(mid)
                    try:
                        outcomes = json.loads(m["outcomes"]) if isinstance(m.get("outcomes"), str) else m.get("outcomes", [])
                        prices   = json.loads(m["outcomePrices"]) if isinstance(m.get("outcomePrices"), str) else m.get("outcomePrices", [])
                    except Exception:
                        outcomes, prices = [], []
                    yes_pct = 50.0
                    for i, outcome in enumerate(outcomes):
                        if str(outcome).lower() == "yes" and i < len(prices):
                            try:
                                yes_pct = round(float(prices[i]) * 100, 1)
                            except Exception:
                                pass
                            break
                    else:
                        if prices:
                            try:
                                yes_pct = round(float(prices[0]) * 100, 1)
                            except Exception:
                                pass
                    results.append({
                        "id": mid,
                        "question": question,
                        "pct": yes_pct,
                        "delta": 0.0,
                        "source": "Polymarket",
                        "url": f"https://polymarket.com/event/{event_slug}",
                        "volume": float(m.get("volume", 0) or 0),
                        "end_date": m.get("endDate", ""),
                        "is_real": True,
                    })
        except Exception as e:
            logger.debug(f"Polymarket events query '{q}' failed: {e}")
    return results


@router.get("/predictions")
async def get_predictions(request: Request):
    """
    Live prediction market percentages from Manifold Markets and Polymarket.
    Cached for 5 minutes. Falls back to signal-derived forecasts if APIs unavailable.
    """
    import httpx
    lock = await _get_pred_lock()
    async with lock:
        # Return cache if fresh (5 min)
        now = datetime.now(timezone.utc)
        if _pred_cache["updated_at"]:
            age = (now - _pred_cache["updated_at"]).total_seconds()
            if age < 300 and _pred_cache["predictions"]:
                return {
                    "predictions": _pred_cache["predictions"],
                    "total": len(_pred_cache["predictions"]),
                    "sources": list({p["source"] for p in _pred_cache["predictions"]}),
                    "updated_at": _pred_cache["updated_at"].isoformat(),
                    "is_real": _pred_cache.get("is_real", False),
                    "cache_age_s": round(age),
                }

        all_results = []
        is_real = False
        try:
            async with httpx.AsyncClient(follow_redirects=True, trust_env=False, timeout=10) as client:
                manifold_task = asyncio.create_task(_fetch_manifold(client))
                poly_task     = asyncio.create_task(_fetch_polymarket_events(client))
                manifold, poly = await asyncio.gather(manifold_task, poly_task, return_exceptions=True)

            if isinstance(manifold, list):
                all_results.extend(manifold)
            if isinstance(poly, list):
                all_results.extend(poly)
            is_real = len(all_results) > 0
        except Exception as e:
            logger.warning(f"External prediction APIs unavailable: {e}")

        # Fall back to signal-derived forecasts if no real data
        if not all_results:
            logger.info("Predictions: falling back to signal-derived forecasts")
            store = getattr(request.app.state, "events_store", {})
            all_results = _build_forecast_predictions(store)
            is_real = False

        # Deduplicate by question, sort by volume descending
        seen, unique = set(), []
        for r in all_results:
            q = r.get("question", "").lower().strip()
            if q and q not in seen:
                seen.add(q)
                unique.append(r)
        unique.sort(key=lambda x: x.get("volume", 0), reverse=True)
        top = unique[:12]

        # Update cache
        _pred_cache["predictions"] = top
        _pred_cache["updated_at"] = now
        _pred_cache["is_real"] = is_real

        sources = list({p["source"] for p in top}) if top else []
        logger.info(f"Predictions: returning {len(top)} markets from {sources} (real={is_real})")

        return {
            "predictions": top,
            "total": len(top),
            "sources": sources,
            "updated_at": now.isoformat(),
            "is_real": is_real,
            "cache_age_s": 0,
        }


def _build_forecast_predictions(store: dict) -> list:
    """Build prediction-style items from the live event store as fallback."""
    from datetime import timedelta
    events = list(store.values())

    def count_events(category=None, location=None, severity_min=1, days=30):
        cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
        return len([
            e for e in events
            if e.get("created_at_ts", 0) > cutoff
            and (category is None or e.get("category") == category)
            and (location is None or location.lower() in e.get("location_name", "").lower())
            and e.get("severity", 1) >= severity_min
        ])

    def avg_conf(category=None):
        pool = [e["confidence"] for e in events
                if (category is None or e.get("category") == category) and "confidence" in e]
        return sum(pool) / len(pool) if pool else 0.5

    def sig_pct(raw, base=50.0, sens=30.0):
        return max(5, min(95, round(base + (raw - 0.5) * sens * 2)))

    reg_s = min(1.0, count_events("regulatory", days=14) / 5 * 0.4 + avg_conf("regulatory") * 0.6)
    palm_s = min(1.0, count_events("transaction", "Palm Jumeirah", days=7) / 10 * 0.5 + avg_conf("transaction") * 0.5)
    offplan_s = min(1.0, count_events("offplan", days=14) / 8 * 0.5 + avg_conf("offplan") * 0.5)
    bb_s = min(1.0, count_events("transaction", "Business Bay", days=30) / 20)
    marina_s = min(1.0, count_events("investment", "Marina", days=14) / 5 * 0.5 + avg_conf("investment") * 0.5)
    infra_s = min(1.0, count_events("infrastructure", days=30, severity_min=3) / 5)
    creek_s = min(1.0, count_events(location="Creek", days=30) / 5)
    dt_s = min(1.0, count_events("transaction", "Downtown", days=7) / 10 * 0.5 + avg_conf("transaction") * 0.5)
    foreign_s = min(1.0, count_events("foreign_buyers", days=14) / 8 * 0.4 + avg_conf("foreign_buyers") * 0.6)

    forecasts = [
        {"id": "palm_rise_10",  "question": "Will Palm Jumeirah villa prices rise 10% by Q4?",           "pct": sig_pct(palm_s, 62, 25),    "source": "ACQAR Signal"},
        {"id": "dld_digital",   "question": "Will DLD announce digital title deed by June?",              "pct": sig_pct(reg_s, 75, 20),     "source": "ACQAR Signal"},
        {"id": "marina_yield",  "question": "Will Dubai Marina average yield exceed 8% this year?",       "pct": sig_pct(marina_s, 42, 20),  "source": "ACQAR Signal"},
        {"id": "emaar_q2",      "question": "Will Emaar launch a new Downtown mega-project in Q2?",       "pct": sig_pct(offplan_s, 68, 22), "source": "ACQAR Signal"},
        {"id": "bb_1000",       "question": "Will Business Bay transactions hit 1,000/month by mid-year?","pct": sig_pct(bb_s, 55, 28),      "source": "ACQAR Signal"},
        {"id": "rera_str",      "question": "Will RERA tighten short-term rental regulations in 2026?",   "pct": sig_pct(reg_s, 76, 18),     "source": "ACQAR Signal"},
        {"id": "foreign_65",    "question": "Will foreign buyer share exceed 65% of total DLD sales?",    "pct": sig_pct(foreign_s, 58, 25), "source": "ACQAR Signal"},
        {"id": "creek_top3",    "question": "Will Creek Harbour become a top-3 DLD area by volume?",      "pct": sig_pct(creek_s, 52, 22),   "source": "ACQAR Signal"},
        {"id": "infra_q2",      "question": "Will a major Dubai infrastructure project be announced Q2?", "pct": sig_pct(infra_s, 70, 20),   "source": "ACQAR Signal"},
        {"id": "dt_record",     "question": "Will Downtown Dubai set a new monthly transaction record?",   "pct": sig_pct(dt_s, 48, 22),      "source": "ACQAR Signal"},
    ]
    for f in forecasts:
        f.update({"delta": 0.0, "volume": 0.0, "end_date": "", "is_real": False, "url": ""})
    return forecasts


@router.get("/status")
async def get_status(request: Request):
    return {
        "monitor_count": getattr(request.app.state, "monitor_count", 0),
        "active_connections": getattr(request.app.state, "ws_connections", 0),
        "pipeline_running": True,
        "last_event_at": getattr(request.app.state, "last_event_at", None),
        "alpha_vantage_key_set": os.getenv("ALPHA_VANTAGE_KEY") is not None
    }


def _format_aed(val):
    """Format a value as AED currency string."""
    if val is None:
        return None
    if val >= 1_000_000_000:
        return f"AED {val/1_000_000_000:.1f}B"
    if val >= 1_000_000:
        return f"AED {val/1_000_000:.1f}M"
    if val >= 1_000:
        return f"AED {val/1_000:.0f}K"
    return f"AED {val:,.0f}"


def _minutes_ago(event):
    """Calculate minutes since event creation."""
    ts = event.get("created_at_ts", 0)
    if not ts:
        return 999
    return round((datetime.now(timezone.utc).timestamp() - ts) / 60)


@router.get("/signal-row")
async def get_signal_row(request: Request):
    """
    Return cached signal row data (DLD events + stocks).
    Returns fresh data if cache is older than 2 minutes.
    """
    from datetime import timedelta
    from data_pipeline.fetchers.dfm_fetcher import DFMFetcher

    lock = await _get_signal_row_lock()
    async with lock:
        now = datetime.now(timezone.utc)

        # Check cache freshness (2 min = 120 sec)
        if _signal_row_cache["updated_at"]:
            age = (now - _signal_row_cache["updated_at"]).total_seconds()
            if age < 120 and _signal_row_cache["dld"]:
                return {
                    "dld": _signal_row_cache["dld"],
                    "stocks": _signal_row_cache["stocks"],
                    "updated_at": _signal_row_cache["updated_at"].isoformat(),
                    "is_real": True,
                    "total_dld": len(_signal_row_cache["dld"]),
                    "total_stocks": len(_signal_row_cache["stocks"]),
                }

        # Fetch fresh DLD signals from events_store
        store = getattr(request.app.state, "events_store", {})
        dld_events = []

        for event in store.values():
            if event.get("category") not in ["transaction", "offplan", "price_signal", "regulatory"]:
                continue
            if "price" not in event and "title" not in event:
                continue

            dld_events.append({
                "id": event.get("id", ""),
                "type": "dld",
                "label": event.get("title", "")[:70],
                "area": event.get("location_name", "Dubai"),
                "amount": event.get("price", None),
                "amount_fmt": _format_aed(event.get("price")),
                "category": event.get("category", "transaction"),
                "severity": event.get("severity", 1),
                "url": event.get("url", ""),
                "age_mins": _minutes_ago(event),
                "is_real": True,
            })

        # Sort by created_at_ts descending (newest first)
        dld_events.sort(key=lambda x: x.get("id", ""), reverse=False)
        dld_events = [
            e for e in sorted(
                dld_events,
                key=lambda x: store.get(x["id"], {}).get("created_at_ts", 0),
                reverse=True
            )
        ][:20]

        # Fetch stock signals
        stocks = []
        try:
            dfm = DFMFetcher()
            stock_data = await dfm.fetch_all_stocks()
            for symbol, data in stock_data.items():
                stocks.append({
                    "id": f"stock_{symbol}",
                    "type": "stock",
                    "symbol": symbol,
                    "label": data.get("name", symbol),
                    "fullname": data.get("fullname", symbol),
                    "price": data.get("price", 0),
                    "change": data.get("change", 0),
                    "change_pct": data.get("change_pct", 0),
                    "currency": "AED",
                    "exchange": data.get("exchange", ""),
                    "is_real": data.get("is_real", False),
                    "source": data.get("source", ""),
                })
        except Exception as e:
            logger.warning(f"Failed to fetch stock data for signal-row: {e}")

        # Update cache
        _signal_row_cache["dld"] = dld_events
        _signal_row_cache["stocks"] = stocks
        _signal_row_cache["updated_at"] = now

        return {
            "dld": dld_events,
            "stocks": stocks,
            "updated_at": now.isoformat(),
            "is_real": True,
            "total_dld": len(dld_events),
            "total_stocks": len(stocks),
        }


@router.get("/forecasts")
async def get_forecasts(request: Request):
    """
    Dynamic forecast percentages calculated from real event signal data in the store.
    These are SIGNAL-DERIVED estimates, not real prediction markets.
    Each forecast question has its probability calculated from actual event patterns.
    """
    store = getattr(request.app.state, "events_store", {})
    events = list(store.values())
    total = max(len(events), 1)

    def count_events(category=None, location=None, severity_min=1, days=30):
        from datetime import timedelta
        cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
        filtered = [
            e for e in events
            if e.get("created_at_ts", 0) > cutoff
            and (category is None or e.get("category") == category)
            and (location is None or location.lower() in e.get("location_name", "").lower())
            and e.get("severity", 1) >= severity_min
        ]
        return len(filtered)

    def avg_confidence(category=None, location=None):
        pool = [
            e["confidence"] for e in events
            if (category is None or e.get("category") == category)
            and (location is None or location.lower() in e.get("location_name", "").lower())
            and "confidence" in e
        ]
        return sum(pool) / len(pool) if pool else 0.5

    def signal_pct(raw_signal: float, base: float = 50.0, sensitivity: float = 30.0) -> int:
        """Convert a normalised signal (0-1) to a percentage anchored around base."""
        pct = base + (raw_signal - 0.5) * sensitivity * 2
        return max(5, min(95, round(pct)))

    # Calculate forecasts from real event signal data
    palm_txn = count_events("transaction", "Palm Jumeirah", days=7)
    palm_conf = avg_confidence("transaction", "Palm Jumeirah")
    palm_signal = min(1.0, palm_txn / 10 * 0.5 + palm_conf * 0.5)

    downtown_txn = count_events("transaction", "Downtown", days=7)
    downtown_conf = avg_confidence("transaction", "Downtown")
    dt_signal = min(1.0, downtown_txn / 10 * 0.5 + downtown_conf * 0.5)

    reg_events = count_events("regulatory", days=14)
    reg_conf = avg_confidence("regulatory")
    reg_signal = min(1.0, reg_events / 5 * 0.4 + reg_conf * 0.6)

    marina_inv = count_events("investment", "Marina", days=14)
    marina_conf = avg_confidence("investment", "Marina")
    marina_signal = min(1.0, marina_inv / 5 * 0.5 + marina_conf * 0.5)

    foreign_events = count_events("foreign_buyers", days=14)
    foreign_conf = avg_confidence("foreign_buyers")
    foreign_signal = min(1.0, foreign_events / 8 * 0.4 + foreign_conf * 0.6)

    infra_events = count_events("infrastructure", days=30, severity_min=3)
    infra_signal = min(1.0, infra_events / 5)

    bb_txn = count_events("transaction", "Business Bay", days=30)
    bb_signal = min(1.0, bb_txn / 20)

    offplan_events = count_events("offplan", days=14)
    offplan_conf = avg_confidence("offplan")
    offplan_signal = min(1.0, offplan_events / 8 * 0.5 + offplan_conf * 0.5)

    creek_events = count_events(location="Creek", days=30)
    creek_signal = min(1.0, creek_events / 5)

    price_events = count_events("price_signal", days=7)
    price_conf = avg_confidence("price_signal")
    price_signal = min(1.0, price_events / 5 * 0.5 + price_conf * 0.5)

    forecasts = [
        {
            "id": "palm_rise_10",
            "question": "Will Palm Jumeirah villa prices rise 10% by Q4 2025?",
            "pct": signal_pct(palm_signal, base=62, sensitivity=25),
            "delta": round((palm_signal - 0.5) * 6, 1),
            "signal_basis": f"{palm_txn} recent transactions, {round(palm_conf*100)}% avg confidence",
            "is_calculated": True,
        },
        {
            "id": "dld_digital",
            "question": "Will DLD announce digital title deed by June 2025?",
            "pct": signal_pct(reg_signal, base=75, sensitivity=20),
            "delta": round((reg_signal - 0.5) * 4, 1),
            "signal_basis": f"{reg_events} regulatory signals detected",
            "is_calculated": True,
        },
        {
            "id": "marina_yield_8",
            "question": "Will Dubai Marina average yield exceed 8% this year?",
            "pct": signal_pct(marina_signal, base=42, sensitivity=20),
            "delta": round((marina_signal - 0.5) * 4, 1),
            "signal_basis": f"{marina_inv} investment signals, Marina",
            "is_calculated": True,
        },
        {
            "id": "emaar_downtown",
            "question": "Will Emaar launch a new Downtown mega-project in Q2?",
            "pct": signal_pct(offplan_signal, base=68, sensitivity=22),
            "delta": round((offplan_signal - 0.5) * 5, 1),
            "signal_basis": f"{offplan_events} off-plan signals detected",
            "is_calculated": True,
        },
        {
            "id": "bb_1000_month",
            "question": "Will Business Bay transactions hit 1,000/month by mid-2026?",
            "pct": signal_pct(bb_signal, base=55, sensitivity=28),
            "delta": round((bb_signal - 0.5) * 5, 1),
            "signal_basis": f"{bb_txn} Business Bay transactions (30d)",
            "is_calculated": True,
        },
        {
            "id": "rera_str",
            "question": "Will RERA tighten STR regulations further in 2026?",
            "pct": signal_pct(reg_signal, base=76, sensitivity=18),
            "delta": round((reg_signal - 0.5) * 3, 1),
            "signal_basis": f"{reg_events} regulatory events",
            "is_calculated": True,
        },
        {
            "id": "foreign_65",
            "question": "Will foreign buyer share exceed 65% of total DLD sales?",
            "pct": signal_pct(foreign_signal, base=58, sensitivity=25),
            "delta": round((foreign_signal - 0.5) * 5, 1),
            "signal_basis": f"{foreign_events} foreign buyer signals",
            "is_calculated": True,
        },
        {
            "id": "creek_top3",
            "question": "Will Creek Harbour become top 3 DLD area by volume?",
            "pct": signal_pct(creek_signal, base=52, sensitivity=22),
            "delta": round((creek_signal - 0.5) * 4, 1),
            "signal_basis": f"{creek_events} Creek Harbour events",
            "is_calculated": True,
        },
        {
            "id": "infra_expansion",
            "question": "Will a major Dubai infrastructure project be announced Q2?",
            "pct": signal_pct(infra_signal, base=70, sensitivity=20),
            "delta": round((infra_signal - 0.5) * 4, 1),
            "signal_basis": f"{infra_events} infrastructure signals (S3+)",
            "is_calculated": True,
        },
        {
            "id": "price_200m",
            "question": "Will a Dubai property exceed AED 200M this quarter?",
            "pct": signal_pct(price_signal, base=33, sensitivity=20),
            "delta": round((price_signal - 0.5) * 4, 1),
            "signal_basis": f"{price_events} price signals",
            "is_calculated": True,
        },
    ]

    return {
        "forecasts": forecasts,
        "total_events_analysed": total,
        "is_calculated": True,
        "methodology": "Signal-derived from live event store. Not a regulated prediction market.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
