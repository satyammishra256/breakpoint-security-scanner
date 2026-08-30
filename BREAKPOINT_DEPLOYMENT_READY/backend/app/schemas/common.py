from datetime import datetime
from pydantic import BaseModel, ConfigDict

class ProjectCreate(BaseModel):
    name: str
    target_url: str
    description: str = ''

class ProjectOut(ProjectCreate):
    id: int
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ScanOut(BaseModel):
    id: int; project_id: int; status: str; started_at: datetime; completed_at: datetime
    total_findings: int; critical_count: int; high_count: int; medium_count: int; low_count: int
    model_config = ConfigDict(from_attributes=True)

class VulnerabilityOut(BaseModel):
    id: int; scan_id: int; title: str; severity: str; category: str; description: str
    affected_component: str; evidence: str; remediation: str; status: str; cvss_score: float
    model_config = ConfigDict(from_attributes=True)

class SimulationCreate(BaseModel):
    scenario: str
    target_component: str

class WhatIfCreate(BaseModel):
    vulnerability_id: int
    proposed_fix: str

class ValidationOut(BaseModel):
    id: int; project_id: int; vulnerabilities_fixed: int; vulnerabilities_remaining: int
    risk_before: str; risk_after: str; attack_paths_before: int; attack_paths_after: int
    overall_result: str; created_at: datetime
    risk_before_score: int = 42
    risk_after_score: int = 76
    compromised_assets_before: int = 2
    compromised_assets_after: int = 0
    model_config = ConfigDict(from_attributes=True)
