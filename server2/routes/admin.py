import uuid
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from models import db, Admin, Project, ProjectImage, TeamMember, SiteContent, ContactMessage
from services.auth import generate_token
from utils.decorators import admin_required
from . import admin_bp
import os


def allowed_file(filename: str) -> bool:
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]
    )


def save_upload(file_storage):
    if file_storage and allowed_file(file_storage.filename):
        filename = secure_filename(file_storage.filename)
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        path = os.path.join(upload_folder, unique_name)
        file_storage.save(path)
        return unique_name
    return None


@admin_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"status": "error", "message": "Email et mot de passe requis"}), 400
    admin = Admin.query.filter_by(email=email).first()
    if not admin or not admin.check_password(password):
        return jsonify({"status": "error", "message": "Identifiants invalides"}), 401
    token = generate_token(admin.id)
    return jsonify({"status": "success", "token": token, "admin": {"email": admin.email}})


@admin_bp.post("/logout")
@admin_required
def logout():
    
    return jsonify({"status": "success", "message": "Déconnecté"})


@admin_bp.post("/projects")
@admin_required
def create_project():
    title = request.form.get("title")
    description = request.form.get("description")
    if not title or not description:
        return jsonify({"status": "error", "message": "Titre et description requis"}), 400
    try:
        year_value = int(request.form.get("year")) if request.form.get("year") else None
    except ValueError:
        return jsonify({"status": "error", "message": "Année invalide"}), 400

    project = Project(
        title=title,
        description=description,
        project_type=request.form.get("project_type"),
        location=request.form.get("location"),
        year=year_value,
        surface=request.form.get("surface"),
    )
    db.session.add(project)
    db.session.flush()  # ensures id for images

    images = request.files.getlist("images")
    for idx, image in enumerate(images):
        if not allowed_file(image.filename):
            continue
        rel_path = save_upload(image)
        if rel_path:
            db.session.add(
                ProjectImage(
                    project_id=project.id, image_path=rel_path, is_main=idx == 0
                )
            )

    db.session.commit()
    return jsonify({"status": "success", "data": {"id": project.id}}), 201


@admin_bp.put("/projects/<int:project_id>")
@admin_required
def update_project(project_id: int):
    project = Project.query.get_or_404(project_id)
    form = request.form
    project.title = form.get("title", project.title)
    project.description = form.get("description", project.description)
    project.project_type = form.get("project_type", project.project_type)
    project.location = form.get("location", project.location)
    if form.get("year"):
        try:
            project.year = int(form.get("year"))
        except ValueError:
            return jsonify({"status": "error", "message": "Année invalide"}), 400
    project.surface = form.get("surface", project.surface)

    images = request.files.getlist("images")
    current_images = ProjectImage.query.filter_by(project_id=project.id).count()

    # Manage images: optional param to remove all images then add new ones
    if form.get("replace_images") == "true":
        ProjectImage.query.filter_by(project_id=project.id).delete()
        current_images = 0

    for idx, image in enumerate(images):
        if not allowed_file(image.filename):
            continue
        rel_path = save_upload(image)
        if rel_path:
            db.session.add(
                ProjectImage(
                    project_id=project.id,
                    image_path=rel_path,
                    is_main=True if current_images == 0 and idx == 0 else False,
                )
            )

    db.session.commit()
    return jsonify({"status": "success", "message": "Projet mis à jour"})


@admin_bp.delete("/projects/<int:project_id>")
@admin_required
def delete_project(project_id: int):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({"status": "success", "message": "Projet supprimé"})


@admin_bp.post("/team")
@admin_required
def create_team_member():
    data = request.form
    name = data.get("name")
    position = data.get("position")
    if not name or not position:
        return jsonify({"status": "error", "message": "Nom et poste requis"}), 400
    member = TeamMember(
        name=name,
        position=position,
        bio=data.get("bio"),
    )
    photo = request.files.get("photo")
    if photo and allowed_file(photo.filename):
        member.photo_path = save_upload(photo)
    db.session.add(member)
    db.session.commit()
    return jsonify({"status": "success", "data": {"id": member.id}}), 201


@admin_bp.put("/team/<int:member_id>")
@admin_required
def update_team_member(member_id: int):
    member = TeamMember.query.get_or_404(member_id)
    data = request.form
    member.name = data.get("name", member.name)
    member.position = data.get("position", member.position)
    member.bio = data.get("bio", member.bio)
    photo = request.files.get("photo")
    if photo and allowed_file(photo.filename):
        member.photo_path = save_upload(photo)
    db.session.commit()
    return jsonify({"status": "success", "message": "Membre mis à jour"})


@admin_bp.delete("/team/<int:member_id>")
@admin_required
def delete_team_member(member_id: int):
    member = TeamMember.query.get_or_404(member_id)
    db.session.delete(member)
    db.session.commit()
    return jsonify({"status": "success", "message": "Membre supprimé"})


@admin_bp.put("/content/<key>")
@admin_required
def update_content(key: str):
    data = request.get_json() or {}
    value = data.get("value")
    if value is None:
        return jsonify({"status": "error", "message": "Valeur requise"}), 400
    content = SiteContent.query.filter_by(key=key).first()
    if not content:
        content = SiteContent(key=key, value=value)
        db.session.add(content)
    else:
        content.value = value
    db.session.commit()
    return jsonify({"status": "success", "message": "Contenu mis à jour"})


@admin_bp.get("/contact-messages")
@admin_required
def list_contact_messages():
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    data = [
        {
            "id": msg.id,
            "name": msg.name,
            "email": msg.email,
            "phone": msg.phone,
            "subject": msg.subject,
            "message": msg.message,
            "created_at": msg.created_at.isoformat() if msg.created_at else None,
            "is_read": msg.is_read,
        }
        for msg in messages
    ]
    return jsonify({"status": "success", "data": data})


@admin_bp.put("/contact-messages/<int:msg_id>/mark-read")
@admin_required
def mark_message_read(msg_id: int):
    msg = ContactMessage.query.get_or_404(msg_id)
    msg.is_read = True
    db.session.commit()
    return jsonify({"status": "success", "message": "Message marqué comme lu"})
