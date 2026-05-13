# """
# UAE Real Estate Stock Fetcher.
# Uses yfinance for DFM-listed stocks available on Yahoo Finance (.AE suffix).
# Confirmed working: EMAAR.AE, EMAARDEV.AE, DEYAAR.AE, UPP.AE
# ALDAR (ADX) and DAMAC (not on YF) use calibrated last-known prices with
# intraday micro-drift so the ticker always shows movement.
# """
# import asyncio
# import logging
# import time
# import math
# from datetime import datetime, timezone
# from typing import Dict

# logger = logging.getLogger(__name__)

# # ---------------------------------------------------------------------------
# # Symbol registry
# # live=True  -> fetched from Yahoo Finance (yfinance)
# # live=False -> calibrated estimate with intraday sine-wave drift
# # ---------------------------------------------------------------------------
# TRACKED_STOCKS = {
#     "EMAAR.AE": {
#         "name": "Emaar", "fullname": "Emaar Properties",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     "EMAARDEV.AE": {
#         "name": "EmaarDev", "fullname": "Emaar Development",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     "DEYAAR.AE": {
#         "name": "Deyaar", "fullname": "Deyaar Development",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     "UPP.AE": {
#         "name": "Union P.", "fullname": "Union Properties",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     # ADX / not available on Yahoo Finance — calibrated estimates
#     "ALDAR": {
#         "name": "Aldar", "fullname": "Aldar Properties",
#         "currency": "AED", "exchange": "ADX",
#         "live": False, "base_price": 3.18,
#     },
#     "DAMAC": {
#         "name": "DAMAC", "fullname": "DAMAC Real Estate",
#         "currency": "AED", "exchange": "DFM",
#         "live": False, "base_price": 0.41,
#     },
# }

# _cache: Dict = {}
# _cache_ts: float = 0.0
# _CACHE_TTL = 300  # 5 minutes between full yfinance fetches


# def _micro_drift(symbol: str, base: float):
#     """Return (price, change_pct) with a slow sine-wave intraday drift."""
#     phase = (hash(symbol) % 1000) / 1000.0
#     cycle = math.sin(time.time() / 14400 * 2 * math.pi + phase * 2 * math.pi)
#     drift_pct = cycle * 0.8   # ±0.8 % amplitude
#     price = round(base * (1 + drift_pct / 100), 3)
#     return price, round(drift_pct, 2)


# def _fetch_yfinance_sync(symbols: list) -> Dict:
#     """Blocking yfinance call — always run via asyncio.to_thread."""
#     import warnings
#     warnings.filterwarnings("ignore")
#     try:
#         import yfinance as yf
#     except ImportError:
#         logger.warning("yfinance not installed; install it with: pip install yfinance")
#         return {}

#     results = {}
#     for sym in symbols:
#         meta = TRACKED_STOCKS.get(sym, {})
#         try:
#             hist = yf.Ticker(sym).history(period="5d")
#             if hist.empty:
#                 logger.warning(f"{sym}: no history returned by Yahoo Finance")
#                 continue
#             price = float(hist["Close"].iloc[-1])
#             prev  = float(hist["Close"].iloc[-2]) if len(hist) > 1 else price
#             change     = round(price - prev, 4)
#             change_pct = round((change / prev * 100) if prev else 0.0, 2)
#             results[sym] = {
#                 "symbol":     sym,
#                 "name":       meta.get("name", sym),
#                 "fullname":   meta.get("fullname", sym),
#                 "price":      round(price, 3),
#                 "change":     change,
#                 "change_pct": change_pct,
#                 "currency":   meta.get("currency", "AED"),
#                 "exchange":   meta.get("exchange", "DFM"),
#                 "is_real":    True,
#                 "source":     "Yahoo Finance / DFM",
#                 "fetched_at": datetime.now(timezone.utc).isoformat(),
#             }
#             logger.info(f"{sym}: AED {price:.3f} ({change_pct:+.2f}%)")
#         except Exception as e:
#             logger.warning(f"{sym} yfinance error: {e}")
#     return results


# class DFMFetcher:
#     """Fetches UAE real estate stock prices."""

#     async def fetch_all_stocks(self) -> Dict:
#         global _cache, _cache_ts

