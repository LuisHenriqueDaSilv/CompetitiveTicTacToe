from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.exceptions import HTTPException
from fastapi import status
from passlib.context import CryptContext 

from src.db.models import UserModel
from src.schemas import UserSchema

from src.services import JWTService


crypt_context = CryptContext(schemes=['sha256_crypt'])

class UserUseCases: 
  def __init__(self, db_session:Session):
    self.db_session = db_session
    
  def user_register(self, user: UserSchema):
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
  
    authorization = JWTService.encode(user.username)
    return authorization
  
  def user_login(self, user: UserSchema):
    user_on_db:UserSchema = self.db_session.query(UserModel).filter_by(username=user.username).first()
    
    if user_on_db is None:
      raise HTTPException(
        detail="Invalid username or password",
        status_code=status.HTTP_401_UNAUTHORIZED
      )
      
    password_is_valid = crypt_context.verify(user.password, user_on_db.password)
    if not password_is_valid:
      raise HTTPException(
        detail="Invalid username or password",
        status_code=status.HTTP_401_UNAUTHORIZED
      )
      
    authorization = JWTService.encode(user.username)
    
    return authorization
  