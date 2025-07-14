from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, computed_field


class PastePublic(BaseModel):
    title: str
    content: str
    url: str
    created_at: datetime
    is_protected: Optional[bool]
    
    updatable: bool
    deletable: bool

class PasteUpdate(BaseModel) :
    title: str
    content: str

class PasteOverview(BaseModel):
    title: str
    url: str
    created_at: datetime
    is_protected: Optional[bool]
    
    updatable: bool
    deletable: bool


class PasteCreate(BaseModel):
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)
    key: Optional[str] = None
    
    updatable: bool = True
    deletable: bool = True
