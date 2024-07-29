from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()


@app.get("/")
def hello_world():
    return {"message": "Hello From Python Backend"}

@app.get("/api/get/history/{year}")
async def get_history(year: int, data: list | None = None):
    
    
    
    return {
        "message": f"Fetching history for year {year}",
        "received_data": data,
        "year": year
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="localhost", port=port)
