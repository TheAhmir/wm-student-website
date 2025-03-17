from fastapi import APIRouter
from pydantic import BaseModel
import cloudinary.api
import datetime
import random
import uuid
from utils.image_storage import getOptimizedUrl

router = APIRouter(prefix="/shop_posts")

class ImagePost(BaseModel):
    post_id: str
    user_id: str
    title: str
    price: float
    description: str
    createdat: datetime.datetime
    

# get sample image urls
@router.get("/")
async def get_sample_posts():
    try:
        posts = []
        result = cloudinary.api\
        .resources(
        type = "upload", 
        prefix = "sample")

        for i in result["resources"]:
            optimized_url = getOptimizedUrl(i['public_id'])
            element = {
                "post_id" : str(uuid.uuid4()),
                "user_id" : str(uuid.uuid4()),
                "images" : [{
                    "asset_id" : i["asset_id"],
                    "url" : optimized_url
                }],
                "title" : i["display_name"],
                "price" : round(random.uniform(1.0, 100.0), 2),
                "description" : "this is a sample image.",
                "createdat" : datetime.datetime.now()
            }
            posts.append(element)

        return posts
    except cloudinary.exceptions.Error as e:
        print(f"Error fetching images: {e}")
        return []

