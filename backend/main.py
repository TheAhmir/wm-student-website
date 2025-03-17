from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import courses, reviews, users, shop

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_methods = ["*"],
    allow_headers=["*"]
)

app.include_router(courses.router)
app.include_router(reviews.router)
app.include_router(users.router)
app.include_router(shop.router)

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI"}
