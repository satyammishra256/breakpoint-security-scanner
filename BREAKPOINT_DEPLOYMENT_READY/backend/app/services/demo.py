import json
from sqlalchemy.orm import Session
from ..models import Project, Scan, Vulnerability, AttackPath

def create_demo_scan(db: Session, project: Project):
    scan = Scan(project_id=project.id, status='completed', total_findings=4, critical_count=0, high_count=1, medium_count=2, low_count=1)
    db.add(scan); db.flush()
    vulns = [
      Vulnerability(scan_id=scan.id,title='Weak Authentication',severity='HIGH',category='Authentication',description='Authentication controls allow risky credential patterns in the demo target.',affected_component='Authentication Gateway',evidence='Demo evidence: password policy does not enforce strong requirements.',remediation='Require MFA, strong password policy, rate limiting, and account lockout.',status='open',cvss_score=8.1),
      Vulnerability(scan_id=scan.id,title='Missing Security Headers',severity='MEDIUM',category='Configuration',description='Important browser security headers are absent from the demo configuration.',affected_component='Web Application',evidence='Demo evidence: Content-Security-Policy and related headers are missing.',remediation='Configure CSP, HSTS, X-Content-Type-Options and suitable frame protections.',status='open',cvss_score=5.4),
      Vulnerability(scan_id=scan.id,title='Excessive Permissions',severity='MEDIUM',category='Authorization',description='A demo service account has broader permissions than required.',affected_component='Service Account',evidence='Demo evidence: account role contains unnecessary administrative privileges.',remediation='Apply least privilege and separate read/write/admin roles.',status='open',cvss_score=6.2),
      Vulnerability(scan_id=scan.id,title='Verbose Error Messages',severity='LOW',category='Information Disclosure',description='Error responses expose unnecessary implementation details.',affected_component='API Error Handler',evidence='Demo evidence: stack traces are returned in development mode.',remediation='Return generic production errors and keep detailed traces server-side.',status='open',cvss_score=3.1),
    ]
    db.add_all(vulns)
    path = AttackPath(project_id=project.id,name='Public Entry → Weak Authentication → Application Access → Sensitive Data',risk_level='high',nodes_json=json.dumps([
      {'id':'entry','label':'Public Entry Point','type':'entry'}, {'id':'app','label':'Web Application','type':'component'}, {'id':'auth','label':'Weak Authentication','type':'vulnerability'}, {'id':'account','label':'User Account','type':'asset'}, {'id':'data','label':'Sensitive Data','type':'asset'}]),edges_json=json.dumps([{'source':'entry','target':'app'},{'source':'app','target':'auth'},{'source':'auth','target':'account'},{'source':'account','target':'data'}]))
    db.add(path); db.commit(); db.refresh(scan)
    return scan
