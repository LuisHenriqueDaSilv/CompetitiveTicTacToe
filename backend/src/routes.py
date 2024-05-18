from fastapi import APIRouter, Depends, status, Request
from fastapi.responses import JSONResponse 
from sqlalchemy.orm import Session

from .depends import get_db_session
from .schemas.userSchema import UserSchema
from .services import JWTService
from .useCases import UserUseCases

user_router = APIRouter(prefix="/user")
authenticated_router = APIRouter(dependencies=[Depends(JWTService.token_verifier)])

@user_router.get("/")
def health_check() -> JSONResponse:
  return JSONResponse(
    content={"msg":"hello world"},
    status_code=status.HTTP_200_OK
  )

@user_router.post("/register")
def user_register(
  userData: UserSchema=Depends(UserSchema),
  db_session:Session=Depends(get_db_session)
) -> JSONResponse:
  userUseCase = UserUseCases(db_session=db_session)
  authorization_data = userUseCase.user_register(userData)
  
  return JSONResponse(
    content={
      "detail":"succes",
      "authorization": authorization_data
    },
    status_code=status.HTTP_201_CREATED
  )
  
@user_router.post("/login")
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
  
@authenticated_router.get("/authorization-test")
def user_authorization_test(
  request:Request
) -> JSONResponse:
  return JSONResponse(
    content={
      "detail":"authorizated",
      "username": request.state.user.username
    },
    status_code=status.HTTP_200_OK
  )