#         now = time.time()
#         if _cache and (now - _cache_ts) < _CACHE_TTL:
#             # Serve cache but refresh drift for estimated stocks
#             result = dict(_cache)
#             for sym, meta in TRACKED_STOCKS.items():
#                 if not meta.get("live") and sym in result:
#                     p, dp = _micro_drift(sym, meta["base_price"])
#                     result[sym] = {**result[sym], "price": p, "change_pct": dp}
#             return result

#         # Full refresh — fetch live symbols in a thread
#         live_syms = [s for s, m in TRACKED_STOCKS.items() if m.get("live")]
#         try:
#             live_data = await asyncio.to_thread(_fetch_yfinance_sync, live_syms)
#         except Exception as e:
#             logger.warning(f"yfinance thread failed: {e}")
#             live_data = {}

#         result = dict(live_data)

#         # Add calibrated estimates for non-YF symbols
#         for sym, meta in TRACKED_STOCKS.items():
#             if not meta.get("live"):
#                 p, dp = _micro_drift(sym, meta["base_price"])
#                 result[sym] = {
#                     "symbol":     sym,
#                     "name":       meta["name"],
#                     "fullname":   meta["fullname"],
#                     "price":      p,
#                     "change":     round(p - meta["base_price"], 4),
#                     "change_pct": dp,
#                     "currency":   meta.get("currency", "AED"),
#                     "exchange":   meta.get("exchange", "DFM"),
#                     "is_real":    False,
#                     "source":     "Calibrated estimate",
#                     "fetched_at": datetime.now(timezone.utc).isoformat(),
#                 }

#         _cache    = result
#         _cache_ts = now
#         logger.info(
#             f"DFMFetcher: {len(live_data)} live + "
#             f"{len(result) - len(live_data)} estimated"
#         )
#         return result











# """
# UAE Real Estate Stock Fetcher.
# Uses yfinance for DFM-listed stocks available on Yahoo Finance (.AE suffix).
# Confirmed working: EMAAR.AE, EMAARDEV.AE, DEYAAR.AE, UPP.AE
# ALDAR (ADX) and DAMAC (not on YF) use calibrated last-known prices with
# intraday micro-drift so the ticker always shows movement.
# """
# import asyncio
# import logging
# import time
# import math
# from datetime import datetime, timezone
# from typing import Dict

# logger = logging.getLogger(__name__)

# # ---------------------------------------------------------------------------
# # Symbol registry
# # live=True  -> fetched from Yahoo Finance (yfinance)
# # live=False -> calibrated estimate with intraday sine-wave drift
# # ---------------------------------------------------------------------------
# TRACKED_STOCKS = {
#     # ── Live via Yahoo Finance (.AE suffix) ──────────────────────────────
#     "EMAAR.AE": {
#         "name": "Emaar", "fullname": "Emaar Properties",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     "EMAARDEV.AE": {
#         "name": "EmaarDev", "fullname": "Emaar Development",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     "DEYAAR.AE": {
#         "name": "Deyaar", "fullname": "Deyaar Development",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     "UPP.AE": {
#         "name": "Union P.", "fullname": "Union Properties",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     "ALDAR.AE": {
#         "name": "Aldar", "fullname": "Aldar Properties",
#         "currency": "AED", "exchange": "ADX", "live": True,
#     },
#     "DIC.AE": {
#         "name": "Dubai Inv.", "fullname": "Dubai Investments",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     "AMLAK.AE": {
#         "name": "Amlak", "fullname": "Amlak Finance",
#         "currency": "AED", "exchange": "DFM", "live": True,
#     },
#     # ── Calibrated estimates (not on Yahoo Finance) ──────────────────────
#     "DAMAC": {
#         "name": "DAMAC", "fullname": "DAMAC Real Estate",
#         "currency": "AED", "exchange": "DFM",
#         "live": False, "base_price": 0.41,
#     },
#     "NAKHEEL": {
#         "name": "Nakheel", "fullname": "Nakheel PJSC",
#         "currency": "AED", "exchange": "DFM",
#         "live": False, "base_price": 1.85,
#     },
#     "SOBHA": {
#         "name": "Sobha", "fullname": "Sobha Realty",
#         "currency": "AED", "exchange": "DFM",
#         "live": False, "base_price": 1.22,
#     },
# }

# _cache: Dict = {}
# _cache_ts: float = 0.0
# _CACHE_TTL = 300  # 5 minutes between full yfinance fetches


