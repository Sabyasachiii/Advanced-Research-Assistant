from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    filename: str
    filepath: str
    filetype: str
    project_id: int

    class Config:
        from_attributes = True