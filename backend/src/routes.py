from dotenv import dotenv_values
from fastapi import APIRouter, Depends, status, Request
from fastapi.responses import JSONResponse 
from sqlalchemy.orm import Session

from .depends import get_db_session
from .schemas import UserSchema, UserValidationSchema, UserResendValidationCodeSchema
from .services import JWTService, EmailService
from .useCases import UserUseCases


# Email server settings
EMAIL_PASSWORD=dotenv_values().get("GMAIL_APP_PASSWORD", None)
EMAIL_ADDRESS=dotenv_values().get("GMAIL_ADDRESS", None)
emailService = EmailService(
  email=EMAIL_ADDRESS,
  password=EMAIL_PASSWORD
)

#Routes
authentication_router = APIRouter(prefix="/autenticacao")
authenticated_router = APIRouter(dependencies=[Depends(JWTService.token_verifier)], prefix="/autenticado")
global_router = APIRouter()

@global_router.get("/")
def health_check() -> JSONResponse:
  return JSONResponse(
    content={"msg":"hello world"},
    status_code=status.HTTP_200_OK
  )

@authentication_router.post("/registro")
def user_register(
  userData: UserSchema=Depends(UserSchema),
  dbSession:Session=Depends(get_db_session)
) -> JSONResponse:
  userUseCase = UserUseCases(dbSession=dbSession, emailService=emailService)
  creation_status = userUseCase.user_register(userData)
  
  return JSONResponse(
    content={
      "detail":creation_status,
    },
    status_code=status.HTTP_200_OK
  )

@authentication_router.post("/validar")
def user_validator(
  validationData: UserValidationSchema=Depends(UserValidationSchema),
  dbSession:Session=Depends(get_db_session)
) -> JSONResponse:
  userUseCase = UserUseCases(dbSession=dbSession, emailService=emailService)
  authentication_data = userUseCase.user_validate(validationData)
  
  return JSONResponse(
    content={
      "detail":"sucesso",
      "authentication": authentication_data
    },
    status_code=status.HTTP_200_OK
  )

@authentication_router.post("/reenviar-codigo")
def user_resend_validation_code(
  requestData: UserResendValidationCodeSchema=Depends(UserResendValidationCodeSchema),
  dbSession:Session=Depends(get_db_session)
) -> JSONResponse:
  userUseCase = UserUseCases(dbSession=dbSession, emailService=emailService)
  userUseCase.user_resend_validation_code(requestData)
  
  return JSONResponse(
    content={
      "detail":"sucesso",
    },
    status_code=status.HTTP_200_OK
  )
  
@authentication_router.post("/login")
def user_login(
  userData: UserSchema=Depends(UserSchema),
  dbSession: Session=Depends(get_db_session)
) -> JSONResponse:
  userUseCase= UserUseCases(dbSession=dbSession)
  authorization_data = userUseCase.user_login(userData)
  
  return JSONResponse(
    content=authorization_data,
    status_code=status.HTTP_200_OK
  )
  
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
