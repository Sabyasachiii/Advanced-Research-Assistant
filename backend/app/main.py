from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine
from app.database.base import Base

from app.api import users
from app.api import projects
from app.api import documents
from app.api import chat


# ---------------------------------
# FastAPI Application
# ---------------------------------

app = FastAPI(
    title="Advanced Research Assistant",
    version="1.0.0",
)


# ---------------------------------
# CORS
# ---------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------------
# Database Startup
# ---------------------------------

@app.on_event("startup")
def startup():
    Base.metadata.create_all(
        bind=engine
    )


# ---------------------------------
# API Routers
# ---------------------------------

app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
)

app.include_router(
    projects.router,
    prefix="/projects",
    tags=["Projects"],
)

app.include_router(
    documents.router,
    prefix="/documents",
    tags=["Documents"],
)

app.include_router(
    chat.router,
    prefix="/chat",
    tags=["Chat"],
)


# ---------------------------------
# Root Endpoint
# ---------------------------------

@app.get("/")
def home():
    return {
        "message": "Advanced Research Assistant Running",
    }