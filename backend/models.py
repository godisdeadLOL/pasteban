from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class Paste(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: Optional[str] = Field(unique=True, index=True)

    title: str
    content: str
    language : str
    
    query: str

    key_hash: Optional[str]

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    @property
    def is_protected(self) -> bool:
        return self.key_hash is not None
