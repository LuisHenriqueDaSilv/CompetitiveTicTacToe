from socketio import Server

def socket_data_parser(Schema):
  def decorator(function):
    async def wrapper(self, sid, data, *args, **kwargs):
      try:
        parsed_data = Schema(**data)
      except ValueError as error:
        await self.sio.emit("bad", error, to=sid)
        return
      await function(self, sid, parsed_data, *args, **kwargs)
    
    return wrapper
  return decorator
