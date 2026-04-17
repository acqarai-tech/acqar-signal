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
#             "source_type": ev.get("source_type", ""), 
#             "platform": "reddit" if "reddit" in source.lower() else "",  
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
