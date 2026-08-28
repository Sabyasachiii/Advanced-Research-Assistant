from sqlalchemy import Column, Integer, Text, ForeignKey
from app.database.base import Base


class Chat(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    role = Column(
        Text,
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )