import os
from app.database import SessionLocal, Base, engine
from app import models
from app.routes.auth import hash_password
from app.models import Project, User
from app.services.demo import create_demo_scan

Base.metadata.create_all(bind=engine)
db=SessionLocal()
try:
    email=os.getenv('DEMO_EMAIL','demo@breakpoint.local').lower().strip()
    password=os.getenv('DEMO_PASSWORD')
    if not password:
        raise RuntimeError('Set DEMO_PASSWORD before running seed.py')
    user=db.query(User).filter_by(email=email).first()
    if not user:
        user=User(email=email,name='BREAKPOINT Demo',password_hash=hash_password(password))
        db.add(user); db.commit(); db.refresh(user)
    if not db.query(Project).filter_by(user_id=user.id).first():
        p=Project(name='Connected Vehicle Demo',target_url='https://demo.breakpoint.local',description='Safe demo target for BREAKPOINT',user_id=user.id)
        db.add(p); db.commit(); db.refresh(p); create_demo_scan(db,p)
        print('Seeded project id:',p.id)
    else: print('Database already seeded for demo user')
finally:
    db.close()
