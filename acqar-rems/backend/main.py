# import asyncio
# import logging
# import os
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import socketio

# from app.api.events import router as events_router
# from app.api.market import router as market_router
# from app.api.chat import router as chat_router, add_message
# from app.services.pipeline_service import PipelineService
# from contextlib import asynccontextmanager

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Create Socket.io server
# sio = socketio.AsyncServer(
#     async_mode="asgi",
#     cors_allowed_origins=[
#         "http://localhost:5173",
#         "https://acqar-signal.vercel.app",
#         "https://*.vercel.app",
#            "https://signal.acqar.com",
#     ],
#     logger=False,
#     engineio_logger=False
# )
# pipeline = PipelineService()

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     logger.info("Starting ACQAR SIGNAL backend...")
#     app.state.events_store = {}
#     app.state.pipeline_status = {}
#     app.state.monitor_count = 8742
#     app.state.ws_connections = 0
#     app.state.chat_connections = 0
#     app.state.last_event_at = None
#     app.state.sio = sio

#     await pipeline.start(app.state)
#     asyncio.create_task(pipeline.fetch_once())
#     logger.info("Backend ready!")
#     yield
#     await pipeline.stop()
#     logger.info("Backend shutdown complete")

# # FastAPI app
# app = FastAPI(title="ACQAR SIGNAL API", description="Real-time Dubai Real Estate Intelligence", version="0.1.0", lifespan=lifespan)

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#   allow_origins=[
#         "http://localhost:5173",
#         "http://localhost:3000",
#         "https://*.vercel.app",
#         "https://acqar-signal.vercel.app",  # ← your actual URL
#          "https://signal.acqar.com",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include routers
# app.include_router(events_router)
# app.include_router(market_router)
# app.include_router(chat_router)

# # Health check
# @app.get("/health")
# async def health():
#     return {
#         "status": "healthy",
#         "events_count": len(app.state.events_store),
#         "pipeline": pipeline.get_status()
#     }

# # Root
# @app.get("/")
# async def root():
#     return {"status": "ok", "service": "ACQAR SIGNAL", "version": "0.1.0"}

# # Socket.io events
# @sio.event
# async def connect(sid, environ):
#     app.state.ws_connections += 1
#     app.state.chat_connections += 1
#     app.state.monitor_count += 1
#     logger.info(f"Client connected: {sid}")
#     events = list(app.state.events_store.values())[-20:]
#     await sio.emit('initial_events', {'events': events}, to=sid)
#     await sio.emit('market_update', {'monitor_count': app.state.monitor_count}, to=sid)

# @sio.event
# async def disconnect(sid):
#     app.state.ws_connections = max(0, app.state.ws_connections - 1)
#     app.state.chat_connections = max(0, app.state.chat_connections - 1)
#     app.state.monitor_count = max(0, app.state.monitor_count - 1)
#     logger.info(f"Client disconnected: {sid}")

# @sio.event
# async def chat_message(sid, data):
#     username = data.get("username", "Anonymous")
#     text = data.get("text", "").strip()
#     if not text or len(text) > 500:
#         return
#     message = add_message(username, text)
#     await sio.emit("chat_message", message)

# # Mount Socket.io ASGI app
# socket_app = socketio.ASGIApp(sio, app)

# # Run locally or on Railway
# if __name__ == "__main__":
#     port = int(os.getenv("PORT", 8000))  # Use Railway PORT if available
#     import uvicorn
#     uvicorn.run("main:socket_app", host="0.0.0.0", port=port, reload=True)









import asyncio
import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

from app.api.events import router as events_router
from app.api.market import router as market_router
from app.api.chat import router as chat_router, add_message
from app.services.pipeline_service import PipelineService
from app.api.summary import router as summary_router
from contextlib import asynccontextmanager
from app.api import distress
from app.api.article import router as article_router
from app.api.ticker import router as ticker_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Socket.io server
sio = socketio.AsyncServer(
    async_mode="asgi",
   cors_allowed_origins=[
    "http://localhost:5173",
    "https://acqar.vercel.app",
    "https://acqar-signal.vercel.app",
    "https://signal.acqar.com",
    "https://acqar.com",
    "https://www.acqar.com",
],
    logger=False,
    engineio_logger=False
)
pipeline = PipelineService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting ACQAR SIGNAL backend...")
    app.state.events_store = {}
    app.state.pipeline_status = {}
    app.state.monitor_count = 8742
    app.state.ws_connections = 0
    app.state.chat_connections = 0
    app.state.last_event_at = None
    app.state.sio = sio

    await pipeline.start(app.state)
    asyncio.create_task(pipeline.fetch_once())
    logger.info("Backend ready!")
    yield
    await pipeline.stop()
    logger.info("Backend shutdown complete")

# FastAPI app
app = FastAPI(title="ACQAR SIGNAL API", description="Real-time Dubai Real Estate Intelligence", version="0.1.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://acqar.vercel.app",
    "https://acqar-signal.vercel.app",
    "https://signal.acqar.com",
    "https://acqar.com",
    "https://www.acqar.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events_router)
app.include_router(market_router)
app.include_router(chat_router)
app.include_router(summary_router)
app.include_router(article_router)
app.include_router(ticker_router)

app.include_router(distress.router)

# Health check
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "events_count": len(app.state.events_store),
        "pipeline": pipeline.get_status()
    }

