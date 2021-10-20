from typing import List
from schemas.student import StudentInfo
from schemas.librarian import LibrarianInfo
from fastapi import APIRouter, Depends
from config.db import db
from config.librarian_auth_config import get_current_active_user as get_current_active_librarian
from config.student_auth_config import get_current_active_user as get_current_active_student


router = APIRouter()
# collection = db.user

@router.get("/")
async def root():
    return {"response": "Welcome to your app!"}


@router.get("/api/users/librarian/", response_model=LibrarianInfo)
async def read_users_me(current_user: LibrarianInfo = Depends(get_current_active_librarian)):
    return current_user


@router.get("/api/users/student/", response_model=StudentInfo)
async def read_users_me(current_user: StudentInfo = Depends(get_current_active_student)):
    return current_user