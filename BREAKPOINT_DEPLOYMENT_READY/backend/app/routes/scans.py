from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Scan, Vulnerability, Project, User
from ..schemas.common import ScanOut, VulnerabilityOut
from .auth import current_user
router=APIRouter(prefix='/api/scans',tags=['scans'])

def owned_scan(scan_id:int,user:User,db:Session):
    s=db.query(Scan).join(Project, Scan.project_id==Project.id).filter(Scan.id==scan_id, Project.user_id==user.id).first()
    if not s: raise HTTPException(404,'Scan not found')
    return s

@router.get('/{scan_id}',response_model=ScanOut)
def get_scan(scan_id:int,db:Session=Depends(get_db),user:User=Depends(current_user)):
    return owned_scan(scan_id,user,db)

@router.get('/{scan_id}/vulnerabilities',response_model=list[VulnerabilityOut])
def vulnerabilities(scan_id:int,db:Session=Depends(get_db),user:User=Depends(current_user)):
    owned_scan(scan_id,user,db)
    return db.query(Vulnerability).filter_by(scan_id=scan_id).all()
