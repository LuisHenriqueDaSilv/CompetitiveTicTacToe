import re
from pydantic import BaseModel, field_validator
from fastapi import status, HTTPException

from src.utils.formBodyParser import form_body, Form

@form_body
class UserChangePasswordData(BaseModel):
  new_password:str = Form(...)
  validation_token: str = Form(...)

  @field_validator("new_password")
  @staticmethod
  def validate_password(password):
    if len(password)>50:
      raise HTTPException(
        detail="senha invalida",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return password
  