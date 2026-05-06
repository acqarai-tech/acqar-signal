# from fastapi import APIRouter, Query, HTTPException, Request
# from typing import Optional
# from datetime import datetime, timezone

# router = APIRouter(prefix="/api/events", tags=["events"])


# @router.get("/")
# async def get_events(
#     request: Request,
#     category: Optional[str] = None,
#     severity_min: int = Query(1, ge=1, le=5),
#     severity_max: int = Query(5, ge=1, le=5),
#     hours: int = Query(24, ge=1, le=168),
#     limit: int = Query(50, ge=1, le=200),
#     search: Optional[str] = None
# ):
#     """Get events with filtering"""
#     events = list(request.app.state.events_store.values())

#     # Filter by hours
#     cutoff = datetime.now(timezone.utc).timestamp() - (hours * 3600)
#     events = [e for e in events if e.get('created_at_ts', 0) > cutoff]

#     # Filter by category
#     if category:
#         events = [e for e in events if e.get('category') == category]

#     # Filter by severity
#     events = [e for e in events if severity_min <= e.get('severity', 1) <= severity_max]

#     # Search
#     if search:
#         search_lower = search.lower()
#         events = [e for e in events if
#                   search_lower in e.get('title', '').lower() or
#                   search_lower in e.get('location_name', '').lower()]

#     # Sort by created_at descending
#     events.sort(key=lambda x: x.get('created_at_ts', 0), reverse=True)

#     return {
#         "events": events[:limit],
#         "total": len(events),
#         "last_updated": datetime.now(timezone.utc).isoformat()
#     }


# @router.get("/stats")
# async def get_stats(request: Request):
#     """Get aggregate stats for the dashboard"""
#     events = list(request.app.state.events_store.values())

#     by_category = {}
#     by_severity = {}
#     for e in events:
#         cat = e.get('category', 'unknown')
#         sev = e.get('severity', 1)
#         by_category[cat] = by_category.get(cat, 0) + 1
#         by_severity[str(sev)] = by_severity.get(str(sev), 0) + 1

#     return {
#         "total_events": len(events),
#         "by_category": by_category,
#         "by_severity": by_severity,
#         "pipeline_status": request.app.state.pipeline_status
#     }


# @router.get("/area-momentum")
# async def get_area_momentum(request: Request):
#     """Areas with 3+ S3+ events = momentum areas"""
#     store = request.app.state.events_store
#     area_map: dict = {}
#     for event in store.values():
#         if event.get("severity", 0) >= 3:
#             area = event.get("location_name", "Unknown")
#             if area not in area_map:
#                 area_map[area] = {
#                     "area": area,
#                     "count": 0,
#                     "lat": event.get("lat"),
#                     "lng": event.get("lng"),
#                     "max_severity": 0,
#                 }
#             area_map[area]["count"] += 1
#             area_map[area]["max_severity"] = max(
#                 area_map[area]["max_severity"], event.get("severity", 0)
#             )
#     momentum = [v for v in area_map.values() if v["count"] >= 3]
#     momentum.sort(key=lambda x: x["count"], reverse=True)
#     return {"momentum_areas": momentum[:10]}


# @router.get("/community-signals")
# async def get_community_signals(request: Request, limit: int = Query(15, ge=1, le=50)):
#     """
#     Returns the latest events formatted as community signal messages.
#     Used by the frontend ChatPanel to show real event-derived signals
#     instead of hardcoded simulated messages.
#     """
#     store = request.app.state.events_store
#     events = list(store.values())
#     # Sort newest first
#     events.sort(key=lambda x: x.get("created_at_ts", 0), reverse=True)
#     events = events[:limit]

#     signals = []
#     for ev in events:
#         # Map category to emoji
#         cat_emoji = {
#             "transaction": "🏠", "offplan": "🏗️", "construction": "🔧",
#             "regulatory": "📋", "infrastructure": "🚇", "investment": "💰",
#             "price_signal": "📈", "freezone": "🏢", "rental_yield": "📡", "foreign_buyers": "🌍"
#         }.get(ev.get("category", ""), "📡")

