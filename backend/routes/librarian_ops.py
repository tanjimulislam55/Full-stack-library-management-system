from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from config.db import db
from config.librarian_auth_config import get_current_active_user
from schemas.student import StudentInfo, BorrowedBook
from schemas.librarian import LibrarianInfo
from schemas.borrowed_by import BorrowedBy

router = APIRouter()
collection_s = db.students
collection_b = db.books



@router.put('/process_book_request', response_description="Process book req to borrow")
async def book_req_process(borrowed_by: BorrowedBy, current_user: LibrarianInfo = Depends(get_current_active_user)):
    book_process_info = borrowed_by.dict()
    # for insertion to student info. There is only three fields been interated
    book_info = BorrowedBook(**book_process_info)
    print(book_process_info["student_id"])
    try:
        student_id = book_process_info["student_id"]
        book_id = book_process_info["book_id"]
        return_date = book_process_info["return_date"]
        await collection_s.update_one({"_id": student_id}, {"$set": {"book_info": jsonable_encoder(book_info)}})
        await collection_b.update_one({"_id": book_id}, {"$set": {"in_stock": False, "return_date": return_date}})
        return f"Successfully processed book request"
    except:
        return "Process unsuccessfull to process book request"


@router.put('/clear_book_request_{student_id}_{book_id}', response_description="Clear student book record")
async def clear_boroowed_book_record_and_update_student_info(student_id: str, book_id: str, current_user: LibrarianInfo = Depends(get_current_active_user)):
    try:
        await collection_s.update_one({"_id": student_id}, {"$set": {"book_info": None, "book_req": None}})
        await collection_b.update_one({"_id": book_id}, {"$set": {"in_stock": True, "return_date": None}})
        return "Successfully processed clear book request"
    except:
        return "Process unsuccessful to clear book request"


@router.put('/update_student_fine/{id}', response_model=StudentInfo, response_description="Update student fine")
async def update_student_fine(id: str, fine: float, current_user: LibrarianInfo = Depends(get_current_active_user)):
    await collection_s.update_one({"_id": id}, {"$set": {"fine": fine}})
    document = await collection_s.find_one({"_id": id})
    return document


# in UI student info and book info will appear on the screen and also borrowedby info 
# in this way specific book and student capbility of borrow book will be shown before process