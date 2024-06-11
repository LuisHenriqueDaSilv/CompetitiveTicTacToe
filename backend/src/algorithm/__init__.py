import random
from socketio import Server as SocketServer
from src.schemas import GameData

class Algorithm():
  
  @staticmethod
  def generate_random_position(gameData)-> int:
    game_positions = [a for a in gameData]
    free_positions_indexes = []
    for index, position in enumerate(game_positions):
      if position == " ": free_positions_indexes.append(index)
    move_position_index = random.randint(0, len(free_positions_indexes)-1)
    return free_positions_indexes[move_position_index]
  
  @classmethod
  def move(cls, game:GameData):
    move_position = cls.generate_random_position(game.data)
    game_data = list(game.data)
    game_data[move_position] = game.infos.current
    new_game_data = ''.join(game_data)
    game.data = new_game_data

  @staticmethod
  def verify_result(game_data):
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
    elif blank_positions == 0: return "tie"
    else: return False
    