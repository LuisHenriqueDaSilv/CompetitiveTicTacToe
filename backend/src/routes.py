from dotenv import dotenv_values
from fastapi import APIRouter, Depends, status, Request
from fastapi.responses import JSONResponse 
from sqlalchemy.orm import Session

from .depends import get_db_session
from .services import JWTService, EmailService
from .controllers import AuthenticationController
from .schemas import \
  UserSchema, \
  UserValidationSchema, \
  UserResendValidationCodeSchema, \
  UserLoginSchema, \
  RequestChangePasswordSchema

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
def user_register(
  data: UserSchema=Depends(UserSchema),
  db_session:Session=Depends(get_db_session)
) -> JSONResponse:
  authentication_controller.db_session = db_session
  return authentication_controller.signup(data)

@authentication_router.post("/validar")
def user_validator(
  data: UserValidationSchema=Depends(UserValidationSchema),
  db_session:Session=Depends(get_db_session)
) -> JSONResponse:
  authentication_controller.db_session = db_session
  return authentication_controller.validate_email(data)

@authentication_router.post("/reenviar-codigo")
def user_resend_validation_code(
  data: UserResendValidationCodeSchema=Depends(UserResendValidationCodeSchema),
  db_session:Session=Depends(get_db_session)
) -> JSONResponse:
  authentication_controller.db_session = db_session
  return authentication_controller.resend_validation_code(data)
  
@authentication_router.post("/login")
def user_login(
  data: UserLoginSchema=Depends(UserLoginSchema),
  db_session: Session=Depends(get_db_session)
) -> JSONResponse:
  authentication_controller.db_session = db_session
  return authentication_controller.login(data)

@authentication_router.post("/alterar-senha")
def request_change_password(
  data: RequestChangePasswordSchema=Depends(RequestChangePasswordSchema),
  db_session:Session=Depends(get_db_session)
):
  authentication_controller.db_session = db_session
  return authentication_controller.request_change_password(data)

  
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