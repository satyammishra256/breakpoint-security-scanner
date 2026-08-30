import os, hashlib, secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
import jwt

router = APIRouter(prefix='/api/auth', tags=['auth'])
SECRET = os.getenv('AUTH_SECRET')
if not SECRET:
    raise RuntimeError('AUTH_SECRET must be configured in the environment')
ALGO = 'HS256'

def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 180_000)
    return salt.hex()+':'+digest.hex()

def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, digest_hex = stored.split(':',1)
        digest = hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt_hex), 180_000)
        return secrets.compare_digest(digest.hex(), digest_hex)
    except Exception:
        return False

def token_for(user: User):
    return jwt.encode({'sub': str(user.id), 'email': user.email, 'exp': datetime.now(timezone.utc)+timedelta(days=7)}, SECRET, algorithm=ALGO)

class SignUp(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class SignIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

def current_user(authorization: str|None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(401, 'Authentication required')
    try:
        data=jwt.decode(authorization[7:], SECRET, algorithms=[ALGO])
        user=db.get(User, int(data['sub']))
    except Exception:
        raise HTTPException(401, 'Invalid or expired session')
    if not user: raise HTTPException(401, 'User not found')
    return user

@router.post('/signup')
def signup(payload: SignUp, db: Session=Depends(get_db)):
    email=payload.email.lower().strip()
    if db.query(User).filter_by(email=email).first(): raise HTTPException(409, 'An account with this email already exists')
    user=User(email=email,name=payload.name.strip(),password_hash=hash_password(payload.password))
    db.add(user); db.commit(); db.refresh(user)
    return {'token':token_for(user),'user':{'id':user.id,'name':user.name,'email':user.email}}

@router.post('/signin')
def signin(payload: SignIn, db: Session=Depends(get_db)):
    user=db.query(User).filter_by(email=payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password,user.password_hash): raise HTTPException(401,'Incorrect email or password')
    return {'token':token_for(user),'user':{'id':user.id,'name':user.name,'email':user.email}}

@router.get('/me')
def me(user: User=Depends(current_user)):
    return {'id':user.id,'name':user.name,'email':user.email}
