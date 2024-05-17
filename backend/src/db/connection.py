import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_URL=os.environ.get("DB_URL")

engine = create_engine(DB_URL, pool_pre_ping=True)
Session = sessionmaker(bind=engine)
