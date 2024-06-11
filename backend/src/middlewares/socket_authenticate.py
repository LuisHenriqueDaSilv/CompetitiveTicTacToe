from src.db.connection import Session as DbSession
from src.services import JWTService
from src.db.models import UserModel

def socket_authenticate(function):
  async def wrapper(self, sid: str, data, *args, **kwargs):
    user_on_db = {}
    author_session = await self.sio.get_session(sid)
    author_token = author_session["authentication_jwt"]
    if author_token is not None:
      try:
        token_payload = JWTService.decode(author_token)
        db_session = DbSession()
        user_on_db = db_session.query(UserModel).filter_by(username=token_payload["sub"]).one_or_none()
        db_session.close()
      except: 
        pass
    if user_on_db is None:
      user_on_db = {}
    await function(self, sid, data, user_on_db, *args, **kwargs)
  return wrapper