"""
Gaushala Data Processor
-----------------------
Reads a CSV of Gaushala names/addresses, geocodes them using Nominatim (free),
and outputs formatted JSON for gaushala-data.js

Usage:
    python gaushala_processor.py input.csv output.json

Requirements:
    pip install pandas geopy

Author: SanatanOS Team
"""

import csv
import json
import time
import sys
from typing import Optional, Dict, List

# Try to import geopy, provide instructions if not available
try:
    from geopy.geocoders import Nominatim
    from geopy.exc import GeocoderTimedOut, GeocoderServiceError
    GEOPY_AVAILABLE = True
except ImportError:
    GEOPY_AVAILABLE = False
    print("⚠️  geopy not installed. Run: pip install geopy")
    print("   Continuing without geocoding...")


def geocode_address(address: str, geolocator) -> Optional[Dict]:
    """
    Geocode an address using Nominatim (OpenStreetMap)
    Returns: { lat, lng } or None
    """
    if not GEOPY_AVAILABLE or not geolocator:
        return None
    
    try:
        location = geolocator.geocode(address + ", India", timeout=10)
        if location:
            return {
                "lat": round(location.latitude, 4),
                "lng": round(location.longitude, 4)
            }
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"  ⚠️ Geocoding failed for: {address[:30]}... ({e})")
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    return None


def generate_id(state: str, district: str, index: int) -> str:
    """Generate a unique ID like RJ-JOD-001"""
    state_code = state[:2].upper() if state else "XX"
    district_code = district[:3].upper() if district else "000"
    return f"{state_code}-{district_code}-{index:03d}"


def process_csv(input_file: str, output_file: str):
    """
    Process CSV file and output JSON for gaushala-data.js
    
    Expected CSV columns:
    name, state, city, district, address, pincode, phone, whatsapp, type, source
    """
    
    # Initialize geocoder
    geolocator = None
    if GEOPY_AVAILABLE:
        geolocator = Nominatim(user_agent="gaushala_processor_sanatan_os")
        print("✅ Geocoder initialized (Nominatim/OpenStreetMap)")
    
    gaushalas = []
    
    print(f"\n📂 Reading: {input_file}")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for i, row in enumerate(reader, 1):
                print(f"  Processing {i}: {row.get('name', 'Unknown')[:40]}...")
                
                # Build address for geocoding
                full_address = f"{row.get('address', '')}, {row.get('city', '')}, {row.get('district', '')}, {row.get('state', '')}"
                
                # Geocode (with rate limiting)
                geo = geocode_address(full_address, geolocator)
                if GEOPY_AVAILABLE:
                    time.sleep(1.1)  # Nominatim requires 1 req/sec
                
                # Build gaushala entry
                gaushala = {
                    "id": row.get('id') or generate_id(row.get('state'), row.get('district'), i),
                    "name": row.get('name', '').strip(),
                    "state": row.get('state', '').strip(),
                    "city": row.get('city', '').strip(),
                    "district": row.get('district', '').strip(),
                    "address": row.get('address', '').strip(),
                    "pincode": row.get('pincode', '').strip(),
                    "phone": row.get('phone', '').strip() or None,
                    "whatsapp": row.get('whatsapp', '').strip() or None,
                    "type": row.get('type', 'Unknown').strip(),
                    "verified": row.get('source', '').lower() in ['awbi', 'government', 'state'],
                    "source": row.get('source', 'Manual Entry').strip(),
                    "geo": geo
                }
                
                # Add capacity if provided
                if row.get('capacity'):
                    try:
                        gaushala["capacity"] = int(row.get('capacity'))
                    except ValueError:
                        pass
                
                gaushalas.append(gaushala)
        
        print(f"\n✅ Processed {len(gaushalas)} entries")
        
        # Output JSON
        output = {
            "lastUpdated": time.strftime("%Y-%m-%d"),
            "count": len(gaushalas),
            "gaushalas": gaushalas
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Saved to: {output_file}")
        
        # Show sample
        print("\n📋 Sample entry:")
        print(json.dumps(gaushalas[0] if gaushalas else {}, indent=2, ensure_ascii=False))
        
    except FileNotFoundError:
        print(f"❌ File not found: {input_file}")
        print("\n📝 Create a CSV file with these columns:")
        print("   name, state, city, district, address, pincode, phone, whatsapp, type, source")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


def create_sample_csv(filename: str = "gaushala_template.csv"):
    """Create a sample CSV template"""
    headers = ["name", "state", "city", "district", "address", "pincode", "phone", "whatsapp", "type", "source", "capacity"]
    
    sample_data = [
        {
            "name": "Shri Krishna Gaushala",
            "state": "Uttar Pradesh",
            "city": "Vrindavan",
            "district": "Mathura",
            "address": "Near Banke Bihari Temple",
            "pincode": "281121",
            "phone": "",
            "whatsapp": "919876543210",
            "type": "Trust",
            "source": "Manual Entry",
            "capacity": "450"
        }
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(sample_data)
    
    print(f"✅ Created template: {filename}")
    print("   Fill this CSV with Gaushala data, then run:")
    print(f"   python gaushala_processor.py {filename} output.json")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("🐄 Gaushala Data Processor")
        print("=" * 40)
        print("\nUsage:")
        print("  python gaushala_processor.py <input.csv> <output.json>")
        print("  python gaushala_processor.py --template")
        print("\nExamples:")
        print("  python gaushala_processor.py gaushalas.csv output.json")
        print("  python gaushala_processor.py --template")
        sys.exit(0)
    
    if sys.argv[1] == "--template":
        create_sample_csv()
    else:
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else "gaushalas_output.json"
        process_csv(input_file, output_file)
