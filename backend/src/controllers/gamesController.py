from socketio import AsyncServer
from sqlalchemy.orm import Session
import random
from uuid import uuid4

from src.db.gamesMemoryDatabase import GamesMemoryDatabase

class GamesController():
  
  db_session:Session = None
  
  def __init__(self, games_memory:GamesMemoryDatabase, sio:AsyncServer):
    self.games_memory = games_memory
    self.sio = sio
    
  async def create(self, sid):
    if sid in self.games_memory.players_in_game:
      await self.sio.emit("bad", "você já esta em uma partida", to=sid)
      return 
    
    game_uuid = uuid4().hex
    created_game = {
      "mode":"algoritmo", 
      "x_player_id":None, # Adicionar ids dos usuários para funcionar em multiplayer 
      "o_player_id":None,
      "x_player_sid":sid,
      "o_player_sid":None,
      "data": "         ",
      "id": game_uuid,
      "current": "x"
    }
    self.games_memory.running_games[game_uuid] = created_game 
    
    self.games_memory.players_in_game[sid] = {
      "sid":sid,
      "id": None # Adicionar ids dos usuários para funcionar em multiplayer 
    }
    await self.sio.enter_room(sid, game_uuid)
    await self.sio.emit("new_game", {
      "data":created_game["data"],
      "gameInfos": {
        "mode":created_game["mode"],
        "id":created_game["id"],
        "current": created_game["current"],
        "o_player": None,
        "x_player": None
      }
    }, room=game_uuid)
  
  def algorithm_random_position(self, gameData):
    game_positions = [a for a in gameData]
    free_positions_indexes = []
    for index, position in enumerate(game_positions):
      if position == " ": free_positions_indexes.append(index)
    move_position_index = random.randint(0, len(free_positions_indexes)-1)
    return free_positions_indexes[move_position_index]
  
  async def algorithm_move(self, game):
    algorithm_move_position = self.algorithm_random_position(game["data"])
    game_data = list(game["data"])
    game_data[algorithm_move_position] = game["current"]
    new_game_data = ''.join(game_data)
    self.games_memory.running_games[game["id"]]["data"] = new_game_data
    
    await self.sio.emit(
      "new_move",
      {
        "new_data": new_game_data
      },
      room=game["id"]
    )  
    
    result = self.verify_result(game["data"])
    if not result is None: 
      await self.handle_result(game, result)
      return
    
    self.games_memory.running_games[game["id"]]["current"] = "x" if game["current"]=="o" else "o"
  
  def verify_result(self, game_data):
    game_data = list(game_data)
    blank_positions = game_data.count(" ")
    if blank_positions > 4: return None # Sem movimentos suficientes para ter um resultado
    
    has_winner = False
    possibles_win_positions = [
      (0, 1, 2), (3, 4, 5), (6, 7, 8), (0, 3, 6), (1, 4, 7), (2, 5, 8), 
      (0, 4, 8), (2, 4, 6)
    ]
    for a, b, c in possibles_win_positions:
      has_winner = game_data[a] == game_data[b] and game_data[b] \
        == game_data[c] and game_data[c] != " "
      if has_winner: break 
      
    if has_winner: return "win" 
    if blank_positions == 0: return "tie"
    
  async def handle_result(self, game, result):
    self.delete_game(game=game)
    await self.sio.emit("end_game", {
      "result": result,
      "winner": game["current"] if result == "win" else None
      }, room=game["id"])
    
  async def move(self, sid, data):    
    if sid not in self.games_memory.players_in_game:
      await self.sio.emit("bad", "você não esta em uma partida", to=sid)
      return 
    
    game_id = data.get("gameId")
    position = data.get("position")
    try: 
      position = int(position)
    except ValueError:
      await self.sio.emit("bad", "a posição precisa ser um inteiro", to=sid)
      return
    
    if position is None or (position < 0 or position > 9): 
      await self.sio.emit("bad", "posição invalida", to=sid)
      return
    
    game_on_memory = self.games_memory.running_games.get(game_id, None) 
    if game_on_memory is None: 
      await self.sio.emit("bad", "id de partida invalida", to=sid)
      return
    
    player_is_x = game_on_memory["x_player_sid"]==sid
    player_is_o = game_on_memory["o_player_sid"]==sid
    if not player_is_x and not player_is_o: 
      await self.sio.emit("bad", "a partida informada não é sua", to=sid)
      return

    if (player_is_x and game_on_memory["current"] != "x") or (player_is_o and game_on_memory["current"] != "o"):
      await self.sio.emit("bad", "Não é a sua vez de jogar", to=sid)
      return
    
    game_data = list(game_on_memory["data"])
    if game_data[position] != " ":  
      await self.sio.emit("bad", "posição invalida", to=sid)
      return
    
    game_data[position] = game_on_memory["current"]
    new_game_data = ''.join(game_data)
    game_on_memory["data"] = new_game_data
    
    result = self.verify_result(game_on_memory["data"])
    if not result is None: 
      await self.handle_result(game_on_memory, result)
      return
    
    game_on_memory["current"] = "x" if game_on_memory["current"]=="o" else "o"  
    if game_on_memory["mode"] == "algoritmo": await self.algorithm_move(game_on_memory)
      
  def delete_game(self, sid=None, game=None):
    if game is None:
      for game_id in self.games_memory.running_games:
        if (self.games_memory.running_games[game_id]["x_player_sid"] == sid or \
          self.games_memory.running_games[game_id]["o_player_sid"] == sid):
            game = self.games_memory.running_games[game_id]
            break    

    if game is None: return
    if game.get("x_player_sid") is not None: del self.games_memory.players_in_game[game["x_player_sid"]]
    if game.get("o_player_sid") is not None: del self.games_memory.players_in_game[game["o_player_sid"]]
    del game
      
  def disconnect_player(self, sid):
    self.delete_game(sid)