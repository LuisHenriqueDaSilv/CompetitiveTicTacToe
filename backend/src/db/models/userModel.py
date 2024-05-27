from sqlalchemy import Column, String, Integer, Boolean
from src.db.base import Base

class UserModel(Base):
  __tablename__ = "users"
  id= Column("id", Integer, primary_key=True, nullable=False, autoincrement=True)
  username = Column("username", String, nullable=False, unique=True)
  password = Column("password", String, nullable=False)
  email = Column("email", String, nullable=False, unique=True)
  validated = Column("validated", Boolean, nullable=False)
  validation_code = Column("validation_code", Integer, nullable=True)
  