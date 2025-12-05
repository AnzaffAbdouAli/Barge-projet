from typing import Optional
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import current_app


def _get_serializer() -> URLSafeTimedSerializer:
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="admin-auth")


def generate_token(admin_id: int) -> str:
    serializer = _get_serializer()
    return serializer.dumps({"admin_id": admin_id})


def verify_token(token: str, max_age: int) -> Optional[int]:
    serializer = _get_serializer()
    try:
        data = serializer.loads(token, max_age=max_age)
        return data.get("admin_id")
    except (BadSignature, SignatureExpired):
        return None
