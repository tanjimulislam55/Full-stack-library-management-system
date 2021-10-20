from pydantic import BaseModel

class BorrowedBy(BaseModel):
    student_id: str
    book_id: str
    issue_date: str
    return_date: str