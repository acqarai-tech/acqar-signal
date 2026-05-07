from fastapi import APIRouter, HTTPException
from supabase import create_client
import os

router = APIRouter(prefix="/api/ticker", tags=["ticker"])

@router.get("/{area_slug}")
async def get_ticker(area_slug: str):
    supabase = create_client(
        os.environ.get("VITE_SUPABASE_URL", ""),
        os.environ.get("VITE_SUPABASE_ANON_KEY", "")
    )
    
    area_res = supabase.table("area_intelligence").select(
        "area_id, area_name_en, tx_7d, tx_7d_delta_pct, truvalu_psm, gross_yield_pct, distress_pct, verdict, investment_score"
    ).eq("area_slug", area_slug).single().execute()

    if not area_res.data:
        raise HTTPException(status_code=404, detail=f"Area '{area_slug}' not found")

    area = area_res.data

    metro_res = supabase.table("area_catalysts").select(
        "name, expected_date, confidence"
    ).eq("area_id", area["area_id"]).eq("catalyst_type", "metro").eq("human_approved", True).order(
        "expected_date", desc=False
    ).limit(1).execute()

    metro = metro_res.data[0] if metro_res.data else None

    pipeline_res = supabase.table("off_plan_projects").select(
        "id", count="exact"
    ).eq("area_id", area["area_id"]).eq("status", "active").execute()

    truvalu_psm = area.get("truvalu_psm")
    fair_price_psf = round(truvalu_psm / 10.764) if truvalu_psm else None

    return {
        "soldThisWeek":    area.get("tx_7d") or 0,
        "soldDeltaPct":    area.get("tx_7d_delta_pct") or 0,
        "fairPriceAedPsf": fair_price_psf,
        "rentalReturnPct": area.get("gross_yield_pct"),
        "distressPct":     area.get("distress_pct") or 0,
        "metroOpening":    metro,
        "offPlanPipeline": pipeline_res.count or 0,
        "signalMood":      area.get("verdict") or "WATCH",
        "score":           area.get("investment_score") or 50,
    }
