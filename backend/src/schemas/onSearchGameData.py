from pydantic import BaseModel, model_validator

class OnSearchGameData(BaseModel):
  gamemode: str
  
  @model_validator(mode='before')
  @classmethod
  def validate_model(self, data):
    if data.get("gamemode", None) is None:
      raise ValueError("modo de jogo invalido")
    return data
  