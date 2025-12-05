from functools import wraps
from flask import request, jsonify, current_app, g
from services.auth import verify_token
from models import Admin


def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Missing token"}), 401
        token = auth_header.split(" ", 1)[1].strip()
        admin_id = verify_token(
            token, int(current_app.config["ACCESS_TOKEN_EXPIRES"].total_seconds())
        )
        if not admin_id:
            return jsonify({"status": "error", "message": "Invalid or expired token"}), 401
        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({"status": "error", "message": "User not found"}), 401
        g.current_admin = admin
        return func(*args, **kwargs)

    return wrapper
