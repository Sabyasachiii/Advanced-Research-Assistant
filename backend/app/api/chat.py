from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.models.project import Project
from app.models.user import User

from app.rag.retrieval import retrieve_documents
from app.services.llm import generate_answer

from app.utils.dependencies import (
    get_db,
    get_current_user,
)


router = APIRouter()


# ---------------------------------
# Request Schema
# ---------------------------------

class ChatRequest(BaseModel):
    project_id: int
    question: str


# ---------------------------------
# Verify Project Ownership
# ---------------------------------

def get_user_project(
    project_id: int,
    current_user: User,
    db: Session,
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.owner_id == current_user.id,
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project


# ---------------------------------
# Get Chat History
# GET /chat/{project_id}
# ---------------------------------

@router.get("/{project_id}")
def get_chat_history(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify project ownership
    get_user_project(
        project_id=project_id,
        current_user=current_user,
        db=db,
    )

    history = (
        db.query(Chat)
        .filter(
            Chat.project_id == project_id,
        )
        .order_by(Chat.id)
        .all()
    )

    return [
        {
            "id": item.id,
            "role": item.role,
            "content": item.message,
        }
        for item in history
    ]


# ---------------------------------
# Ask Question
# POST /chat/
# ---------------------------------

@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ---------------------------------
    # Validate Question
    # ---------------------------------

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty",
        )

    # ---------------------------------
    # Verify Project Ownership
    # ---------------------------------

    get_user_project(
        project_id=request.project_id,
        current_user=current_user,
        db=db,
    )

    # ---------------------------------
    # Retrieve Relevant Chunks
    # ---------------------------------

    try:
        chunks = retrieve_documents(
            project_id=request.project_id,
            query=question,
            k=3,
        )
    except Exception as e:
        print("Document retrieval error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve relevant documents",
        )

    # ---------------------------------
    # No Relevant Documents
    # ---------------------------------

    if not chunks:
        return {
            "question": question,
            "answer": (
                "I couldn't find the answer in "
                "the uploaded documents."
            ),
            "sources": [],
        }

    # ---------------------------------
    # Build Context
    # ---------------------------------

    context = "\n\n".join(chunks)

    # ---------------------------------
    # Load Previous Conversation
    # ---------------------------------

    history = (
        db.query(Chat)
        .filter(
            Chat.project_id == request.project_id,
        )
        .order_by(Chat.id)
        .all()
    )

    conversation = ""

    for item in history:
        conversation += (
            f"{item.role}: "
            f"{item.message}\n"
        )

    # ---------------------------------
    # Generate Answer
    # ---------------------------------

    try:
        answer = generate_answer(
            question=question,
            context=context,
            conversation=conversation,
        )
    except Exception as e:
        print("LLM generation error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response",
        )

    # ---------------------------------
    # Save User Message
    # ---------------------------------

    user_message = Chat(
        project_id=request.project_id,
        role="user",
        message=question,
    )

    db.add(user_message)

    # ---------------------------------
    # Save Assistant Message
    # ---------------------------------

    assistant_message = Chat(
        project_id=request.project_id,
        role="assistant",
        message=answer,
    )

    db.add(assistant_message)

    # ---------------------------------
    # Commit Chat History
    # ---------------------------------

    try:
        db.commit()
    except Exception as e:
        db.rollback()

        print("Chat database error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to save chat history",
        )

    # ---------------------------------
    # Response
    # ---------------------------------

    return {
        "question": question,
        "answer": answer,
        "sources": chunks,
    }