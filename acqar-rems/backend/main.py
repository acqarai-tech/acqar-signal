# import asyncio
# import logging
# from contextlib import asynccontextmanager
# from datetime import datetime, timezone

# import socketio
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.api.events import router as events_router
# from app.api.market import router as market_router
# from app.api.chat import router as chat_router, add_message
# from app.services.pipeline_service import PipelineService

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Create Socket.io server
# sio = socketio.AsyncServer(
#     async_mode='asgi',
#     cors_allowed_origins='*',
#     logger=False,
#     engineio_logger=False
# )

# pipeline = PipelineService()


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Startup
#     logger.info("Starting ACQAR SIGNAL backend...")

#     # Initialize shared state
#     app.state.events_store = {}  # id -> event dict
#     app.state.pipeline_status = {}
#     app.state.monitor_count = 8742
#     app.state.ws_connections = 0
#     app.state.chat_connections = 0
#     app.state.last_event_at = None
#     app.state.sio = sio

#     # Start data pipeline
#     await pipeline.start(app.state)

#     # Also do an immediate fetch on startup
#     asyncio.create_task(pipeline.fetch_once())

#     logger.info("Backend ready!")
#     yield

#     # Shutdown
#     await pipeline.stop()
#     logger.info("Backend shutdown complete")


# # Create FastAPI app
# app = FastAPI(
#     title="ACQAR SIGNAL API",
#     description="Real-time Dubai Real Estate Intelligence",
#     version="0.1.0",
#     lifespan=lifespan
# )

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173", "http://localhost:3000", "https://*.vercel.app"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include routers
# app.include_router(events_router)
# app.include_router(market_router)
# app.include_router(chat_router)


# @app.get("/")
# async def root():
#     """Root endpoint"""
#     return {"status": "ok", "service": "ACQAR SIGNAL", "version": "0.1.0"}


# @app.get("/health")
# async def health():
#     """Health check endpoint"""
#     return {
#         "status": "healthy",
#         "events_count": len(app.state.events_store),
#         "pipeline": pipeline.get_status()
#     }


# @app.post("/api/pipeline/trigger")
# async def trigger_pipeline():
#     """Manually trigger a pipeline fetch"""
#     asyncio.create_task(pipeline.fetch_once())
#     return {"message": "Pipeline triggered"}


# # Socket.io events
# @sio.event
# async def connect(sid, environ):
#     """Handle client connection"""
#     app.state.ws_connections += 1
#     app.state.chat_connections += 1
#     app.state.monitor_count += 1
#     logger.info(f"Client connected: {sid} (total: {app.state.ws_connections})")

#     # Send current events on connect
#     events = list(app.state.events_store.values())[-20:]
#     await sio.emit('initial_events', {'events': events}, to=sid)
#     await sio.emit('market_update', {'monitor_count': app.state.monitor_count}, to=sid)


# @sio.event
# async def disconnect(sid):
#     """Handle client disconnection"""
#     app.state.ws_connections = max(0, app.state.ws_connections - 1)
#     app.state.chat_connections = max(0, app.state.chat_connections - 1)
#     app.state.monitor_count = max(0, app.state.monitor_count - 1)
#     logger.info(f"Client disconnected: {sid}")


# @sio.event
# async def request_events(sid, data):
#     """Client requests filtered events"""
#     events = list(app.state.events_store.values())
#     await sio.emit('events_batch', {'events': events[-50:]}, to=sid)


# @sio.event
# async def chat_message(sid, data):
#     """Broadcast a chat message to all connected clients."""
#     username = data.get("username", "Anonymous")
#     text = data.get("text", "").strip()
#     if not text or len(text) > 500:
#         return
#     # Store and broadcast
#     message = add_message(username, text)
#     await sio.emit("chat_message", message)


# @sio.event
# async def typing(sid, data):
#     """Broadcast typing indicator to others."""
#     username = data.get("username", "Someone")
#     # Broadcast to all except sender
#     await sio.emit("user_typing", {"username": username}, skip_sid=sid)


# # Mount Socket.io on the ASGI app
# socket_app = socketio.ASGIApp(sio, app)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(socket_app, host="0.0.0.0", port=8000)




