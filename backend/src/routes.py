from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse 
from sqlalchemy.orm import Session

from .depends import get_db_session
from .schemas.userSchema import User

from .useCases import UserUseCases

router = APIRouter()

@router.get("/")
def health_check() -> JSONResponse:
  return JSONResponse(
    content={"msg":"hello world"},
    status_code=status.HTTP_200_OK
  )

@router.post("/user/register")
async def user_register(
  userData: User=Depends(User),
  db_session:Session=Depends(get_db_session)
) -> JSONResponse:
  # user = await form_data.f.read()
  userUseCase = UserUseCases(db_session=db_session)
  userUseCase.user_register(userData)
  
  return JSONResponse(
    content={"msg":"succes"},
    status_code=status.HTTP_201_CREATED
  )
  