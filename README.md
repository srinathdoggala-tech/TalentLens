# TalentLens AI - Resume Analyzer & Career Roadmap Platform

TalentLens is a premium, modern, glassmorphic AI-powered resume parsing, scoring, and career optimization platform. Built using Next.js (Tailwind CSS v4) and FastAPI, the platform simulates a Senior Google Recruiter, evaluates ATS formatting/metrics, extracts structured details, conducts job matching/gap analysis, builds career milestones, and predicts interview questionnaires.

---

## 🚀 Key Features

1. **Resume Parser (PDF & DOCX)**
   - Extracts structured details (Skills, Projects, Education, Experience, Certifications) from resume byte streams using PyMuPDF (fitz) with a pdfplumber fallback for PDFs, and python-docx for DOCX files.
2. **ATS Resume Scorer**
   - Grades the resume against formatting, keyword usage, metrics, and project quality, producing a unified ATS score (e.g., 78/100).
3. **Senior Google Recruiter Simulation**
   - Simulates recruiter feedback: "Would you shortlist this candidate? Why? Reasons (missing cloud skills, weak project impact)."
4. **Interactive Bullet Improver**
   - Rewrites weak resume bullet points into action-driven, quantified achievements (e.g., *"Built a web application"* ➔ *"Built a scalable React web app serving 500+ users"*).
5. **Job Matching & Gap Analysis**
   - Matches candidate skills against roles from LinkedIn, Wellfound, Naukri, and Internshala, showing match scores and listing exact skill gaps.
6. **AI Resume Tailoring & Cover Letter Generator**
   - Rewrites project summaries to target specific Job Descriptions and outputs a copy-pastable Cover Letter mockup.
7. **Interactive Career Roadmaps**
   - Generates node-based learning paths (DSA ➔ Full Stack ➔ Open Source ➔ Cloud) to bridge current profiles to target dream companies.
8. **Interview Predictor**
   - Generates customized HR, Technical, and Project-focused questions with revealable expert answers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, custom glassmorphism utilities, modern dark-theme gradients
- **Icons**: Lucide React
- **Statistics Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Parser Engines**: PyMuPDF, pdfplumber, python-docx
- **Database**: SQLAlchemy (SQLite for local zero-setup dev, PostgreSQL ready for production)
- **AI Integrations**: Google Gemini SDK & OpenAI API

---

## 📂 Project Structure

```
TalentLens/
├── backend/                  # FastAPI Backend Service
│   ├── main.py               # API Routers & CORS Middleware
│   ├── database.py           # SQLite/PostgreSQL connections
│   ├── models.py             # SQLAlchemy Database Tables
│   ├── schemas.py            # Pydantic Schemas
│   ├── parser.py             # PyMuPDF & docx extractors
│   ├── ai_service.py         # OpenAI/Gemini Prompt Engine & Mock Fallback
│   └── requirements.txt      # Python Dependencies
├── frontend/                 # Next.js Frontend Application
│   ├── app/                  # App Router Pages (ATS, Match, Tailor, Roadmap, etc.)
│   ├── components/           # Navbar & Reusable layout UI
│   ├── utils/                # API Client fetch methods
│   └── package.json          # Node Dependencies & Port Configurations
├── run_talentlens.bat        # Detached multi-server startup script
└── talentlens.db             # Local SQLite database file
```

---

## ⚙️ Setup & Local Execution

Both the backend (port 8000) and the frontend (port 8080) must be running concurrently.

### Option A: Direct Batch Script (Recommended for Windows)
Double-click `run_talentlens.bat` in the root folder, or run it via PowerShell:
```powershell
.\run_talentlens.bat
```
This script automatically spawns two separate command prompt windows, navigating them to the correct directories and booting both servers.

---

### Option B: Manual Startup

#### 1. Backend Server Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   ```
3. Run the uvicorn server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will boot at http://127.0.0.1:8000.*

#### 2. Frontend Server Setup
1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will boot at http://localhost:8080.*

---

## 🔑 Environment Settings

Create a `.env` file inside `backend/` to unlock live AI evaluations. If no keys are specified, the platform defaults to a simulated mock AI engine that generates realistic demo data, ensuring complete usability out of the box.

```env
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname # Optional PostgreSQL hook
```
