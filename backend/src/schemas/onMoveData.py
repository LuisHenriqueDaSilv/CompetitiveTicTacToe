from pydantic import BaseModel, field_validator, model_validator

class OnMoveData(BaseModel):
  position: int=None
  
  @field_validator("position")
  def validate_position(position):
    try:
      position = int(position)
    except:
      raise ValueError("a posição deve ser um numero inteiro")
    if position > 8 or position < 0:
      raise ValueError("posição invalida")
    return position
  
  @model_validator(mode="before")
  @classmethod
  def validate_model(self, data):
    if data.get("position", None) is None:
      raise ValueError("posição invalida")
    return data