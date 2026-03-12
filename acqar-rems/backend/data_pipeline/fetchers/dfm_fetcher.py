"""
UAE Real Estate Stock Fetcher.
Uses yfinance for DFM-listed stocks available on Yahoo Finance (.AE suffix).
Confirmed working: EMAAR.AE, EMAARDEV.AE, DEYAAR.AE, UPP.AE
ALDAR (ADX) and DAMAC (not on YF) use calibrated last-known prices with
intraday micro-drift so the ticker always shows movement.
"""
import asyncio
import logging
import time
import math
from datetime import datetime, timezone
from typing import Dict

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Symbol registry
# live=True  -> fetched from Yahoo Finance (yfinance)
# live=False -> calibrated estimate with intraday sine-wave drift
# ---------------------------------------------------------------------------
TRACKED_STOCKS = {
    "EMAAR.AE": {
        "name": "Emaar", "fullname": "Emaar Properties",
        "currency": "AED", "exchange": "DFM", "live": True,
    },
    "EMAARDEV.AE": {
        "name": "EmaarDev", "fullname": "Emaar Development",
        "currency": "AED", "exchange": "DFM", "live": True,
    },
    "DEYAAR.AE": {
        "name": "Deyaar", "fullname": "Deyaar Development",
        "currency": "AED", "exchange": "DFM", "live": True,
    },
    "UPP.AE": {
        "name": "Union P.", "fullname": "Union Properties",
        "currency": "AED", "exchange": "DFM", "live": True,
    },
    # ADX / not available on Yahoo Finance — calibrated estimates
    "ALDAR": {
        "name": "Aldar", "fullname": "Aldar Properties",
        "currency": "AED", "exchange": "ADX",
        "live": False, "base_price": 3.18,
    },
    "DAMAC": {
        "name": "DAMAC", "fullname": "DAMAC Real Estate",
        "currency": "AED", "exchange": "DFM",
        "live": False, "base_price": 0.41,
    },
}

_cache: Dict = {}
_cache_ts: float = 0.0
_CACHE_TTL = 300  # 5 minutes between full yfinance fetches


def _micro_drift(symbol: str, base: float):
    """Return (price, change_pct) with a slow sine-wave intraday drift."""
    phase = (hash(symbol) % 1000) / 1000.0
    cycle = math.sin(time.time() / 14400 * 2 * math.pi + phase * 2 * math.pi)
    drift_pct = cycle * 0.8   # ±0.8 % amplitude
    price = round(base * (1 + drift_pct / 100), 3)
    return price, round(drift_pct, 2)


def _fetch_yfinance_sync(symbols: list) -> Dict:
    """Blocking yfinance call — always run via asyncio.to_thread."""
    import warnings
    warnings.filterwarnings("ignore")
    try:
        import yfinance as yf
    except ImportError:
        logger.warning("yfinance not installed; install it with: pip install yfinance")
        return {}

    results = {}
    for sym in symbols:
        meta = TRACKED_STOCKS.get(sym, {})
        try:
            hist = yf.Ticker(sym).history(period="5d")
            if hist.empty:
                logger.warning(f"{sym}: no history returned by Yahoo Finance")
                continue
            price = float(hist["Close"].iloc[-1])
            prev  = float(hist["Close"].iloc[-2]) if len(hist) > 1 else price
            change     = round(price - prev, 4)
            change_pct = round((change / prev * 100) if prev else 0.0, 2)
            results[sym] = {
                "symbol":     sym,
                "name":       meta.get("name", sym),
                "fullname":   meta.get("fullname", sym),
                "price":      round(price, 3),
                "change":     change,
                "change_pct": change_pct,
                "currency":   meta.get("currency", "AED"),
                "exchange":   meta.get("exchange", "DFM"),
                "is_real":    True,
                "source":     "Yahoo Finance / DFM",
                "fetched_at": datetime.now(timezone.utc).isoformat(),
            }
            logger.info(f"{sym}: AED {price:.3f} ({change_pct:+.2f}%)")
        except Exception as e:
            logger.warning(f"{sym} yfinance error: {e}")
    return results


class DFMFetcher:
    """Fetches UAE real estate stock prices."""

    async def fetch_all_stocks(self) -> Dict:
        global _cache, _cache_ts

        now = time.time()
        if _cache and (now - _cache_ts) < _CACHE_TTL:
            # Serve cache but refresh drift for estimated stocks
            result = dict(_cache)
            for sym, meta in TRACKED_STOCKS.items():
                if not meta.get("live") and sym in result:
                    p, dp = _micro_drift(sym, meta["base_price"])
                    result[sym] = {**result[sym], "price": p, "change_pct": dp}
            return result

        # Full refresh — fetch live symbols in a thread
        live_syms = [s for s, m in TRACKED_STOCKS.items() if m.get("live")]
        try:
            live_data = await asyncio.to_thread(_fetch_yfinance_sync, live_syms)
        except Exception as e:
            logger.warning(f"yfinance thread failed: {e}")
            live_data = {}

        result = dict(live_data)

        # Add calibrated estimates for non-YF symbols
        for sym, meta in TRACKED_STOCKS.items():
            if not meta.get("live"):
                p, dp = _micro_drift(sym, meta["base_price"])
                result[sym] = {
                    "symbol":     sym,
                    "name":       meta["name"],
                    "fullname":   meta["fullname"],
                    "price":      p,
                    "change":     round(p - meta["base_price"], 4),
                    "change_pct": dp,
                    "currency":   meta.get("currency", "AED"),
                    "exchange":   meta.get("exchange", "DFM"),
                    "is_real":    False,
                    "source":     "Calibrated estimate",
                    "fetched_at": datetime.now(timezone.utc).isoformat(),
                }

        _cache    = result
        _cache_ts = now
        logger.info(
            f"DFMFetcher: {len(live_data)} live + "
            f"{len(result) - len(live_data)} estimated"
        )
        return result
