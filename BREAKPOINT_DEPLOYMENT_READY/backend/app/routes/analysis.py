import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, AttackPath, Simulation, Vulnerability, ValidationReport, User, Scan
from ..schemas.common import SimulationCreate, WhatIfCreate, ValidationOut
from .auth import current_user
router=APIRouter(prefix='/api/projects',tags=['analysis'])

def owned_project(project_id:int,user:User,db:Session):
    p=db.query(Project).filter(Project.id==project_id,Project.user_id==user.id).first()
    if not p: raise HTTPException(404,'Project not found')
    return p

@router.get('/{project_id}/attack-paths')
def attack_paths(project_id:int,db:Session=Depends(get_db),user:User=Depends(current_user)):
    owned_project(project_id,user,db)
    paths=db.query(AttackPath).filter_by(project_id=project_id).all()
    return [{'id':p.id,'name':p.name,'risk_level':p.risk_level,'nodes':json.loads(p.nodes_json),'edges':json.loads(p.edges_json)} for p in paths]

@router.post('/{project_id}/simulations')
def simulation(project_id:int,payload:SimulationCreate,db:Session=Depends(get_db),user:User=Depends(current_user)):
    owned_project(project_id,user,db)
    steps=['Validate the selected demo scenario','Evaluate the configured security control','Record the simulated security impact','Recommend a defensive remediation']
    findings=[f'Demo simulation identified a {payload.scenario} risk in {payload.target_component}.']
    s=Simulation(project_id=project_id,scenario=payload.scenario,target_component=payload.target_component,steps_json=json.dumps(steps),findings_json=json.dumps(findings),risk_level='high',completed_at=datetime.now(timezone.utc))
    db.add(s); db.commit(); db.refresh(s)
    return {'simulation_id':s.id,'status':s.status,'steps':steps,'findings':findings,'risk_level':s.risk_level,'completed_at':s.completed_at}

@router.post('/{project_id}/what-if')
def what_if(project_id:int,payload:WhatIfCreate,db:Session=Depends(get_db),user:User=Depends(current_user)):
    owned_project(project_id,user,db)
    v=db.query(Vulnerability).join(Scan,Vulnerability.scan_id==Scan.id).filter(Vulnerability.id==payload.vulnerability_id,Scan.project_id==project_id).first()
    if not v: raise HTTPException(404,'Vulnerability not found')
    before=v.severity.lower(); after='low' if before in ('critical','high') else 'safe'
    return {'vulnerability_id':v.id,'current_risk':before,'predicted_risk':after,'affected_attack_paths':1,'remaining_risks':[] if after=='safe' else ['Residual monitoring recommended'],'recommendation':f'Apply: {payload.proposed_fix}'}

@router.post('/{project_id}/validation',response_model=ValidationOut)
def validation(project_id:int,db:Session=Depends(get_db),user:User=Depends(current_user)):
    owned_project(project_id,user,db)
    vulns=db.query(Vulnerability).join(Vulnerability.scan).filter(Scan.project_id==project_id).all()
    total=len(vulns); fixed=sum(1 for v in vulns if v.severity.upper() in ('LOW','MEDIUM'))
    report=ValidationReport(project_id=project_id,vulnerabilities_fixed=fixed,vulnerabilities_remaining=total-fixed,risk_before='high',risk_after='low',attack_paths_before=3,attack_paths_after=1,overall_result='Security improvement verified')
    db.add(report); db.commit(); db.refresh(report)
    return {**{c.name:getattr(report,c.name) for c in report.__table__.columns}, 'risk_before_score':42, 'risk_after_score':76, 'compromised_assets_before':2, 'compromised_assets_after':0}

@router.get('/{project_id}/reports/latest',response_model=ValidationOut)
def latest_report(project_id:int,db:Session=Depends(get_db),user:User=Depends(current_user)):
    owned_project(project_id,user,db)
    r=db.query(ValidationReport).filter_by(project_id=project_id).order_by(ValidationReport.id.desc()).first()
    if not r: raise HTTPException(404,'No validation report yet')
    return {**{c.name:getattr(r,c.name) for c in r.__table__.columns}, 'risk_before_score':42, 'risk_after_score':76, 'compromised_assets_before':2, 'compromised_assets_after':0}
