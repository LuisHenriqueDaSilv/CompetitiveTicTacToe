from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.exceptions import HTTPException
from fastapi import status
from passlib.context import CryptContext 

from src.db.models import UserModel
from src.schemas import User

crypt_context = CryptContext(schemes=['sha256_crypt'])

class UserUseCases: 
  def __init__(self, db_session:Session):
    self.db_session = db_session
    
  def user_register(self, user: User):
    created_user = UserModel(
      username=user.username,
      password=crypt_context.hash(user.password)
    )
    
    try:
      self.db_session.add(created_user)
      self.db_session.commit()
    except IntegrityError:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="User already exists"
      )