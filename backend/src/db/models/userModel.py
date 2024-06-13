from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.orm import relationship
from src.db.base import Base

class UserModel(Base):
  __tablename__ = "users"
  id= Column("id", Integer, primary_key=True, nullable=False, autoincrement=True)
  username = Column("username", String, nullable=False, unique=True)
  password = Column("password", String, nullable=False)
  email = Column("email", String, nullable=False, unique=True)
  validated = Column("validated", Boolean, nullable=False)
  validation_code = Column("validation_code", Integer, nullable=True)
  
  x_games = relationship("MultiplayerGameModel", foreign_keys="MultiplayerGameModel.x_player_id", back_populates='x_player')
  o_games = relationship("MultiplayerGameModel", foreign_keys="MultiplayerGameModel.o_player_id", back_populates='o_player')
  wins = relationship("MultiplayerGameModel", foreign_keys="MultiplayerGameModel.winner_id", back_populates='winner')
  