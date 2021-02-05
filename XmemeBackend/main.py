from typing import List
from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Meme, MemeIn, Body
import os
import urllib
from database import Datamodel

dataModel = Datamodel()
database = dataModel.get_database()
memes = dataModel.get_table()

app = FastAPI(title="Xmeme")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def home():
    return {"message" : "welcome perul jain"}

@app.post("/memes", status_code = status.HTTP_201_CREATED)
async def create_meme(name:str, caption:str, url:str):
    query = memes.select().where(memes.c.name==name and memes.c.url==url and memes.c.caption==caption)
    result = await database.fetch_one(query)
    if(result):
        raise HTTPException(status_code=409, detail="Meme already exists")
    
    query = memes.insert().values(name=name, caption=caption, url=url)
    last_record_id = await database.execute(query)
    return {"id": last_record_id}

@app.get("/memes", response_model=List[Meme], status_code = status.HTTP_200_OK)
async def read_memes(skip: int = 0, take: int = 100):
    query = memes.select().offset(skip).limit(take)
    result = await database.fetch_all(query)
    return result[::-1]

@app.get("/memes/{meme_id}", response_model=Meme, status_code = status.HTTP_200_OK)
async def read_meme(meme_id: int):
    query = memes.select().where(memes.c.id == meme_id)
    result = await database.fetch_one(query)
    if(result==None): 
        raise HTTPException(status_code=404, detail="Meme not found")
    return result


@app.patch("/memes/{meme_id}", status_code = status.HTTP_200_OK)
async def read_meme(meme_id: int, body : Body):
    query = memes.update().where(memes.c.id == meme_id).values(url=body.url, caption=body.caption)
    result = await database.execute(query)
    if(result==0): 
        raise HTTPException(status_code=404, detail="Item not found")
    query = memes.select().where(memes.c.id == meme_id)
    result = await database.fetch_one(query)
    return result

@app.delete("/memes/{meme_id}",  status_code = status.HTTP_200_OK)
async def read_meme(meme_id: int):
    query = memes.delete().where(memes.c.id == meme_id)
    result = await database.execute(query)
    if(result==0): 
        raise HTTPException(status_code=404, detail="Meme not found")
    return {"message" : "deleted successfully"}