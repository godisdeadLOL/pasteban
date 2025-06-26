import os
import requests

def validate_captcha(captcha: str) -> bool :
    response = requests.post(
        f"https://www.google.com/recaptcha/api/siteverify?secret={os.environ['RECAPTCHA_SECRET_KEY']}&response={captcha}"
    )
    success: bool = response.json()["success"]
    
    return success