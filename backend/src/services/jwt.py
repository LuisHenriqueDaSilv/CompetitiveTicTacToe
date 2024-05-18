from jose import jwt
from datetime import datetime, timedelta, timezone
from dotenv import dotenv_values

JWT_SECRET = dotenv_values().get("JWT_SECRET")
JWT_ALGORITHM = dotenv_values().get("JWT_ALGORITHM")

class JWTService():

  @staticmethod
  def encode(username:str, expires_in: int=30):
    exp = datetime.now(timezone.utc) + timedelta(minutes=expires_in)
    payload = {
      'exp': exp,
      'sub': username
    }
    token = jwt.encode(payload,JWT_SECRET ,algorithm=JWT_ALGORITHM)
    return {
      "token": token,
      "exp": exp.isoformat()
    }
    