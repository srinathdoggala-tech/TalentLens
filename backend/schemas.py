from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Parsed Resume Schema
class ParsedResumeSchema(BaseModel):
    skills: List[str] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)  # title, description, technologies
    education: List[Dict[str, Any]] = Field(default_factory=list) # institution, degree, year
    experience: List[Dict[str, Any]] = Field(default_factory=list) # company, role, duration, achievements
    certifications: List[str] = Field(default_factory=list)

class ResumeResponse(BaseModel):
    id: int
    filename: str
    parsed_json: Optional[ParsedResumeSchema] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ATS Score & Recruiter Review
class BulletImprovementSchema(BaseModel):
    before: str
    after: str

class ATSAnalysisResponse(BaseModel):
    id: int
    resume_id: int
    ats_score: int
    recruiter_decision: str
    recruiter_reasons: List[str]
    problems: List[str]
    recommendations: List[str]
    bullet_improvements: List[BulletImprovementSchema]
    created_at: datetime

    class Config:
        from_attributes = True

# Job Matching
class JobMatchSchema(BaseModel):
    job_title: str
    company: str
    match_score: int
    missing_skills: List[str]
    matched_skills: List[str]
    job_board: str

class JobMatchResponse(BaseModel):
    id: int
    resume_id: int
    job_title: str
    company: str
    match_score: int
    missing_skills: List[str]
    matched_skills: List[str]
    job_board: str
    created_at: datetime

    class Config:
        from_attributes = True

class MatchRequest(BaseModel):
    skills: List[str]

# Resume Tailoring & Cover Letter
class TailorRequest(BaseModel):
    job_description: str

class TailorResponse(BaseModel):
    optimized_resume: ParsedResumeSchema
    changes: List[str]
    cover_letter: str

# Career Roadmap
class RoadmapRequest(BaseModel):
    current_profile: str
    target_role: str

class RoadmapStepSchema(BaseModel):
    stage: int
    title: str
    description: str
    skills_to_learn: List[str]
    resources: List[str]

class RoadmapResponse(BaseModel):
    id: int
    current_profile: str
    target_role: str
    steps: List[RoadmapStepSchema]
    created_at: datetime

    class Config:
        from_attributes = True

# Interview Predictor
class QuestionSchema(BaseModel):
    question: str
    category: str  # e.g., behavioral, coding, system design, details
    ideal_answer: str

class InterviewPrepResponse(BaseModel):
    id: int
    resume_id: int
    hr_questions: List[QuestionSchema]
    tech_questions: List[QuestionSchema]
    project_questions: List[QuestionSchema]
    created_at: datetime

    class Config:
        from_attributes = True
