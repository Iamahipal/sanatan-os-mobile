"""
Gita Data Pipeline
------------------
Ingests Bhagavad Gita data from JSON/Text sources and enriches it using Google Gemini API.
Standard for building the "Offline Brain" for Krishna Vaani.
"""

import os
import json
import time
import argparse
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
"""

class GitaPipeline:
    def __init__(self, api_key):
        print(f"[INFO] Initializing Gemini API...")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-pro") 
        self.verses = []

    def enrich_verse(self, verse):
        """Call Gemini to get themes/situations"""
        try:
            input_text = f"Verse {verse.get('chapter', '?')}.{verse.get('verse', '?')}: {verse.get('translation', '')}"
            prompt = SYSTEM_PROMPT.replace("{verse_data}", input_text)
            
            response = self.model.generate_content(prompt)
            data = json.loads(response.text.replace("```json", "").replace("```", "").strip())
            
            verse.update(data)
            print(f"    [AI] Enriched {verse.get('ref')}")
            return verse
        except Exception as e:
            return verse

    def load_json(self, path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Heuristic for different dataset formats:
                if isinstance(data, list): return data 
                if 'chapters' in data: return data['chapters']
                if 'BhagavadGitaChapter' in data: return data['BhagavadGitaChapter'] # DharmicData format
                
                # If single dict has 'chapter' key, maybe it is a list of 1?
                # or keys are just wrappers
                for k in data.keys():
                    if isinstance(data[k], list) and len(data[k]) > 0 and 'verse' in data[k][0]:
                        return data[k]
                
                return []
        except Exception as e:
            print(f"    Error reading {path}: {e}")
            return []

    def run(self, source_path):
        print(f"[DIR] Loading data from {source_path}...")
        
        raw_verses = []
        if os.path.isdir(source_path):
            print(f"[DIR] Scanning directory {source_path} recursively...")
            for root, _, files in os.walk(source_path):
                for f in files:
                    if f.endswith('.json'):
                        full_path = os.path.join(root, f)
                        vers = self.load_json(full_path)
                        # print(f"  Found {len(vers)} in {f}")
                        raw_verses.extend(vers)
        else:
            raw_verses = self.load_json(source_path)
            
        print(f"[PROC] Found {len(raw_verses)} verses. Processing...")
        
        normalized = []
        for v in raw_verses:
            if not isinstance(v, dict): continue
            
            # DharmicData "text" often contains Sanskrit. "translations" is a dict.
            # We need to extract one good translation.
            
            trans = v.get('translation', '')
            if not trans and 'translations' in v:
                # Picker preferred English translation
                t_dict = v['translations']
                # Try specific authors or take first available
                trans = t_dict.get('swami sivananda') or t_dict.get('swami adidevananda') or next(iter(t_dict.values()), '')

            normalized.append({
                "chapter": v.get('chapter') or v.get('chapter_number') or 0,
                "verse": v.get('verse') or v.get('verse_number') or 0,
                "ref": f"{v.get('chapter',0)}.{v.get('verse',0)}",
                "sanskrit": v.get('text') or v.get('slok', ''),
                "translation": trans,
                "themes": v.get('themes', []),
                "situations": v.get('situations', [])
            })
            
        # Sort by Chapter/Verse
        normalized.sort(key=lambda x: (int(x['chapter']), int(x['verse'])))

        # Enrich First 20 Verses (Limit to ensure timely finish), Save ALL
        print(f"[AI] Enriching first 20 verses (saving all {len(normalized)})...")
        
        for i, verse in enumerate(normalized):
            if i < 20: 
                print(f"  Enriching {verse['ref']}...")
                self.verses.append(self.enrich_verse(verse))
                time.sleep(1.2)
            else:
                self.verses.append(verse)

        self.save()

    def save(self):
        output = {
            "meta": {"generated": time.strftime('%Y-%m-%d'), "count": len(self.verses)},
            "verses": self.verses 
        }
        
        js_path = "apps/gita-ai/js/gita-data-complete.js"
        os.makedirs(os.path.dirname(js_path), exist_ok=True)
        
        with open(js_path, "w", encoding="utf-8") as f:
            f.write("const GITA_DATA_COMPLETE = ")
            json.dump(output, f, indent=4, ensure_ascii=False)
            f.write(";\n")
        print(f"[DONE] Saved {len(self.verses)} verses to {js_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--api_key", required=True)
    args = parser.parse_args()
    
    pipeline = GitaPipeline(args.api_key)
    pipeline.run(args.source)
