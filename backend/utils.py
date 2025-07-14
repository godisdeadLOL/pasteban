import hashlib
import os
from typing import Optional
import zlib
import base64
import urllib.parse

from models import Paste
from schemas import PastePublic


def convert_id_to_url(id: int):
    hash = zlib.crc32(bytes(id)) & 0xFFFFFFFF
    return hex(hash)[2:]


def decode_base64(encoded: str):
    return base64.b64decode(urllib.parse.unquote(encoded)).decode("utf-8")


def generate_hash(text: str):
    return hashlib.sha256(text.encode()).hexdigest()


def generate_query(title: str):
    return title.lower().replace(" ", "")


def check_read_access(paste: Paste, key: Optional[str]):
    if not paste.key_hash:
        return True

    if key == os.environ["TOKEN"]:
        return True

    if not key:
        return False

    return generate_hash(key) == paste.key_hash


def check_delete_access(paste: Paste, key: Optional[str]):
    if key == os.environ["TOKEN"]:
        return True
    
    if not paste.deletable : return False

    if not paste.key_hash or not key:
        return False

    return generate_hash(key) == paste.key_hash


def check_update_access(paste: Paste, key: Optional[str]):
    if key == os.environ["TOKEN"]:
        return True
    
    if not paste.updatable : return False

    if not paste.key_hash or not key:
        return False

    return generate_hash(key) == paste.key_hash