# Root
@app.get("/")
async def root():
    return {"status": "ok", "service": "ACQAR SIGNAL", "version": "0.1.0"}

# Socket.io events
@sio.event
async def connect(sid, environ):
    app.state.ws_connections += 1
    app.state.chat_connections += 1
    app.state.monitor_count += 1
    logger.info(f"Client connected: {sid}")
    events = list(app.state.events_store.values())[-20:]
    await sio.emit('initial_events', {'events': events}, to=sid)
    await sio.emit('market_update', {'monitor_count': app.state.monitor_count}, to=sid)

@sio.event
async def disconnect(sid):
    app.state.ws_connections = max(0, app.state.ws_connections - 1)
    app.state.chat_connections = max(0, app.state.chat_connections - 1)
    app.state.monitor_count = max(0, app.state.monitor_count - 1)
    logger.info(f"Client disconnected: {sid}")

@sio.event
async def chat_message(sid, data):
    username = data.get("username", "Anonymous")
    text = data.get("text", "").strip()
    if not text or len(text) > 500:
        return
    message = add_message(username, text)
    await sio.emit("chat_message", message)

# Mount Socket.io ASGI app
socket_app = socketio.ASGIApp(sio, app)

# Run locally or on Railway
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))  # Use Railway PORT if available
    import uvicorn
    uvicorn.run("main:socket_app", host="0.0.0.0", port=port, reload=True)











# import asyncio
# import logging
# import os
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import socketio

# from app.api.events import router as events_router
# from app.api.market import router as market_router
# from app.api.chat import router as chat_router, add_message
# from app.services.pipeline_service import PipelineService
# from app.api.summary import router as summary_router
# from contextlib import asynccontextmanager

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Create Socket.io server
# sio = socketio.AsyncServer(
#     async_mode="asgi",
#    cors_allowed_origins=[
#     "http://localhost:5173",
#     "https://acqar.vercel.app",
#     "https://acqar-signal.vercel.app",
#     "https://signal.acqar.com",
#     "https://acqar.com",
#     "https://www.acqar.com",
# ],
#     logger=False,
#     engineio_logger=False
# )
# pipeline = PipelineService()

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     logger.info("Starting ACQAR SIGNAL backend...")
#     app.state.events_store = {}
#     app.state.pipeline_status = {}
#     app.state.monitor_count = 8742
#     app.state.ws_connections = 0
#     app.state.chat_connections = 0
#     app.state.last_event_at = None
#     app.state.sio = sio

    
#     asyncio.create_task(pipeline.fetch_once())
#     logger.info("Backend ready!")
#     yield
#     await pipeline.stop()
#     logger.info("Backend shutdown complete")

# # FastAPI app
# app = FastAPI(title="ACQAR SIGNAL API", description="Real-time Dubai Real Estate Intelligence", version="0.1.0", lifespan=lifespan)

# # CORS
# app.add_middleware(
#     CORSMiddleware,
# allow_origins=[
#     "http://localhost:5173",
#     "http://localhost:3000",
#     "https://acqar.vercel.app",
#     "https://acqar-signal.vercel.app",
#     "https://signal.acqar.com",
#     "https://acqar.com",
#     "https://www.acqar.com",
# ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include routers
# app.include_router(events_router)
# app.include_router(market_router)
# app.include_router(chat_router)
# app.include_router(summary_router)

# # Health check
# @app.get("/health")
# async def health():
#     return {
#         "status": "healthy",
#         "events_count": len(app.state.events_store),
#         "pipeline": pipeline.get_status()
#     }

# # Root
# @app.get("/")
# async def root():
#     return {"status": "ok", "service": "ACQAR SIGNAL", "version": "0.1.0"}

# # Socket.io events
# @sio.event
# async def connect(sid, environ):
#     app.state.ws_connections += 1
#     app.state.chat_connections += 1
#     app.state.monitor_count += 1
#     logger.info(f"Client connected: {sid}")
#     all_events = list(app.state.events_store.values())
#     events = [e for e in all_events if not e.get('is_seed') and not e.get('is_demo')][-20:]
#     await sio.emit('initial_events', {'events': events}, to=sid)
#     await sio.emit('market_update', {'monitor_count': app.state.monitor_count}, to=sid)

# @sio.event
# async def disconnect(sid):
#     app.state.ws_connections = max(0, app.state.ws_connections - 1)
#     app.state.chat_connections = max(0, app.state.chat_connections - 1)
#     app.state.monitor_count = max(0, app.state.monitor_count - 1)
#     logger.info(f"Client disconnected: {sid}")

# @sio.event
# async def chat_message(sid, data):
#     username = data.get("username", "Anonymous")
#     text = data.get("text", "").strip()
#     if not text or len(text) > 500:
#         return
#     message = add_message(username, text)
#     await sio.emit("chat_message", message)

# # Mount Socket.io ASGI app
# socket_app = socketio.ASGIApp(sio, app)

# # Run locally or on Railway
# if __name__ == "__main__":
#     port = int(os.getenv("PORT", 8000))  # Use Railway PORT if available
#     import uvicorn
#     uvicorn.run("main:socket_app", host="0.0.0.0", port=port, reload=True)
