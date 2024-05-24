from sqlalchemy import String, Integer, Column

from src.db.base import Base

class MultiplayerGameModel(Base):
  __tablename__ = "games"
  id = Column("id", Integer, primary_key=True, unique=True, autoincrement=True, nullable=False)
  x_player_id = Column("x_player_id", Integer, nullable=True)
  o_player_id = Column("o_player_id", Integer, nullable=True)
  data = Column("data", String(9), nullable=True)
  winner_id = Column("winner_id", Integer, nullable=True)
  
  def __init__(self, x_player_id, o_player_id):
    self.x_player_id = x_player_id
    self.o_player_id = o_player_id
    self.data = "         "