#         # Build a natural-language signal text from the real event
#         title = ev.get("title", "")
#         location = ev.get("location_name", "Dubai")
#         price = ev.get("price_aed")
#         source = ev.get("source", "")
#         confidence = ev.get("confidence", 0.7)

#         price_str = f" — AED {price/1_000_000:.1f}M" if price and price >= 1_000_000 else ""
#         text = f"{cat_emoji} {title}{price_str}"
#         if len(text) > 120:
#             text = text[:117] + "..."

#         signals.append({
#             "event_id": ev.get("id"),
#             "text": text,
#             "location": location,
#             "source": source,
#             "source_url": ev.get("source_url", ev.get("url", "")),
#             "confidence": confidence,
#             "category": ev.get("category", "investment"),
#             "severity": ev.get("severity", 1),
#             "created_at_ts": ev.get("created_at_ts", 0),
#             "published_at": ev.get("created_at", ""),
#         })

#     return {"signals": signals, "total": len(signals)}


# @router.get("/{event_id}/signals")
# async def get_event_signals(event_id: str, request: Request):
#     """Get source signals for a specific event"""
#     event = request.app.state.events_store.get(event_id)
#     if not event:
#         raise HTTPException(status_code=404, detail="Event not found")
#     return {
#         "event_id": event_id,
#         "signals": event.get("signals", []),
#         "signal_count": event.get("signal_count", 1),
#         "confidence": event.get("confidence", 0),
#     }


# @router.get("/{event_id}")
# async def get_event(event_id: str, request: Request):
#     """Get a specific event by ID"""
#     event = request.app.state.events_store.get(event_id)
#     if not event:
#         raise HTTPException(status_code=404, detail="Event not found")
#     return event












# from fastapi import APIRouter, Query, HTTPException, Request
# from typing import Optional
# from datetime import datetime, timezone

# router = APIRouter(prefix="/api/events", tags=["events"])


# @router.get("/")
# async def get_events(
#     request: Request,
#     category: Optional[str] = None,
#     severity_min: int = Query(1, ge=1, le=5),
#     severity_max: int = Query(5, ge=1, le=5),
#     hours: int = Query(24, ge=1, le=168),
#     limit: int = Query(50, ge=1, le=200),
#     search: Optional[str] = None
# ):
#     """Get events with filtering"""
#     events = list(request.app.state.events_store.values())

#      # Exclude seed/demo events — real data only
#     events = [e for e in events if not e.get('is_seed') and not e.get('is_demo')]

#     # Filter by hours
#     cutoff = datetime.now(timezone.utc).timestamp() - (hours * 3600)
#     events = [e for e in events if e.get('created_at_ts', 0) > cutoff]

#     # Filter by category
#     if category:
#         events = [e for e in events if e.get('category') == category]

#     # Filter by severity
#     events = [e for e in events if severity_min <= e.get('severity', 1) <= severity_max]

#     # Search
#     if search:
#         search_lower = search.lower()
#         events = [e for e in events if
#                   search_lower in e.get('title', '').lower() or
#                   search_lower in e.get('location_name', '').lower()]

#     # Sort by created_at descending
#     events.sort(key=lambda x: x.get('created_at_ts', 0), reverse=True)

#     return {
#         "events": events[:limit],
#         "total": len(events),
#         "last_updated": datetime.now(timezone.utc).isoformat()
#     }


# @router.get("/stats")
# async def get_stats(request: Request):
#     """Get aggregate stats for the dashboard"""
#     events = list(request.app.state.events_store.values())

#     by_category = {}
#     by_severity = {}
#     for e in events:
#         cat = e.get('category', 'unknown')
#         sev = e.get('severity', 1)
#         by_category[cat] = by_category.get(cat, 0) + 1
#         by_severity[str(sev)] = by_severity.get(str(sev), 0) + 1

