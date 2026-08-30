from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

def now(): return datetime.now(timezone.utc)

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    target_url = Column(String(500), nullable=False)
    description = Column(Text, default='')
    status = Column(String(30), default='active')
    created_at = Column(DateTime, default=now)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    user = relationship('User', back_populates='projects')
    scans = relationship('Scan', back_populates='project', cascade='all, delete-orphan')
    attack_paths = relationship('AttackPath', back_populates='project', cascade='all, delete-orphan')
    simulations = relationship('Simulation', back_populates='project', cascade='all, delete-orphan')
    reports = relationship('ValidationReport', back_populates='project', cascade='all, delete-orphan')

class Scan(Base):
    __tablename__ = 'scans'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    status = Column(String(30), default='completed')
    started_at = Column(DateTime, default=now)
    completed_at = Column(DateTime, default=now)
    total_findings = Column(Integer, default=0)
    critical_count = Column(Integer, default=0)
    high_count = Column(Integer, default=0)
    medium_count = Column(Integer, default=0)
    low_count = Column(Integer, default=0)
    project = relationship('Project', back_populates='scans')
    vulnerabilities = relationship('Vulnerability', back_populates='scan', cascade='all, delete-orphan')

class Vulnerability(Base):
    __tablename__ = 'vulnerabilities'
    id = Column(Integer, primary_key=True)
    scan_id = Column(Integer, ForeignKey('scans.id'), nullable=False)
    title = Column(String(200), nullable=False)
    severity = Column(String(20), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    affected_component = Column(String(200), nullable=False)
    evidence = Column(Text, default='')
    remediation = Column(Text, default='')
    status = Column(String(30), default='open')
    cvss_score = Column(Float, default=0)
    scan = relationship('Scan', back_populates='vulnerabilities')

class AttackPath(Base):
    __tablename__ = 'attack_paths'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    name = Column(String(200), nullable=False)
    risk_level = Column(String(20), default='high')
    nodes_json = Column(Text, nullable=False)
    edges_json = Column(Text, nullable=False)
    project = relationship('Project', back_populates='attack_paths')

class Simulation(Base):
    __tablename__ = 'simulations'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    scenario = Column(String(200), nullable=False)
    target_component = Column(String(200), nullable=False)
    status = Column(String(30), default='completed')
    steps_json = Column(Text, nullable=False)
    findings_json = Column(Text, nullable=False)
    risk_level = Column(String(20), default='high')
    completed_at = Column(DateTime, default=now)
    project = relationship('Project', back_populates='simulations')

class ValidationReport(Base):
    __tablename__ = 'validation_reports'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    vulnerabilities_fixed = Column(Integer, default=0)
    vulnerabilities_remaining = Column(Integer, default=0)
    risk_before = Column(String(20), default='high')
    risk_after = Column(String(20), default='low')
    attack_paths_before = Column(Integer, default=0)
    attack_paths_after = Column(Integer, default=0)
    overall_result = Column(String(100), default='Improved')
    created_at = Column(DateTime, default=now)
    project = relationship('Project', back_populates='reports')


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(120), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=now)
    projects = relationship('Project', back_populates='user', cascade='all, delete-orphan')
