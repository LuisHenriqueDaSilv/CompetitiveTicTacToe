import socketio

from .db.gamesMemoryDatabase import GamesMemoryDatabase
from .db.connection import Session
from .useCases import GameUseCases


sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[])
socketio_app = socketio.ASGIApp(sio)

GameMemory = GamesMemoryDatabase()
GameUseCase = GameUseCases(
  game_memory=GameMemory,
  db_session=Session(),
  sio=sio,
)

@sio.on("connect")
async def handle_socket_connection(sid, data):
  await sio.emit("connect_message", "hi!", to=sid)
  
@sio.on("disconnect")
def handle_socket_disconnection(sid):
  GameUseCase.handle_user_disconnection(sid)
  
@sio.on("searching_new_game")
async def handle_player_searching_game(sid, data):
  if sid in GameMemory.players_in_game:
    await sio.emit("bad", "você já esta em uma partida", to=sid)
    return 
  await GameUseCase.create_game(sid)

@sio.on("move")
async def handle_move(sid, data):
  if sid not in GameMemory.players_in_game:
    await sio.emit("bad", "você não esta em uma partida", to=sid)
    return 
  await GameUseCase.handle_move(sid, data)