#     return {
#         "total_events": len(events),
#         "by_category": by_category,
#         "by_severity": by_severity,
#         "pipeline_status": request.app.state.pipeline_status
#     }

# @router.get("/fetch-article")
# async def fetch_article(url: str):
#     """Proxy fetch and extract article body text from a source URL"""
#     import httpx
#     import re
#     import base64

#     def decode_google_news_url(google_url: str) -> str:
#         """Extract real URL from Google News RSS link"""
#         try:
#             # Google News URLs contain the real URL encoded in the path
#             # Format: /rss/articles/BASE64_ENCODED_DATA
#             match = re.search(r'/articles/([^?]+)', google_url)
#             if not match:
#                 return google_url
            
#             encoded = match.group(1)
#             # Add padding if needed
#             padding = 4 - len(encoded) % 4
#             if padding != 4:
#                 encoded += '=' * padding
            
#             # Try to decode — Google encodes the URL in base64
#             try:
#                 decoded = base64.b64decode(encoded.replace('-', '+').replace('_', '/'))
#                 # Find URL pattern inside decoded bytes
#                 url_match = re.search(rb'https?://[^\x00-\x1f\x7f]+', decoded)
#                 if url_match:
#                     return url_match.group(0).decode('utf-8', errors='ignore').rstrip('\\')
#             except Exception:
#                 pass
            
#             return google_url
#         except Exception:
#             return google_url

#     try:
#         # ── Step 1: Resolve Google News URLs to real URL ──
#         real_url = url
#         if 'news.google.com' in url:
#             real_url = decode_google_news_url(url)
#             # If decode failed, try HTTP HEAD to follow redirect
#             if real_url == url:
#                 try:
#                     async with httpx.AsyncClient(timeout=10, follow_redirects=True,
#                         headers={"User-Agent": "Mozilla/5.0"}) as client:
#                         resp = await client.head(url)
#                         real_url = str(resp.url)
#                 except Exception:
#                     real_url = url

#         # ── Step 2: Fetch the real article ──
#         import re
#         async with httpx.AsyncClient(
#             timeout=15,
#             follow_redirects=True,
#             headers={
#                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
#                 "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
#                 "Accept-Language": "en-US,en;q=0.5",
#             }
#         ) as client:
#             resp = await client.get(real_url)
#             final_url = str(resp.url)
#             if resp.status_code != 200:
#                 return {"success": False, "content": "", "url": final_url}

#         html = resp.text

#         # Extract title
#         title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.S | re.I)
#         title = title_match.group(1).strip() if title_match else ""
#         title = re.sub(r'<[^>]+>', '', title)

#         # Remove noise
#         html = re.sub(r'<(script|style|nav|footer|header|aside|noscript)[^>]*>.*?</\1>', '', html, flags=re.S | re.I)

#         # Extract paragraphs
#         paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', html, flags=re.S | re.I)

#         def strip_tags(text):
#             text = re.sub(r'<[^>]+>', '', text)
#             text = text.replace('&nbsp;', ' ').replace('&amp;', '&') \
#                        .replace('&lt;', '<').replace('&gt;', '>') \
#                        .replace('&#39;', "'").replace('&quot;', '"')
#             return text.strip()

#         clean = [strip_tags(p) for p in paragraphs]
#         clean = [p for p in clean if len(p) > 60]
#         full_text = '\n\n'.join(clean[:20])

#         if not full_text:
#             return {"success": False, "content": "", "title": title, "url": final_url}

#         return {"success": True, "content": full_text, "title": title, "url": final_url}

#     except Exception as e:
#         return {"success": False, "content": "", "error": str(e), "url": url}
        
