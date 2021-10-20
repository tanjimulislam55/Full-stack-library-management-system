from fastapi import APIRouter, Depends
from config.db import db
from config.student_auth_config import get_current_active_user
from schemas.student import StudentInfo

router = APIRouter()
collection = db.students



@router.put('/student_book_request_{book_id}_{student_id}', response_description="Student book req to borrow")
async def student_book_req(book_id: str, student_id: str, current_user: StudentInfo = Depends(get_current_active_user)):
    await collection.update_one({"_id": student_id}, {"$set": {"book_req": book_id}})
    return "request was sent"


