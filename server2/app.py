import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import config
from models import db
from routes import public_bp, admin_bp


def create_app():
    app = Flask(__name__, static_folder=None)
    app.config.from_object(config)
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"status": "error", "message": "Not found"}), 404

    @app.route("/uploads/<path:filename>")
    def serve_upload(filename):
        upload_folder = config.UPLOAD_FOLDER
        return send_from_directory(upload_folder, filename)

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        if not os.path.exists(config.UPLOAD_FOLDER):
            os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
