from sqlalchemy import String, Integer, Column, ForeignKey
from sqlalchemy.orm import relationship, backref

from src.db.base import Base

class MultiplayerGameModel(Base):
  __tablename__ = "games"
  id = Column("id", Integer, primary_key=True, unique=True, autoincrement=True, nullable=False)
  x_player_id = Column("x_player_id", Integer, ForeignKey("users.id"), nullable=True, )
  o_player_id = Column("o_player_id", Integer, ForeignKey("users.id"), nullable=True)
  data = Column("data", String(9), nullable=True)
  winner_id = Column("winner_id", Integer, ForeignKey("users.id"),  nullable=True)
  
  x_player = relationship("UserModel", foreign_keys=[x_player_id], back_populates="x_games")
  o_player = relationship("UserModel", foreign_keys=[o_player_id], back_populates="o_games")
  winner = relationship("UserModel", foreign_keys=[winner_id], back_populates="wins")
  
  def __init__(self, x_player_id, o_player_id, winner_id, data):
    self.x_player_id = x_player_id
    self.o_player_id = o_player_id
    self.data = data
    self.winner_id = winner_id
    
