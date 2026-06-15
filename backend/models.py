from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=True)
    parsed_json = Column(JSON, nullable=True)  # Store parsed details: skills, projects, education, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ATSAnalysis(Base):
    __tablename__ = "ats_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    ats_score = Column(Integer, nullable=False)
    recruiter_decision = Column(String(50), nullable=False)  # "Yes", "No", "Maybe"
    recruiter_reasons = Column(JSON, nullable=True)          # List of reasons
    problems = Column(JSON, nullable=True)                  # List of problems (e.g. Missing GitHub)
    recommendations = Column(JSON, nullable=True)           # List of recommendations
    bullet_improvements = Column(JSON, nullable=True)       # Before/After bullet points list
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    match_score = Column(Integer, nullable=False)
    missing_skills = Column(JSON, nullable=True)
    matched_skills = Column(JSON, nullable=True)
    job_board = Column(String(100), nullable=True)          # LinkedIn, Wellfound, Internshala, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CareerRoadmap(Base):
    __tablename__ = "career_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=True)
    current_profile = Column(String(255), nullable=False)   # e.g., "2nd Year AIML"
    target_role = Column(String(255), nullable=False)       # e.g., "Google SWE"
    steps = Column(JSON, nullable=False)                    # List of milestone stages
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InterviewPrep(Base):
    __tablename__ = "interview_preps"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    hr_questions = Column(JSON, nullable=True)
    tech_questions = Column(JSON, nullable=True)
    project_questions = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_description = Column(Text, nullable=False)
    cover_letter_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
