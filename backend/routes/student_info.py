from fastapi import APIRouter, status, Depends
from typing import List
from config.db import db
from config.librarian_auth_config import get_current_active_user
from schemas.librarian import LibrarianInfo
from schemas.student import StudentInfo

router = APIRouter()
collection = db.students


@router.get('/students', response_model=List[StudentInfo], response_description="List of all student profile")
async def get_all_students(current_user: LibrarianInfo = Depends(get_current_active_user)):
    document = await collection.find().to_list(10000)
    return document


@router.get('/student/{id}', response_model=StudentInfo, response_description="Specific student info")
async def get_a_student(id: str, current_user: LibrarianInfo = Depends(get_current_active_user)):
    document = await collection.find_one({"_id": id})
    return document


