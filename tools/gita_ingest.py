"""
Gita Data Pipeline
------------------
Ingests Bhagavad Gita data from JSON/Text sources and enriches it using Google Gemini API.
Standard for building the "Offline Brain" for Krishna Vaani.

Supported Sources:
1. JSON File (Standard format: {chapters: [...]})
2. Directory of JSONs (e.g., from vedicscriptures repo)
3. Raw Text/PDF (Legacy support)

Usage:
    python tools/gita_ingest.py --source data/gita.json --api_key YOUR_GEMINI_KEY
"""

import os
import json
import time
import argparse
# import vertexai (Replacing with simple google.generativeai for ease of use)
import google.generativeai as genai

SYSTEM_PROMPT = """
You are an expert Vedic Psychologist.
Analyze the following Bhagavad Gita verse.
Input: {verse_data}

Output JSON (ONLY):
{
    "explanation": "Psychological/Spiritual explanation (max 2 sentences)",
    "themes": ["Theme1", "Theme2"],
    "situations": ["Situation1", "Situation2"]
}
Themes: Single words (e.g., Karma, Dharma, Focus).
Situations: Relatable states (e.g., Anxiety, Failure, Leadership).
"""

class GitaPipeline:
    def __init__(self, api_key):
        print(f"🧠 Initializing Gemini API...")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.verses = []

    def enrich_verse(self, verse):
        """Call Gemini to get themes/situations"""
        try:
            # Construct a concise input for the model
            input_text = f"Verse {verse.get('chapter', '?')}.{verse.get('verse', '?')}: {verse.get('translation', '')}"
            prompt = SYSTEM_PROMPT.replace("{verse_data}", input_text)
            
            response = self.model.generate_content(prompt)
            data = json.loads(response.text.replace("```json", "").replace("```", "").strip())
            
            # Merge enriched data
            verse.update(data)
            print(f"    ✨ Enriched {verse.get('ref')}: {data.get('themes')}")
            return verse
        except Exception as e:
            print(f"    ⚠️ AI Enrichment failed: {e}")
            return verse

    def load_json(self, path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Normalize structure - handle different dataset formats
                if isinstance(data, list): return data # List of verses
                if 'chapters' in data: return data['chapters'] # Nested chapters
                return []
        except Exception as e:
            print(f"    Error reading {path}: {e}")
            return []

    def run(self, source_path):
        print(f"📂 Loading data from {source_path}...")
        
        raw_verses = []
        if os.path.isdir(source_path):
            print(f"📂 Scanning directory {source_path} recursively...")
            for root, _, files in os.walk(source_path):
                for f in files:
                    if f.endswith('.json'):
                        full_path = os.path.join(root, f)
                        # print(f"  Found {f}") # Optional debug
                        raw_verses.extend(self.load_json(full_path))
        else:
            raw_verses = self.load_json(source_path)
            
        print(f"⚡ Processing {len(raw_verses)} verses...")
        
        # Flatten/Normalize
        # This part depends on input format. Assuming "vedicscriptures" style or list of dicts
        normalized = []
        for v in raw_verses:
            # Check if this looks like a verse object
            if not isinstance(v, dict): continue
            
            # Smart extraction of fields based on common dataset keys
            normalized.append({
                "chapter": v.get('chapter_number') or v.get('chapter_id') or v.get('chapter', 0),
                "verse": v.get('verse_number') or v.get('verse_id') or v.get('verse', 0),
                "ref": f"{v.get('chapter_number') or v.get('chapter', 0)}.{v.get('verse_number') or v.get('verse', 0)}",
                "sanskrit": v.get('slok') or v.get('text') or v.get('sanskrit', ''),
                "translation": v.get('transliteration') or v.get('meaning') or v.get('translation', ''),
                "themes": v.get('themes', []),
                "situations": v.get('situations', [])
            })

        # Enrich Process (Limit 5 for testing, remove slice for full run)
        # Taking first 5 valid verses
        target_verses = normalized[:5] 
        print(f"🧪 Test Run: Enriching 5 verses...")
        
        for i, verse in enumerate(target_verses): 
            print(f"  Processing {i+1}/{len(target_verses)}...")
            self.verses.append(self.enrich_verse(verse))
            time.sleep(1)

        self.save()

    def save(self):
        output = {
            "meta": {"generated": time.strftime('%Y-%m-%d'), "count": len(self.verses)},
            "chapters": [], # Re-structure if needed or just flat list for RAG
            "verses": self.verses 
        }
        
        js_path = "apps/gita-ai/js/gita-data-complete.js"
        # Create directory if not exists (handling new users)
        os.makedirs(os.path.dirname(js_path), exist_ok=True)
        
        with open(js_path, "w", encoding="utf-8") as f:
            f.write("const GITA_DATA_COMPLETE = ")
            json.dump(output, f, indent=4, ensure_ascii=False)
            f.write(";\n")
        print(f"✅ Saved to {js_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--api_key", required=True)
    args = parser.parse_args()
    
    pipeline = GitaPipeline(args.api_key)
    pipeline.run(args.source)
