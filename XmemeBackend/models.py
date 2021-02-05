from pydantic import BaseModel
from typing import Optional

class MemeIn(BaseModel):
    name: str
    caption: str
    url : str

class Meme(BaseModel):
    id: int
    name: str
    caption: str
    url : str

class Body(BaseModel):
    caption : Optional[str]
    url : Optional[str]
