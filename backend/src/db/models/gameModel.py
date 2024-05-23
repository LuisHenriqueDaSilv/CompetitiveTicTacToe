from sqlalchemy import String, Integer, Column

from src.db.base import Base

class GameModel(Base):
  __tablename__ = "games"
  id = Column("id", Integer, primary_key=True, unique=True, autoincrement=True, nullable=False )
  player1_id = Column("player1_id", Integer, nullable=True)
  player1_sid = Column("player1_sid", String, nullable=False)
  player2_sid = Column("player2_sid", String, nullable=True)
  player2_id = Column("player2_id", Integer, nullable=True)
  mode = Column("mode", String, nullable=False)
  data = Column("data", String(9), nullable=True)
  status = Column("status", String(3), nullable=False) # "RUN" or "END"
  winner_id = Column("winner_id", Integer, nullable=True)
  current = Column("current", String(1), nullable=False)
  
  def __init__(self, mode, player1_id, player2_id, player1_sid, player2_sid=""):
    self.player1_id = player1_id
    self.player2_id = player2_id
    self.mode = mode
    self.player1_sid = player1_sid
    self.player2_sid = player2_sid
    self.status = "RUN"
    self.current = "x"
    self.data = "         "
