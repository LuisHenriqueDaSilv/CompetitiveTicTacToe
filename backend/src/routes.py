from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse 
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .depends import get_db_session
from .schemas.userSchema import UserSchema

from .useCases import UserUseCases

router = APIRouter()

@router.get("/")
def health_check() -> JSONResponse:
  return JSONResponse(
    content={"msg":"hello world"},
    status_code=status.HTTP_200_OK
  )

@router.post("/user/register")
def user_register(
  userData: UserSchema=Depends(UserSchema),
  db_session:Session=Depends(get_db_session)
) -> JSONResponse:
  userUseCase = UserUseCases(db_session=db_session)
  authorization_data = userUseCase.user_register(userData)
  
  return JSONResponse(
    content={
      "msg":"succes",
      "authorization": authorization_data
    },
    status_code=status.HTTP_201_CREATED
  )
  
@router.post("/user/login")
def user_login(
  userData: UserSchema=Depends(UserSchema),
  db_session: Session=Depends(get_db_session)
) -> JSONResponse:
  userUseCase= UserUseCases(db_session=db_session)
  authorization_data = userUseCase.user_login(userData)
  
  return JSONResponse(
    content=authorization_data,
    status_code=status.HTTP_200_OK
  )