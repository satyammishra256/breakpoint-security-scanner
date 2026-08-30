from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Vulnerability, Scan, Project, User
from ..schemas.common import VulnerabilityOut
from .auth import current_user
router=APIRouter(prefix='/api/vulnerabilities',tags=['vulnerabilities'])
@router.get('/{vulnerability_id}',response_model=VulnerabilityOut)
def get_vulnerability(vulnerability_id:int,db:Session=Depends(get_db),user:User=Depends(current_user)):
    v=db.query(Vulnerability).join(Scan, Vulnerability.scan_id==Scan.id).join(Project, Scan.project_id==Project.id).filter(Vulnerability.id==vulnerability_id,Project.user_id==user.id).first()
    if not v: raise HTTPException(404,'Vulnerability not found')
    return v