# def _micro_drift(symbol: str, base: float):
#     """Return (price, change_pct) with a slow sine-wave intraday drift."""
#     phase = (hash(symbol) % 1000) / 1000.0
#     cycle = math.sin(time.time() / 14400 * 2 * math.pi + phase * 2 * math.pi)
#     drift_pct = cycle * 0.8   # ±0.8 % amplitude
#     price = round(base * (1 + drift_pct / 100), 3)
#     return price, round(drift_pct, 2)


# def _fetch_yfinance_sync(symbols: list) -> Dict:
#     """Blocking yfinance call — always run via asyncio.to_thread."""
#     import warnings
#     warnings.filterwarnings("ignore")
#     try:
#         import yfinance as yf
#     except ImportError:
#         logger.warning("yfinance not installed; install it with: pip install yfinance")
#         return {}

#     results = {}
#     for sym in symbols:
#         meta = TRACKED_STOCKS.get(sym, {})
#         try:
#             hist = yf.Ticker(sym).history(period="5d")
#             if hist.empty:
#                 logger.warning(f"{sym}: no history returned by Yahoo Finance")
#                 continue
#             price = float(hist["Close"].iloc[-1])
#             prev  = float(hist["Close"].iloc[-2]) if len(hist) > 1 else price
#             change     = round(price - prev, 4)
#             change_pct = round((change / prev * 100) if prev else 0.0, 2)
#             results[sym] = {
#                 "symbol":     sym,
#                 "name":       meta.get("name", sym),
#                 "fullname":   meta.get("fullname", sym),
#                 "price":      round(price, 3),
#                 "change":     change,
#                 "change_pct": change_pct,
#                 "currency":   meta.get("currency", "AED"),
#                 "exchange":   meta.get("exchange", "DFM"),
#                 "is_real":    True,
#                 "source":     f"Yahoo Finance / {meta.get('exchange', 'DFM')}",
#                 "fetched_at": datetime.now(timezone.utc).isoformat(),
#             }
#             logger.info(f"{sym}: AED {price:.3f} ({change_pct:+.2f}%)")
#         except Exception as e:
#             logger.warning(f"{sym} yfinance error: {e}")
#     return results


# class DFMFetcher:
#     """Fetches UAE real estate stock prices."""

#     async def fetch_all_stocks(self) -> Dict:
#         global _cache, _cache_ts

#         now = time.time()
#         if _cache and (now - _cache_ts) < _CACHE_TTL:
#             # Serve cache but refresh drift for estimated stocks
#             result = dict(_cache)
#             for sym, meta in TRACKED_STOCKS.items():
#                 if not meta.get("live") and sym in result:
#                     p, dp = _micro_drift(sym, meta["base_price"])
#                     result[sym] = {**result[sym], "price": p, "change_pct": dp}
#             return result

#         # Full refresh — fetch live symbols in a thread
#         live_syms = [s for s, m in TRACKED_STOCKS.items() if m.get("live")]
#         try:
#             live_data = await asyncio.to_thread(_fetch_yfinance_sync, live_syms)
#         except Exception as e:
#             logger.warning(f"yfinance thread failed: {e}")
#             live_data = {}

#         result = dict(live_data)

#         # Add calibrated estimates for non-YF symbols
#         for sym, meta in TRACKED_STOCKS.items():
#             if not meta.get("live"):
#                 p, dp = _micro_drift(sym, meta["base_price"])
#                 result[sym] = {
#                     "symbol":     sym,
#                     "name":       meta["name"],
#                     "fullname":   meta["fullname"],
#                     "price":      p,
#                     "change":     round(p - meta["base_price"], 4),
#                     "change_pct": dp,
#                     "currency":   meta.get("currency", "AED"),
#                     "exchange":   meta.get("exchange", "DFM"),
#                     "is_real":    False,
#                     "source":     "Calibrated estimate",
#                     "fetched_at": datetime.now(timezone.utc).isoformat(),
#                 }

#         _cache    = result
#         _cache_ts = now
#         logger.info(
#             f"DFMFetcher: {len(live_data)} live + "
#             f"{len(result) - len(live_data)} estimated"
#         )
#         return result

















# import asyncio
# import logging
# import time
# import math
# import os
# import httpx
# from datetime import datetime, timezone
# from typing import Dict

# logger = logging.getLogger(__name__)

# ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_KEY")

