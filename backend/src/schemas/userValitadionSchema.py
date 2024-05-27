import re
from fastapi.exceptions import HTTPException
from fastapi import Form, status
from pydantic import BaseModel, field_validator

from src.utils import form_body

@form_body
class UserValidationSchema(BaseModel):
  email:str= Form(...)
  code:str= Form()

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
    
  @field_validator("code")
  @staticmethod
  def validate_code(value):
    if not re.match(r"^\d{4}$", value):
      raise HTTPException(
        detail="código invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return value
