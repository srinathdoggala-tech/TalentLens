import os
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from .database import engine, Base, get_db
from . import models, schemas, parser, ai_service

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TalentLens API", version="1.0.0")

# Setup CORS middleware to allow connection from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development; narrow in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the TalentLens AI API!"}

# --- RESUME UPLOAD & HISTORY ---

@app.post("/api/resume/upload", response_model=schemas.ResumeResponse)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    filename = file.filename
    try:
        file_bytes = await file.read()
        # Parse the raw text based on extension (PDF or DOCX)
        raw_text = parser.extract_text(filename, file_bytes)
        
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file. The document might be scanned or empty.")
            
        # Parse the raw text using AI/Mock parser into structured JSON fields
        parsed_json = ai_service.parse_resume(raw_text)
        
        # Save to database
        db_resume = models.Resume(
            filename=filename,
            raw_text=raw_text,
            parsed_json=parsed_json
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        
        return db_resume
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.get("/api/resumes", response_model=List[schemas.ResumeResponse])
def get_resumes(db: Session = Depends(get_db)):
    """
    List all uploaded resumes (recent first).
    """
    return db.query(models.Resume).order_by(models.Resume.created_at.desc()).all()

@app.get("/api/resume/{resume_id}", response_model=schemas.ResumeResponse)
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    db_resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return db_resume

# --- ATS SCORE & LLM RECRUITER REVIEW ---

@app.post("/api/resume/{resume_id}/analyze", response_model=schemas.ATSAnalysisResponse)
def analyze_resume(resume_id: int, db: Session = Depends(get_db)):
    # Retrieve resume
    db_resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
        
    try:
        # Check if analysis already exists
        existing_analysis = db.query(models.ATSAnalysis).filter(models.ATSAnalysis.resume_id == resume_id).first()
        if existing_analysis:
            return existing_analysis
            
        # Perform ATS analysis
        analysis_data = ai_service.analyze_ats(db_resume.parsed_json)
        
        db_analysis = models.ATSAnalysis(
            resume_id=resume_id,
            ats_score=analysis_data["ats_score"],
            recruiter_decision=analysis_data["recruiter_decision"],
            recruiter_reasons=analysis_data["recruiter_reasons"],
            problems=analysis_data["problems"],
            recommendations=analysis_data["recommendations"],
            bullet_improvements=analysis_data["bullet_improvements"]
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        
        return db_analysis
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"ATS analysis failed: {str(e)}")

# --- JOB MATCHING ENGINE ---

@app.post("/api/resume/{resume_id}/job-match", response_model=List[schemas.JobMatchResponse])
def get_job_matches(resume_id: int, db: Session = Depends(get_db)):
    db_resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
        
    try:
        skills = db_resume.parsed_json.get("skills", [])
        matches = ai_service.match_jobs(skills)
        
        saved_matches = []
        # Clear old job matches for this resume to avoid duplicates
        db.query(models.JobMatch).filter(models.JobMatch.resume_id == resume_id).delete()
        
        for m in matches:
            db_match = models.JobMatch(
                resume_id=resume_id,
                job_title=m["job_title"],
                company=m["company"],
                match_score=m["match_score"],
                missing_skills=m["missing_skills"],
                matched_skills=m["matched_skills"],
                job_board=m["job_board"]
            )
            db.add(db_match)
            saved_matches.append(db_match)
            
        db.commit()
        
        # Refresh and return
        for m in saved_matches:
            db.refresh(m)
            
        return saved_matches
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")

# --- RESUME TAILORING & COVER LETTER ---

@app.post("/api/resume/{resume_id}/tailor", response_model=schemas.TailorResponse)
def tailor_resume(resume_id: int, req: schemas.TailorRequest, db: Session = Depends(get_db)):
    db_resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
        
    try:
        tailored_data = ai_service.tailor_resume_and_cover_letter(db_resume.parsed_json, req.job_description)
        
        # Save Cover Letter
        db_cl = models.CoverLetter(
            resume_id=resume_id,
            job_description=req.job_description,
            cover_letter_text=tailored_data["cover_letter"]
        )
        db.add(db_cl)
        db.commit()
        
        return tailored_data
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Tailoring failed: {str(e)}")

# --- CAREER ROADMAP ENGINE ---

@app.post("/api/career/roadmap", response_model=schemas.RoadmapResponse)
def create_career_roadmap(req: schemas.RoadmapRequest, db: Session = Depends(get_db)):
    try:
        roadmap_steps = ai_service.generate_roadmap(req.current_profile, req.target_role)
        
        db_roadmap = models.CareerRoadmap(
            current_profile=req.current_profile,
            target_role=req.target_role,
            steps=roadmap_steps
        )
        db.add(db_roadmap)
        db.commit()
        db.refresh(db_roadmap)
        
        return db_roadmap
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")

# --- INTERVIEW PREDICTOR ---

@app.post("/api/resume/{resume_id}/interview", response_model=schemas.InterviewPrepResponse)
def get_interview_prep(resume_id: int, db: Session = Depends(get_db)):
    db_resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
        
    try:
        # Check if already generated
        existing_prep = db.query(models.InterviewPrep).filter(models.InterviewPrep.resume_id == resume_id).first()
        if existing_prep:
            return existing_prep
            
        questions = ai_service.predict_interview(db_resume.parsed_json)
        
        db_prep = models.InterviewPrep(
            resume_id=resume_id,
            hr_questions=questions["hr_questions"],
            tech_questions=questions["tech_questions"],
            project_questions=questions["project_questions"]
        )
        db.add(db_prep)
        db.commit()
        db.refresh(db_prep)
        
        return db_prep
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Interview question generation failed: {str(e)}")
