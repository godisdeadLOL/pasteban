from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field, computed_field


class PastePublic(BaseModel):
    title: str
    content: str
    url: str
    language: str
    
    is_protected: Optional[bool]

    updatable: bool
    deletable: bool
    
    created_at: datetime
    expiration: Optional[int]


class PasteUpdate(BaseModel):
    title: str
    content: str
    language: str


class PasteOverview(BaseModel):
    title: str
    url: str
    created_at: datetime
    is_protected: Optional[bool]

    updatable: bool
    deletable: bool


class PasteCreate(BaseModel):
    title: str = Field(min_length=5, max_length=100)
    content: str = Field(max_length=10000)
    language: str
    
    key: Optional[str] = None
    
    duration: Optional[Literal["", "5m", "10m", "1h", "5h", "1d", "1w"]]

    updatable: bool = True
    deletable: bool = True