# TRACKED_STOCKS = {
#     "EMAAR.AE": {"name": "Emaar", "fullname": "Emaar Properties", "currency": "AED", "exchange": "DFM"},
#     "EMAARDEV.AE": {"name": "EmaarDev", "fullname": "Emaar Development", "currency": "AED", "exchange": "DFM"},
#     "DEYAAR.AE": {"name": "Deyaar", "fullname": "Deyaar Development", "currency": "AED", "exchange": "DFM"},
#     "UPP.AE": {"name": "Union P.", "fullname": "Union Properties", "currency": "AED", "exchange": "DFM"},
#     "ALDAR.AE": {"name": "Aldar", "fullname": "Aldar Properties", "currency": "AED", "exchange": "ADX"},
#     "DIC.AE": {"name": "Dubai Inv.", "fullname": "Dubai Investments", "currency": "AED", "exchange": "DFM"},
#     "DAMAC": {"name": "DAMAC", "fullname": "DAMAC Real Estate", "currency": "AED", "exchange": "DFM"},
#     "NAKHEEL": {"name": "Nakheel", "fullname": "Nakheel PJSC", "currency": "AED", "exchange": "DFM"},
#     "SOBHA": {"name": "Sobha", "fullname": "Sobha Realty", "currency": "AED", "exchange": "DFM"},
# }

# # Fallback base prices if API fails
# BASE_PRICES = {
#     "EMAAR.AE": 8.45, "EMAARDEV.AE": 4.20, "DEYAAR.AE": 0.72,
#     "UPP.AE": 0.38, "ALDAR.AE": 3.18, "DIC.AE": 2.85,
#     "DAMAC": 0.41, "NAKHEEL": 1.85, "SOBHA": 1.22,
# }

# _cache: Dict = {}
# _cache_ts: float = 0.0
# _CACHE_TTL = 300  # 5 minutes


# def _micro_drift(symbol: str, base: float):
#     phase = (hash(symbol) % 1000) / 1000.0
#     cycle = math.sin(time.time() / 14400 * 2 * math.pi + phase * 2 * math.pi)
#     drift_pct = cycle * 0.8
#     price = round(base * (1 + drift_pct / 100), 3)
#     return price, round(drift_pct, 2)


# async def _fetch_alpha_vantage(symbol: str, meta: dict) -> dict | None:
#     """Fetch single stock from Alpha Vantage."""
#     if not ALPHA_VANTAGE_KEY:
#         return None
#     try:
#         url = "https://www.alphavantage.co/query"
#         params = {
#             "function": "GLOBAL_QUOTE",
#             "symbol": symbol,
#             "apikey": ALPHA_VANTAGE_KEY,
#         }
#         async with httpx.AsyncClient(timeout=10) as client:
#             resp = await client.get(url, params=params)
#             data = resp.json()

#         quote = data.get("Global Quote", {})
#         price = float(quote.get("05. price", 0))
#         prev = float(quote.get("08. previous close", price))
#         change = round(price - prev, 4)
#         change_pct = round((change / prev * 100) if prev else 0.0, 2)

#         if price <= 0:
#             logger.warning(f"{symbol}: Alpha Vantage returned price 0")
#             return None

#         return {
#             "symbol": symbol,
#             "name": meta["name"],
#             "fullname": meta["fullname"],
#             "price": round(price, 3),
#             "change": change,
#             "change_pct": change_pct,
#             "currency": meta["currency"],
#             "exchange": meta["exchange"],
#             "is_real": True,
#             "source": "Alpha Vantage",
#             "fetched_at": datetime.now(timezone.utc).isoformat(),
#         }
#     except Exception as e:
#         logger.warning(f"{symbol} Alpha Vantage error: {e}")
#         return None


# def _fallback(symbol: str, meta: dict) -> dict:
#     """Return calibrated estimate when API fails."""
#     base = BASE_PRICES.get(symbol, 1.0)
#     p, dp = _micro_drift(symbol, base)
#     return {
#         "symbol": symbol,
#         "name": meta["name"],
#         "fullname": meta["fullname"],
#         "price": p,
#         "change": round(p - base, 4),
#         "change_pct": dp,
#         "currency": meta["currency"],
#         "exchange": meta["exchange"],
#         "is_real": False,
#         "source": "Calibrated estimate",
#         "fetched_at": datetime.now(timezone.utc).isoformat(),
#     }


# class DFMFetcher:
#     async def fetch_all_stocks(self) -> Dict:
#         global _cache, _cache_ts

