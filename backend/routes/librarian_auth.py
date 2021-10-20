from fastapi import Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from passlib.context import CryptContext
from config.db import db
from config.librarian_auth_config import get_password_hash, authenticated_user, create_access_token
from schemas.librarian import LibrarianSignup, LibrarianInDB, LibrarianInfo
from schemas.jwt import Token


collection = db.librarian
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pass_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="librarian_login")

router = APIRouter()


@router.post("/librarian_login", response_model=Token)
async def librarian_login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticated_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "disabled": user.disabled}



@router.post('/librarian_register', response_model=LibrarianInfo, response_description="Add new librarian")
async def librarian_registration(user: LibrarianSignup):
    new_user = user.dict()
    new_user["hashed_password"] = get_password_hash(new_user["password"])
    new_user["disabled"] = True
    new_user.pop("password")
    all_users = await collection.find().to_list(9999)
    if any(x["username"] == new_user["username"] for x in all_users):
        raise HTTPException(status_code=400, detail="The username is taken")

    new_entry = await collection.insert_one(jsonable_encoder(LibrarianInDB(**new_user)))
    document = await collection.find_one({"_id": new_entry.inserted_id}, {"hashed_password": 0, "disabled": 0})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=document)
