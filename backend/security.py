import os
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import requests

from utils import decode_base64


def validate_captcha(captcha: str) -> bool:
    response = requests.post(
        f"https://www.google.com/recaptcha/api/siteverify?secret={os.environ['RECAPTCHA_SECRET_KEY']}&response={captcha}"
    )
    success: bool = response.json()["success"]

    return success


security = HTTPBearer(auto_error=False)


def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials : return None
    
    token = decode_base64(credentials.credentials)
    
    return token or None
