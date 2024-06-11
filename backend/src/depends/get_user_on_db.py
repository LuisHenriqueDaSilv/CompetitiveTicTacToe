from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status

from src.db.models import UserModel
from src.schemas import GenericAuthenticationRouteData
from .get_db_session import get_db_session

def get_user_on_db(
  request_data: GenericAuthenticationRouteData = Depends(GenericAuthenticationRouteData, use_cache=True),
  db_session:Session= Depends(get_db_session)
):
    user_on_db = db_session.query(UserModel).filter_by(email=request_data.email).one_or_none()
    if user_on_db is None:
      raise HTTPException(
        detail="perfil não encontrado",
        status_code=status.HTTP_400_BAD_REQUEST
      )
      
    return user_on_db