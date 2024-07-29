from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()

@app.get("/")
def hello_world():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="localhost", port=port)