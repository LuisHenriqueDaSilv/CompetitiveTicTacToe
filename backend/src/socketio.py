import socketio

sio = socketio.AsyncServer(cors_allowed_origins='*',async_mode='asgi')
socketio_app = socketio.ASGIApp(sio)

@sio.on("connect")
async def handle_socket_connection(sid, env):
  await sio.emit("message", "connected", to=sid)
