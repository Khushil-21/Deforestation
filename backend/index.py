from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from typing import List
from fastapi.middleware.cors import CORSMiddleware
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
    "https://deforestation-frontend.vercel.app",
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
sentinal = ee.ImageCollection("MODIS/006/MOD44B")
l4 = ee.ImageCollection("LANDSAT/LT04/C02/T1_L2")
l5 = ee.ImageCollection("LANDSAT/LT05/C02/T1_L2")
l7 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2")
l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")

data = {}
report = str()


class BboxRequest(BaseModel):
    bbox: List[float] = None
    platform: str = "Production"


class QnaRequest(BaseModel):
    question: str = None


def filter_col(col, roi, start_date, end_date):
    return col.filterBounds(roi).filterDate(start_date, end_date)


def generateMasks(
    start_date,
    end_date,
    i,
    bbox=[-59.5026, 2.9965, -59.2035, 3.1899],
    platform="Production",
):
    # Define the collections
    global l4, l5, l6, l7, l8, l9
    roi = ee.Geometry.Rectangle(bbox)

    filtered_sentinal = filter_col(sentinal, roi, start_date, end_date)
    # Example: Get the first image from the merged collection
    first_image = filtered_sentinal.first()

    rgb_img = geemap.ee_to_numpy(first_image, region=roi)

    print(f"Original image shape: {rgb_img.shape}")

    # Ensure the image has 3 channels (RGB)
    if len(rgb_img.shape) == 2:
        rgb_img = np.stack((rgb_img,) * 3, axis=-1)
    elif rgb_img.shape[2] == 1:
        rgb_img = np.repeat(rgb_img, 3, axis=2)
    elif rgb_img.shape[2] > 4:
        rgb_img = rgb_img[:, :, :3]  # Take only the first 3 channels

    print(f"Processed image shape: {rgb_img.shape}")

    # Normalize the image to 0-255 range
    rgb_img = (
        (rgb_img - rgb_img.min()) / (rgb_img.max() - rgb_img.min()) * 255
    ).astype(np.uint8)

    # Create a mask for forest (green) and land (red)
    forest_mask = rgb_img[:, :, 0] > 125  # Assuming higher values indicate forest
    land_mask = ~forest_mask

    # Create a new image with red for land and green for forest
    colored_img = np.zeros_like(rgb_img)
    if platform == "Production":
        colored_img[land_mask] = [138, 190, 255]  # Red for land
        colored_img[forest_mask] = [138, 255, 151]  # Green for forest
    else:
        colored_img[land_mask] = [138, 255, 151]  # Red for land
        colored_img[forest_mask] = [138, 190, 255]  # Green for forest

    # Save the colorful image to a local file
    local_filename = f"temp_image_{i}.png"
    plt.imsave(local_filename, colored_img)

    # Upload the local file to Cloudinary
    response = cloudinary.uploader.upload(local_filename, resource_type="image")
    print("Uploaded image URL:", response["url"])

    # Remove the temporary local file
    os.remove(local_filename)

    # Calculate forest and land percentages
    total_pixels = rgb_img.shape[0] * rgb_img.shape[1]
    forest_pixels = np.sum(forest_mask)
    land_pixels = np.sum(land_mask)

    forest_percentage = (forest_pixels / total_pixels) * 100
    land_percentage = (land_pixels / total_pixels) * 100

    print(start_date)
    print(f"Forest Percentage: {forest_percentage:.2f}%")
    print(f"Land Percentage: {land_percentage:.2f}%")

    if platform == "Production":
        print("Production")
        return {
            "year": i - 1,
            "forest Area(%)": forest_percentage,
            "land_Area(%)": land_percentage,
            "img_url": response["url"],
        }
    else:
        print("Local")
        return {
            "year": i - 1,
            "forest Area(%)": land_percentage,
            "land_Area(%)": forest_percentage,
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
    print(request.platform + " is the platform")
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
    for i in range(1999, 2022, 1):
        start_date = ee.Date.fromYMD(i - 1, 1, 1)
        end_date = ee.Date.fromYMD(i + 1, 12, 31)
        forestData.append(
            generateMasks(start_date, end_date, i, bbox, request.platform)
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
