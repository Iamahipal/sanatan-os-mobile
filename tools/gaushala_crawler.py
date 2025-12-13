"""
Gaushala Web Crawler
--------------------
Crawls authentic government and verified sources for Gaushala data:
- helpgaushala.com (aggregated directory)
- State Goseva Aayog websites
- AWBI (Animal Welfare Board of India)

Usage:
    python gaushala_crawler.py --source helpgaushala
    python gaushala_crawler.py --source rajasthan
    python gaushala_crawler.py --all

Requirements:
    pip install requests beautifulsoup4 lxml

Author: SanatanOS Team
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
import sys
from typing import List, Dict, Optional
from urllib.parse import urljoin

# Headers to mimic browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

# State codes mapping
STATE_CODES = {
    'andhra pradesh': 'AP', 'arunachal pradesh': 'AR', 'assam': 'AS',
    'bihar': 'BR', 'chhattisgarh': 'CG', 'goa': 'GA', 'gujarat': 'GJ',
    'haryana': 'HR', 'himachal pradesh': 'HP', 'jharkhand': 'JH',
    'karnataka': 'KA', 'kerala': 'KL', 'madhya pradesh': 'MP',
    'maharashtra': 'MH', 'manipur': 'MN', 'meghalaya': 'ML',
    'mizoram': 'MZ', 'nagaland': 'NL', 'odisha': 'OR', 'punjab': 'PB',
    'rajasthan': 'RJ', 'sikkim': 'SK', 'tamil nadu': 'TN',
    'telangana': 'TG', 'tripura': 'TR', 'uttar pradesh': 'UP',
    'uttarakhand': 'UK', 'west bengal': 'WB', 'delhi': 'DL',
}


def get_state_code(state: str) -> str:
    """Get ISO state code"""
    return STATE_CODES.get(state.lower().strip(), state[:2].upper())


def clean_phone(phone: str) -> Optional[str]:
    """Clean and format phone number"""
    if not phone:
        return None
    # Remove non-digits except +
    cleaned = re.sub(r'[^\d+]', '', phone)
    # Add 91 prefix if needed
    if cleaned.startswith('+'):
        cleaned = cleaned[1:]
    if len(cleaned) == 10:
        cleaned = '91' + cleaned
    return cleaned if len(cleaned) >= 10 else None


class GaushalaCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.results = []
    
    def save_results(self, filename: str):
        """Save crawled data to JSON"""
        output = {
            'lastUpdated': time.strftime('%Y-%m-%d'),
            'count': len(self.results),
            'source': 'crawler',
            'gaushalas': self.results
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Saved {len(self.results)} entries to {filename}")
    
    def crawl_helpgaushala(self, max_pages: int = 5) -> List[Dict]:
        """
        Crawl helpgaushala.com directory
        This site aggregates Gaushala listings with contact info
        """
        print("\n🔍 Crawling helpgaushala.com...")
        base_url = "https://helpgaushala.com/gaushala-list/"
        
        gaushalas = []
        
        for page in range(1, max_pages + 1):
            url = f"{base_url}page/{page}/" if page > 1 else base_url
            print(f"  📄 Page {page}...")
            
            try:
                response = self.session.get(url, timeout=15)
                if response.status_code != 200:
                    print(f"  ⚠️ Page {page} returned {response.status_code}")
                    break
                
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Find gaushala cards
                cards = soup.select('.gaushala-card, .listing-item, article')
                
                if not cards:
                    print(f"  ⚠️ No cards found on page {page}")
                    break
                
                for card in cards:
                    try:
                        gaushala = self._parse_helpgaushala_card(card)
                        if gaushala and gaushala.get('name'):
                            gaushalas.append(gaushala)
                    except Exception as e:
                        print(f"    ❌ Parse error: {e}")
                
                # Rate limiting
                time.sleep(2)
                
            except requests.RequestException as e:
                print(f"  ❌ Request failed: {e}")
                break
        
        print(f"  ✅ Found {len(gaushalas)} Gaushalas from helpgaushala.com")
        self.results.extend(gaushalas)
        return gaushalas
    
    def _parse_helpgaushala_card(self, card) -> Optional[Dict]:
        """Parse a single Gaushala card from helpgaushala.com"""
        # Try to extract data from card
        name_el = card.select_one('h2, h3, .title, .name')
        name = name_el.get_text(strip=True) if name_el else None
        
        if not name:
            return None
        
        # Location
        location_el = card.select_one('.location, .address, p')
        location = location_el.get_text(strip=True) if location_el else ''
        
        # Phone
        phone_el = card.select_one('a[href^="tel:"], .phone, .contact')
        phone = None
        if phone_el:
            if phone_el.get('href', '').startswith('tel:'):
                phone = phone_el['href'].replace('tel:', '')
            else:
                phone = phone_el.get_text(strip=True)
        
        # WhatsApp link
        whatsapp_el = card.select_one('a[href*="wa.me"], a[href*="whatsapp"]')
        whatsapp = None
        if whatsapp_el:
            href = whatsapp_el.get('href', '')
            match = re.search(r'(\d{10,12})', href)
            if match:
                whatsapp = clean_phone(match.group(1))
        
        # Extract state/city from location text
        state, city, district = self._parse_location(location)
        
        return {
            'id': f"HG-{get_state_code(state)}-{len(self.results)+1:03d}",
            'name': name,
            'state': state,
            'city': city,
            'district': district,
            'address': location,
            'phone': clean_phone(phone) if phone else None,
            'whatsapp': whatsapp,
            'type': 'Trust',
            'verified': False,
            'source': 'helpgaushala.com',
            'geo': None
        }
    
    def _parse_location(self, location: str) -> tuple:
        """Extract state, city, district from location string"""
        if not location:
            return ('Unknown', 'Unknown', 'Unknown')
        
        parts = [p.strip() for p in location.split(',')]
        
        # Try to identify state
        state = 'Unknown'
        for part in parts:
            if part.lower() in STATE_CODES:
                state = part
                break
        
        city = parts[0] if parts else 'Unknown'
        district = parts[1] if len(parts) > 1 else city
        
        return (state, city, district)
    
    def crawl_rajasthan_gopalan(self, max_districts: int = 5) -> List[Dict]:
        """
        Crawl Rajasthan Gopalan Department portal
        Source: gopalanapp.rajasthan.gov.in
        """
        print("\n🔍 Crawling Rajasthan Gopalan Portal...")
        
        # This is a government portal that may require specific API calls
        # For now, we'll use their public listing if available
        base_url = "https://gopalanapp.rajasthan.gov.in"
        
        gaushalas = []
        
        try:
            # Try to access the main listing
            response = self.session.get(base_url, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'lxml')
                
                # Look for gaushala listings
                items = soup.select('.gaushala, .listing, tr')
                
                for item in items[:100]:  # Limit
                    try:
                        name_el = item.select_one('td:first-child, .name')
                        if name_el:
                            gaushalas.append({
                                'id': f"RJ-GOV-{len(gaushalas)+1:03d}",
                                'name': name_el.get_text(strip=True),
                                'state': 'Rajasthan',
                                'verified': True,
                                'source': 'Rajasthan Gopalan Dept'
                            })
                    except:
                        pass
                
                print(f"  ✅ Found {len(gaushalas)} from Rajasthan Gopalan")
            else:
                print(f"  ⚠️ Portal returned {response.status_code}")
                print("  💡 Try accessing manually: https://gopalanapp.rajasthan.gov.in")
                
        except requests.RequestException as e:
            print(f"  ❌ Portal access failed: {e}")
            print("  💡 Government portals may require manual access")
        
        self.results.extend(gaushalas)
        return gaushalas
    
    def crawl_maharashtra_goseva(self) -> List[Dict]:
        """
        Crawl Maharashtra Goseva Aayog
        """
        print("\n🔍 Crawling Maharashtra Goseva Aayog...")
        
        # Maharashtra Goseva Aayog directory
        gaushalas = []
        
        # Note: Most government sites require manual download of PDFs
        print("  💡 Maharashtra Goseva data typically available as PDF at:")
        print("     https://mhgosevaayog.gov.in")
        print("  💡 Use gaushala_processor.py to convert PDF→CSV→JSON")
        
        return gaushalas
    
    def crawl_awbi(self) -> List[Dict]:
        """
        Crawl AWBI (Animal Welfare Board of India) grant lists
        """
        print("\n🔍 Checking AWBI Grant Lists...")
        
        print("  💡 AWBI publishes grant recipient PDFs at:")
        print("     https://awbi.gov.in")
        print("  💡 These contain verified NGO names with registration IDs")
        print("  💡 Download PDF → Extract to CSV → Use gaushala_processor.py")
        
        return []


def main():
    crawler = GaushalaCrawler()
    
    if len(sys.argv) < 2:
        print("🐄 Gaushala Web Crawler")
        print("=" * 50)
        print("\nUsage:")
        print("  python gaushala_crawler.py --source helpgaushala")
        print("  python gaushala_crawler.py --source rajasthan")
        print("  python gaushala_crawler.py --all")
        print("\nSources:")
        print("  helpgaushala  - helpgaushala.com directory")
        print("  rajasthan     - Rajasthan Gopalan Dept")
        print("  maharashtra   - Maharashtra Goseva Aayog")
        print("  awbi          - AWBI grant recipients")
        print("  all           - Crawl all sources")
        return
    
    source = sys.argv[1].lower().replace('--source', '').replace('--', '').strip()
    
    if source == 'helpgaushala':
        crawler.crawl_helpgaushala(max_pages=10)
    elif source == 'rajasthan':
        crawler.crawl_rajasthan_gopalan()
    elif source == 'maharashtra':
        crawler.crawl_maharashtra_goseva()
    elif source == 'awbi':
        crawler.crawl_awbi()
    elif source == 'all':
        crawler.crawl_helpgaushala(max_pages=10)
        crawler.crawl_rajasthan_gopalan()
        crawler.crawl_maharashtra_goseva()
        crawler.crawl_awbi()
    else:
        print(f"❌ Unknown source: {source}")
        return
    
    if crawler.results:
        crawler.save_results('crawled_gaushalas.json')
        print("\n📋 Next steps:")
        print("  1. Review crawled_gaushalas.json")
        print("  2. Add geocoding: python gaushala_processor.py crawled.csv output.json")
        print("  3. Merge into gaushala-data.js")


if __name__ == "__main__":
    main()
