from fastapi import APIRouter
import httpx
import os

router = APIRouter(prefix="/api/area", tags=["area"])

@router.get("/{slug}/full")
async def get_area_full(slug: str, persona: str = "buyer"):

    # Step A — Get real data from DXB Analytics
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(
                f"https://www.dxbanalytics.com/api/analytics?area={slug}"
            )
            dxb = res.json()
    except:
        return {"error": "DXB API failed"}

    analytics = dxb.get("analytics", {})
    info = dxb.get("info", {})
    price_history = dxb.get("priceHistory", [])
    rental_stats = dxb.get("rentalStats", {})
    transactions = dxb.get("transactions", [])

    # Step B — Process the data
    psf = analytics.get("avgPsf")
    score = analytics.get("investmentScore") or 50
    yoy = analytics.get("yoyChange") or 0
    verdict = "BUY" if score >= 75 else "HOLD" if score >= 60 else "WATCH"

    from datetime import datetime, timedelta
    cutoff = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    sold_this_week = sum(1 for tx in transactions if tx.get("date", "") >= cutoff)

    current = price_history[-1]["avgPsf"] if price_history else psf
    old = next((p["avgPsf"] for p in price_history if p["month"].startswith("2020")), None)
    appreciation = round((current - old) / old * 100, 1) if current and old else None

    # Step C — Call Groq to write AI brief
    ai_brief = None
    groq_key = os.environ.get("VITE_GROQ_KEY", "")

    if groq_key:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                groq_res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {groq_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "max_tokens": 200,
                        "temperature": 0.7,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a Dubai real estate expert. Write clear, specific, data-driven market briefs. Always use the exact numbers given. 3 sentences max."
                            },
                            {
                                "role": "user",
                                "content": f"""Write a market brief for {info.get('name', slug)} for a {persona}.

Real live data:
- Current price: AED {psf}/sqft
- Year on year change: {yoy}%
- Investment score: {score}/100
- Verdict: {verdict}
- Homes sold this week: {sold_this_week}
- 5 year appreciation: {appreciation}%
- Average annual rent: AED {rental_stats.get('avgRent', 'N/A')}

Use these exact numbers. 3 sentences only. Be direct and specific."""
                            }
                        ]
                    }
                )
                groq_data = groq_res.json()
                ai_brief = groq_data["choices"][0]["message"]["content"].strip()
        except:
            ai_brief = None

    # Step D — Return everything
    return {
        "name":               info.get("name", slug),
        "pricePerSqft":       psf,
        "score":              score,
        "verdict":            verdict,
        "yoyChange":          yoy,
        "soldThisWeek":       sold_this_week,
        "fiveYrAppreciation": appreciation,
        "avgRent":            rental_stats.get("avgRent"),
        "medianRent":         rental_stats.get("medianRent"),
        "priceHistory":       price_history[-24:],
        "recentTransactions": transactions[:10],
        "aiBrief":            ai_brief,
    }
