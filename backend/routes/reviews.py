from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.engine import Connection
from sqlalchemy.sql import text
from pydantic import BaseModel
from typing import Optional
from utils.database import get_db

router = APIRouter(prefix="/reviews")

class Review(BaseModel):
    courseid: str
    userid: str
    difficulty: float
    workload: float
    professor: Optional[str] = None
    body: str

# GET ALL REVIEWS
@router.get("/")
async def get_all_reviews(db: Connection = Depends(get_db)):
    try:
        result = db.execute(text("SELECT * FROM reviews"))  # Pure SQL query
        reviews = [dict(row) for row in result.mappings()]  # Convert rows to dictionaries
        return reviews
    except Exception as e:
            print(f"Error retrieving reviews: {e}")  # Logs error to terminal
            raise HTTPException(status_code=500, detail="Internal Server Error")

# GET REVIEWS BY COURSE
@router.get("/course/{course_id}")
async def get_reviews_by_course(course_id : str, db: Connection = Depends(get_db)):
    try:
        query = text("""
            SELECT reviews.id, courseid, userid, name, difficulty, workload, professor, body, createdat FROM reviews
            JOIN users ON users.id = reviews.userid
            WHERE courseid = :course_id
            """)
        result = db.execute(query, {"course_id" : course_id})
        reviews = [dict(row) for row in result.mappings()]
        for i in reviews:
            formatted_date = i['createdat'].strftime("%m/%d/%Y %I:%M %p")
            i['createdat'] = formatted_date

        if not reviews:
            return []
        return reviews
    except Exception as e:
        print(f"Error retrieving course reviews: {e}")

        raise HTTPException(status_code=500, detail="Internal Service Error")

# CREATE COMMENT FOR A COURSE
@router.post("/create_review")
async def create_new_review(review: Review, db: Connection = Depends(get_db)):
    try:
        print("Received Review Body:", review.dict())
        new_review = review.dict()
        if new_review["professor"] is not None:
            query = text("""
                             INSERT INTO reviews (id, courseid, userid, difficulty, workload, professor, body)
                             VALUES (uuid_generate_v4(), :courseid, :userid, :difficulty, :workload, :professor, :body)
                         """)
        else:
            query = text("""
                             INSERT INTO reviews (id, courseid, userid, difficulty, workload, body)
                             VALUES (uuid_generate_v4(), :courseid, :userid, :difficulty, :workload, :body)
                         """)

        db.execute(query, new_review)
        
        db.commit()
            
        return {"message": "Review added successfully", "review" : new_review}
    except Exception as e:
        print(f"Error creating new review: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
