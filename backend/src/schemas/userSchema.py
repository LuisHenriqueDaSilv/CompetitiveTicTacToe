import re
from fastapi import Form, status
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, field_validator

from src.utils import form_body

@form_body
class UserSchema(BaseModel):
  username: str = Form(...)
  password: str = Form(...)
  email: str = Form(...)
  
  @field_validator("username")
  @staticmethod
  def validate_username(username):
    if not re.match("^([a-z]|[A-Z]|[0-9])+$", username) or len(username) > 10:
      raise HTTPException(
        detail="Nome de usuário invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return username
  
  @field_validator("email")
  @staticmethod
  def validate_email(email):
    validate_email_regex = r"""^(?:(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)|(?:".+"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\]))$"""
    if not re.match(validate_email_regex, email):
      raise HTTPException(
        detail="email invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return email
