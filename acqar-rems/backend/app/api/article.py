from fastapi import APIRouter
import httpx
from bs4 import BeautifulSoup

router = APIRouter(prefix="/api/article", tags=["article"])

@router.get("/fetch")
async def fetch_article(url: str):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
        }
        async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
            resp = await client.get(url, headers=headers)

        soup = BeautifulSoup(resp.text, "lxml")

        # Remove junk
        for tag in soup(["script", "style", "nav", "footer", "header", "aside", "iframe", "noscript"]):
            tag.decompose()

        # Try to get title
        title = ""
        if soup.find("h1"):
            title = soup.find("h1").get_text(strip=True)
        elif soup.title:
            title = soup.title.get_text(strip=True)

        # Try to get main article text
        content = ""
        for selector in ["article", "main", "[class*='article']", "[class*='content']", "[class*='body']"]:
            el = soup.select_one(selector)
            if el:
                paragraphs = el.find_all("p")
                content = "\n\n".join(p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 40)
                if len(content) > 200:
                    break

        # Fallback: grab all paragraphs
        if not content:
            paragraphs = soup.find_all("p")
            content = "\n\n".join(p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 40)

        if not content:
            return {"success": False, "error": "Could not extract content from this page"}

        return {
            "success": True,
            "title": title,
            "content": content[:5000],  # max 5000 chars
            "url": url
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
