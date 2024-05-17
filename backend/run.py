import uvicorn
from dotenv import load_dotenv
import os

load_dotenv('.env')
PORT = os.environ.get("PORT", 3003)
DEBUG = os.environ.get("DEBUG", False)
if __name__ == "__main__":
  uvicorn.run("src:app",
              host="0.0.0.0", 
              port=int(PORT),
              reload=DEBUG
              )