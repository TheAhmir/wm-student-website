import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os

load_dotenv()

cloudinary.config( 
    cloud_name = os.getenv("img_storage_name"), 
    api_key = os.getenv("img_storage_api_key"), 
    api_secret = os.getenv("img_storage_api_secret"),
    secure=True
)

def getOptimizedUrl(image_id):
    optimize_url, _ = cloudinary_url(image_id, fetch_format="auto", quality="auto")
    return optimize_url
