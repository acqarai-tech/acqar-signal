# from fastapi import APIRouter, HTTPException
# from supabase import create_client
# import os

# router = APIRouter(prefix="/api/ticker", tags=["ticker"])

# @router.get("/{area_slug}")
# async def get_ticker(area_slug: str):
#     supabase = create_client(
#         os.environ.get("VITE_SUPABASE_URL", ""),
#         os.environ.get("VITE_SUPABASE_ANON_KEY", "")
#     )

#     area_res = supabase.table("area_intelligence").select(
#         "area_id, area_name_en, tx_7d, tx_7d_delta_pct, truvalu_psm, gross_yield_pct, distress_pct, verdict, investment_score"
#     ).eq("area_slug", area_slug).limit(1).execute()

#     if not area_res.data or len(area_res.data) == 0:
#         raise HTTPException(status_code=404, detail=f"Area '{area_slug}' not found")

#     area = area_res.data[0]

#     try:
#         metro_res = supabase.table("area_catalysts").select(
#             "name, expected_date, confidence"
#         ).eq("area_id", area["area_id"]).eq("catalyst_type", "metro").eq("human_approved", True).order(
#             "expected_date", desc=False
#         ).limit(1).execute()
#         metro = metro_res.data[0] if metro_res.data else None
#     except:
#         metro = None

#     try:
#         pipeline_res = supabase.table("off_plan_projects").select(
#             "id", count="exact"
#         ).eq("area_id", area["area_id"]).eq("status", "active").execute()
#         pipeline_count = pipeline_res.count or 0
#     except:
#         pipeline_count = 0

#     truvalu_psm = area.get("truvalu_psm")
#     fair_price_psf = round(truvalu_psm / 10.764) if truvalu_psm else None

#     return {
#         "soldThisWeek":    area.get("tx_7d") or 0,
#         "soldDeltaPct":    area.get("tx_7d_delta_pct") or 0,
#         "fairPriceAedPsf": fair_price_psf,
#         "rentalReturnPct": area.get("gross_yield_pct"),
#         "distressPct":     area.get("distress_pct") or 0,
#         "metroOpening":    metro,
#         "offPlanPipeline": pipeline_count,
#         "signalMood":      area.get("verdict") or "WATCH",
#         "score":           area.get("investment_score") or 50,
#     }












# from fastapi import APIRouter, HTTPException
# from supabase import create_client
# import os

# router = APIRouter(prefix="/api/ticker", tags=["ticker"])

# # Maps area_intelligence names → dld_projects area_en names
# DLD_NAME_MAP = {
#     "Jumeirah Village Circle (JVC)":        "Al Barsha South Fourth",
#     "Jumeirah Village Triangle (JVT)":      "Al Barsha South Fifth",
#     "Barsha Heights (Tecom)":               "Al Thanyah First",
#     "Dubai Hills Estate":                   "Hadaeq Sheikh Mohammed Bin Rashid",
#     "DAMAC Hills 2 (Akoya by DAMAC)":       "Madinat Hind 4",
#     "Dubai Production City (IMPZ)":         "Me'Aisem First",
#     "Jumeirah Lake Towers (JLT)":           "Al Thanyah Fifth",
#     "Al Jaddaf":                            "Al Jadaf",
#     "Culture Village (Jaddaf Waterfront)":  "Al Jadaf",
#     "Dubai Silicon Oasis (DSO)":            "Silicon Oasis",
#     "Meydan":                               "Meydan One",
# }

# @router.get("/{area_slug}")
# async def get_ticker(area_slug: str):
#     supabase = create_client(
#         os.environ.get("VITE_SUPABASE_URL", ""),
#         os.environ.get("VITE_SUPABASE_ANON_KEY", "")
#     )

#     # ── 1. Fetch area intelligence ──
#     area_res = supabase.table("area_intelligence").select(
#         "area_id, area_name_en, tx_7d, tx_7d_delta_pct, truvalu_psm, gross_yield_pct, distress_pct, verdict, investment_score"
#     ).eq("area_slug", area_slug).limit(1).execute()

#     if not area_res.data or len(area_res.data) == 0:
#         raise HTTPException(status_code=404, detail=f"Area '{area_slug}' not found")

#     area = area_res.data[0]
#     area_name = area.get("area_name_en", "")

#     # ── 2. Fetch metro catalyst ──
#     # Try by area_id first, fallback to area_name_en
#     try:
#         metro_res = supabase.table("area_catalysts").select(
#             "name, expected_date, confidence"
#         ).eq("area_id", area["area_id"]).eq("catalyst_type", "metro").eq(
#             "human_approved", True
#         ).order("expected_date", desc=False).limit(1).execute()

