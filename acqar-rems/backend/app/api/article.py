from fastapi import APIRouter
import httpx
from bs4 import BeautifulSoup
import re

router = APIRouter(prefix="/api/article", tags=["article"])

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
]

PAYWALLED = ["bloomberg.com", "ft.com", "wsj.com", "economist.com", "thetimes.co.uk"]

# Google News URL patterns — need to follow redirect to real article
REDIRECT_DOMAINS = ["news.google.com", "linkedin.com", "t.co", "bit.ly", "google.com/url"]


def is_redirect_domain(url: str) -> bool:
    return any(d in url for d in REDIRECT_DOMAINS)


def is_paywalled(url: str) -> bool:
    return any(d in url for d in PAYWALLED)


def get_google_cache_url(url: str) -> str:
    return f"https://webcache.googleusercontent.com/search?q=cache:{url}&hl=en"


def extract_content(html: str, base_url: str = "") -> dict:
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

    # Extract article body
    content = ""
    selectors = [
        "article",
        "[class*='article-body']", "[class*='article__body']",
        "[class*='story-body']", "[class*='story__body']",
        "[class*='post-content']", "[class*='entry-content']",
        "[class*='article-content']", "[class*='ArticleBody']",
        "[itemprop='articleBody']", "[class*='body-text']",
        "[class*='page-content']", "main", "[role='main']",
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

    # Fallback: all <p> tags
    if not content:
        paras = soup.find_all("p")
        content = "\n\n".join(
            p.get_text(strip=True) for p in paras
            if len(p.get_text(strip=True)) > 50
        )

    # Detect if we got a useless generic page (like Google News homepage)
    generic_phrases = [
        "comprehensive up-to-date news coverage",
        "aggregated from sources all over the world",
        "sign in to access",
        "javascript is required",
        "please enable javascript",
        "subscribe to read",
    ]
    content_lower = (content + meta_desc).lower()
    is_generic = any(phrase in content_lower for phrase in generic_phrases)

    return {
        "title": title,
        "content": content[:6000] if not is_generic else "",
        "meta_desc": meta_desc if not is_generic else "",
        "is_generic": is_generic,
    }


async def fetch_url(client: httpx.AsyncClient, url: str) -> tuple[str, str]:
    """Fetch URL, follow all redirects, return (final_url, html)"""
    for ua in USER_AGENTS:
        try:
            resp = await client.get(url, headers={
                "User-Agent": ua,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
            }, timeout=15, follow_redirects=True)

            final_url = str(resp.url)
            if resp.status_code == 200 and len(resp.text) > 300:
                return final_url, resp.text
        except Exception:
            continue
    return url, ""


@router.get("/fetch")
async def fetch_article(url: str):
    async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:

        # Step 1: Follow redirects to get the REAL URL
        final_url, html = await fetch_url(client, url)

        # If redirect domain gave us nothing useful, we have the final URL now
        if not html:
            return {"success": False, "error": "Could not load this page", "url": url}

        # Step 2: Extract content
        data = extract_content(html, final_url)

        # Step 3: If the page was generic/redirect page, try fetching final_url directly
        if data["is_generic"] and final_url != url:
            final_url2, html2 = await fetch_url(client, final_url)
            if html2:
                data = extract_content(html2, final_url2)

        # Step 4: If paywalled domain, try Google Cache
        if (not data["content"] or data["is_generic"]) and is_paywalled(final_url):
            cache_url = get_google_cache_url(final_url)
            _, cache_html = await fetch_url(client, cache_url)
            if cache_html:
                data = extract_content(cache_html, final_url)

        # Step 5: Last resort Google Cache on original URL
        if not data["content"] or data["is_generic"]:
            cache_url = get_google_cache_url(url)
            _, cache_html = await fetch_url(client, cache_url)
            if cache_html:
                data = extract_content(cache_html, url)

        if not data["content"]:
            return {
                "success": False,
                "error": "Article content blocked or behind paywall",
                "url": final_url or url
            }

        return {
            "success": True,
            "title": data["title"],
            "content": data["content"],
            "meta_desc": data["meta_desc"],
            "url": final_url or url,
        }
