from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.engine import Connection
from sqlalchemy.sql import text
from pydantic import BaseModel, EmailStr
from utils.database import get_db

router = APIRouter(prefix="/users")

class User(BaseModel):
    id: str
    name: str
    email: EmailStr
    

# GET ALL USERS
@router.get("/")
async def get_all_users(db: Connection = Depends(get_db)):
    try:
        result = db.execute(text("SELECT * FROM users"))
        users = [dict(row) for row in result.mappings()]
        if not users:
            return []
        return users
    except Exception as e:
        print(f"Error retrieving users: {e}")
        
        raise HTTPException(status_code=500, detail="Internal Service Error")

# ADD NEW USER
@router.post("/add_user")
async def add_user(user: User, db: Connection = Depends(get_db)):
    try:
        new_user = user.dict()

        query = "INSERT INTO users (id, name, email) VALUES (:id, :name, :email)"

        result = db.execute(text(query), new_user)

        if result.rowcount == 0:
            raise HTTPException(status_code=400, detail="A problem occured while attempting to add user.")

        db.commit()
        
        return {"message": "User added successfully", "user" : new_user}
        
    except Exception as e:
        print(f"Error adding user {e}")
        raise HTTPException(status_code=500, detail="Internal Service Error")

# GET USER REVIEWS
@router.get("/reviews/{user_id}")
async def get_specific_reviews(user_id: str, db: Connection = Depends(get_db)):
    try:
        query = """
            SELECT reviews.id as id, prefix, code, title, difficulty, workload, professor, body, createdat
            FROM reviews
            JOIN users ON users.id = reviews.userid
            JOIN courses on courses.id = reviews.courseid
            WHERE userid = :user_id
            ORDER BY createdat DESC
        """
        result = db.execute(text(query), {"user_id" : user_id})
        reviews = [dict(row) for row in result.mappings()]

        for i in reviews:
            formatted_date = i['createdat'].strftime('%m/%d/%Y %I:%M %p')
            i['createdat_date'] = i['createdat'].strftime('%m/%d/%Y')
            i['createdat_time'] = i['createdat'].strftime('%I:%M %p')
            i['createdat'] = formatted_date
            

        if not reviews:
            return []
        return reviews
    except Exception as e:
        print(f"Error retrieving individual course reviews: {e}")
        raise HTTPException(status_code=500, detail="Internal Service Error")
