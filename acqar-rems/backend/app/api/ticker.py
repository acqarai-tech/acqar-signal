"""
Ticker Bar API for ACQAR SIGNAL Area Specialist page.
Returns 7 live market stats for a given area slug.
"""
from fastapi import APIRouter, HTTPException
from supabase import create_client
import os

router = APIRouter(prefix="/api/ticker", tags=["ticker"])

url = os.environ.get("VITE_SUPABASE_URL", "")
key = os.environ.get("VITE_SUPABASE_ANON_KEY", "")
supabase = create_client(url, key)

@router.get("/{area_slug}")
async def get_ticker(area_slug: str):
    """Get 7 ticker values for a given area slug."""

    # Items 1, 2, 3, 4, 7 — from area_intelligence
    area_res = supabase.table("area_intelligence").select(
        "area_id, area_name_en, tx_7d, tx_7d_delta_pct, truvalu_psm, gross_yield_pct, distress_pct, verdict, investment_score"
    ).eq("area_slug", area_slug).single().execute()

    if not area_res.data:
        raise HTTPException(status_code=404, detail=f"Area '{area_slug}' not found")

    area = area_res.data

    # Item 5 — next metro catalyst
    metro_res = supabase.table("area_catalysts").select(
        "name, expected_date, confidence"
    ).eq("area_id", area["area_id"]).eq("catalyst_type", "metro").eq("human_approved", True).order(
        "expected_date", desc=False
    ).limit(1).execute()

    metro = metro_res.data[0] if metro_res.data else None

    # Item 6 — off-plan pipeline count
    pipeline_res = supabase.table("off_plan_projects").select(
        "id", count="exact"
    ).eq("area_id", area["area_id"]).eq("status", "active").execute()

    pipeline_count = pipeline_res.count or 0

    # Build fair price AED/sqft (psm ÷ 10.764)
    truvalu_psm = area.get("truvalu_psm")
    fair_price_psf = round(truvalu_psm / 10.764) if truvalu_psm else None

    return {
        # Item 1
        "soldThisWeek":    area.get("tx_7d") or 0,
        "soldDeltaPct":    area.get("tx_7d_delta_pct") or 0,
        # Item 2
        "fairPriceAedPsf": fair_price_psf,
        # Item 3
        "rentalReturnPct": area.get("gross_yield_pct"),
        # Item 4
        "distressPct":     area.get("distress_pct") or 0,
        # Item 5
        "metroOpening":    metro,
        # Item 6
        "offPlanPipeline": pipeline_count,
        # Item 7
        "signalMood":      area.get("verdict") or "WATCH",
        "score":           area.get("investment_score") or 50,
    }
