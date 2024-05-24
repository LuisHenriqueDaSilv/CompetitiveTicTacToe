from socketio import AsyncServer
from sqlalchemy.orm import Session
from sqlalchemy import or_
import random
from src.db.gamesMemoryDatabase import GamesMemoryDatabase
from src.db.models import GameModel

class GameUseCases():
  
  def __init__(self, game_memory:GamesMemoryDatabase, sio:AsyncServer, db_session:Session
    ):
    self.game_memory = game_memory
    self.sio = sio
    self.db_session = db_session
    
  async def create_game(self, sid, data):
    if data["gamemode"] == "algoritmo":
      
      created_game = GameModel(
        mode="algoritmo", 
        player1_id=None,
        player2_id=None,
        player1_sid=sid,
        player2_sid=None,
      )
      try:
        self.db_session.add(created_game)
        self.db_session.commit()
      except:
        await self.sio.emit("bad", "erro no banco de dados", to=sid)
        
      self.game_memory.players_in_game[sid] = {
        "sid":sid
      }      
      await self.sio.emit("new_game", {
        "data":created_game.data,
        "gameInfos": {
          "mode":created_game.mode,
          "id": created_game.id,
          "oponent": {
            "id": None,
            "username": None,
            "type": "algoritmo"
          }
        }
      }, to=sid)
  
  def algorithm_random_position(self, game: GameModel):
    game_positions = [a for a in game.data]
    free_positions_indexes = []
    for index, position in enumerate(game_positions):
      if position == " ":
        free_positions_indexes.append(index)
    move_position_index = random.randint(0, len(free_positions_indexes)-1)
    return free_positions_indexes[move_position_index]
    
  async def algorithm_move(self, game:GameModel, sid):
    algorithm_move_position = self.algorithm_random_position(game)
    game_data = list(game.data)
    game_data[algorithm_move_position] = game.current
    new_game_data = ''.join(game_data)
    
    game.data = new_game_data
    game.current = "x" if game.current=="o" else "o"
    try: 
      self.db_session.commit()
    except: 
        await self.sio.emit("bad", "erro no banco de dados", to=sid)
    
    await self.sio.emit(
      "new_move",
      {
        "new_data": new_game_data
      },
      to=game.player1_sid
    )  
  
  def verify_winner(self, game):
    possibles_win_positions = [
      (0, 1, 2), (3, 4, 5), (6, 7, 8), (0, 3, 6), (1, 4, 7), (2, 5, 8), 
      (0, 4, 8), (2, 4, 6)
    ]
    game_data = list(game.data)
    has_winner = False
    for a, b, c in possibles_win_positions:
      has_winner = game_data[a] == game_data[b] and game_data[b] \
        == game_data[c] and game_data[c] != " "
      if has_winner:
        break 
      
    return has_winner
    
  async def handle_win(self, game:GameModel):
    return await self.sio.emit("win", "", to=game.player1_sid)
    
  async def handle_move(self, sid, data):
    game_id = data.get("gameId")
    position = data.get("position")
    
    try: 
      game_id = int(game_id)
      position = int(position)
    except ValueError:
      return await self.sio.emit("bad", "id de partida ou posição invalida", to=sid)
    
    if position is None or (position < 0 or position > 9):
      return await self.sio.emit("bad", "posição invalida", to=sid)
    
    game_on_db = self.db_session.query(GameModel)\
      .filter(GameModel.status=="RUN")\
      .filter(GameModel.id==game_id)\
      .filter(or_(GameModel.player1_sid == sid, GameModel.player2_sid==sid))\
      .first()
      
    if game_on_db is None:
      return await self.sio.emit("bad", "id de partida invalida", to=sid)
    if (sid == game_on_db.player1_sid and game_on_db.current != "x") or (sid == game_on_db.player2_sid and game_on_db.current != "o"):
      return await self.sio.emit("bad", "Não é a sua vez de jogar", to=sid)
    
    game_data = list(game_on_db.data)
    if game_data[position] != " ":
      return await self.sio.emit("bad", "posição invalida", to=sid)
    
    game_data[position] = game_on_db.current
    new_game_data = ''.join(game_data)
    game_on_db.data = new_game_data
    game_on_db.current = "x" if game_on_db.current=="o" else "o"
    
    try: 
      self.db_session.commit()
    except: 
        await self.sio.emit("bad", "erro no banco de dados", to=sid)
    
    if game_on_db.mode == "algoritmo":
      await self.algorithm_move(game_on_db, sid)
    
    has_winner = self.verify_winner(game_on_db)
    
    if has_winner:
      await self.handle_win(game_on_db)
      
    
  def delete_game(self, game):
    try:
      self.db_session.delete(game)
      self.db_session.commit()
    except:
      # End game
      pass
  
  def handle_user_disconnection(self, sid):
    running_games_with_disconnected_user = self.db_session.query(GameModel) \
      .filter(or_(GameModel.player1_sid==sid, GameModel.player2_sid==sid)) \
      .filter(GameModel.status=="RUN" ) \
      .all()
      
    for game in running_games_with_disconnected_user:
      if game.mode == "algoritmo":
        self.delete_game(game)
