from pydantic import BaseModel
from typing import Optional

class PlayerData(BaseModel):
  id: Optional[int]
  username: Optional[str]
  sid: str
  