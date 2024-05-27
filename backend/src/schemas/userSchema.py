import re
from fastapi import Form, status
from fastapi.exceptions import HTTPException
from pydantic import BaseModel, field_validator

def form_body(cls):
    cls.__signature__ = cls.__signature__.replace(
      parameters=[
        arg.replace(default=Form(...))
        for arg in cls.__signature__.parameters.values()
      ]
    )
    return cls

@form_body
class UserSchema(BaseModel):
  username: str = Form(...)
  password: str = Form(...)
  email: str = Form(...)
  
  @field_validator("username")
  @staticmethod
  def validate_username(value):
    if not re.match("^([a-z]|[A-Z]|[0-9])+$", value) or len(value) > 10:
      raise HTTPException(
        detail="Nome de usuário invalido",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return value
  
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
    