# backend/app/main.py
import asyncio
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

from app.api.events import router as events_router
from app.api.market import router as market_router
from app.api.chat import router as chat_router, add_message
from app.services.pipeline_service import PipelineService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------------------
# FastAPI instance
# ------------------------------
fastapi_app = FastAPI(
    title="ACQAR SIGNAL API",
    description="Real-time Dubai Real Estate Intelligence",
    version="0.1.0"
)

# ------------------------------
# CORS
# ------------------------------
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Include routers
# ------------------------------
fastapi_app.include_router(events_router)
fastapi_app.include_router(market_router)
fastapi_app.include_router(chat_router)

# ------------------------------
# Root & Health endpoints
# ------------------------------
@fastapi_app.get("/")
async def root():
    return {"status": "ok", "service": "ACQAR SIGNAL", "version": "0.1.0"}

@fastapi_app.get("/health")
async def health():
    events_count = len(getattr(fastapi_app.state, "events_store", {}))
    pipeline_status = getattr(fastapi_app.state, "pipeline_status", "unknown")
    return {
        "status": "healthy",
        "events_count": events_count,
        "pipeline": pipeline_status
    }

# ------------------------------
# Socket.IO server
# ------------------------------
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=False,
    engineio_logger=False
)

socket_app = socketio.ASGIApp(sio, fastapi_app)

# ------------------------------
# Pipeline Service (background)
# ------------------------------
pipeline = PipelineService()

@fastapi_app.on_event("startup")
async def startup_event():
    # Initialize shared state
    fastapi_app.state.events_store = {}
    fastapi_app.state.pipeline_status = {}
    fastapi_app.state.monitor_count = 8742
    fastapi_app.state.ws_connections = 0
    fastapi_app.state.chat_connections = 0
    fastapi_app.state.last_event_at = None
    fastapi_app.state.sio = sio

    # Run pipeline in background (non-blocking)
    asyncio.create_task(pipeline.start(fastapi_app.state))
    asyncio.create_task(pipeline.fetch_once())
    logger.info("Backend startup complete (pipeline running in background)")

# ------------------------------
# Socket.IO Events
# ------------------------------
@sio.event
async def connect(sid, environ):
    fastapi_app.state.ws_connections += 1
    fastapi_app.state.chat_connections += 1
    fastapi_app.state.monitor_count += 1
    logger.info(f"Client connected: {sid} (total: {fastapi_app.state.ws_connections})")

    # Send current events on connect
    events = list(fastapi_app.state.events_store.values())[-20:]
    await sio.emit('initial_events', {'events': events}, to=sid)
    await sio.emit('market_update', {'monitor_count': fastapi_app.state.monitor_count}, to=sid)

@sio.event
async def disconnect(sid):
    fastapi_app.state.ws_connections = max(0, fastapi_app.state.ws_connections - 1)
    fastapi_app.state.chat_connections = max(0, fastapi_app.state.chat_connections - 1)
    fastapi_app.state.monitor_count = max(0, fastapi_app.state.monitor_count - 1)
    logger.info(f"Client disconnected: {sid}")

@sio.event
async def request_events(sid, data):
    events = list(fastapi_app.state.events_store.values())
    await sio.emit('events_batch', {'events': events[-50:]}, to=sid)

@sio.event
async def chat_message(sid, data):
    username = data.get("username", "Anonymous")
    text = data.get("text", "").strip()
    if not text or len(text) > 500:
        return
    message = add_message(username, text)
    await sio.emit("chat_message", message)

@sio.event
async def typing(sid, data):
    username = data.get("username", "Someone")
    await sio.emit("user_typing", {"username": username}, skip_sid=sid)

# ------------------------------
# API endpoint to manually trigger pipeline
# ------------------------------
@fastapi_app.post("/api/pipeline/trigger")
async def trigger_pipeline():
    asyncio.create_task(pipeline.fetch_once())
    return {"message": "Pipeline triggered"}

# ------------------------------
# ENTRY POINT for Railway
# ------------------------------
app = socket_app  # Procfile should point to this: uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
