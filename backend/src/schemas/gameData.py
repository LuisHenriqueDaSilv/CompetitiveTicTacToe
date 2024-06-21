from pydantic import BaseModel
from typing import Optional
from .playerData import PlayerData
from uuid import uuid4

class GameInfosData(BaseModel):
    result: str|None = None
    winner: Optional[str] = None
    mode: str
    id: str
    current: str = "x"
    o_player: PlayerData
    x_player: PlayerData
    
    def __init__(self, id=None, **kwargs):
      if id is None:
        id=uuid4().hex
      super().__init__(id=id, **kwargs)
  

class GameData(BaseModel):
  data: str="         "
  infos: GameInfosData
  
  def get_dict(self):
    return self.model_dump(
      exclude={
        'infos': { 'x_player': {'sid'}, 'o_player': {'sid'} }
      }
    )
