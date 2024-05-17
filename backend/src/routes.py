from fastapi.responses import JSONResponse
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health_check() -> JSONResponse:
  return JSONResponse({"msg": "hello"})
