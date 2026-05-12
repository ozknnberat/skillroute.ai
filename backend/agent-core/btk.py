import os
import json
import asyncio
import chromadb
from google import genai
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

# 1. Ortam Değişkenleri
load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# 2. FastAPI ve CORS Ayarları (Mert'in UI bağlantısı için)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. RAG (ChromaDB) Kurulumu - 64GB RAM Gücüyle
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="donanim_katalogu")

# Örnek donanım verilerini indexliyoruz (Shopper Agent için)
collection.add(
    documents=[
        "Logitech G733 Kablosuz Kulaklık - 3500 TL - Üstün ses",
        "HyperX Alloy Origins Mekanik Klavye - 2000 TL - Hızlı tepki",
        "Razer DeathAdder V2 Mouse - 1500 TL - Ergonomik",
        "SteelSeries Arctis Nova - 2500 TL - Konforlu",
        "Rampage KB-R96 Klavye - 800 TL - Fiyat performans"
    ],
    metadatas=[{"type": "kulaklik"}, {"type": "klavye"}, {"type": "mouse"}, {"type": "kulaklik"}, {"type": "klavye"}],
    ids=["h1", "h2", "h3", "h4", "h5"]
)

@app.get("/generate-all/{konu}")
async def multi_agent_orchestrator(konu: str, butce: int = 5000):
    async def generate():
        print(f"--- Supervisor Agent Devrede: {konu} işleniyor... ---")
        
        # Berat'ın (Kaptan) istediği 'Data Contract' ve Gökay'ın 'Donanım Konsepti' bir arada
        prompt = f"""
        GÖREV: Kullanıcı '{konu}' öğrenmek istiyor ve {butce} TL bütçesi var.
        
        SADECE aşağıdaki formatta bir JSON döndür:
        {{
          "education_route": {{
            "nodes": [{{ "id": "n1", "label": "{konu} Giriş", "level": 0, "type": "theory", "status": "unlocked" }}],
            "edges": []
          }},
          "shopping_list": {{
            "budget_summary": "Buraya sadece donanımla ilgili tavsiyeni yaz. Örn: '{butce} TL bütçenle kulaklığa yüklendik. Yanına da şu klavyeyi çektik.'",
            "recommendations": [
               {{ "item": "Klavye Modeli", "price": 0, "reason": "..." }},
               {{ "item": "Mouse Modeli", "price": 0, "reason": "..." }},
               {{ "item": "Kulaklık Modeli", "price": 0, "reason": "..." }}
            ]
          }}
        }}

        KURALLAR: 
        1. Alışveriş listesinde sadece fiziksel donanım öner (Klavye, Mouse, Kulaklık).
        2. 'budget_summary' içinde eğitimden veya buluttan bahsetme, sadece donanım tavsiyesi ver.
        3. Nodes/Edges formatına KESİNLİKLE sadık kal.
        """
        
        responses = client.models.generate_content_stream(
            model="models/gemini-2.5-flash",
            config={"response_mime_type": "application/json"},
            contents=prompt
        )
        
        for chunk in responses:
            if chunk.text:
                yield chunk.text
                await asyncio.sleep(0.02)

    return StreamingResponse(generate(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
