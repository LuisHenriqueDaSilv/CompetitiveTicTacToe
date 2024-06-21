
from src.schemas import GameData, PlayerData

class GamesMemoryDatabase:
  players_queue = {}
  players_in_game = {}
  running_games = {}
  
  def save_game(self, game:GameData) -> None:
    self.running_games[game.infos.id] = game.model_dump()
  
  def get_game(self,id=None) -> GameData|None:
    game = self.running_games.get(id, None)
    if game is None: return None
    return GameData(**game)
  
  def remove_player_from_queue(self, sid) -> None:
    self.players_queue.pop(sid)
    
  def get_player_in_queue(self, sid=None) -> PlayerData:
    player = None
    if sid is None:
      has_players_in_queue = len(self.players_queue) > 0
      if not has_players_in_queue: return
      player = self.players_queue.get(list(self.players_queue.keys())[0])
    else:  
      player = self.players_queue.get(sid, None)
      
    if player is None: return
    return PlayerData(**player)
  
  def get_game_by_player_sid(self, sid) -> GameData | None:
    searched_game = None
    for game_id in self.running_games:
      game = self.get_game(game_id)
      if game.infos.x_player.sid == sid or game.infos.o_player.sid == sid:
        searched_game = game
        break
    if searched_game is None: return
    return searched_game
  
  def set_player_in_game(self, player:PlayerData) -> None:
    self.players_in_game[player.sid] = player.model_dump()
    
  def add_player_in_queue(self, player:PlayerData) -> None:
    self.players_queue[player.sid] = player.model_dump()
    
  def delete_game(self, game:GameData=None):  
    self.players_in_game.pop(game.infos.x_player.sid)
    if game.infos.mode == "multiplayer":
      self.players_in_game.pop(game.infos.o_player.sid)
    self.running_games.pop(game.infos.id)