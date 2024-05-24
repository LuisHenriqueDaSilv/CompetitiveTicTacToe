from fastapi import FastAPI

from .routes import authentication_router, authenticated_router
from .socketio import socketio_app


#Fastapi settings
app = FastAPI()
app.include_router(authentication_router)
app.include_router(authenticated_router)

app.mount("/", socketio_app)
