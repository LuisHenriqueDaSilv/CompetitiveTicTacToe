from dotenv import dotenv_values
from fastapi import APIRouter, Depends, status, Request
from fastapi.responses import JSONResponse 
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.db.models import UserModel, MultiplayerGameModel
from .depends import get_db_session, get_user_on_db
from .services import JWTService, EmailService
from .controllers import AuthenticationController
from .schemas import \
  UserData, \
  UserValidationData, \
  UserLoginData, \
  UserRequestChangePasswordData, \
  UserChangePasswordData

# Email server settings
EMAIL_PASSWORD=dotenv_values().get("GMAIL_APP_PASSWORD", None)
EMAIL_ADDRESS=dotenv_values().get("GMAIL_ADDRESS", None)
email_service = EmailService( email=EMAIL_ADDRESS, password=EMAIL_PASSWORD )

# Routes
authentication_router = APIRouter(prefix="/autenticacao")
authenticated_router = APIRouter(dependencies=[Depends(JWTService.token_verifier)], prefix="/autenticado")
global_router = APIRouter()

#Controllers
authentication_controller = AuthenticationController( email_service=email_service )

@global_router.get("/")
def health_check() -> JSONResponse:
  return JSONResponse(
    content={"msg":"hello world"},
    status_code=status.HTTP_200_OK
  )

@authentication_router.post("/registro")
def user_signup(
  data: UserData=Depends(UserData),
  db_session:Session=Depends(get_db_session)
) -> JSONResponse: 
  return authentication_controller.signup(data, db_session)

@authentication_router.post("/validar")
def user_validate_email(
  data: UserValidationData=Depends(UserValidationData),
  db_session:Session=Depends(get_db_session),
  user_on_db:UserModel =Depends(get_user_on_db)
) -> JSONResponse: 
  return authentication_controller.validate_email(data, user_on_db, db_session)

@authentication_router.post("/reenviar-codigo")
def user_resend_validation_code(
  db_session:Session=Depends(get_db_session),
  user_on_db:UserModel =Depends(get_user_on_db)
) -> JSONResponse: 
  return authentication_controller.resend_validation_code(user_on_db, db_session)
  
@authentication_router.post("/login")
def user_login(
  data: UserLoginData=Depends(UserLoginData),
  user_on_db:UserModel =Depends(get_user_on_db)
) -> JSONResponse: 
  return authentication_controller.login(data, user_on_db)

@authentication_router.post("/alterar-senha")
def request_change_password(
  data: UserRequestChangePasswordData=Depends(UserRequestChangePasswordData),
  user_on_db:UserModel =Depends(get_user_on_db)
): 
  return authentication_controller.request_change_password(data, user_on_db)

@authentication_router.post("/alterar-senha/confirmar")
def change_password(
  data: UserChangePasswordData=Depends(UserChangePasswordData),
  db_session: Session=Depends(get_db_session)
): 
  return authentication_controller.change_password(data, db_session)

@authenticated_router.get("/jogador")
def user_authorization_test(
  request:Request
) -> JSONResponse:
  return JSONResponse(
    content={
      "detail":"autenticado",
      "username": request.state.user.username
    },
    status_code=status.HTTP_200_OK
  )

@global_router.get("/ranking")
def get_ranking(
  db_session:Session = Depends(get_db_session)
) -> JSONResponse:
  top_ten_users = (
    db_session.query(UserModel, func.count(MultiplayerGameModel.id).label("wins_count"))
    .outerjoin(UserModel.wins)
    .group_by(UserModel.id)
    .order_by(func.count(MultiplayerGameModel.id).desc())
  ).limit(10).all()
  
  raking = [{"username": user.username, "wins": wins_count} for user, wins_count in top_ten_users]
  return JSONResponse(
    content={
      "ranking": raking 
    },
    status_code=status.HTTP_200_OK
  )
