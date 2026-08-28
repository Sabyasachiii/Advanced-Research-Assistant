import os
import shutil

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.project import Project
from app.models.user import User

from app.rag.loader import load_pdf
from app.rag.splitter import split_text
from app.rag.embeddings import create_embeddings
from app.rag.store import vector_store

from app.utils.dependencies import (
    get_db,
    get_current_user,
)


router = APIRouter()


# ---------------------------------
# Upload Folder
# ---------------------------------

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True,
)


# ---------------------------------
# Upload PDF
# ---------------------------------

@router.post("/upload")
def upload_document(
    project_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ---------------------------------
    # Verify Project Ownership
    # ---------------------------------

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

    # ---------------------------------
    # Validate File
    # ---------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected",
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed",
        )

    # ---------------------------------
    # Create File Path
    # ---------------------------------

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename,
    )

    # ---------------------------------
    # Save PDF
    # ---------------------------------

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to save uploaded file",
        )

    # ---------------------------------
    # Save Document to Database
    # ---------------------------------

    document = Document(
        filename=file.filename,
        filepath=file_path,
        filetype=file.content_type,
        project_id=project_id,
    )

    db.add(document)

    try:
        db.commit()
        db.refresh(document)
    except Exception:
        db.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=400,
            detail="Failed to save document",
        )

    # ---------------------------------
    # Build RAG Index
    # ---------------------------------

    try:
        # Extract text from PDF
        text = load_pdf(file_path)

        if not text or not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF",
            )

        # Split text into chunks
        chunks = split_text(text)

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No text chunks were created",
            )

        # Create embeddings
        embeddings = create_embeddings(chunks)

        # Store embeddings
        vector_store.add(
            project_id=project_id,
            chunks=chunks,
            embeddings=embeddings,
        )

    except HTTPException:
        # ---------------------------------
        # Rollback Document
        # ---------------------------------

        db.delete(document)
        db.commit()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise

    except Exception as e:
        print("RAG indexing error:", e)

        # ---------------------------------
        # Rollback Document
        # ---------------------------------

        db.delete(document)
        db.commit()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail="Failed to process PDF",
        )

    # ---------------------------------
    # Debug Information
    # ---------------------------------

    print("=" * 50)
    print("DOCUMENT UPLOAD")
    print("Project:", project_id)
    print("User:", current_user.id)
    print("Filename:", file.filename)
    print("Chunks:", len(chunks))
    print(
        "Vector Store:",
        vector_store.total_documents(),
    )
    print("=" * 50)

    # ---------------------------------
    # Response
    # ---------------------------------

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "chunks_created": len(chunks),
    }


# ---------------------------------
# Get All Documents
# ---------------------------------

@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .join(
            Project,
            Document.project_id == Project.id,
        )
        .filter(
            Project.owner_id == current_user.id,
        )
        .all()
    )

    return documents


# ---------------------------------
# Get Documents By Project
# ---------------------------------

@router.get("/project/{project_id}")
def get_project_documents(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ---------------------------------
    # Verify Project Ownership
    # ---------------------------------

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

    # ---------------------------------
    # Get Documents
    # ---------------------------------

    documents = (
        db.query(Document)
        .filter(
            Document.project_id == project_id,
        )
        .all()
    )

    return documents