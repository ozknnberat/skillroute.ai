from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"durum": "Backend ayakta! Gokay'in gercek kodlari bekleniyor..."}