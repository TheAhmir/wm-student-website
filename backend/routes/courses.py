from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.engine import Connection
from sqlalchemy.sql import text
from utils.database import get_db

router = APIRouter(prefix="/courses")

@router.get("/")
async def get_all_courses(db: Connection = Depends(get_db)):
    try:
        result = db.execute(text("SELECT courses.id, prefix, code, title, COUNT(reviews.id) as num_reviews FROM courses LEFT JOIN reviews ON reviews.courseid = courses.id GROUP BY courses.id, prefix, code, title ORDER BY prefix ASC, code ASC"))  # Pure SQL query
        courses = [dict(row) for row in result.mappings()]  # Convert rows to dictionaries
        return courses
    except Exception as e:
            print(f"Error retrieving courses: {e}")  # Logs error to terminal
            raise HTTPException(status_code=500, detail="Internal Server Error")

