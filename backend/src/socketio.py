import socketio

from .db.gamesMemoryDatabase import GamesMemoryDatabase
from .controllers import GamesController
from .depends import get_db_session

# Socket settings
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[])
socketio_app = socketio.ASGIApp(sio)

# Games settings
games_memory = GamesMemoryDatabase()
games_controller = GamesController(
  games_memory=games_memory,
  sio=sio,
)

# Socket events
@sio.on("connect")
async def handle_socket_connection(sid, data):
  await sio.emit("connect_message", "hi!", to=sid)
  
@sio.on("disconnect")
def handle_socket_disconnection(sid):
  games_controller.db_session = get_db_session()
  games_controller.disconnect_player(sid)
  
@sio.on("searching_new_game")
async def handle_player_searching_game(sid, data):
  games_controller.db_session = get_db_session()
  await games_controller.create(sid)

@sio.on("move")
async def handle_move(sid, data):
  games_controller.db_session = get_db_session()
  await games_controller.move(sid, data)