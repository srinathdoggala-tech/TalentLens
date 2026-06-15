# 🚀 TalentLens AI

<div align="center">

### AI-Powered Resume Intelligence, ATS Optimization & Career Roadmap Platform

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Production-green?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-blue?style=for-the-badge&logo=openai" />
  <img src="https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/PostgreSQL-Ready-blue?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" />
</p>

### Upload Resume ➜ ATS Analysis ➜ Recruiter Feedback ➜ Job Matching ➜ Career Roadmap ➜ Interview Preparation

<p>
<a href="https://talent-lens-4z4i.vercel.app">
<img src="https://img.shields.io/badge/🌐 Live Demo-Visit-success?style=for-the-badge">
</a>

<a href="https://github.com/srinathdoggala-tech/TalentLens">
<img src="https://img.shields.io/badge/📂 GitHub-Repository-black?style=for-the-badge">
</a>
</p>

</div>

---

# 🌟 Overview

TalentLens AI is a next-generation AI-powered career intelligence platform designed to help students, job seekers, and professionals optimize their resumes, improve ATS performance, identify skill gaps, discover matching opportunities, and prepare for interviews.

Unlike traditional ATS checkers, TalentLens goes beyond resume scoring by simulating recruiter evaluations, generating personalized career roadmaps, predicting interview questions, and providing actionable recommendations powered by Generative AI.

The platform acts as a personal career copilot that helps candidates bridge the gap between their current profile and their dream role.

---

# 🌐 Live Demo

### 🚀 Production Deployment

**Live Application:**
https://talent-lens-4z4i.vercel.app

### Source Code

**GitHub Repository:**
https://github.com/srinathdoggala-tech/TalentLens

---

# 🎯 Problem Statement

Every year, millions of candidates apply to internships and jobs without understanding:

* Why their resume gets rejected
* Which skills they are missing
* How recruiters evaluate their profile
* Which jobs actually match their background
* How to prepare for interviews effectively

TalentLens AI solves these challenges through a unified AI-powered platform that combines ATS analysis, recruiter simulation, job matching, skill-gap detection, interview preparation, and career planning.

---

# 🎥 Demo

> Add your project GIF here

```markdown
/assets/demo.gif
```

```html
<p align="center">
  <img src="./assets/demo.gif" width="1000"/>
</p>
```

---

# 🔥 Core Features

## 📄 Smart Resume Parsing

Upload resumes in PDF or DOCX format and instantly extract:

* Skills
* Projects
* Education
* Experience
* Certifications
* Contact Information

### Supported Formats

* PDF
* DOCX

### Technologies Used

* PyMuPDF
* pdfplumber
* python-docx

---

## 🎯 ATS Resume Scoring

Evaluate resume quality based on:

* ATS Compatibility
* Formatting
* Keywords
* Project Quality
* Achievement Metrics
* Missing Sections

### Example Output

```yaml
ATS Score: 84/100

Issues Found:
- Missing quantified achievements
- Weak project descriptions
- Missing GitHub profile

Recommendations:
- Add metrics
- Include portfolio links
- Improve action verbs
```

---

## 👨‍💼 Senior Recruiter Simulation

Simulates recruiter-level screening.

Provides:

* Shortlisting decision
* Resume strengths
* Resume weaknesses
* Missing skills
* Recruiter recommendations

### Example

```yaml
Shortlist Decision: No

Reasons:
- Limited internship experience
- Missing cloud technologies
- Weak project impact statements
```

---

## ✨ AI Bullet Point Enhancer

Transforms weak resume content into impact-driven achievements.

### Before

```text
Built a web application
```

### After

```text
Built a scalable React-based web application serving 500+ users and reducing page load time by 40%.
```

---

## 🎯 Intelligent Job Matching Engine

Matches candidates against opportunities from:

* LinkedIn
* Wellfound
* Naukri
* Internshala

### Output

```yaml
Software Engineer Intern

Match Score: 92%

Missing Skills:
- Docker
- AWS
- Redis
```

---

## 📊 Skill Gap Analysis

Identifies the exact skills needed to achieve a target role.

### Example

```yaml
Current Skills:
- React
- Node.js
- Python

Missing Skills:
- Docker
- Kubernetes
- CI/CD
```

---

## 📝 Resume Tailoring

Customize resumes for specific Job Descriptions.

Features:

* Keyword Alignment
* ATS Optimization
* Project Rewriting
* Resume Enhancement