#         metro = metro_res.data[0] if metro_res.data else None

#         # Fallback: try by area_name_en
#         if not metro:
#             metro_res2 = supabase.table("area_catalysts").select(
#                 "name, expected_date, confidence"
#             ).eq("area_name_en", area_name).eq("catalyst_type", "metro").eq(
#                 "human_approved", True
#             ).order("expected_date", desc=False).limit(1).execute()
#             metro = metro_res2.data[0] if metro_res2.data else None
#     except:
#         metro = None

#     # ── 3. Fetch off-plan pipeline from dld_projects ──
#     try:
#         # Get the correct DLD area name
#         dld_name = DLD_NAME_MAP.get(area_name)

#         # If not in map, try stripping suffix like "(JVC)" or "(IMPZ)"
#         if not dld_name:
#             dld_name = area_name.split(" (")[0].strip()

#         # Query dld_projects by area_en
#         pipeline_res = supabase.table("dld_projects").select(
#             "project_number", count="exact"
#         ).eq("area_en", dld_name).eq("project_status", "ACTIVE").execute()

#         pipeline_count = pipeline_res.count or 0

#         # If still 0, try the original area_name directly
#         if pipeline_count == 0 and dld_name != area_name:
#             pipeline_res2 = supabase.table("dld_projects").select(
#                 "project_number", count="exact"
#             ).eq("area_en", area_name).eq("project_status", "ACTIVE").execute()
#             pipeline_count = pipeline_res2.count or 0

#     except:
#         pipeline_count = 0

#     # ── 4. Compute fair price ──
#     truvalu_psm = area.get("truvalu_psm")
#     fair_price_psf = round(float(truvalu_psm) / 10.764) if truvalu_psm else None

#     return {
#         "soldThisWeek":    area.get("tx_7d") or 0,
#         "soldDeltaPct":    area.get("tx_7d_delta_pct") or 0,
#         "fairPriceAedPsf": fair_price_psf,
#         "rentalReturnPct": area.get("gross_yield_pct"),
#         "distressPct":     area.get("distress_pct") or 0,
#         "metroOpening":    metro,
#         "offPlanPipeline": pipeline_count,
#         "signalMood":      area.get("verdict") or "WATCH",
#         "score":           area.get("investment_score") or 50,
#     }







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

    # ── 1. Fetch area intelligence ──
    area_res = supabase.table("area_intelligence").select(
        "area_id, area_name_en, tx_7d, tx_7d_delta_pct, truvalu_psm, gross_yield_pct, distress_pct, verdict, investment_score, active_project_count"  # ← added active_project_count
    ).eq("area_slug", area_slug).limit(1).execute()

    if not area_res.data or len(area_res.data) == 0:
        raise HTTPException(status_code=404, detail=f"Area '{area_slug}' not found")

    area = area_res.data[0]
    area_name = area.get("area_name_en", "")

    # ── 2. Fetch metro catalyst ──
    try:
        metro_res = supabase.table("area_catalysts").select(
            "name, expected_date, confidence"
        ).eq("area_id", area["area_id"]).eq("catalyst_type", "metro").eq(
            "human_approved", True
        ).order("expected_date", desc=False).limit(1).execute()

        metro = metro_res.data[0] if metro_res.data else None

        if not metro:
            metro_res2 = supabase.table("area_catalysts").select(
                "name, expected_date, confidence"
            ).eq("area_name_en", area_name).eq("catalyst_type", "metro").eq(
                "human_approved", True
            ).order("expected_date", desc=False).limit(1).execute()
            metro = metro_res2.data[0] if metro_res2.data else None
    except:
        metro = None

    # ── 3. Off-plan pipeline — now from area_intelligence directly ──  ← REPLACED entire dld_projects block
    pipeline_count = area.get("active_project_count") or 0

    # ── 4. Compute fair price ──
    truvalu_psm = area.get("truvalu_psm")
    fair_price_psf = round(float(truvalu_psm) / 10.764) if truvalu_psm else None

    return {
        "soldThisWeek":    area.get("tx_7d") or 0,
        "soldDeltaPct":    area.get("tx_7d_delta_pct") or 0,
        "fairPriceAedPsf": fair_price_psf,
        "rentalReturnPct": area.get("gross_yield_pct"),
        "distressPct":     area.get("distress_pct") or 0,
        "metroOpening":    metro,
        "offPlanPipeline": pipeline_count,
        "signalMood":      area.get("verdict") or "WATCH",
        "score":           area.get("investment_score") or 50,
    }