# @router.get("/area-momentum")
# async def get_area_momentum(request: Request):
#     """Areas with 3+ S3+ events = momentum areas"""
#     store = request.app.state.events_store
#     area_map: dict = {}
#     for event in store.values():
#         if event.get("severity", 0) >= 3:
#             area = event.get("location_name", "Unknown")
#             if area not in area_map:
#                 area_map[area] = {
#                     "area": area,
#                     "count": 0,
#                     "lat": event.get("lat"),
#                     "lng": event.get("lng"),
#                     "max_severity": 0,
#                 }
#             area_map[area]["count"] += 1
#             area_map[area]["max_severity"] = max(
#                 area_map[area]["max_severity"], event.get("severity", 0)
#             )
#     momentum = [v for v in area_map.values() if v["count"] >= 3]
#     momentum.sort(key=lambda x: x["count"], reverse=True)
#     return {"momentum_areas": momentum[:10]}


# @router.get("/community-signals")
# async def get_community_signals(request: Request, limit: int = Query(15, ge=1, le=50)):
#     """
#     Returns the latest events formatted as community signal messages.
#     Used by the frontend ChatPanel to show real event-derived signals
#     instead of hardcoded simulated messages.
#     """
#     store = request.app.state.events_store
#     events = list(store.values())
#     # Sort newest first
#     events.sort(key=lambda x: x.get("created_at_ts", 0), reverse=True)
#     events = events[:limit]

#     signals = []
#     for ev in events:
#         # Map category to emoji
#         cat_emoji = {
#             "transaction": "🏠", "offplan": "🏗️", "construction": "🔧",
#             "regulatory": "📋", "infrastructure": "🚇", "investment": "💰",
#             "price_signal": "📈", "freezone": "🏢", "rental_yield": "📡", "foreign_buyers": "🌍"
#         }.get(ev.get("category", ""), "📡")

#         # Build a natural-language signal text from the real event
#         title = ev.get("title", "")
#         location = ev.get("location_name", "Dubai")
#         price = ev.get("price_aed")
#         source = ev.get("source", "")
#         confidence = ev.get("confidence", 0.7)

#         price_str = f" — AED {price/1_000_000:.1f}M" if price and price >= 1_000_000 else ""
#         text = f"{cat_emoji} {title}{price_str}"
#         if len(text) > 120:
#             text = text[:117] + "..."

#         signals.append({
#             "event_id": ev.get("id"),
#             "text": text,
#             "location": location,
#             "source": source,
#             "source_url": ev.get("source_url", ev.get("url", "")),
#             "confidence": confidence,
#             "category": ev.get("category", "investment"),
#             "severity": ev.get("severity", 1),
#             "created_at_ts": ev.get("created_at_ts", 0),
#             "published_at": ev.get("created_at", ""),
#         })

#     return {"signals": signals, "total": len(signals)}


# @router.get("/{event_id}/signals")
# async def get_event_signals(event_id: str, request: Request):
#     """Get source signals for a specific event"""
#     event = request.app.state.events_store.get(event_id)
#     if not event:
#         raise HTTPException(status_code=404, detail="Event not found")
#     return {
#         "event_id": event_id,
#         "signals": event.get("signals", []),
#         "signal_count": event.get("signal_count", 1),
#         "confidence": event.get("confidence", 0),
#     }


# @router.get("/{event_id}")
# async def get_event(event_id: str, request: Request):
#     """Get a specific event by ID"""
#     event = request.app.state.events_store.get(event_id)
#     if not event:
#         raise HTTPException(status_code=404, detail="Event not found")
#     return event










