"""
Quick setup script:
- Creates all tables
- Seeds a default admin user
- Seeds basic site contents
"""
import os
from getpass import getpass
from app import create_app
from models import db, Admin, SiteContent


def main():
    app = create_app()
    with app.app_context():
        db.create_all()
        email = input("Admin email [admin@barge.com]: ") or "admin@barge.com"
        password = getpass("Admin password [change-me]: ") or "change-me"
        existing = Admin.query.filter_by(email=email).first()
        if existing:
            print("Admin already exists, skipping.")
        else:
            admin = Admin(email=email)
            admin.set_password(password)
            db.session.add(admin)
        defaults = {
            "home_hero": "BARGE SARL façonne des espaces élégants et durables.",
            "about": "BARGE SARL est un bureau d'architecture spécialisé dans les projets inspirés par la matière et la lumière.",
            "contact_intro": "Parlons de votre projet. Nous répondons sous 24h.",
        }
        for key, value in defaults.items():
            if not SiteContent.query.filter_by(key=key).first():
                db.session.add(SiteContent(key=key, value=value))
        db.session.commit()
        print("Database initialized.")


if __name__ == "__main__":
    main()
