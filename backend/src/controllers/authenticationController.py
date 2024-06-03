from fastapi import HTTPException, status
from fastapi.responses import JSONResponse  
from sqlalchemy import or_
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from random import randint
from passlib.context import CryptContext

from src.db.models import UserModel
from src.utils import send_validation_email
from src.schemas import UserSchema, UserValidationSchema, UserResendValidationCodeSchema
from src.services import JWTService

crypt_context = CryptContext(schemes=['sha256_crypt'])

class AuthenticationController():

  db_session:Session = None

  def __init__(self, email_service):
    self.email_service = email_service

  def signup(self, user: UserSchema):
    exist_user_on_db = self.db_session.query(UserModel).where(or_(UserModel.email==user.email, UserModel.username==user.username)).first()
    if exist_user_on_db is not None:
      if not exist_user_on_db.validated and exist_user_on_db.email == user.email:
        raise HTTPException(
          status_code=status.HTTP_200_OK,
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
      send_validation_email(self.email_service, created_user)
    except:
      raise HTTPException(
        detail="email indisponivel",
        status_code=status.HTTP_400_BAD_REQUEST
      )

    try:
      self.db_session.add(created_user)
      self.db_session.commit()
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
    
    return JSONResponse(
      content={
        "detail":"verifique seu email",
      },
      status_code=status.HTTP_200_OK
    )
  
  def login(self, user): 
    user_on_db:UserSchema = self.dbSession.query(UserModel).filter_by(email=user.email).first()
    if user_on_db is None:
      raise HTTPException(
        detail="email ou senha não encontrados",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    
    password_is_valid = crypt_context.verify(user.password, user_on_db.password)
    if not password_is_valid:
      raise HTTPException(
        detail="email ou senha não encontrados",
        status_code=status.HTTP_400_BAD_REQUEST
      )
      
    authorization = JWTService.encode(user_on_db.username)
    return JSONResponse(
      content=authorization,
      status_code=status.HTTP_200_OK
    )

  def validate_email(self, user:UserValidationSchema):
    user_on_db = self.db_session.query(UserModel).filter_by(email=user.email, validated=False).one_or_none()
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
      self.db_session.commit()
    except:
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="erro no banco de dados"
      )
    
    return JSONResponse(
      content={
        "detail":"sucesso",
        "authentication": JWTService.encode(user_on_db.username)
      },
      status_code=status.HTTP_200_OK
    )

  def resend_validation_code(self, user: UserResendValidationCodeSchema):
    user_on_db = self.db_session.query(UserModel).filter_by(email=user.email, validated=False).one_or_none()
    if user_on_db is None:
      raise HTTPException(
        detail="email invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    validation_code = f"{randint(1, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}"
    user_on_db.validation_code =  validation_code
    try:
      self.db_session.commit()
    except:
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="erro no banco de dados"
      )
    try: 
      send_validation_email(self.email_service, user_on_db)
    except:
      raise HTTPException(
        detail="email indisponivel",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    
    return JSONResponse(
      content={
        "detail":"sucesso",
      },
      status_code=status.HTTP_200_OK
    )
  