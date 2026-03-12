from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class EventCategory(str, Enum):
    transaction = "transaction"
    offplan = "offplan"
    construction = "construction"
    regulatory = "regulatory"
    infrastructure = "infrastructure"
    investment = "investment"


class EventSeverity(int, Enum):
    s1 = 1
    s2 = 2
    s3 = 3
    s4 = 4
    s5 = 5


class Event(BaseModel):
    id: str
    title: str
    summary: str
    url: Optional[str] = None
    category: EventCategory
    severity: int  # 1-5
    lat: float
    lng: float
    location_name: str
    country: str = "UAE"
    region: str = "Dubai"
    signal_count: int = 1
    confidence: float = 0.5
    is_active: bool = True
    source: str
    source_types: List[str] = ["news"]
    developer: Optional[str] = None
    price_aed: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    classified_at: Optional[datetime] = None


class EventsResponse(BaseModel):
    events: List[Event]
    total: int
    last_updated: datetime


class MarketTicker(BaseModel):
    symbol: str
    name: str
    value: float
    change: float
    change_pct: float
    unit: str


class PipelineStatus(BaseModel):
    is_running: bool
    last_fetch_at: Optional[datetime]
    events_fetched_today: int
    active_sources: List[str]
    errors: List[str]
