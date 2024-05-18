from fastapi import FastAPI

from .routes import user_router, authenticated_router

app = FastAPI()
app.include_router(user_router)
app.include_router(authenticated_router)