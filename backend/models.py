from datetime import datetime, timezone
from typing import Optional
import sqlalchemy
from sqlmodel import Field, SQLModel


class Paste(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: Optional[str] = Field(unique=True, index=True)

    title: str
    content: str
    language: str

    updatable: bool = Field(default=True)
    deletable: bool = Field(default=True)

    query: str

    key_hash: Optional[str]

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    duration: Optional[int]

    @property
    def is_protected(self) -> bool:
        return self.key_hash is not None

    @property
    def expiration(self) -> Optional[int]:
        if not self.duration:
            return None
        
        created_at = self.created_at.replace(tzinfo=timezone.utc)
        return max(0, self.duration - (datetime.now(timezone.utc) - created_at).seconds)
