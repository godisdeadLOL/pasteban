import hashlib
import zlib
import base64
import urllib.parse
from whats_that_code.election import guess_language_all_methods


def convert_id_to_url(id: int):
    hash = zlib.crc32(bytes(id)) & 0xFFFFFFFF
    return hex(hash)[2:]


def decode_base64(encoded: str):
    return base64.b64decode(urllib.parse.unquote(encoded)).decode("utf-8")


def generate_hash(text: str):
    return hashlib.sha256(text.encode()).hexdigest()

def generate_query(title : str):
    return title.lower().replace(' ', '')

languages = {
    "python": "python",
    "java": "java",
    "javascript": "javascript",
    "c#": "csharp",
    "c++": "cpp",
    "php": "php",
    "r": "r",
    "objectivec": "objectivec",
    "swift": "swift",
    "typescript": "typescript",
    "matlab": "matlab",
    "kotlin": "kotlin",
    "go": "go",
    "ruby": "ruby",
    "rust": "rust",
    "scala": "scala",
    "vbnet": "vbnet",
    "lua": "lua",
    "ada": "ada",
    "dart": "dart",
    "abap": "abap",
    "perl": "perl",
    "julia": "julia",
    "groovy": "groovy",
    "haskell": "haskell",
    "delphi": "delphi",
    "cobol": "text",
    "vba": "text",
}


def guess_language(code: str):
    result = guess_language_all_methods(code)

    if result is None:
        return "text"

    try:
        return languages[result]
    except:
        return "text"