#         now = time.time()
#         if _cache and (now - _cache_ts) < _CACHE_TTL:
#             # Refresh drift for estimated stocks in cache
#             result = dict(_cache)
#             for sym, meta in TRACKED_STOCKS.items():
#                 if sym in result and not result[sym]["is_real"]:
#                     p, dp = _micro_drift(sym, BASE_PRICES.get(sym, 1.0))
#                     result[sym] = {**result[sym], "price": p, "change_pct": dp}
#             return result

#         # Fetch all stocks concurrently from Alpha Vantage
#         tasks = [
#             _fetch_alpha_vantage(sym, meta)
#             for sym, meta in TRACKED_STOCKS.items()
#         ]
#         results_list = await asyncio.gather(*tasks, return_exceptions=True)

#         result = {}
#         live_count = 0
#         for sym, meta, data in zip(TRACKED_STOCKS.keys(), TRACKED_STOCKS.values(), results_list):
#             if isinstance(data, dict) and data:
#                 result[sym] = data
#                 live_count += 1
#             else:
#                 result[sym] = _fallback(sym, meta)

#         _cache = result
#         _cache_ts = now
#         logger.info(f"DFMFetcher: {live_count} live + {len(result) - live_count} estimated")
#         return result












# import asyncio
# import logging
# import time
# import math
# import os
# from datetime import datetime, timezone
# from typing import Dict

# logger = logging.getLogger(__name__)

# TRACKED_STOCKS = {
#     "EMAAR.AE":    {"name": "Emaar",     "fullname": "Emaar Properties",   "currency": "AED", "exchange": "DFM"},
#     "EMAARDEV.AE": {"name": "EmaarDev",  "fullname": "Emaar Development",  "currency": "AED", "exchange": "DFM"},
#     "DEYAAR.AE":   {"name": "Deyaar",    "fullname": "Deyaar Development", "currency": "AED", "exchange": "DFM"},
#     "UPP.AE":      {"name": "Union P.",  "fullname": "Union Properties",   "currency": "AED", "exchange": "DFM"},
#     "ALDAR.AE":    {"name": "Aldar",     "fullname": "Aldar Properties",   "currency": "AED", "exchange": "ADX"},
#     "DIC.AE":      {"name": "Dubai Inv.","fullname": "Dubai Investments",  "currency": "AED", "exchange": "DFM"},
#     "DAMAC.AE":    {"name": "DAMAC",     "fullname": "DAMAC Real Estate",  "currency": "AED", "exchange": "DFM"},
#     "NAKHEEL.AE":  {"name": "Nakheel",   "fullname": "Nakheel PJSC",       "currency": "AED", "exchange": "DFM"},
#     "SOBHA.AE":    {"name": "Sobha",     "fullname": "Sobha Realty",       "currency": "AED", "exchange": "DFM"},
# }

# BASE_PRICES = {
#     "EMAAR.AE": 8.45, "EMAARDEV.AE": 4.20, "DEYAAR.AE": 0.72,
#     "UPP.AE": 0.38,   "ALDAR.AE": 3.18,    "DIC.AE": 2.85,
#     "DAMAC.AE": 0.41, "NAKHEEL.AE": 1.85,  "SOBHA.AE": 1.22,
# }

# _cache: Dict = {}
# _cache_ts: float = 0.0
# _CACHE_TTL = 300  # 5 minutes


# def _micro_drift(symbol: str, base: float):
#     phase = (hash(symbol) % 1000) / 1000.0
#     cycle = math.sin(time.time() / 14400 * 2 * math.pi + phase * 2 * math.pi)
#     drift_pct = cycle * 0.8
#     price = round(base * (1 + drift_pct / 100), 3)
#     return price, round(drift_pct, 2)


# def _fetch_yahoo_sync(symbols: list) -> dict:
#     """Fetch real prices from Yahoo Finance using yfinance (sync)."""
#     try:
#         import yfinance as yf
#     except ImportError:
#         logger.warning("yfinance not installed — run: pip install yfinance")
#         return {}

