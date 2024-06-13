from socketio import AsyncServer

from src.middlewares import socket_data_parser
from src.schemas import \
  OnSearchGameData, \
  GameData, \
  PlayerData, \
  GameInfosData, \
  OnMoveData
from src.db.models import UserModel, MultiplayerGameModel
from src.db.gamesMemoryDatabase import GamesMemoryDatabase
from src.db.connection import Session as DbSession
from src.middlewares import socket_authenticate
from src.algorithm import Algorithm

class GamesController():
  sio: AsyncServer = None
  games_memory:GamesMemoryDatabase = GamesMemoryDatabase()

  def __init__(self, sio:AsyncServer):
    self.sio = sio
    
  @socket_data_parser(OnSearchGameData)
  async def on_wanna_play(self, sid, data:OnSearchGameData):
    if sid in self.games_memory.players_in_game.keys():
      await self.sio.emit("bad", "você já esta em uma partida", to=sid)
      return 
    
    if data.gamemode == "algoritmo": await self.create_algorithm_game(sid)
    elif data.gamemode == "multiplayer": await self.find_multiplayer_match(sid, data)
    else: self.sio.emit("bad", "modo de jogo invalido", to=sid)
  
  async def create_algorithm_game(self, sid):
    new_player = PlayerData( id=None, username=None, sid=sid )
    created_game = GameData( infos=GameInfosData( mode="algoritmo", x_player=new_player ) )
    self.games_memory.save_game(created_game)
    await self.sio.emit("new_game", created_game.model_dump(), to=new_player.sid)
    self.games_memory.set_player_in_game(new_player)
  
  @socket_authenticate
  async def find_multiplayer_match(self, sid, _, user_on_db:UserModel):
    if user_on_db is None:
      await self.sio.emit("bad", "usuário não autenticado",to=sid)
      return
    
    new_player = PlayerData( id=user_on_db.id, sid=sid, username=user_on_db.username )
    has_player_waiting_for_game = len(self.games_memory.players_finding_game.keys()) > 0
    if not has_player_waiting_for_game:
      self.games_memory.set_player_searching_game(new_player)
      return
    player_who_is_waiting = self.games_memory.get_awaiting_player()
    created_game_infos = GameInfosData(
      mode="multiplayer",
      o_player=new_player,
      x_player=player_who_is_waiting
    )
    created_game = GameData(infos=created_game_infos)
    self.games_memory.save_game(created_game)
    self.games_memory.set_player_in_game(new_player)
    self.games_memory.set_player_in_game(player_who_is_waiting)
    await self.sio.emit("new_game", created_game.model_dump(), to=new_player.sid)
    await self.sio.emit("new_game", created_game.model_dump(), to=player_who_is_waiting.sid)
  
  @socket_data_parser(OnMoveData)
  async def move(self, sid, data:OnMoveData):
    game = self.games_memory.get_game_by_player_sid(sid)
    if game is None:
      await self.sio.emit("bad", "você não está em uma partida", to=sid)
      return
    
    player_is_x = game.infos.x_player.sid == sid
    player_is_o = game.infos.o_player.sid == sid if game.infos.mode == "multiplayer" else False
    if (player_is_o and game.infos.current != "o") or (player_is_x and game.infos.current != "x"):
      await self.sio.emit("bad", "não é a sua vez de jogar", to=sid)
      return
    
    new_game_data = list(game.data)
    if new_game_data[data.position] != " ": 
      await self.sio.emit("bad", "posição invalida", to=sid)
      return
    new_game_data[data.position] = game.infos.current
    game.data = ''.join(new_game_data)
    game_result = Algorithm.verify_result(game.data)
    if game_result: 
      self.finish_game(game, game_result)
      await self.sio.emit( "new_move", game.model_dump(), to=game.infos.x_player.sid )
      if game.infos.mode == "multiplayer":
        await self.sio.emit( "new_move", game.model_dump(), to=game.infos.o_player.sid )
      return
    
    game.infos.current = "x" if game.infos.current == "o" else "o"
    self.games_memory.save_game(game)
    if game.infos.mode == "algoritmo":
      Algorithm.move(game)
      result_after_algorithm_move = Algorithm.verify_result(game.data)
      if result_after_algorithm_move: self.finish_game(game, result_after_algorithm_move)
      else:
        game.infos.current = "x" if game.infos.current == "o" else "o"
        self.games_memory.save_game(game)
        
    to_sid = None
    if player_is_x and game.infos.mode == "multiplayer": to_sid = game.infos.o_player.sid
    else: to_sid = game.infos.x_player.sid 
    await self.sio.emit( "new_move", game.model_dump(), to=to_sid )
    
  def finish_game(self, game:GameData, result:str, winner=None):
    game.infos.result=result
    if winner is None: winner = game.infos.current
    game.infos.winner = winner
    if game.infos.mode == "multiplayer":
      winner_id = game.infos.x_player.id if winner == "x" else game.infos.o_player.id
      try:
        db_session = DbSession()
        created_game = MultiplayerGameModel(
          data=game.data,
          winner_id=winner_id,
          x_player_id=game.infos.x_player.id,
          o_player_id=game.infos.o_player.id,
        )
        db_session.add(created_game)
        db_session.commit()
        db_session.close()
      except: pass
    self.games_memory.delete_game(game)  
      
  async def disconnect_player(self, sid):
    # test = 0/0
    game = self.games_memory.get_game_by_player_sid(sid)
    if game is None: return
    player_is_o = game.infos.o_player.sid == sid if game.infos.mode == "multiplayer" else False
    winner = "x" if player_is_o else "o"
    self.finish_game(game, "giveup", winner)
    
    if game.infos.mode == "algoritmo": return
    to_sid = game.infos.x_player.sid  if player_is_o else game.infos.o_player.sid  
    await self.sio.emit( "new_move", game.model_dump(), to=to_sid )
