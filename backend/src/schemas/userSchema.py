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
  
  @field_validator("username")
  def validate_username(cls, value):
    if not re.match("^([a-z]|[A-Z]|[0-9])+$", value) or len(value) > 10:
      raise HTTPException(
        detail="Username format invalid",
        status_code=status.HTTP_400_BAD_REQUEST
      )
    return value
    