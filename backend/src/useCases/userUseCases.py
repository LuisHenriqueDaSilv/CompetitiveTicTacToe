from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import status, HTTPException
from passlib.context import CryptContext 
from random import randint
from sqlalchemy import or_

from src.db.models import UserModel
from src.schemas import UserSchema, UserValidationSchema, UserResendValidationCodeSchema
from src.services import JWTService, EmailService
from src.utils import send_validation_email

crypt_context = CryptContext(schemes=['sha256_crypt'])

class UserUseCases: 
  def __init__(self, dbSession:Session, emailService:EmailService):
    self.emailService = emailService
    self.dbSession = dbSession

    
  def user_register(self, user: UserSchema):

    exist_user_on_db = self.dbSession.query(UserModel).where(or_(UserModel.email==user.email, UserModel.username==user.username)).first()
    if exist_user_on_db is not None:
      if not exist_user_on_db.validated and exist_user_on_db.email == user.email:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="já existe um processo de validação com este email, verifique sua caixa de entrada"
        )
      if exist_user_on_db.email == user.email:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="já existe um jogador utilizando o email informado"
        )
      
      if exist_user_on_db.username == user.username:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="nome de usuário indisponivel"
        )

    validation_code = f"{randint(1, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}"
    created_user = UserModel(
      username=user.username,
      password=crypt_context.hash(user.password),
      email=user.email,
      validated=False,
      validation_code=validation_code
    )

    try:
      send_validation_email(self.emailService, created_user)
    except:
      raise HTTPException(
        detail="email indisponivel",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    
    try:
      self.dbSession.add(created_user)
      self.dbSession.commit()
    except IntegrityError:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="nome de usuário ou email indisponivel"
      )
    except: 
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="erro no banco de dados"
      )
    
    return "verifique seu email"
  
  def user_validate(self, user:UserValidationSchema):
    user_on_db = self.dbSession.query(UserModel).filter_by(email=user.email, validated=False).one_or_none()
    
    if user_on_db is None:
      raise HTTPException(
        detail="email invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    if user_on_db.validation_code != int(user.code):
      raise HTTPException(
        detail="código incorreto",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    
    user_on_db.validation_code = None
    user_on_db.validated = True
    try:
      self.dbSession.commit()
    except:
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="erro no banco de dados"
      )
    
    return JWTService.encode(user_on_db.username)
    
  def user_resend_validation_code(self, user:UserResendValidationCodeSchema):
    user_on_db = self.dbSession.query(UserModel).filter_by(email=user.email, validated=False).one_or_none()
    if user_on_db is None:
      raise HTTPException(
        detail="email invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    validation_code = f"{randint(1, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}"
    user_on_db.validation_code =  validation_code
    try:
      self.dbSession.commit()
    except:
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="erro no banco de dados"
      )
    send_validation_email(self.emailService, user_on_db)

    return "código reenviado"

  def user_login(self, user: UserSchema):
    user_on_db:UserSchema = self.dbSession.query(UserModel).filter_by(username=user.username).first()
    
    if user_on_db is None:
      raise HTTPException(
        detail="nome de usuário ou senha invalido",
        status_code=status.HTTP_401_UNAUTHORIZED
      )
      
    password_is_valid = crypt_context.verify(user.password, user_on_db.password)
    if not password_is_valid:
      raise HTTPException(
        detail="nome de usuário ou senha invalido",
        status_code=status.HTTP_401_UNAUTHORIZED
      )
      
    authorization = JWTService.encode(user.username)
    
    return authorization
  