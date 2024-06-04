import re 
from fastapi import HTTPException, status
from pydantic import BaseModel, field_validator

from src.utils.formBodyParser import Form, form_body

@form_body
class RequestChangePasswordSchema(BaseModel):
  email: str = Form(...)
  redirect_url: str = Form(...)
  
  @field_validator("email")
  @staticmethod
  def validate_email(email):
    validate_email_regex = r"""^(?:(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)|(?:".+"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\]))$"""
    if not re.match(validate_email_regex, email) or len(email) > 320:
      raise HTTPException(
        detail="email invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return email
    