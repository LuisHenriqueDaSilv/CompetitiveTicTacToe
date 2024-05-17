import uvicorn
from dotenv import load_dotenv
import os

from src import app

load_dotenv()
PORT = os.environ.get("PORT", 3003)
if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=int(PORT))