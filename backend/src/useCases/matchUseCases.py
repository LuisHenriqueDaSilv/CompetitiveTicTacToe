from socketio import AsyncServer
from sqlalchemy.orm import Session
from sqlalchemy import or_
from src.db.gameMemoryDatabase import GameMemoryDatabase
from src.db.models import MatchModel

class MatchUseCases():
  
  def __init__(self, game_memory:GameMemoryDatabase, sio:AsyncServer, db_session:Session
    ):
    self.game_memory = game_memory
    self.sio = sio
    self.db_session = db_session
    
  def find_match(self, sid, data):
    pass
    
  async def create_match(self, sid, data):
    if data["matchmode"] == "algoritmo":
      created_match = MatchModel(
        mode="algoritmo", 
        player1_id=None,
        player2_id=None,
        player1_sid=sid,
        player2_sid=None,
      )
      
      try:
        self.db_session.add(created_match)
        self.db_session.commit()
      except:
        await self.sio.emit("bad", "database error", to=sid)
        
      self.game_memory.players_in_match[sid] = {
        "sid":sid
      }
      
      await self.sio.emit("new_match", {
        "data":created_match.data,
        "matchInfos": {
          "mode":created_match.mode,
          "id": created_match.id,
          "oponent": {
            "id": None,
            "username": None,
            "type": "algorithm"
          }
        },
        
      }, to=sid)
      
  async def handle_move(self, sid, data):      
      
    match_id = data.get("matchId")
    position = data.get("position")
    
    try: 
      match_id = int(match_id)
      position = int(position)

    except ValueError:
      await self.sio.emit("bad", "invalid position or matchId", to=sid)
      return 
        
    if position is None or (position < 0 or position > 9):
      await self.sio.emit("bad", "Invalid position", to=sid)
    
    match_on_db = self.db_session.query(MatchModel)\
      .filter(MatchModel.status=="RUN")\
      .filter(MatchModel.id==match_id)\
      .filter(or_(MatchModel.player1_sid == sid, MatchModel.player2_sid==sid))\
      .first()
    if not match_on_db:
      return await self.sio.emit("bad", "invalid match id", to=sid)

    if not ((sid == match_on_db.player1_sid and match_on_db.current == "x") or \
      (sid == match_on_db.player2_sid and match_on_db.current == "o")):
      return await self.sio.emit("bad", "Its not your turn", to=sid)
    
    new_match_data_list = list(match_on_db.data)
    new_match_data_list[position] = match_on_db.current
    new_match_data = ''.join(new_match_data_list)
    match_on_db.data = new_match_data
    try: 
      self.db_session.commit()
    except: 
        await self.sio.emit("bad", "database error", to=sid)
    
  async def end_match(self, id):
    pass
  
  def delete_match(self, match):
    try:
      self.db_session.delete(match)
      self.db_session.commit()
    except:
      print("Algo de inesperado ocorreu no banco de dados")
  
  def handle_user_disconnection(self, sid):
    running_matches_with_disconnected_user = self.db_session.query(MatchModel) \
      .filter(or_(MatchModel.player1_sid==sid, MatchModel.player2_sid==sid)) \
      .filter(MatchModel.status=="RUN" ) \
      .all()
      
    for match in running_matches_with_disconnected_user:
      if match.mode == "algoritmo":
        self.delete_match(match)
