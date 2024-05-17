from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def get_index() -> str:
  return "hello world"
