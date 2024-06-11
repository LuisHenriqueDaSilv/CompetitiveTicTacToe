
from src.schemas import GameData, PlayerData

class GamesMemoryDatabase:
  players_finding_game = {}
  players_in_game = {}
  running_games = {}
  
  def save_game(self, game:GameData) -> None:
    self.running_games[game.infos.id] = game.model_dump()
  
  def get_game(self,id=None) -> GameData|None:
    game = self.running_games.get(id, None)
    if game is None: return None
    return GameData(**game)
  
  def get_awaiting_player(self) -> PlayerData:
    player = self.players_finding_game.popitem()[1]
    return PlayerData(**player)
  
  def get_game_by_player_sid(self, sid) -> GameData | None:
    searched_game = None
    for game_id in self.running_games:
      game = self.get_game(game_id)
      if game.infos.x_player.sid == sid or game.infos.o_player.sid == sid:
        searched_game = game
        break
    if searched_game is None: return None
    return searched_game
  
  def set_player_in_game(self, player:PlayerData) -> None:
    self.players_in_game[player.sid] = player.model_dump()
    
  def set_player_searching_game(self, player:PlayerData) -> None:
    self.players_finding_game[player.sid] = player.model_dump()
    
  def delete_game(self, game:GameData=None):  
    self.players_in_game.pop(game.infos.x_player.sid)
    if game.infos.mode == "multiplayer":
      self.players_in_game.pop(game.infos.o_player.sid)
    self.running_games.pop(game.infos.id)