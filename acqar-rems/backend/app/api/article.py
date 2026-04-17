from fastapi import APIRouter
import httpx
from bs4 import BeautifulSoup
import re

router = APIRouter(prefix="/api/article", tags=["article"])

# Try multiple User-Agent strings to bypass blocks
USER_AGENTS = [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
]

# Sites that always block — use Google Cache instead
BLOCKED_DOMAINS = ["bloomberg.com", "ft.com", "wsj.com", "economist.com"]

def get_google_cache_url(url: str) -> str:
    return f"https://webcache.googleusercontent.com/search?q=cache:{url}&hl=en"

def get_archive_url(url: str) -> str:
    return f"https://archive.ph/{url}"

async def try_fetch(client: httpx.AsyncClient, url: str, ua: str) -> httpx.Response | None:
    try:
        resp = await client.get(url, headers={
            "User-Agent": ua,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        }, timeout=12)
        if resp.status_code == 200 and len(resp.text) > 500:
            return resp
    except Exception:
        pass
    return None

def extract_content(html: str) -> dict:
    soup = BeautifulSoup(html, "lxml")

    # Remove junk tags
    for tag in soup(["script", "style", "nav", "footer", "header",
                     "aside", "iframe", "noscript", "ads", "form",
                     "[class*='ad-']", "[class*='cookie']", "[class*='popup']"]):
        tag.decompose()

    # Get title
    title = ""
    for t in [soup.find("h1"), soup.find("meta", property="og:title"), soup.title]:
        if t:
            title = t.get("content", "") or t.get_text(strip=True)
            if title:
                break

    # Get meta description as fallback summary
    meta_desc = ""
    meta = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", property="og:description")
    if meta:
        meta_desc = meta.get("content", "")

    # Try known article selectors in priority order
    content = ""
    selectors = [
        "article", "[class*='article-body']", "[class*='article__body']",
        "[class*='story-body']", "[class*='post-content']", "[class*='entry-content']",
        "[class*='article-content']", "[itemprop='articleBody']",
        "main", "[role='main']", "[class*='content']",
    ]
    for selector in selectors:
        el = soup.select_one(selector)
        if el:
            paragraphs = el.find_all("p")
            text = "\n\n".join(
                p.get_text(strip=True) for p in paragraphs
                if len(p.get_text(strip=True)) > 40
            )
            if len(text) > 300:
                content = text
                break

    # Fallback: all paragraphs
    if not content:
        paragraphs = soup.find_all("p")
        content = "\n\n".join(
            p.get_text(strip=True) for p in paragraphs
            if len(p.get_text(strip=True)) > 40
        )

    # If still nothing, use meta description
    if not content and meta_desc:
        content = meta_desc

    return {"title": title, "content": content[:6000], "meta_desc": meta_desc}


@router.get("/fetch")
async def fetch_article(url: str):
    domain = re.sub(r"https?://(www\.)?", "", url).split("/")[0]
    is_blocked = any(d in domain for d in BLOCKED_DOMAINS)

    async with httpx.AsyncClient(follow_redirects=True, timeout=12) as client:

        # For known blocked domains, try Google Cache first
        if is_blocked:
            cache_url = get_google_cache_url(url)
            for ua in USER_AGENTS:
                resp = await try_fetch(client, cache_url, ua)
                if resp:
                    data = extract_content(resp.text)
                    if data["content"]:
                        return {"success": True, **data, "url": url, "via": "cache"}

        # Normal fetch — try multiple user agents
        for ua in USER_AGENTS:
            resp = await try_fetch(client, url, ua)
            if resp:
                data = extract_content(resp.text)
                if data["content"]:
                    return {"success": True, **data, "url": url, "via": "direct"}

        # Last resort: try Google Cache for any domain
        if not is_blocked:
            cache_url = get_google_cache_url(url)
            for ua in USER_AGENTS[:1]:
                resp = await try_fetch(client, cache_url, ua)
                if resp:
                    data = extract_content(resp.text)
                    if data["content"]:
                        return {"success": True, **data, "url": url, "via": "cache"}

    return {"success": False, "error": "This source blocks automated access", "url": url}
