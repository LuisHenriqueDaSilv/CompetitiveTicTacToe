from fastapi import HTTPException, status
from fastapi.responses import JSONResponse  
from sqlalchemy import or_
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from random import randint
from passlib.context import CryptContext

from src.emails import user_validation_email, change_password_email
from src.db.models import UserModel
from src.schemas import UserData, \
  UserValidationData, \
  UserRequestChangePasswordData, \
  UserChangePasswordData
from src.services import JWTService, EmailService

crypt_context = CryptContext(schemes=['sha256_crypt'])

class AuthenticationController():

  def __init__(self, email_service: EmailService):
    self.email_service = email_service

  def signup(self, request_data: UserData, db_session:Session):
    exist_user_on_db = db_session.query(UserModel).where(or_(UserModel.email==request_data.email, UserModel.username==request_data.username)).first()
    if exist_user_on_db is not None:
      if not exist_user_on_db.validated and exist_user_on_db.email == request_data.email:
        raise HTTPException(
          status_code=status.HTTP_200_OK,
          detail="já existe um processo de validação com este email, verifique sua caixa de entrada"
        )
      if exist_user_on_db.email == request_data.email:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="já existe um jogador utilizando o email informado"
        )
      if exist_user_on_db.username == request_data.username:
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="nome de usuário indisponivel"
        )

    validation_code = f"{randint(1, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}"
    created_user = UserModel(
      username=request_data.username,
      password=crypt_context.hash(request_data.password),
      email=request_data.email,
      validated=False,
      validation_code=validation_code
    )
    
    try:
      email_data = user_validation_email(self.email_service, created_user)
      self.email_service.send_email(email_data)
    except:
      raise HTTPException(
        detail="email indisponivel",
        status_code=status.HTTP_400_BAD_REQUEST
      )

    try:
      db_session.add(created_user)
      db_session.commit()
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
  
  def login(self, request_data, user_on_db:UserModel): 
    
    password_is_valid = crypt_context.verify(request_data.password, user_on_db.password)
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

  def validate_email(self, request_data:UserValidationData, user_on_db:UserModel, db_session:Session):

    if user_on_db.validation_code != int(request_data.code):
      raise HTTPException(
        detail="código incorreto",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    
    user_on_db.validation_code = None
    user_on_db.validated = True
    try:
      db_session.commit()
    except:
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="erro no banco de dados"
      )
    
    authorization = JWTService.encode(user_on_db.username)
    return JSONResponse(
      content={
        "detail":"sucesso",
        "authentication": authorization
      },
      status_code=status.HTTP_200_OK
    )

  def resend_validation_code(self, user_on_db:UserModel, db_session:Session):
    validation_code = f"{randint(1, 9)}{randint(0, 9)}{randint(0, 9)}{randint(0, 9)}"
    user_on_db.validation_code =  validation_code
    try:
      db_session.commit()
    except:
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="erro no banco de dados"
      )
    try: 
      email_data = user_validation_email(self.email_service, user_on_db)
      self.email_service.send_email(email_data)
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
  
  def request_change_password(self, request_data: UserRequestChangePasswordData, user_on_db:UserModel):
      
    change_password_token = JWTService.encode(
      username=user_on_db.username,
      expires_in=2*60, # 2 horas
      token_type="change_password"
    )
      
    try: 
      confirm_change_password_url = f"{request_data.redirect_url}?token={change_password_token["token"]}"
      email_data = change_password_email(self.email_service, user_on_db, confirm_change_password_url)
      self.email_service.send_email(email_data)
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
    
  def change_password(self, request_data: UserChangePasswordData, db_session:Session):
    
    token_data = {}
    try:
      token_data = JWTService.decode(request_data.validation_token, "password")
    except:
      raise HTTPException(
        detail="a solicitação de recuperação de senha é inválida ou expirou. Por favor, solicite uma nova recuperação.",
        status_code=status.HTTP_400_BAD_REQUEST
      )
      
    user_on_db = db_session.query(UserModel).filter_by(username=token_data["sub"]).one_or_none()
    if user_on_db is None:
      raise HTTPException(
        detail="token invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    user_on_db.password = crypt_context.hash(request_data.new_password)
    db_session.commit()  
    
    return JSONResponse(
      content={
        "detail": "sucess"
      },
      status_code=status.HTTP_200_OK
    )      
    