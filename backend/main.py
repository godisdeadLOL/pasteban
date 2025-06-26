import asyncio
from pathlib import Path
import random
import dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session

from db import get_session, init_db
from router import router as paste_router

dotenv.load_dotenv()

app = FastAPI()
app.add_middleware(  # todo: настроить cors
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range"],
)

app.include_router(paste_router, prefix="/pastes", tags=["Pastes"])

app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.exception_handler(404)
def redirect_to_index(request: Request, exc: HTTPException):
    return FileResponse("static/index.html")


@app.on_event("startup")
def on_startup():
    init_db()


@app.middleware("http")
async def emulate_latency(request: Request, call_next):
    await asyncio.sleep(1 + 1 * random.random())
    return await call_next(request)
