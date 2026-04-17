from fastapi import APIRouter
import httpx
from bs4 import BeautifulSoup
import re
import xml.etree.ElementTree as ET

router = APIRouter(prefix="/api/article", tags=["article"])

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
]

PAYWALLED = ["bloomberg.com", "ft.com", "wsj.com", "economist.com"]


async def get_real_url_from_google_news(client: httpx.AsyncClient, url: str) -> str:
    """
    Multiple strategies to extract real URL from Google News links.
    """
    # Strategy 1: Use Google News RSS to find source URL
    # The encoded ID in the URL can be used to fetch the RSS item
    try:
        # Extract article ID
        match = re.search(r'/articles/([^?&/]+)', url)
        if match:
            article_id = match.group(1)
            
            # Fetch single article RSS
            rss_url = f"https://news.google.com/rss/articles/{article_id}"
            resp = await client.get(rss_url, headers={
                "User-Agent": USER_AGENTS[0],
                "Accept": "application/rss+xml, application/xml, text/xml",
            }, timeout=10, follow_redirects=True)
            
            if resp.status_code == 200:
                # Parse RSS XML to get source URL
                try:
                    root = ET.fromstring(resp.text)
                    # Look for link in RSS
                    for item in root.iter('item'):
                        link = item.find('link')
                        source = item.find('source')
                        if link is not None and link.text:
                            real = link.text.strip()
                            if "google.com" not in real and real.startswith("http"):
                                return real
                        # Check guid
                        guid = item.find('guid')
                        if guid is not None and guid.text:
                            real = guid.text.strip()
                            if "google.com" not in real and real.startswith("http"):
                                return real
                except Exception:
                    pass
                
                # Parse as HTML/XML with BeautifulSoup
                soup = BeautifulSoup(resp.text, "lxml")
                for tag in ['link', 'guid', 'url']:
                    el = soup.find(tag)
                    if el and el.get_text() and "google.com" not in el.get_text():
                        text = el.get_text().strip()
                        if text.startswith("http"):
                            return text
    except Exception:
        pass

    # Strategy 2: Use Google AMP/reader URL format
    try:
        match = re.search(r'/articles/([^?&/]+)', url)
        if match:
            article_id = match.group(1)
            amp_url = f"https://news.google.com/articles/{article_id}?hl=en-US&gl=US&ceid=US:en"
            
            resp = await client.get(amp_url, headers={
                "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                "Accept": "text/html",
            }, timeout=10, follow_redirects=True)
            
            final = str(resp.url)
            if "google.com" not in final:
                return final
                
            # Scrape the page for article link
            soup = BeautifulSoup(resp.text, "lxml")
            
            # Look for JSON-LD structured data
            for script in soup.find_all("script", type="application/ld+json"):
                try:
                    import json
                    data = json.loads(script.string)
                    if isinstance(data, dict):
                        for key in ["url", "mainEntityOfPage", "@id"]:
                            val = data.get(key, "")
                            if isinstance(val, str) and val.startswith("http") and "google.com" not in val:
                                return val
                except Exception:
                    pass
            
            # Look for meta refresh redirect
            meta_refresh = soup.find("meta", attrs={"http-equiv": "refresh"})
            if meta_refresh:
                content = meta_refresh.get("content", "")
                url_match = re.search(r'url=(.+)', content, re.IGNORECASE)
                if url_match:
                    redirect_url = url_match.group(1).strip().strip("'\"")
                    if "google.com" not in redirect_url:
                        return redirect_url
            
            # Find any external link
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if (href.startswith("http") and 
                    "google.com" not in href and 
                    "gstatic.com" not in href and
                    "googleapis.com" not in href):
                    return href

    except Exception:
        pass

    # Strategy 3: Try with requests that simulate a browser click
    try:
        match = re.search(r'/articles/([^?&/]+)', url)
        if match:
            article_id = match.group(1)
            for ua in USER_AGENTS:
                try:
                    resp = await client.get(
                        f"https://news.google.com/articles/{article_id}",
                        headers={
                            "User-Agent": ua,
                            "Referer": "https://news.google.com/",
                            "Accept": "text/html,application/xhtml+xml",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Cache-Control": "no-cache",
                        },
                        timeout=12,
                        follow_redirects=True
                    )
                    final = str(resp.url)
                    if "google.com" not in final:
                        return final
                except Exception:
                    continue
    except Exception:
        pass

    return url  # All strategies failed


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

    if not content:
        paras = soup.find_all("p")
        content = "\n\n".join(
            p.get_text(strip=True) for p in paras
            if len(p.get_text(strip=True)) > 50
        )

    generic_phrases = [
        "comprehensive up-to-date news coverage",
        "aggregated from sources all over the world",
        "sign in to access", "javascript is required",
        "please enable javascript", "subscribe to read",
        "enable javascript and cookies", "before you continue",
        "google llc", "privacy policy",
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
    async with httpx.AsyncClient(follow_redirects=True, timeout=20) as client:

        real_url = url

        # ── Resolve Google News URLs ──
        if "news.google.com" in url:
            real_url = await get_real_url_from_google_news(client, url)

        # ── Fetch real article ──
        if real_url != url and "google.com" not in real_url:
            data = await fetch_and_parse(client, real_url)
            if data:
                return {"success": True, **data, "url": real_url}

        # ── Try original URL ──
        if "google.com" not in url:
            data = await fetch_and_parse(client, url)
            if data:
                return {"success": True, **data, "url": url}

        # ── Google Cache fallback for paywalled ──
        target = real_url if "google.com" not in real_url else url
        if any(d in target for d in PAYWALLED) and "google.com" not in target:
            cache_url = f"https://webcache.googleusercontent.com/search?q=cache:{target}&hl=en"
            data = await fetch_and_parse(client, cache_url)
            if data:
                return {"success": True, **data, "url": target, "via": "cache"}

        return {
            "success": False,
            "error": "Could not resolve article URL",
            "real_url": real_url,
            "original_url": url,
        }
