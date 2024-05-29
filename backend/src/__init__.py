from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import authentication_router, authenticated_router, global_router
from .socketio import socketio_app


#Fastapi settings
app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
app.include_router(authentication_router)
app.include_router(authenticated_router)
app.include_router(global_router)

app.mount("/", socketio_app)
