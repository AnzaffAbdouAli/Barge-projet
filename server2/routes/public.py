from flask import request, jsonify
from models import db, Project, TeamMember, SiteContent, ContactMessage
from . import public_bp


def serialize_project(project: Project, with_images: bool = True):
    data = {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "project_type": project.project_type,
        "location": project.location,
        "year": project.year,
        "surface": project.surface,
        "created_at": project.created_at.isoformat() if project.created_at else None,
    }
    if with_images:
        data["images"] = [
            {
                "id": img.id,
                "image_path": img.image_path,
                "is_main": img.is_main,
            }
            for img in project.images
        ]
    return data


@public_bp.get("/projects")
def list_projects():
    project_type = request.args.get("type")
    year = request.args.get("year")
    query = Project.query
    if project_type:
        query = query.filter_by(project_type=project_type)
    if year and year.isdigit():
        query = query.filter_by(year=int(year))
    projects = query.order_by(Project.created_at.desc()).all()
    return jsonify({"status": "success", "data": [serialize_project(p) for p in projects]})


@public_bp.get("/projects/<int:project_id>")
def get_project(project_id: int):
    project = Project.query.get_or_404(project_id)
    return jsonify({"status": "success", "data": serialize_project(project)})


@public_bp.get("/team")
def list_team():
    members = TeamMember.query.order_by(TeamMember.created_at.desc()).all()
    data = [
        {
            "id": member.id,
            "name": member.name,
            "position": member.position,
            "bio": member.bio,
            "photo_path": member.photo_path,
        }
        for member in members
    ]
    return jsonify({"status": "success", "data": data})


@public_bp.get("/content/<key>")
def get_content(key: str):
    content = SiteContent.query.filter_by(key=key).first()
    if not content:
        return jsonify({"status": "error", "message": "Content not found"}), 404
    return jsonify({"status": "success", "data": {"key": content.key, "value": content.value}})


@public_bp.post("/contact")
def submit_contact():
    data = request.get_json() or {}
    required_fields = ["name", "email", "subject", "message"]
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return (
            jsonify({"status": "error", "message": f"Missing fields: {', '.join(missing)}"}),
            400,
        )

    contact = ContactMessage(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone"),
        subject=data["subject"],
        message=data["message"],
    )
    db.session.add(contact)
    db.session.commit()
    return jsonify({"status": "success", "message": "Message reçu. Merci!"}), 201