---

## 💌 Cover Letter Generator

Generate personalized cover letters instantly.

### Input

```yaml
Resume
Job Description
```

### Output

```yaml
ATS-Friendly Cover Letter
```

---

## 🗺️ Interactive Career Roadmaps

Create personalized career paths.

### Example

```text
Current:
Student

Goal:
Google Software Engineer

Roadmap:

DSA
 ↓
Full Stack Development
 ↓
Open Source
 ↓
Cloud Computing
 ↓
System Design
 ↓
Google SWE
```

---

## 🎤 Interview Predictor

Generate:

* HR Questions
* Technical Questions
* Project-Based Questions
* Behavioral Questions

Includes expert-level sample answers.

---

# 🏗️ System Architecture

```text
Resume Upload
      │
      ▼
Resume Parser
      │
      ▼
Skill Extractor
      │
      ▼
ATS Analyzer
      │
      ▼
Recruiter Simulator
      │
      ▼
Job Matching Engine
      │
      ▼
Skill Gap Analysis
      │
      ▼
Career Roadmap Generator
      │
      ▼
Interview Predictor
```

---

# 📸 Screenshots

Add screenshots for better recruiter engagement.

### Dashboard

```markdown
/screenshots/dashboard.png
```

### ATS Analysis

```markdown
/screenshots/ats-analysis.png
```

### Job Matching

```markdown
/screenshots/job-matching.png
```

### Career Roadmap

```markdown
/screenshots/roadmap.png
```

### Interview Predictor

```markdown
/screenshots/interview.png
```

---

# ⚙️ Technology Stack

## Frontend

* Next.js 15/16
* React
* Tailwind CSS v4
* Shadcn UI
* Recharts
* Lucide React

## Backend

* FastAPI
* Python 3.12+
* SQLAlchemy
* SQLite
* PostgreSQL

## AI Layer

* OpenAI API
* Google Gemini API

## Resume Processing

* PyMuPDF
* pdfplumber
* python-docx

---

# 📂 Project Structure

```bash
TalentLens/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── parser.py
│   ├── ai_service.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── utils/
│   └── package.json
│
├── assets/
│   └── demo.gif
│
├── screenshots/
│   ├── dashboard.png
│   ├── ats-analysis.png
│   ├── job-matching.png
│   ├── roadmap.png
│   └── interview.png
│
├── run_talentlens.bat
└── talentlens.db
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/srinathdoggala-tech/TalentLens.git

cd TalentLens
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend URL:

```bash
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```bash
http://localhost:8080
```

---

# 🔑 Environment Variables

Create a `.env` file inside `backend/`

```env
OPENAI_API_KEY=your_openai_key

GEMINI_API_KEY=your_gemini_key

DATABASE_URL=postgresql://user:password@localhost:5432/talentlens
```

If no API keys are provided, TalentLens automatically falls back to a simulated AI engine for demonstration purposes.

---

# 📈 Future Enhancements

* Resume Version Control
* GitHub Profile Analyzer
* LinkedIn Profile Scoring
* AI Mock Interviews
* Real-Time Job Alerts
* Salary Prediction Engine
* Resume Benchmarking
* Portfolio Analysis
* Recruiter Dashboard
* Multi-Language Resume Support

---

# 🌟 Why TalentLens?

TalentLens is more than an ATS checker.

It acts as:

✅ ATS Resume Analyzer

✅ Recruiter Simulator

✅ Career Coach

✅ Job Matching Engine

✅ Skill Gap Analyzer

✅ Interview Preparation Assistant

✅ Cover Letter Generator

✅ Career Roadmap Builder

Helping candidates maximize their chances of landing internships and full-time opportunities.

---

# 👨‍💻 Author

## Srinath Doggala

Computer Science Engineer | AI/ML Enthusiast | Full-Stack Developer

### Connect

🔗 GitHub: https://github.com/srinathdoggala-tech

🔗 Project Repository: https://github.com/srinathdoggala-tech/TalentLens

🌐 Live Application: https://talent-lens-4z4i.vercel.app

---

# ⭐ Support

If you found TalentLens useful:

⭐ Star the repository

🍴 Fork the project

🛠️ Contribute new features

📢 Share it with your network

---

<div align="center">

### Built with ❤️ by Srinath Doggala

**TalentLens AI — Turning Resumes into Opportunities**

</div>
