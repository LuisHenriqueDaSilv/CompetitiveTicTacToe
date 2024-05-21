import socketio

from .db.gameMemoryDatabase import GameMemoryDatabase
from .db.connection import Session
from .useCases import MatchUseCases


sio = socketio.AsyncServer(cors_allowed_origins='*',async_mode='asgi')
socketio_app = socketio.ASGIApp(sio)

GameMemory = GameMemoryDatabase()
MatchUseCase = MatchUseCases(
  game_memory=GameMemory,
  db_session=Session(),
  sio=sio,
)

@sio.on("connect")
async def handle_socket_connection(sid, data):
  await sio.emit("connect_message", "hi!", to=sid)
  
@sio.on("disconnect")
def handle_socket_disconnection(sid):
  MatchUseCase.handle_user_disconnection(sid)
  
@sio.on("searching_new_match")
async def handle_player_searching_match(sid, data):
  if sid in GameMemory.players_in_match:
    await sio.emit("bad", "You already in a match", to=sid)
    return 
  
  if not data.get("matchmode"):
    await sio.emit("bad", "gamemode invalid", to=sid)
    return
    
  if data.get("matchmode") == 'algoritmo':
    await MatchUseCase.create_match(sid, data)
  else:
    # verify auth and find match 
    pass

@sio.on("move")
async def handle_move(sid, data):
  if sid not in GameMemory.players_in_match:
    return await sio.emit("bad", "you are not in a match", to=sid)
    
  await MatchUseCase.handle_move(sid, data)