#     results = {}
#     for symbol in symbols:
#         try:
#             ticker = yf.Ticker(symbol)
#             hist = ticker.history(period="5d")
#             if hist.empty:
#                 logger.warning(f"{symbol}: no data from Yahoo Finance")
#                 continue
#             price = float(hist["Close"].iloc[-1])
#             prev  = float(hist["Close"].iloc[-2]) if len(hist) > 1 else price
#             change = round(price - prev, 4)
#             change_pct = round((change / prev * 100) if prev else 0.0, 2)
#             results[symbol] = {"price": price, "change": change, "change_pct": change_pct}
#             logger.info(f"{symbol}: AED {price:.3f} ({change_pct:+.2f}%)")
#         except Exception as e:
#             logger.warning(f"{symbol} Yahoo Finance error: {e}")
#     return results


# def _fallback(symbol: str, meta: dict) -> dict:
#     base = BASE_PRICES.get(symbol, 1.0)
#     p, dp = _micro_drift(symbol, base)
#     return {
#         "symbol": symbol,
#         "name": meta["name"],
#         "fullname": meta["fullname"],
#         "price": p,
#         "change": round(p - base, 4),
#         "change_pct": dp,
#         "currency": meta["currency"],
#         "exchange": meta["exchange"],
#         "is_real": False,
#         "source": "Calibrated estimate",
#         "fetched_at": datetime.now(timezone.utc).isoformat(),
#     }


# class DFMFetcher:
#     async def fetch_all_stocks(self) -> Dict:
#         global _cache, _cache_ts

#         now = time.time()
#         if _cache and (now - _cache_ts) < _CACHE_TTL:
#             result = dict(_cache)
#             for sym, meta in TRACKED_STOCKS.items():
#                 if sym in result and not result[sym]["is_real"]:
#                     p, dp = _micro_drift(sym, BASE_PRICES.get(sym, 1.0))
#                     result[sym] = {**result[sym], "price": p, "change_pct": dp}
#             return result

#         # Fetch from Yahoo Finance in thread (yfinance is sync)
#         symbols = list(TRACKED_STOCKS.keys())
#         try:
#             yahoo_data = await asyncio.to_thread(_fetch_yahoo_sync, symbols)
#         except Exception as e:
#             logger.warning(f"Yahoo Finance thread failed: {e}")
#             yahoo_data = {}

#         result = {}
#         live_count = 0
#         for sym, meta in TRACKED_STOCKS.items():
#             if sym in yahoo_data:
#                 d = yahoo_data[sym]
#                 result[sym] = {
#                     "symbol": sym,
#                     "name": meta["name"],
#                     "fullname": meta["fullname"],
#                     "price": round(d["price"], 3),
#                     "change": d["change"],
#                     "change_pct": d["change_pct"],
#                     "currency": meta["currency"],
#                     "exchange": meta["exchange"],
#                     "is_real": True,
#                     "source": "Yahoo Finance",
#                     "fetched_at": datetime.now(timezone.utc).isoformat(),
#                 }
#                 live_count += 1
#             else:
#                 result[sym] = _fallback(sym, meta)

#         _cache = result
#         _cache_ts = now
#         logger.info(f"DFMFetcher: {live_count} live + {len(result) - live_count} estimated")
#         return result











import asyncio
import logging
import time
import math
import httpx
from datetime import datetime, timezone
from typing import Dict

logger = logging.getLogger(__name__)

TRACKED_STOCKS = {
    "EMAAR.AE":    {"name": "Emaar",      "fullname": "Emaar Properties",   "currency": "AED", "exchange": "DFM"},
    "EMAARDEV.AE": {"name": "EmaarDev",   "fullname": "Emaar Development",  "currency": "AED", "exchange": "DFM"},
    "DEYAAR.AE":   {"name": "Deyaar",     "fullname": "Deyaar Development", "currency": "AED", "exchange": "DFM"},
    "UPP.AE":      {"name": "Union P.",   "fullname": "Union Properties",   "currency": "AED", "exchange": "DFM"},
    "ALDAR.AE":    {"name": "Aldar",      "fullname": "Aldar Properties",   "currency": "AED", "exchange": "ADX"},
    "DIC.AE":      {"name": "Dubai Inv.", "fullname": "Dubai Investments",  "currency": "AED", "exchange": "DFM"},
    "DAMAC.AE":    {"name": "DAMAC",      "fullname": "DAMAC Real Estate",  "currency": "AED", "exchange": "DFM"},
    "NAKHEEL.AE":  {"name": "Nakheel",    "fullname": "Nakheel PJSC",       "currency": "AED", "exchange": "DFM"},
    "SOBHA.AE":    {"name": "Sobha",      "fullname": "Sobha Realty",       "currency": "AED", "exchange": "DFM"},
}

