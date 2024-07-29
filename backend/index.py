from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()

@app.get("/")
def hello_world():
    return {"message": "Hello, World!"}
