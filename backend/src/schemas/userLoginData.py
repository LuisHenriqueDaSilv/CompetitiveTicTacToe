import re
from pydantic import BaseModel, field_validator
from fastapi import HTTPException, status
from src.utils.formBodyParser import form_body, Form


@form_body
class UserLoginData(BaseModel):
  email: str = Form(...)
  password: str = Form(...)

  @field_validator("email")
  @staticmethod
  def validate_email(value):
    validate_email_regex = r"""^(?:(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)|(?:".+"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\]))$"""
    if not re.match(validate_email_regex, value):
      raise HTTPException(
        detail="email invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return value
  
  @field_validator("password")
  @staticmethod
  def validate_password(password):
    if len(password)>50:
      raise HTTPException(
        detail="senha invalida",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return password