BASE_PRICES = {
    "EMAAR.AE": 8.45, "EMAARDEV.AE": 4.20, "DEYAAR.AE": 0.72,
    "UPP.AE": 0.38,   "ALDAR.AE": 3.18,    "DIC.AE": 2.85,
    "DAMAC.AE": 0.41, "NAKHEEL.AE": 1.85,  "SOBHA.AE": 1.22,
}

_cache: Dict = {}
_cache_ts: float = 0.0
_CACHE_TTL = 300  # 5 minutes

YAHOO_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://finance.yahoo.com/",
}


def _micro_drift(symbol: str, base: float):
    phase = (hash(symbol) % 1000) / 1000.0
    cycle = math.sin(time.time() / 14400 * 2 * math.pi + phase * 2 * math.pi)
    drift_pct = cycle * 0.8
    price = round(base * (1 + drift_pct / 100), 3)
    return price, round(drift_pct, 2)


async def _fetch_yahoo_price(client: httpx.AsyncClient, symbol: str) -> dict | None:
    """Fetch real price from Yahoo Finance v8 API using httpx."""
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
    try:
        resp = await client.get(
            url,
            params={"interval": "1d", "range": "5d"},
            headers=YAHOO_HEADERS,
            timeout=10,
        )
        if resp.status_code != 200:
            logger.warning(f"{symbol}: Yahoo returned {resp.status_code}")
            return None

        data = resp.json()
        result = data.get("chart", {}).get("result", [])
        if not result:
            logger.warning(f"{symbol}: no result in Yahoo response")
            return None

        meta = result[0].get("meta", {})
        price = meta.get("regularMarketPrice")
        prev  = meta.get("chartPreviousClose") or meta.get("previousClose")

        if not price:
            logger.warning(f"{symbol}: price missing in meta")
            return None

        price = round(float(price), 3)
        prev  = round(float(prev), 3) if prev else price
        change = round(price - prev, 4)
        change_pct = round((change / prev * 100) if prev else 0.0, 2)

        logger.info(f"{symbol}: AED {price:.3f} ({change_pct:+.2f}%)")
        return {"price": price, "change": change, "change_pct": change_pct}

    except Exception as e:
        logger.warning(f"{symbol} Yahoo fetch error: {e}")
        return None


def _fallback(symbol: str, meta: dict) -> dict:
    base = BASE_PRICES.get(symbol, 1.0)
    p, dp = _micro_drift(symbol, base)
    return {
        "symbol": symbol,
        "name": meta["name"],
        "fullname": meta["fullname"],
        "price": p,
        "change": round(p - base, 4),
        "change_pct": dp,
        "currency": meta["currency"],
        "exchange": meta["exchange"],
        "is_real": False,
        "source": "Calibrated estimate",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }


class DFMFetcher:
    async def fetch_all_stocks(self) -> Dict:
        global _cache, _cache_ts

        now = time.time()
        if _cache and (now - _cache_ts) < _CACHE_TTL:
            result = dict(_cache)
            for sym, meta in TRACKED_STOCKS.items():
                if sym in result and not result[sym]["is_real"]:
                    p, dp = _micro_drift(sym, BASE_PRICES.get(sym, 1.0))
                    result[sym] = {**result[sym], "price": p, "change_pct": dp}
            return result

        # Fetch all concurrently via httpx
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            tasks = {
                sym: _fetch_yahoo_price(client, sym)
                for sym in TRACKED_STOCKS
            }
            results_raw = await asyncio.gather(*tasks.values(), return_exceptions=True)

        yahoo_data = dict(zip(tasks.keys(), results_raw))

        result = {}
        live_count = 0

        for sym, meta in TRACKED_STOCKS.items():
            data = yahoo_data.get(sym)
            if isinstance(data, dict) and data:
                result[sym] = {
                    "symbol": sym,
                    "name": meta["name"],
                    "fullname": meta["fullname"],
                    "price": data["price"],
                    "change": data["change"],
                    "change_pct": data["change_pct"],
                    "currency": meta["currency"],
                    "exchange": meta["exchange"],
                    "is_real": True,
                    "source": "Yahoo Finance",
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                }
                live_count += 1
            else:
                result[sym] = _fallback(sym, meta)

        _cache = result
        _cache_ts = now
        logger.info(f"DFMFetcher: {live_count} live + {len(result) - live_count} estimated")
        return result
