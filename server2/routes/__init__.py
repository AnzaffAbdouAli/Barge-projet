from flask import Blueprint

public_bp = Blueprint("public", __name__, url_prefix="/api")
admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

from . import public, admin  # noqa: E402,F401
