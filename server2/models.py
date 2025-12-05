from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Admin(db.Model, TimestampMixin):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class Project(db.Model, TimestampMixin):
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    project_type = db.Column(db.String(100), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    year = db.Column(db.Integer, nullable=True)
    surface = db.Column(db.String(100), nullable=True)

    images = db.relationship("ProjectImage", backref="project", cascade="all, delete")


class ProjectImage(db.Model):
    __tablename__ = "project_images"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    is_main = db.Column(db.Boolean, default=False)


class TeamMember(db.Model, TimestampMixin):
    __tablename__ = "team_members"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    position = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    photo_path = db.Column(db.String(255), nullable=True)


class SiteContent(db.Model):
    __tablename__ = "site_contents"
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=False)


class ContactMessage(db.Model):
    __tablename__ = "contact_messages"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
