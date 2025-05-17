import requests
import json
import os
import time
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from urllib.parse import urlparse

class WisdomScraper:
    def __init__(self):
        self.ua = UserAgent()
        self.headers = {'User-Agent': self.ua.random}
        self.quotes_dir = "quotes"
        os.makedirs(self.quotes_dir, exist_ok=True)
        self.delay = 3  # seconds between requests

    def check_robots(self, url):
        """Check robots.txt permissions"""
        domain = urlparse(url).netloc
        robots_url = f"https://{domain}/robots.txt"
        try:
            res = requests.get(robots_url, timeout=5)
            if "Disallow: /" in res.text:
                return False
            return True
        except:
            return True  # Assume allowed if robots.txt inaccessible

    def scrape_rumi(self):
        """Harvest Rumi quotes from multiple sources"""
        print("Harvesting Rumi wisdom...")
        quotes = []
        sources = [
            {
                "url": "https://www.goodreads.com/author/quotes/875661.Rumi",
                "selectors": {
                    "container": ".quoteText",
                    "text": ".quoteText::text",
                    "source": "Rumi"
                }
            },
            {
                "url": "https://www.rumi.org.uk/works.html",
                "selectors": {
                    "container": ".poem-section p",
                    "text": "",
                    "source": "Divan-e Shams-e Tabrizi"
                }
            }
        ]

        for source in sources:
            if not self.check_robots(source["url"]):
                print(f"Skipping {source['url']} - robots.txt restriction")
                continue

            try:
                res = requests.get(source["url"], headers=self.headers, timeout=10)
                soup = BeautifulSoup(res.text, 'html.parser')
                
                items = soup.select(source["selectors"]["container"])[:50]
                for item in items:
                    try:
                        if source["selectors"]["text"]:
                            text = item.select_one(source["selectors"]["text"]).get_text(strip=True)
                        else:
                            text = item.get_text(separator=" ", strip=True)
                        
                        quotes.append({
                            "text": text,
                            "source": source["selectors"]["source"],
                            "url": source["url"],
                            "harvest_date": time.strftime("%Y-%m-%d")
                        })
                    except Exception as e:
                        print(f"Error processing item: {e}")
                        continue

                time.sleep(self.delay)
            except Exception as e:
                print(f"Error scraping {source['url']}: {e}")
                continue

        self.save_quotes(quotes, "rumi.json")
        return quotes

    def scrape_tao(self):
        """Harvest Tao Te Ching quotes"""
        print("Harvesting Tao wisdom...")
        quotes = []
        url = "https://www.wussu.com/laotzu/laotzu.html"
        
        try:
            res = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(res.text, 'html.parser')
            
            chapters = soup.select("body > table > tr > td:nth-child(2) > table > tr > td > p")
            for i, chapter in enumerate(chapters[:81], 1):  # 81 chapters
                text = chapter.get_text(separator=" ", strip=True)
                quotes.append({
                    "text": text,
                    "source": f"Tao Te Ching Chapter {i}",
                    "url": url,
                    "harvest_date": time.strftime("%Y-%m-%d")
                })
            
            self.save_quotes(quotes, "tao-te-ching.json")
        except Exception as e:
            print(f"Error scraping Tao: {e}")
        return quotes

    def save_quotes(self, quotes, filename):
        """Save quotes to JSON with metadata"""
        path = os.path.join(self.quotes_dir, filename)
        data = {
            "meta": {
                "source": filename.replace(".json", ""),
                "count": len(quotes),
                "last_updated": time.strftime("%Y-%m-%d"),
                "terms": "For educational/non-commercial use"
            },
            "quotes": quotes
        }
        
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved {len(quotes)} quotes to {path}")

if __name__ == "__main__":
    scraper = WisdomScraper()
    scraper.scrape_rumi()
    scraper.scrape_tao()
    # Add other scraping methods as needed
