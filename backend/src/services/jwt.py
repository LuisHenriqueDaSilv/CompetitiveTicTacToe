from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from dotenv import dotenv_values
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from src.depends import get_db_session
from src.db.models import UserModel

JWT_SECRET = dotenv_values().get("JWT_SECRET")
JWT_ALGORITHM = dotenv_values().get("JWT_ALGORITHM")

oauth_scheme = OAuth2PasswordBearer(tokenUrl='/usuario/login')

class JWTService():

  @staticmethod
  def encode(username:str, expires_in: int=30):
    exp = datetime.now(timezone.utc) + timedelta(minutes=expires_in)
    payload = {
      'exp': exp,
      'sub': username
    }
    token = jwt.encode(payload,JWT_SECRET ,algorithm=JWT_ALGORITHM)
    return {
      "token": token,
      "exp": exp.isoformat()
    }
    
  @staticmethod
  def token_verifier(
    request:Request,
    db_session:Session = Depends(get_db_session),
    token = Depends(oauth_scheme)
  ):
    try:
      data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
      raise HTTPException(
        detail="token invalido",
        status_code=status.HTTP_401_UNAUTHORIZED
      )
      
    user_on_db = db_session.query(UserModel).filter_by(username=data["sub"]).first()
    
    if user_on_db is None:
      raise HTTPException(
        detail="token invalido",
        status_code=status.HTTP_401_UNAUTHORIZED
      )

    request.state.user = user_on_db
    