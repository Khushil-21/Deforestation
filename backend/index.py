from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from typing import List
import numpy as np
import cv2
import ee
import geemap
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
import pandas as pd
import cloudinary
import cloudinary.uploader
import cloudinary.api
from PIL import Image
import io
from boy import generate_report, chatbot
from dotenv import load_dotenv

load_dotenv()

print(os.getenv("CLOUD_KEY"))
print(os.getenv("GROQ_API_KEY"))
report = []
app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
ee.Authenticate()
ee.Initialize(project="ee-khushilshah2105")
l4 = ee.ImageCollection("LANDSAT/LT04/C02/T1_L2")
l5 = ee.ImageCollection("LANDSAT/LT05/C02/T1_L2")
l7 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2")
l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")

data = {}
report = str()


class BboxRequest(BaseModel):
    bbox: List[float] = None


class QnaRequest(BaseModel):
    question: str = None


def filter_col(col, roi, start_date, end_date):
    return col.filterBounds(roi).filterDate(start_date, end_date)


def generateMasks(
    start_date,
    end_date,
    i,
    bbox=[-59.5026, 2.9965, -59.2035, 3.1899],
):

    # Define the collections
    global l4, l5, l6, l7, l8, l9
    roi = ee.Geometry.Rectangle(bbox)

    # Helper function to filter collections

    # Filter each collection
    filtered_l4 = filter_col(l4, roi, start_date, end_date)
    filtered_l5 = filter_col(l5, roi, start_date, end_date)
    filtered_l7 = filter_col(l7, roi, start_date, end_date)
    filtered_l8 = filter_col(l8, roi, start_date, end_date)
    filtered_l9 = filter_col(l9, roi, start_date, end_date)

    # Merge the filtered collections
    merged_collection = ee.ImageCollection(
        filtered_l4.merge(filtered_l5)
        .merge(filtered_l7)
        .merge(filtered_l8)
        .merge(filtered_l9)
    )

    # Example: Get the first image from the merged collection
    first_image = merged_collection.first()

    rgb_img = geemap.ee_to_numpy(first_image, region=roi)

    print(rgb_img.shape)

    img = rgb_img[:, :, 0]
    image = Image.fromarray(img)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    response = cloudinary.uploader.upload(buffer, resource_type="image")
    print("Uploaded image URL:", response["url"])
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(img)
    scaled_data *= 255

    img_resized = cv2.resize(scaled_data, (512, 512))

    binary_mask = np.where(scaled_data >= 125, 1, 0)

    total_pixels = binary_mask.size
    forest_pixels = np.sum(binary_mask >= 0.9)
    land_pixels = np.sum(binary_mask < 0.9)

    forest_percentage = (forest_pixels / total_pixels) * 100
    land_percentage = (land_pixels / total_pixels) * 100

    print(start_date)
    print(f"Forest Percentage: {forest_percentage:.2f}%")
    print(f"Land Percentage: {land_percentage:.2f}%")

    return {
        "year": i,
        "forest Area(%)": forest_percentage,
        "land_Area(%)": land_percentage,
        "img_url": response["url"],
    }


@app.get("/")
def hello_world():
    return {"message": "Hello From Python Backend"}


@app.post("/getBot")
def getBot(data: dict):
    global report
    print(data)
    resp = generate_report(data)

    myReport = {"report": resp}

    if report != myReport:
        report = myReport

    return report


@app.post("/api/get/history")
async def get_history(request: BboxRequest):
    print("we are here", request)
    global data
    forestData = []
    cloudinary.config(
        cloud_name="dzqf5owza",  # Replace with your Cloudinary cloud name
        api_key="831483217291572",  # Replace with your Cloudinary API key
        api_secret=os.getenv("CLOUD_KEY"),  # Replace with your Cloudinary API secret
    )

    print(request.bbox)
    bbox = request.bbox
    for i in range(1984, 2025, 5):
        start_date = ee.Date.fromYMD(i - 1, 1, 1)
        end_date = ee.Date.fromYMD(i + 1, 12, 31)
        forestData.append(
            generateMasks(start_date, end_date, i, bbox)
        )

    retFor = {
        "received_data": forestData,
    }

    if data != retFor:
        data = retFor

    return retFor


@app.post("/api/getAnswerBot")
async def getAnswerBot(request: QnaRequest):
    global report
    chat = chatbot(request.question, report)

    return chat


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="localhost", port=port)
