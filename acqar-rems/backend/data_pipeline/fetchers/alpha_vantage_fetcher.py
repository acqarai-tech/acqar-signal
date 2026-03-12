"""
Alpha Vantage fetcher for real AED/USD and UAE market data.
Free tier: 25 API calls/day. Sign up free at alphavantage.co
Set ALPHA_VANTAGE_KEY env var with your free key.
Falls back to cached/estimated values if unavailable.
"""
import httpx
import asyncio
import logging
import os
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger(__name__)

# Free key from alphavantage.co — user should replace with their own
AV_KEY = os.getenv("ALPHA_VANTAGE_KEY", "demo")
AV_BASE = "https://www.alphavantage.co/query"

# Last known good values (updated on each successful fetch)
_cache = {
    "aed_usd": 3.6725,
    "aed_usd_change_pct": 0.0,
    "last_updated": None,
}

async def fetch_aed_usd_rate() -> dict:
    """Fetch real-time USD/AED exchange rate from Alpha Vantage."""
    global _cache
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(AV_BASE, params={
                "function": "CURRENCY_EXCHANGE_RATE",
                "from_currency": "USD",
                "to_currency": "AED",
                "apikey": AV_KEY
            })
            resp.raise_for_status()
            data = resp.json()
            
            rate_data = data.get("Realtime Currency Exchange Rate", {})
            if not rate_data:
                logger.warning("Alpha Vantage returned no rate data, using cache")
                return _cache
            
            rate = float(rate_data.get("5. Exchange Rate", _cache["aed_usd"]))
            prev_close = float(rate_data.get("8. Bid Price", rate))
            change_pct = ((rate - prev_close) / prev_close * 100) if prev_close else 0.0
            
            _cache.update({
                "aed_usd": round(rate, 4),
                "aed_usd_change_pct": round(change_pct, 3),
                "last_updated": datetime.now(timezone.utc).isoformat(),
            })
            logger.info(f"AED/USD fetched: {rate}")
            return _cache
            
    except Exception as e:
        logger.warning(f"Alpha Vantage fetch failed: {e}, using cached value {_cache['aed_usd']}")
        return _cache

async def get_market_data() -> dict:
    """Return full market data bundle with real AED/USD and calculated RE metrics."""
    rate_data = await fetch_aed_usd_rate()
    return {
        "aed_usd": rate_data["aed_usd"],
        "aed_usd_change_pct": rate_data["aed_usd_change_pct"],
        "last_updated": rate_data.get("last_updated"),
        "source": "Alpha Vantage" if rate_data.get("last_updated") else "cached"
    }
