# 🚀 TalentLens AI

### AI-Powered Resume Intelligence, ATS Optimization & Career Roadmap Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-green?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-blue?style=for-the-badge&logo=openai" />
  <img src="https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/PostgreSQL-Ready-blue?style=for-the-badge&logo=postgresql" />
</p>

<p align="center">
  <b>Upload Resume ➜ Get ATS Score ➜ Recruiter Feedback ➜ Job Matching ➜ Career Roadmap ➜ Interview Preparation</b>
</p>

---

## ✨ Overview

TalentLens AI is a next-generation career intelligence platform that helps students and professionals optimize their resumes, identify skill gaps, match with relevant internships/jobs, and build personalized learning roadmaps.

Unlike traditional ATS checkers, TalentLens simulates a Senior Google Recruiter, evaluates resume quality, predicts interview questions, and provides AI-powered recommendations to maximize hiring potential.

---

## 🎥 Demo

<p align="center">
  <img src="./assets/demo.gif" width="900"/>
</p>

> Replace the GIF above with your project demo.

---

# 🔥 Core Features

## 📄 Smart Resume Parsing

Upload PDF or DOCX resumes and instantly extract:

* Skills
* Projects
* Education
* Experience
* Certifications

Powered by:

* PyMuPDF
* pdfplumber
* python-docx

---

## 🎯 ATS Resume Scoring

Receive a comprehensive ATS evaluation.

Example:

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

## 👨‍💼 Senior Google Recruiter Simulation

Get AI-generated recruiter feedback.

Example:

```yaml
Shortlist Decision: No

Reasons:
- Limited internship experience
- Missing cloud technologies
- Weak project impact statements
```

---

## ✨ AI Bullet Point Enhancer

Transform weak bullets into recruiter-friendly achievements.

Before:

```text
Built a web application
```

After:

```text
Built a scalable React-based web application serving 500+ users, reducing page load time by 40%.
```

---

## 🎯 Job Matching Engine

Match resumes against:

* LinkedIn
* Wellfound
* Naukri
* Internshala

Example:

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

Identify skills needed to reach target roles.

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

Paste a Job Description and generate:

* Optimized Resume
* Keyword Alignment
* Improved Project Summaries

---

## 💌 Cover Letter Generator

Generate personalized cover letters instantly.

```yaml
Input:
- Resume
- Job Description

Output:
- ATS-friendly Cover Letter
```

---

## 🗺️ Career Roadmaps

Generate visual learning paths.

```text
Current:
Student

Goal:
Google SWE

Roadmap:
DSA
 ↓
Full Stack
 ↓
Open Source
 ↓
Cloud
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

With expert-level sample answers.

---

# 🏗️ Architecture

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
Job Matcher
      │
      ▼
Gap Analysis
      │
      ▼
Career Roadmap Generator
      │
      ▼
Interview Predictor
```

---

# ⚙️ Tech Stack

## Frontend

* Next.js 16
* Tailwind CSS v4
* Shadcn UI
* Recharts
* Lucide Icons

## Backend

* FastAPI
* Python 3.12
* SQLAlchemy
* PostgreSQL
* SQLite

## AI Layer

* OpenAI API
* Google Gemini API

## Resume Parsing

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
│   └── ai_service.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── utils/
│   └── package.json
│
├── run_talentlens.bat
└── talentlens.db
```

---

# 🚀 Getting Started

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend:

```bash
http://127.0.0.1:8000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```bash
http://localhost:8080
```

---

# 🔑 Environment Variables

```env
OPENAI_API_KEY=your_openai_key

GEMINI_API_KEY=your_gemini_key

DATABASE_URL=postgresql://user:password@localhost:5432/talentlens
```

---

# 📈 Future Enhancements

* Resume Version Control
* GitHub Profile Analyzer
* LinkedIn Optimization Engine
* AI Mock Interviews
* Real-Time Job Alerts
* Salary Prediction Model
* Resume Benchmarking Against Top Candidates

---

# 🌟 Why TalentLens?

TalentLens doesn't just review resumes.

It acts as:

✅ ATS Checker
✅ Recruiter Simulator
✅ Career Coach
✅ Job Matching Engine
✅ Interview Preparation Assistant
✅ Roadmap Generator

Helping candidates bridge the gap between where they are today and their dream role.

---
👨‍💻 Author

Srinath Doggala

Computer Science Engineer | AI/ML Enthusiast | Full-Stack Developer

GitHub: https://github.com/srinathdoggala-tech
Project Repository: https://github.com/srinathdoggala-tech/TalentLens
Live Application: https://talent-lens-4z4i.vercel.app
⭐ Support

If you found TalentLens useful:

⭐ Star the repository

🍴 Fork the project

🛠️ Contribute new features

📢 Share it with your network

<p align="center">
  Built with ❤️ by Srinath
</p>
