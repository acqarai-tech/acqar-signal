"""
Real-time Chat API for ACQAR.
In-memory chat store with REST endpoints.
Socket.io handlers are registered in main.py.
"""
from fastapi import APIRouter, Request
from typing import List, Dict, Optional
from datetime import datetime, timezone
import time

router = APIRouter(prefix="/api/chat", tags=["chat"])

# In-memory chat store (last 100 messages)
chat_store: List[Dict] = []
MAX_MESSAGES = 100


def add_message(username: str, text: str) -> Dict:
    """Add a message to the store and return it."""
    message = {
        "id": f"msg_{int(time.time() * 1000)}",
        "username": username,
        "text": text[:500],  # Max 500 chars
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_at_ts": time.time(),
    }
    chat_store.append(message)
    # Keep only last MAX_MESSAGES
    if len(chat_store) > MAX_MESSAGES:
        chat_store.pop(0)
    return message


@router.get("/messages")
async def get_messages(limit: int = 50):
    """Get recent chat messages."""
    messages = chat_store[-limit:] if len(chat_store) > limit else chat_store[:]
    return {
        "messages": messages,
        "total": len(messages)
    }


@router.get("/status")
async def get_chat_status(request: Request):
    """Get chat connection count from socket state."""
    count = getattr(request.app.state, "chat_connections", 0)
    return {
        "connected_users": count,
        "message_count": len(chat_store)
    }