from fastapi import APIRouter, Query, HTTPException, Request
from typing import Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("/")
async def get_events(
    request: Request,
    category: Optional[str] = None,
    severity_min: int = Query(1, ge=1, le=5),
    severity_max: int = Query(5, ge=1, le=5),
    hours: int = Query(24, ge=1, le=168),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = None
):
    """Get events with filtering"""
    events = list(request.app.state.events_store.values())

     # Exclude seed/demo events — real data only
    events = [e for e in events if not e.get('is_seed') and not e.get('is_demo')]

    # Filter by hours
    cutoff = datetime.now(timezone.utc).timestamp() - (hours * 3600)
    events = [e for e in events if e.get('created_at_ts', 0) > cutoff]

    # Filter by category
    if category:
        events = [e for e in events if e.get('category') == category]

    # Filter by severity
    events = [e for e in events if severity_min <= e.get('severity', 1) <= severity_max]

    # Search
    if search:
        search_lower = search.lower()
        events = [e for e in events if
                  search_lower in e.get('title', '').lower() or
                  search_lower in e.get('location_name', '').lower()]

    # Sort by created_at descending
    events.sort(key=lambda x: x.get('created_at_ts', 0), reverse=True)

    return {
        "events": events[:limit],
        "total": len(events),
        "last_updated": datetime.now(timezone.utc).isoformat()
    }


@router.get("/stats")
async def get_stats(request: Request):
    """Get aggregate stats for the dashboard"""
    events = list(request.app.state.events_store.values())

    by_category = {}
    by_severity = {}
    for e in events:
        cat = e.get('category', 'unknown')
        sev = e.get('severity', 1)
        by_category[cat] = by_category.get(cat, 0) + 1
        by_severity[str(sev)] = by_severity.get(str(sev), 0) + 1

    return {
        "total_events": len(events),
        "by_category": by_category,
        "by_severity": by_severity,
        "pipeline_status": request.app.state.pipeline_status
    }

@router.get("/fetch-article")
async def fetch_article(url: str):
    """Proxy fetch and extract article body text from a source URL"""
    import httpx
    import re
    import base64

    def decode_google_news_url(google_url: str) -> str:
        """Extract real URL from Google News RSS link"""
        try:
            # Google News URLs contain the real URL encoded in the path
            # Format: /rss/articles/BASE64_ENCODED_DATA
            match = re.search(r'/articles/([^?]+)', google_url)
            if not match:
                return google_url
            
            encoded = match.group(1)
            # Add padding if needed
            padding = 4 - len(encoded) % 4
            if padding != 4:
                encoded += '=' * padding
            
            # Try to decode — Google encodes the URL in base64
            try:
                decoded = base64.b64decode(encoded.replace('-', '+').replace('_', '/'))
                # Find URL pattern inside decoded bytes
                url_match = re.search(rb'https?://[^\x00-\x1f\x7f]+', decoded)
                if url_match:
                    return url_match.group(0).decode('utf-8', errors='ignore').rstrip('\\')
            except Exception:
                pass
            
            return google_url
        except Exception:
            return google_url

    try:
        # ── Step 1: Resolve Google News URLs to real URL ──
        real_url = url
        if 'news.google.com' in url:
            real_url = decode_google_news_url(url)
            # If decode failed, try HTTP HEAD to follow redirect
            if real_url == url:
                try:
                    async with httpx.AsyncClient(timeout=10, follow_redirects=True,
                        headers={"User-Agent": "Mozilla/5.0"}) as client:
                        resp = await client.head(url)
                        real_url = str(resp.url)
                except Exception:
                    real_url = url

        # ── Step 2: Fetch the real article ──
        import re
        async with httpx.AsyncClient(
            timeout=15,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            }
        ) as client:
            resp = await client.get(real_url)
            final_url = str(resp.url)
            if resp.status_code != 200:
                return {"success": False, "content": "", "url": final_url}

        html = resp.text

        # Extract title
        title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.S | re.I)
        title = title_match.group(1).strip() if title_match else ""
        title = re.sub(r'<[^>]+>', '', title)

        # Remove noise
        html = re.sub(r'<(script|style|nav|footer|header|aside|noscript)[^>]*>.*?</\1>', '', html, flags=re.S | re.I)

        # Extract paragraphs
        paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', html, flags=re.S | re.I)

        def strip_tags(text):
            text = re.sub(r'<[^>]+>', '', text)
            text = text.replace('&nbsp;', ' ').replace('&amp;', '&') \
                       .replace('&lt;', '<').replace('&gt;', '>') \
                       .replace('&#39;', "'").replace('&quot;', '"')
            return text.strip()

        clean = [strip_tags(p) for p in paragraphs]
        clean = [p for p in clean if len(p) > 60]
        full_text = '\n\n'.join(clean[:20])

        if not full_text:
            return {"success": False, "content": "", "title": title, "url": final_url}

        return {"success": True, "content": full_text, "title": title, "url": final_url}

    except Exception as e:
        return {"success": False, "content": "", "error": str(e), "url": url}
        
