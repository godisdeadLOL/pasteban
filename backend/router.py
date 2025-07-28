from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import Session, and_, col, func, or_, select

from db import get_session
from models import Paste
from schemas import PasteCreate, PasteOverview, PastePublic, PasteUpdate
from security import validate_captcha, get_token
from utils import (
    check_delete_access,
    check_read_access,
    check_update_access,
    convert_id_to_url,
    decode_base64,
    generate_hash,
    generate_query,
    parse_duration,
)


router = APIRouter()

expiration_check = or_(
    Paste.duration == None,
    func.strftime("%s", "now") - func.strftime("%s", Paste.created_at) < Paste.duration,
)


@router.get("", response_model=list[PasteOverview])
def list(query: str = "", session: Session = Depends(get_session)):
    stmt = select(Paste).where(expiration_check)

    if len(query) > 0:
        stmt = stmt.where(col(Paste.query).ilike(f"%{generate_query(query)}%"))

    stmt = stmt.order_by(col(Paste.created_at).desc()).limit(15)

    return session.exec(stmt).all()


@router.get("/{url}", response_model=PastePublic)
def get(url: str, token: str = Depends(get_token), session: Session = Depends(get_session)):
    paste: Optional[Paste] = session.exec(select(Paste).where(expiration_check).where(Paste.url == url)).one_or_none()

    if paste is None:
        raise HTTPException(404)

    if not check_read_access(paste, token):
        raise HTTPException(401)

    return paste


@router.post("", response_model=PastePublic)
def create(create_request: PasteCreate, captcha: str = Header(), session: Session = Depends(get_session)):
    if not validate_captcha(captcha):
        raise HTTPException(422)

    fields = create_request.model_dump()
    del fields["key"]
    del fields["duration"]

    paste = Paste(
        **fields,
        key_hash=(generate_hash(create_request.key) if (create_request.key is not None and len(create_request.key) > 0) else None),
        query=generate_query(create_request.title),
        duration=parse_duration(create_request.duration) if create_request.duration else None,
    )

    session.add(paste)
    session.flush()
    session.refresh(paste)

    assert paste.id
    paste.url = convert_id_to_url(paste.id)

    session.commit()

    return paste


@router.delete("/{url}")
def delete(url: str, token: str = Depends(get_token), session: Session = Depends(get_session)):
    paste: Optional[Paste] = session.exec(select(Paste).where(expiration_check).where(Paste.url == url)).one_or_none()

    if not paste:
        raise HTTPException(404)

    if not check_delete_access(paste, token):
        raise HTTPException(401)

    session.delete(paste)
    session.commit()


@router.put("/{url}", response_model=PastePublic)
def update(
    paste_update: PasteUpdate,
    url: str,
    token: str = Depends(get_token),
    session: Session = Depends(get_session),
):
    paste: Optional[Paste] = session.exec(select(Paste).where(expiration_check).where(Paste.url == url)).one_or_none()

    if not paste:
        raise HTTPException(404)

    if not check_update_access(paste, token):
        raise HTTPException(401)

    for key, value in iter(paste_update):
        setattr(paste, key, value)

    if paste_update.content:
        paste.query = generate_query(paste_update.content)

    session.add(paste)
    session.commit()
    session.refresh(paste)

    return paste
