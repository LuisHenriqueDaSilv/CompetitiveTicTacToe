from pydantic import BaseModel
from typing import Optional
from .playerData import PlayerData
from uuid import uuid4

class GameInfosData(BaseModel):
    result: str|None = None
    winner: Optional[str] = None
    mode: str
    id: str = uuid4().hex
    current: str = "x"
    o_player: PlayerData
    x_player: PlayerData
  

class GameData(BaseModel):
  data: str="         "
  infos: GameInfosData
  
  def get_dict(self):
    return self.model_dump(
      exclude={
        'infos': { 'x_player': {'sid'}, 'o_player': {'sid'} }
      }
    )
