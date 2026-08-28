from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models
from app.models.user import User
from app.models.project import Project
from app.models.document import Document
from app.models.chat import Chat