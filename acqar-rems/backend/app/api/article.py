from fastapi import APIRouter
import httpx
from bs4 import BeautifulSoup
import re
import base64

router = APIRouter(prefix="/api/article", tags=["article"])

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
]

PAYWALLED = ["bloomberg.com", "ft.com", "wsj.com", "economist.com", "thetimes.co.uk"]


def is_paywalled(url: str) -> bool:
    return any(d in url for d in PAYWALLED)


def decode_google_news_url(url: str) -> str:
    """
    Google News RSS URLs are base64-encoded. Decode to get the real article URL.
    Format: https://news.google.com/rss/articles/CBMi...
    """
    try:
        if "news.google.com" not in url:
            return url

        # Extract the encoded part after /articles/ or /read/
        match = re.search(r'/(?:articles|read)/([A-Za-z0-9_\-]+)', url)
        if not match:
            return url

        encoded = match.group(1)

        # Add padding if needed
        padding = 4 - len(encoded) % 4
        if padding != 4:
            encoded += '=' * padding

        # Try standard base64 decode
        try:
            decoded = base64.urlsafe_b64decode(encoded).decode('utf-8', errors='ignore')
        except Exception:
            return url

        # Find a real URL inside the decoded bytes
        url_match = re.search(r'https?://[^\s\x00-\x1f"<>]+', decoded)
        if url_match:
            real_url = url_match.group(0).rstrip('.,;)')
            # Make sure it's not Google itself
            if "google.com" not in real_url:
                return real_url

        return url
    except Exception:
        return url


async def resolve_redirect(client: httpx.AsyncClient, url: str) -> str:
    """Follow redirects and return the final URL."""
    try:
        resp = await client.head(url, headers={
            "User-Agent": USER_AGENTS[0]
        }, timeout=10, follow_redirects=True)
        return str(resp.url)
    except Exception:
        try:
            resp = await client.get(url, headers={
                "User-Agent": USER_AGENTS[0]
            }, timeout=10, follow_redirects=True)
            return str(resp.url)
        except Exception:
            return url


async def fetch_and_parse(client: httpx.AsyncClient, url: str) -> dict | None:
    """Try fetching a URL with multiple user agents, return parsed content or None."""
    for ua in USER_AGENTS:
        try:
            resp = await client.get(url, headers={
                "User-Agent": ua,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
            }, timeout=15, follow_redirects=True)

            final_url = str(resp.url)

            if resp.status_code != 200 or len(resp.text) < 300:
                continue

            data = extract_content(resp.text)
            if data["content"] and not data["is_generic"]:
                data["final_url"] = final_url
                return data

        except Exception:
            continue
    return None


def extract_content(html: str) -> dict:
    soup = BeautifulSoup(html, "lxml")

    for tag in soup(["script", "style", "nav", "footer", "header",
                     "aside", "iframe", "noscript", "form", "button"]):
        tag.decompose()

    # Title
    title = ""
    og_title = soup.find("meta", property="og:title")
    if og_title:
        title = og_title.get("content", "")
    if not title and soup.find("h1"):
        title = soup.find("h1").get_text(strip=True)
    if not title and soup.title:
        title = soup.title.get_text(strip=True)

    # Meta description
    meta_desc = ""
    for m in [
        soup.find("meta", property="og:description"),
        soup.find("meta", attrs={"name": "description"}),
    ]:
        if m:
            meta_desc = m.get("content", "")
            break

    # Article body
    content = ""
    selectors = [
        "article",
        "[class*='article-body']", "[class*='article__body']",
        "[class*='story-body']", "[class*='story__body']",
        "[class*='post-content']", "[class*='entry-content']",
        "[class*='article-content']", "[class*='ArticleBody']",
        "[itemprop='articleBody']", "[class*='body-text']",
        "main", "[role='main']",
    ]
    for sel in selectors:
        el = soup.select_one(sel)
        if el:
            paras = el.find_all("p")
            text = "\n\n".join(
                p.get_text(strip=True) for p in paras
                if len(p.get_text(strip=True)) > 50
            )
            if len(text) > 300:
                content = text
                break

    if not content:
        paras = soup.find_all("p")
        content = "\n\n".join(
            p.get_text(strip=True) for p in paras
            if len(p.get_text(strip=True)) > 50
        )

    # Detect useless/generic pages
    generic_phrases = [
        "comprehensive up-to-date news coverage",
        "aggregated from sources all over the world",
        "sign in to access", "javascript is required",
        "please enable javascript", "subscribe to read",
        "google news", "enable javascript and cookies",
    ]
    content_lower = (content + meta_desc + title).lower()
    is_generic = any(p in content_lower for p in generic_phrases)

    return {
        "title": title,
        "content": content[:6000] if not is_generic else "",
        "meta_desc": meta_desc,
        "is_generic": is_generic,
    }


@router.get("/fetch")
@router.get("/fetch-article")  # support both endpoint names
async def fetch_article(url: str):
    async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:

        # ── STEP 1: Decode Google News encoded URL ──
        real_url = decode_google_news_url(url)

        # ── STEP 2: If still google.com, resolve via HEAD redirect ──
        if "google.com" in real_url:
            real_url = await resolve_redirect(client, url)

        # ── STEP 3: Try fetching the real article URL ──
        if real_url and real_url != url and "google.com" not in real_url:
            data = await fetch_and_parse(client, real_url)
            if data:
                return {"success": True, **data, "url": real_url}

        # ── STEP 4: Try original URL directly ──
        data = await fetch_and_parse(client, url)
        if data:
            return {"success": True, **data, "url": url}

        # ── STEP 5: Try Google Cache as last resort ──
        target = real_url if real_url and "google.com" not in real_url else url
        if is_paywalled(target):
            cache_url = f"https://webcache.googleusercontent.com/search?q=cache:{target}&hl=en"
            data = await fetch_and_parse(client, cache_url)
            if data:
                return {"success": True, **data, "url": target, "via": "cache"}

        return {
            "success": False,
            "error": "Article blocked or behind paywall",
            "real_url": real_url,
            "original_url": url,
        }
