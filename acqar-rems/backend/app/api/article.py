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

PAYWALLED = ["bloomberg.com", "ft.com", "wsj.com", "economist.com"]


async def resolve_google_news_url(client: httpx.AsyncClient, url: str) -> str:
    """
    Google News RSS URLs need special handling.
    Fetch the Google News page and extract the real article URL from the HTML.
    """
    try:
        # Convert RSS url to readable URL if needed
        readable_url = url.replace("/rss/articles/", "/articles/")

        for ua in USER_AGENTS:
            try:
                resp = await client.get(readable_url, headers={
                    "User-Agent": ua,
                    "Accept": "text/html,application/xhtml+xml",
                    "Accept-Language": "en-US,en;q=0.9",
                }, timeout=15, follow_redirects=True)

                final = str(resp.url)

                # If we ended up somewhere other than google.com, that's our URL
                if "google.com" not in final:
                    return final

                # Parse the HTML to find the real article link
                soup = BeautifulSoup(resp.text, "lxml")

                # Look for canonical link
                canonical = soup.find("link", rel="canonical")
                if canonical and canonical.get("href") and "google.com" not in canonical["href"]:
                    return canonical["href"]

                # Look for og:url
                og_url = soup.find("meta", property="og:url")
                if og_url and og_url.get("content") and "google.com" not in og_url["content"]:
                    return og_url["content"]

                # Look for the first external link in the page
                for a in soup.find_all("a", href=True):
                    href = a["href"]
                    if href.startswith("http") and "google.com" not in href and "gstatic.com" not in href:
                        return href

            except Exception:
                continue

        # Last resort: try direct RSS url with follow redirects
        try:
            resp = await client.get(url, headers={
                "User-Agent": USER_AGENTS[0],
            }, timeout=15, follow_redirects=True)
            final = str(resp.url)
            if "google.com" not in final:
                return final
        except Exception:
            pass

    except Exception:
        pass

    return url  # Return original if all fails


def extract_content(html: str) -> dict:
    soup = BeautifulSoup(html, "lxml")

    for tag in soup(["script", "style", "nav", "footer", "header",
                     "aside", "iframe", "noscript", "form", "button"]):
        tag.decompose()

    # Title
    title = ""
    for selector in [
        lambda s: s.find("meta", property="og:title"),
        lambda s: s.find("h1"),
        lambda s: s.title,
    ]:
        el = selector(soup)
        if el:
            title = el.get("content", "") if el.name == "meta" else el.get_text(strip=True)
            if title:
                break

    # Meta description
    meta_desc = ""
    for m in [
        soup.find("meta", property="og:description"),
        soup.find("meta", attrs={"name": "description"}),
    ]:
        if m:
            meta_desc = m.get("content", "")
            break

    # Article content
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

    # Fallback
    if not content:
        paras = soup.find_all("p")
        content = "\n\n".join(
            p.get_text(strip=True) for p in paras
            if len(p.get_text(strip=True)) > 50
        )

    # Detect generic/useless pages
    generic_phrases = [
        "comprehensive up-to-date news coverage",
        "aggregated from sources all over the world",
        "sign in to access", "javascript is required",
        "please enable javascript", "subscribe to read",
        "enable javascript and cookies",
        "google news", "before you continue",
    ]
    is_generic = any(p in (content + meta_desc + title).lower() for p in generic_phrases)

    return {
        "title": title,
        "content": content[:6000] if not is_generic else "",
        "meta_desc": meta_desc,
        "is_generic": is_generic,
    }


async def fetch_and_parse(client: httpx.AsyncClient, url: str) -> dict | None:
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


@router.get("/fetch")
@router.get("/fetch-article")
async def fetch_article(url: str):
    async with httpx.AsyncClient(follow_redirects=True, timeout=15) as client:

        # ── STEP 1: Resolve Google News URL to real article URL ──
        real_url = url
        if "news.google.com" in url or "linkedin.com" in url:
            real_url = await resolve_google_news_url(client, url)

        # ── STEP 2: Fetch the real article ──
        if real_url != url and "google.com" not in real_url:
            data = await fetch_and_parse(client, real_url)
            if data:
                return {"success": True, **data, "url": real_url}

        # ── STEP 3: Try original URL ──
        data = await fetch_and_parse(client, url)
        if data:
            return {"success": True, **data, "url": url}

        # ── STEP 4: Google Cache for paywalled sites ──
        target = real_url if "google.com" not in real_url else url
        if any(d in target for d in PAYWALLED):
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