@router.get("/area-momentum")
async def get_area_momentum(request: Request):
    """Areas with 3+ S3+ events = momentum areas"""
    store = request.app.state.events_store
    area_map: dict = {}
    for event in store.values():
        if event.get("severity", 0) >= 3:
            area = event.get("location_name", "Unknown")
            if area not in area_map:
                area_map[area] = {
                    "area": area,
                    "count": 0,
                    "lat": event.get("lat"),
                    "lng": event.get("lng"),
                    "max_severity": 0,
                }
            area_map[area]["count"] += 1
            area_map[area]["max_severity"] = max(
                area_map[area]["max_severity"], event.get("severity", 0)
            )
    momentum = [v for v in area_map.values() if v["count"] >= 3]
    momentum.sort(key=lambda x: x["count"], reverse=True)
    return {"momentum_areas": momentum[:10]}


@router.get("/community-signals")
async def get_community_signals(request: Request, limit: int = Query(15, ge=1, le=50)):
    """
    Returns the latest events formatted as community signal messages.
    Used by the frontend ChatPanel to show real event-derived signals
    instead of hardcoded simulated messages.
    """
    store = request.app.state.events_store
    events = list(store.values())
    # Sort newest first
    events.sort(key=lambda x: x.get("created_at_ts", 0), reverse=True)
    events = events[:limit]

    signals = []
    for ev in events:
        # Map category to emoji
        cat_emoji = {
            "transaction": "🏠", "offplan": "🏗️", "construction": "🔧",
            "regulatory": "📋", "infrastructure": "🚇", "investment": "💰",
            "price_signal": "📈", "freezone": "🏢", "rental_yield": "📡", "foreign_buyers": "🌍"
        }.get(ev.get("category", ""), "📡")

        # Build a natural-language signal text from the real event
        title = ev.get("title", "")
        location = ev.get("location_name", "Dubai")
        price = ev.get("price_aed")
        source = ev.get("source", "")
        confidence = ev.get("confidence", 0.7)

        price_str = f" — AED {price/1_000_000:.1f}M" if price and price >= 1_000_000 else ""
        text = f"{cat_emoji} {title}{price_str}"
        if len(text) > 120:
            text = text[:117] + "..."

        signals.append({
            "event_id": ev.get("id"),
            "text": text,
            "location": location,
            "source": source,
            "source_url": ev.get("source_url", ev.get("url", "")),
            "confidence": confidence,
            "category": ev.get("category", "investment"),
            "severity": ev.get("severity", 1),
            "created_at_ts": ev.get("created_at_ts", 0),
            "published_at": ev.get("created_at", ""),
        })

    return {"signals": signals, "total": len(signals)}


 @router.get("/area-prices")
async def get_area_prices():
    from app.data_pipeline.fetchers.dld_fetcher import RERA_AREA_BENCHMARKS
    return {
        "areas": RERA_AREA_BENCHMARKS,
        "source": "RERA Published Averages Q4 2024"
    }


@router.get("/{event_id}/signals")
async def get_event_signals(event_id: str, request: Request):
    """Get source signals for a specific event"""
    event = request.app.state.events_store.get(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return {
        "event_id": event_id,
        "signals": event.get("signals", []),
        "signal_count": event.get("signal_count", 1),
        "confidence": event.get("confidence", 0),
    }


@router.get("/{event_id}")
async def get_event(event_id: str, request: Request):
    """Get a specific event by ID"""
    event = request.app.state.events_store.get(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
