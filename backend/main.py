from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import root, librarian_auth, student_auth, student_info, book_info, librarian_ops, student_ops
import os
from functools import lru_cache
from dotenv import load_dotenv


app = FastAPI()

@lru_cache()
def cached_dotenv():
    load_dotenv()

cached_dotenv()


origins = [
    os.environ.get("LOCALHOST")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(root.router)
app.include_router(librarian_auth.router)
app.include_router(student_auth.router)
app.include_router(student_info.router)
app.include_router(student_ops.router)
app.include_router(book_info.router)
app.include_router(librarian_ops.router)