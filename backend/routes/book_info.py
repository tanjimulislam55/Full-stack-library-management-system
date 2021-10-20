from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from typing import List
from schemas.librarian import LibrarianInfo
from schemas.student import StudentInfo
from config.db import db
from config.librarian_auth_config import get_current_active_user as get_current_librarian_user
from config.student_auth_config import get_current_active_user as get_current_student_user
from schemas.book import Book

router = APIRouter()
collection = db.books


@router.post('/book_entry', response_model=Book, response_description="New entry book record")
async def new_book_entry(book: Book, current_user: LibrarianInfo = Depends(get_current_librarian_user)):
    new_entry = await collection.insert_one(jsonable_encoder(book))
    document = await collection.find_one({"_id": new_entry.inserted_id})
    return document


@router.delete('/delete_a_book/{id}', response_description="Delete a book record")
async def delete_a_book(id: str, current_user: StudentInfo = Depends(get_current_librarian_user)):
    search_book = await collection.find_one({"_id": id})
    if search_book:
        await collection.delete_one({"_id": id})
        return "Successfully deleted a book record"
    else:
        return f"There is no book with this id {id}"



@router.get('/books&u=s', response_model=List[Book], response_description="Get all books")
async def get_all_books(current_user: StudentInfo = Depends(get_current_student_user)):
    document = await collection.find().to_list(1000)
    return document


@router.get('/books&u=l', response_model=List[Book], response_description="Get all books")
async def get_all_books(current_user: LibrarianInfo = Depends(get_current_librarian_user)):
    document = await collection.find().to_list(1000)
    return document


@router.get('/book/{id}', response_model=Book, response_description="Get a book")
async def get_a_book(id: str, current_user: LibrarianInfo = Depends(get_current_librarian_user)):
    document = await collection.find_one({"_id": id})
    return document