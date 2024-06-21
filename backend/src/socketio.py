import socketio

from .db.gamesMemoryDatabase import GamesMemoryDatabase
from .controllers import GamesController

# Socket settings
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[])
socketio_app = socketio.ASGIApp(sio)

# Games settings
games_controller = GamesController(
  sio=sio,
)

# Socket events
@sio.on("connect")
async def handle_socket_connection(sid, data):
  query_string = data.get('QUERY_STRING', '')
  token = None
  if query_string:
    params = dict(param.split('=') for param in query_string.split('&'))
    token = params.get('authentication_jwt')
  await sio.save_session(sid, {"authentication_jwt": token})
  await sio.emit("connect_message", "hi!", to=sid)
  
@sio.on("disconnect")
async def handle_socket_disconnection(sid):
  await games_controller.disconnect_player(sid)

@sio.on("wanna_play")
async def handle_player_searching_game(sid, data):
  await games_controller.on_wanna_play(sid, data)
  
@sio.on("cancel_wanna_play")
def cancel_game_search(sid, data):
  games_controller.cancel_wanna_play(sid, data)

@sio.on("move")
async def handle_move(sid, data):
  await games_controller.move(sid, data)
  