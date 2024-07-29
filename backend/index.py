from fastapi import FastAPI
import uvicorn
import os
import tensorflow as tf
from tensorflow.keras.models import Model
import numpy as np
import cv2
import ee
import geemap
import leafmap
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
import keras
import pandas as pd
import cloudinary
import cloudinary.uploader
import cloudinary.api
from PIL import Image
import io

app = FastAPI()


def filter_col(col, roi, start_date, end_date):
    return col.filterBounds(roi).filterDate(start_date, end_date)
    
def generateMasks(start_date,end_date,intermediate_layer_model,bbox=[-59.5026, 2.9965, -59.2035, 3.1899]):
    
    # Define the collections
    forestData=[]
    roi = ee.Geometry.Rectangle(bbox)
    l4 = ee.ImageCollection("LANDSAT/LT04/C02/T1_L2")
    l5 = ee.ImageCollection("LANDSAT/LT05/C02/T1_L2")
    l7 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2")
    l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
    l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")

    # Helper function to filter collections


    # Filter each collection
    filtered_l4 = filter_col(l4, roi, start_date, end_date)
    filtered_l5 = filter_col(l5, roi, start_date, end_date)
    filtered_l7 = filter_col(l7, roi, start_date, end_date)
    filtered_l8 = filter_col(l8, roi, start_date, end_date)
    filtered_l9 = filter_col(l9, roi, start_date, end_date)

    # Merge the filtered collections
    merged_collection = ee.ImageCollection(filtered_l4.merge(filtered_l5).merge(filtered_l7).merge(filtered_l8).merge(filtered_l9))

    # Example: Get the first image from the merged collection
    first_image = merged_collection.first()


    rgb_img = geemap.ee_to_numpy(first_image, region=roi)

    print(rgb_img.shape)

    img=rgb_img[:,:,0]
    image = Image.fromarray(img)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    response = cloudinary.uploader.upload(buffer, resource_type='image')
    print("Uploaded image URL:", response['url'])
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(img)
    scaled_data*=255

    img_resized = cv2.resize(scaled_data, (512, 512))
    img_resized = np.expand_dims(img_resized, axis=-1)
    img_resized = np.expand_dims(img_resized, axis=0)


    intermediate_output = intermediate_layer_model.predict(img_resized)
    out=intermediate_output[0,:,:,0]

    binary_mask = np.where(scaled_data >= 125, 1, 0)


    total_pixels = binary_mask.size
    forest_pixels = np.sum(binary_mask >=0.9)
    land_pixels = np.sum(binary_mask < 0.9)

    forest_percentage = (forest_pixels / total_pixels) * 100
    land_percentage = (land_pixels / total_pixels) * 100

    print(start_date)
    print(f"Forest Percentage: {forest_percentage:.2f}%")
    print(f"Land Percentage: {land_percentage:.2f}%")

    forestData.append({'start_date':start_date,'end_date':end_date,'forest Area(%)':forest_percentage,'land_Area(%)':land_percentage,'img_url':response['url']})
    return forestData

@app.get("/")
def hello_world():
    return {"message": "Hello From Python Backend"}

@app.post("/api/get/history/{year}")
async def get_history(year: int, bbox: list | None = None):
    ee.Authenticate()
    ee.Initialize()
    cloudinary.config(
    cloud_name = 'dzqf5owza',  # Replace with your Cloudinary cloud name
    api_key = '831483217291572',        # Replace with your Cloudinary API key
    api_secret = 'WZnkpFNMTxWMVV8o8QJfEXjjlVU'   # Replace with your Cloudinary API secret
    )


    keras.config.enable_unsafe_deserialization()
    model = tf.keras.models.load_model("F:\\Maverick\\unet_model_final.keras")
    layer_name = 'conv2d_35'  # Replace with your layer of interest
    intermediate_layer_model = Model(inputs=model.input, outputs=model.get_layer(layer_name).output)

    bbox=bbox
    year=year
    start_date=ee.Date.fromYMD(year - 1,1,1)
    end_date = ee.Date.fromYMD(year + 1,12,31)
    data=generateMasks(start_date,end_date,intermediate_layer_model,bbox)
    
    
    return {
        "message": f"Fetching history for year {year}",
        "received_data": data,
        "year": year
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="localhost", port=port)
    

