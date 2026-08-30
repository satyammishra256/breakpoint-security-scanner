from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, Scan, Vulnerability, User
from ..schemas.common import ProjectCreate, ProjectOut, ScanOut, VulnerabilityOut
from ..services.demo import create_demo_scan
from .auth import current_user

router=APIRouter(prefix='/api/projects',tags=['projects'])

def owned_project(project_id:int, user:User, db:Session):
    p=db.query(Project).filter(Project.id==project_id, Project.user_id==user.id).first()
    if not p: raise HTTPException(404,'Project not found')
    return p

@router.post('',response_model=ProjectOut)
def create_project(payload: ProjectCreate, db: Session=Depends(get_db), user:User=Depends(current_user)):
    p=Project(**payload.model_dump(), user_id=user.id); db.add(p); db.commit(); db.refresh(p); return p

@router.get('',response_model=list[ProjectOut])
def list_projects(db: Session=Depends(get_db), user:User=Depends(current_user)):
    return db.query(Project).filter_by(user_id=user.id).order_by(Project.id.desc()).all()

@router.get('/{project_id}',response_model=ProjectOut)
def get_project(project_id:int,db:Session=Depends(get_db), user:User=Depends(current_user)):
    return owned_project(project_id,user,db)

@router.delete('/{project_id}')
def delete_project(project_id:int,db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=owned_project(project_id,user,db); db.delete(p); db.commit(); return {'deleted':True}

@router.post('/{project_id}/scans',response_model=ScanOut)
def start_scan(project_id:int,db:Session=Depends(get_db), user:User=Depends(current_user)):
    p=owned_project(project_id,user,db); return create_demo_scan(db,p)

@router.get('/{project_id}/scans',response_model=list[ScanOut])
def scans(project_id:int,db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(project_id,user,db)
    return db.query(Scan).filter_by(project_id=project_id).order_by(Scan.id.desc()).all()

@router.get('/{project_id}/vulnerabilities', response_model=list[VulnerabilityOut])
def project_vulnerabilities(project_id:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(project_id,user,db)
    scan=db.query(Scan).filter_by(project_id=project_id).order_by(Scan.id.desc()).first()
    return db.query(Vulnerability).filter_by(scan_id=scan.id).all() if scan else []

@router.get('/{project_id}/assets')
def project_assets(project_id:int, db:Session=Depends(get_db), user:User=Depends(current_user)):
    owned_project(project_id,user,db)
    scan=db.query(Scan).filter_by(project_id=project_id).order_by(Scan.id.desc()).first()
    vulns=db.query(Vulnerability).filter_by(scan_id=scan.id).all() if scan else []
    assets=[
      {'id':'gateway-alpha','name':'Gateway-Alpha','type':'Network Gateway','criticality':'Critical','status':'At Risk','risk':'high'},
      {'id':'vehicle-control','name':'Vehicle Control API','type':'Application Service','criticality':'Critical','status':'Protected','risk':'medium'},
      {'id':'db-cluster','name':'DB-Cluster-Primary','type':'Database','criticality':'Critical','status':'At Risk','risk':'high'},
      {'id':'mobile-app','name':'Mobile Client','type':'Client Application','criticality':'High','status':'Protected','risk':'low'},
      {'id':'auth-gateway','name':'Authentication Gateway','type':'Identity Service','criticality':'High','status':'At Risk' if any(v.title=='Weak Authentication' for v in vulns) else 'Protected','risk':'high' if any(v.title=='Weak Authentication' for v in vulns) else 'low'}
    ]
    return {'project_id':project_id,'count':len(assets),'assets':assets}
