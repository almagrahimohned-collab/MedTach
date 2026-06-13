import json
import time
import requests
import os

SUPABASE_URL = "https://mpegiwdjovzvzqxtgifj.supabase.co"
SUPABASE_KEY = "sb_publishable_BPJm4CyR7EaM5fdYB_6NaQ_9Ei4nt2O"
BUCKET = "imaging"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
}

with open("output/openi_data.json") as f:
    data = json.load(f)

total = 0
for category, images in data.items():
    safe_cat = category.replace(" ", "_")
    print(f"\n📤 {safe_cat}: {len(images)} images")
    
    for img in images:
        try:
            # 1. Download image from OpenI
            resp = requests.get(img["image_url"], timeout=60)
            if resp.status_code != 200:
                print(f"  ⚠️ Download: {img['uid']}")
                continue
            
            # 2. Upload to Supabase Storage
            filename = f"{safe_cat}/{img['uid']}.png"
            upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{filename}"
            
            upload_headers = {**HEADERS, "Content-Type": "image/png"}
            upload_resp = requests.post(upload_url, headers=upload_headers, data=resp.content)
            
            if upload_resp.status_code not in [200, 201]:
                print(f"  ⚠️ Upload failed ({upload_resp.status_code}): {img['uid']}")
                continue
            
            # 3. Get public URL
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
            
            # 4. Insert into database
            db_url = f"{SUPABASE_URL}/rest/v1/imaging_library"
            db_data = {
                "image_id": img["uid"],
                "category": safe_cat,
                "modality": "xray",
                "body_part": "chest",
                "diagnosis": img["diagnosis"],
                "findings": json.dumps(img.get("findings", [])),
                "problems": img.get("problems", ""),
                "image_url": public_url,
                "source": "OpenI_NIH"
            }
            
            db_headers = {
                **HEADERS,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
            
            db_resp = requests.post(db_url, headers=db_headers, json=db_data)
            
            total += 1
            if total % 25 == 0:
                print(f"  ✅ {total} uploaded")
            
            time.sleep(1)
            
        except Exception as e:
            print(f"  ❌ {img['uid']}: {e}")
    
    print(f"  ✅ {safe_cat} done!")

print(f"\n🎉 Total: {total} images")
