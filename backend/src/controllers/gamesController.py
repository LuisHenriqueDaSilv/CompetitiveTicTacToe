from socketio import AsyncServer
import random
from uuid import uuid4
from src.services import JWTService

from src.db.models import UserModel
from src.db.gamesMemoryDatabase import GamesMemoryDatabase

class GamesController():
  
  sio: AsyncServer = None
  def __init__(self, games_memory:GamesMemoryDatabase, sio:AsyncServer):
    self.games_memory = games_memory
    self.sio = sio
    
  @JWTService.socket_decode_token_middleware
  async def search_new_game(self, sid, data, user_on_db:UserModel):
    gamemode = data.get("gamemode", None)
    if gamemode == "algoritmo":
      user_to_save_in_memory = {
        "id": None,
        "username": None,
        "sid":sid
      }
      await self.create("algoritmo", sid)
      self.games_memory.players_in_game[sid] = user_to_save_in_memory
      return
    elif gamemode == "multiplayer":
      if user_on_db is None:
        await self.sio.emit("bad", "não autenticado", to=sid)
        return
      user_to_save_in_memory = {
        "id": user_on_db.id,
        "username": user_on_db.username,
        "sid":sid
      }
      if len(self.games_memory.players_finding_game.keys()) == 0:
        self.games_memory.players_finding_game[sid] = user_to_save_in_memory
      else:
        player_who_was_waiting = self.games_memory.players_finding_game.popitem()[1]
        await self.create(
          gamemode="multiplayer",
          player_one_sid=player_who_was_waiting["sid"],
          player_one=player_who_was_waiting,
          player_two_sid=sid,
          player_two=user_to_save_in_memory
        )
        self.games_memory.players_in_game[player_who_was_waiting["sid"]] = player_who_was_waiting
        self.games_memory.players_in_game[sid] = user_to_save_in_memory
      pass
    else:
      self.sio.emit("bad", "modo de jogo invalido", to=sid)
  
  async def create(
    self, 
    gamemode:str ="algoritmo",
    player_one_sid:str=None,
    player_one={}, 
    player_two_sid:str=None,
    player_two= {}
  ):
    if player_one_sid in self.games_memory.players_in_game:
      await self.sio.emit("bad", "você já esta em uma partida", to=player_one_sid)
      return 
    
    player_one_id_on_db = player_one.get("id", None)
    player_two_id_on_db = player_two.get("id", None)
    game_uuid = uuid4().hex
    created_game = {
      "mode":gamemode, 
      "x_player_id":player_one_id_on_db,
      "o_player_id":player_two_id_on_db,
      "x_player_sid":player_one_sid,
      "o_player_sid":player_two_sid,
      "data": "         ",
      "id": game_uuid,
      "current": "x"
    }
    self.games_memory.running_games[game_uuid] = created_game 
    await self.sio.enter_room(player_one_sid, game_uuid)
    if player_two_sid is not None: await self.sio.enter_room(player_two_sid, game_uuid)
      
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
    
    position = data.get("position")
    try: 
      position = int(position)
    except ValueError:
      await self.sio.emit("bad", "a posição precisa ser um numero inteiro", to=sid)
      return
    
    game_data = list(game_on_memory["data"])
    if position is None or (position < 0 or position > 9) or game_data[position] != " ": 
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
    if game_on_memory["mode"] == "algoritmo": 
      await self.algorithm_move(game_on_memory)
      return
    await self.sio.emit(
      "new_move",
      {
        "new_data": new_game_data
      },
      room=game_on_memory["id"]
    )  
      
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
