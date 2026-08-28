import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker


# ---------------------------------
# Load Backend .env
# ---------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


# ---------------------------------
# Database Configuration
# ---------------------------------

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")


# ---------------------------------
# Validate Database Configuration
# ---------------------------------

required_variables = {
    "DB_USER": DB_USER,
    "DB_PASSWORD": DB_PASSWORD,
    "DB_HOST": DB_HOST,
    "DB_PORT": DB_PORT,
    "DB_NAME": DB_NAME,
}

missing_variables = [
    key
    for key, value in required_variables.items()
    if not value
]

if missing_variables:
    raise RuntimeError(
        "Missing database environment variables: "
        + ", ".join(missing_variables)
        + f"\nExpected .env file at: {ENV_FILE}"
    )


# ---------------------------------
# Create Database URL
# ---------------------------------

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME,
)


# ---------------------------------
# SQLAlchemy Engine
# ---------------------------------

engine = create_engine(
    DATABASE_URL,
    echo=False,
)


# ---------------------------------
# Database Session
# ---------------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)