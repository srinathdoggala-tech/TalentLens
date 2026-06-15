import os
import json
import re
from typing import Dict, Any, List
import openai
import google.generativeai as genai

# Load environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def clean_json_response(text: str) -> Dict[str, Any]:
    """
    Cleans markdown code block wrapper from LLM JSON response.
    """
    text = text.strip()
    # Remove ```json ... ``` wrapper if present
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        text = match.group(1)
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}. Raw text was:\n{text}")
        # Try to find anything between { and }
        first_curly = text.find('{')
        last_curly = text.rfind('}')
        if first_curly != -1 and last_curly != -1:
            try:
                return json.loads(text[first_curly:last_curly+1])
            except Exception:
                pass
        raise ValueError("LLM did not return valid JSON.")

def call_llm(prompt: str, system_instruction: str = "") -> str:
    """
    Tries Gemini first (if key is set), then OpenAI (if key is set), else raises ValueError.
    """
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_instruction if system_instruction else None
            )
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini call failed: {e}. Trying OpenAI...")
            
    if OPENAI_API_KEY:
        try:
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.2
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI call failed: {e}")
            
    raise ValueError("No API keys configured or both Gemini and OpenAI calls failed.")

def parse_resume(raw_text: str) -> Dict[str, Any]:
    """
    Extracts structured fields (skills, projects, education, experience, certifications) from raw resume text.
    """
    system_instruction = (
        "You are an expert resume parser. Analyze the raw text and extract structured info in JSON. "
        "Return ONLY a JSON object with keys: 'skills' (list of strings), 'projects' (list of objects with "
        "'title', 'description', 'technologies' list), 'education' (list of objects with 'institution', "
        "'degree', 'year'), 'experience' (list of objects with 'company', 'role', 'duration', 'achievements' list), "
        "and 'certifications' (list of strings)."
    )
    prompt = f"Extract structured information from this resume:\n\n{raw_text}"
    
    try:
        raw_response = call_llm(prompt, system_instruction)
        return clean_json_response(raw_response)
    except Exception as e:
        print(f"Using mock parser due to AI error/absence: {e}")
        return get_mock_parsed_resume(raw_text)

def analyze_ats(parsed_resume: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates a Senior Google Recruiter review. Grades the resume, outputs an ATS score, 
    list of issues, recommendations, and rewritten bullet points.
    """
    system_instruction = (
        "You are a Senior Recruiter at Google. Evaluate the structured resume JSON. "
        "Return ONLY a JSON object containing:\n"
        "- 'ats_score': an integer from 0 to 100\n"
        "- 'recruiter_decision': 'Yes', 'No', or 'Maybe'\n"
        "- 'recruiter_reasons': list of strings explaining the decision\n"
        "- 'problems': list of problems (e.g. 'Missing GitHub link', 'No Quantified Achievements')\n"
        "- 'recommendations': list of recommendations (e.g. 'Add metrics to projects', 'Include portfolio')\n"
        "- 'bullet_improvements': list of objects with 'before' (weak bullet point) and 'after' (stronger, quantified version)."
    )
    prompt = f"Analyze this resume JSON:\n\n{json.dumps(parsed_resume, indent=2)}"
    
    try:
        raw_response = call_llm(prompt, system_instruction)
        return clean_json_response(raw_response)
    except Exception as e:
        print(f"Using mock ATS evaluator due to AI error/absence: {e}")
        return get_mock_ats_analysis(parsed_resume)

def match_jobs(skills: List[str], location_filter: str = "All") -> List[Dict[str, Any]]:
    """
    Matches candidate skills against mock jobs worldwide, filtering by the selected location.
    """
    # Expanded international jobs database
    jobs = [
        # United States
        {"job_title": "Software Engineer Intern", "company": "Google", "location": "Silicon Valley, USA", "skills": ["Python", "React", "NodeJS", "Docker", "AWS", "SQL"], "job_board": "LinkedIn"},
        {"job_title": "Frontend Engineer", "company": "Microsoft", "location": "Redmond, USA", "skills": ["TypeScript", "React", "Next.js", "Tailwind CSS", "Redux", "Testing"], "job_board": "Wellfound"},
        {"job_title": "Full Stack Developer", "company": "Stripe", "location": "San Francisco, USA", "skills": ["Ruby", "React", "TypeScript", "SQL", "REST APIs"], "job_board": "Wellfound"},
        
        # China
        {"job_title": "Frontend Intern", "company": "Tencent", "location": "Shenzhen, China", "skills": ["JavaScript", "React", "CSS", "TypeScript", "NodeJS"], "job_board": "LinkedIn"},
        {"job_title": "Cloud Dev Intern", "company": "Alibaba", "location": "Hangzhou, China", "skills": ["Java", "Docker", "Kubernetes", "Linux", "Go"], "job_board": "Greenhouse"},
        {"job_title": "Algorithm Engineer", "company": "ByteDance", "location": "Beijing, China", "skills": ["Python", "PyTorch", "Machine Learning", "C++", "SQL"], "job_board": "Lever"},
        
        # India
        {"job_title": "Backend Developer", "company": "Flipkart", "location": "Bangalore, India", "skills": ["Java", "Spring Boot", "AWS", "PostgreSQL", "Docker", "Redis", "Python"], "job_board": "Naukri"},
        {"job_title": "Full Stack Intern", "company": "TCS", "location": "Mumbai, India", "skills": ["JavaScript", "HTML", "CSS", "React", "NodeJS", "MongoDB"], "job_board": "Internshala"},
        {"job_title": "Python Developer", "company": "Infosys", "location": "Hyderabad, India", "skills": ["Python", "Django", "SQL", "Git", "REST APIs"], "job_board": "Naukri"},
        
        # Germany
        {"job_title": "Software Engineer", "company": "SAP", "location": "Walldorf, Germany", "skills": ["Java", "Spring Boot", "Docker", "SQL", "Kubernetes", "REST APIs"], "job_board": "LinkedIn"},
        {"job_title": "IoT Developer Intern", "company": "Siemens", "location": "Munich, Germany", "skills": ["C++", "Python", "Linux", "Git", "Docker"], "job_board": "Greenhouse"},
        
        # United Kingdom
        {"job_title": "React Developer", "company": "Deliveroo", "location": "London, UK", "skills": ["TypeScript", "React", "Next.js", "NodeJS", "Docker"], "job_board": "Wellfound"},
        {"job_title": "Embedded Systems Intern", "company": "ARM", "location": "Cambridge, UK", "skills": ["C", "C++", "Assembly", "Git", "Linux"], "job_board": "Lever"},
        
        # Japan
        {"job_title": "PlayStation Engineer", "company": "Sony", "location": "Tokyo, Japan", "skills": ["C++", "C#", "Unity", "Shaders", "Git"], "job_board": "LinkedIn"},
        {"job_title": "iOS Developer Intern", "company": "Mercari", "location": "Tokyo, Japan", "skills": ["Swift", "Objective-C", "iOS", "Git", "REST APIs"], "job_board": "Wellfound"}
    ]
    
    # Filter by location if specified
    if location_filter and location_filter.lower() != "all":
        jobs = [j for j in jobs if location_filter.lower() in j["location"].lower()]
        
    results = []
    user_skills_lower = [s.lower() for s in skills]
    
    for job in jobs:
        job_skills = job["skills"]
        
        matched = []
        missing = []
        for js in job_skills:
            if js.lower() in user_skills_lower:
                matched.append(js)
            else:
                missing.append(js)
                
        # Calculate percentage match
        match_score = int((len(matched) / len(job_skills)) * 100) if job_skills else 0
        
        results.append({
            "job_title": job["job_title"],
            "company": job["company"],
            "location": job["location"],
            "match_score": match_score,
            "matched_skills": matched,
            "missing_skills": missing,
            "job_board": job["job_board"]
        })
        
    return sorted(results, key=lambda x: x["match_score"], reverse=True)

def generate_roadmap(current_profile: str, target_role: str) -> List[Dict[str, Any]]:
    """
    Generates step-by-step career path milestones.
    """
    system_instruction = (
        "You are a Career Coach. Create a structured roadmap from a user's current profile "
        "to their target role. Return ONLY a JSON list of objects, each containing: "
        "'stage' (int), 'title' (string), 'description' (string), 'skills_to_learn' (list of strings), "
        "and 'resources' (list of strings)."
    )
    prompt = f"Create a career roadmap from '{current_profile}' to '{target_role}'."
    
    try:
        raw_response = call_llm(prompt, system_instruction)
        return clean_json_response(raw_response)
    except Exception as e:
        print(f"Using mock roadmap generator due to AI error/absence: {e}")
        return get_mock_roadmap(current_profile, target_role)

def predict_interview(parsed_resume: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates HR, Technical, and Project questions based on the candidate's resume.
    """
    system_instruction = (
        "You are an elite interviewer. Analyze the candidate's resume and generate tailored "
        "interview questions and ideal answers. Return ONLY a JSON object with keys: "
        "'hr_questions', 'tech_questions', and 'project_questions'. Each is a list of objects "
        "with keys: 'question', 'category' (e.g., HR, System Design, Coding, Project Details), "
        "and 'ideal_answer' (detailed advice on how to answer)."
    )
    prompt = f"Generate interview questions for this resume:\n\n{json.dumps(parsed_resume, indent=2)}"
    
    try:
        raw_response = call_llm(prompt, system_instruction)
        return clean_json_response(raw_response)
    except Exception as e:
        print(f"Using mock interview predictor due to AI error/absence: {e}")
        return get_mock_interview_prep(parsed_resume)

def tailor_resume_and_cover_letter(parsed_resume: Dict[str, Any], job_description: str) -> Dict[str, Any]:
    """
    Tailors the resume structure to match a JD, outputs list of optimization changes, and generates a Cover Letter.
    """
    system_instruction = (
        "You are an expert career counselor. Tailor the candidate's resume to match the Job Description (JD). "
        "Additionally, write a compelling, premium cover letter for this job role. "
        "Return ONLY a JSON object containing:\n"
        "- 'optimized_resume': an object matching the structure of parsed resume (skills, projects, education, experience, certifications)\n"
        "- 'changes': a list of strings detailing what was optimized (e.g. '+ Added Docker keywords', 'improved projects summary')\n"
        "- 'cover_letter': a string containing the complete, professional cover letter text."
    )
    prompt = f"Resume:\n{json.dumps(parsed_resume, indent=2)}\n\nJob Description:\n{job_description}"
    
    try:
        raw_response = call_llm(prompt, system_instruction)
        return clean_json_response(raw_response)
    except Exception as e:
        print(f"Using mock tailoring due to AI error/absence: {e}")
        return get_mock_tailoring(parsed_resume, job_description)


# --- MOCK GENERATORS FOR OFFLINE / KEY-FREE USAGE ---

def get_mock_parsed_resume(raw_text: str) -> Dict[str, Any]:
    """
    Extracts core details from text using regex/splitting or returns a robust default resume.
    """
    # Simple regex fallback to extract name/email/skills if possible
    skills = []
    known_skills = ["Python", "React", "NodeJS", "JavaScript", "HTML", "CSS", "TypeScript", "SQL", "Docker", "AWS", "Git", "Java", "C++", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch"]
    for skill in known_skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', raw_text, re.IGNORECASE):
            skills.append(skill)
            
    if not skills:
        skills = ["Python", "JavaScript", "React", "NodeJS", "SQL", "Git"]

    return {
        "skills": skills,
        "projects": [
            {
                "title": "TalentLens AI",
                "description": "Built a web application for parsing resumes and generating interview questions.",
                "technologies": ["React", "FastAPI", "ChromaDB", "Python"]
            },
            {
                "title": "E-Commerce Microservice",
                "description": "Developed a database-driven e-commerce backend service supporting high load.",
                "technologies": ["NodeJS", "Express", "PostgreSQL", "Docker"]
            }
        ],
        "education": [
            {
                "institution": "State Technical University",
                "degree": "B.Tech in Computer Science",
                "year": "2027"
            }
        ],
        "experience": [
            {
                "company": "Tech Solutions Inc.",
                "role": "Frontend Intern",
                "duration": "June 2025 - August 2025",
                "achievements": [
                    "Built responsive web dashboards using React.",
                    "Improved site load speeds by 20% by refactoring code.",
                    "Collaborated with backend engineers on API contracts."
                ]
            }
        ],
        "certifications": [
            "AWS Certified Cloud Practitioner",
            "Google AI Fundamentals"
        ]
    }

def get_mock_ats_analysis(parsed: Dict[str, Any]) -> Dict[str, Any]:
    # Calculate a score based on number of skills and projects
    num_skills = len(parsed.get("skills", []))
    num_projects = len(parsed.get("projects", []))
    
    score = 70 + min(15, num_skills * 2) + min(15, num_projects * 5)
    score = min(98, score)

    problems = []
    reasons = []
    recommendations = []
    
    # Analyze experience and projects for weaknesses
    has_metrics = False
    for p in parsed.get("projects", []):
        desc = p.get("description", "").lower()
        if any(x in desc for x in ["%", "users", "ms", "seconds", "$", "faster", "reduced"]):
            has_metrics = True

    if not has_metrics:
        problems.append("❌ No Quantified Achievements (e.g. 'improved speed by X%', 'served Y users')")
        recommendations.append("✅ Add impact metrics to your projects (e.g., 'serving 500+ users', 'speed up by 30%')")
        reasons.append("Recruiter found the impact of projects difficult to gauge because achievements aren't quantified.")
    
    # Skills gaps
    skills_lower = [s.lower() for s in parsed.get("skills", [])]
    if "docker" not in skills_lower and "aws" not in skills_lower and "kubernetes" not in skills_lower:
        problems.append("❌ Missing cloud and deployment keywords (Docker, AWS/GCP)")
        recommendations.append("✅ Add cloud and containerization skills to match modern tech requirements")
        reasons.append("Missing cloud experience or container tools like Docker and AWS.")

    # Github
    problems.append("❌ Missing GitHub repository links on projects")
    recommendations.append("✅ Link your GitHub repositories directly to project descriptions for developer verification")

    if score >= 85:
        decision = "Yes"
        reasons.append("Strong technical skills matching modern stack, well-formatted sections, and relevant projects.")
    elif score >= 75:
        decision = "Maybe"
        reasons.append("Matches core developer skills, but lacks containerization experience and project metrics.")
    else:
        decision = "No"
        reasons.append("Insufficient internship experience, missing essential DevOps keywords, and lack of metrics.")

    # Bullet point fixes
    bullet_improvements = [
        {
            "before": "Built a web application",
            "after": "Built a scalable React-based web application serving 500+ users with FastAPI backend"
        },
        {
            "before": "Worked on database design",
            "after": "Designed and optimized database schemas in PostgreSQL, reducing query latency by 25%"
        }
    ]

    return {
        "ats_score": score,
        "recruiter_decision": decision,
        "recruiter_reasons": reasons,
        "problems": problems,
        "recommendations": recommendations,
        "bullet_improvements": bullet_improvements
    }

def get_mock_roadmap(current: str, target: str) -> List[Dict[str, Any]]:
    return [
        {
            "stage": 1,
            "title": "Core Foundations & Data Structures",
            "description": "Establish absolute command over basic coding principles, time complexity, and standard data structures (Arrays, Linked Lists, Stacks, Queues, Graphs, Trees).",
            "skills_to_learn": ["Time Complexity", "Arrays & Hashing", "Recursion", "Trees & Graphs"],
            "resources": ["LeetCode 75", "NeetCode.io", "CLRS Introduction to Algorithms"]
        },
        {
            "stage": 2,
            "title": "Full-Stack Development & Architecture",
            "description": "Build high-impact end-to-end applications. Learn modern frameworks, backend routing, state management, and database query optimizations.",
            "skills_to_learn": ["React & Next.js", "FastAPI / Node.js", "SQL & NoSQL Databases", "REST APIs"],
            "resources": ["Full Stack Open (University of Helsinki)", "FastAPI Documentation", "Prisma/SQLAlchemy guides"]
        },
        {
            "stage": 3,
            "title": "Cloud, Containers & DevOps",
            "description": "Move beyond local development. Understand containers, virtual servers, CI/CD pipelines, and cloud storage solutions.",
            "skills_to_learn": ["Docker", "Kubernetes", "AWS (S3, EC2)", "GitHub Actions (CI/CD)"],
            "resources": ["Docker for Beginners", "AWS Educate", "TechWorld with Nana (YouTube)"]
        },
        {
            "stage": 4,
            "title": "Open Source Contribution & Professional System Design",
            "description": "Prepare for enterprise environments. Learn scalable architectures, system design concepts, and contribute to repository codebases.",
            "skills_to_learn": ["System Design (Load Balancers, Caching)", "Git Branching / PRs", "Microservices", "ChromaDB / Pinecone (Vector Databases)"],
            "resources": ["ByteByteGo", "Grokking the System Design Interview", "GitHub Explore (Open Source projects)"]
        }
    ]

def get_mock_interview_prep(parsed: Dict[str, Any]) -> Dict[str, Any]:
    skills = parsed.get("skills", ["React", "Python", "FastAPI"])
    projects = parsed.get("projects", [{"title": "TalentLens AI"}])
    proj_title = projects[0]["title"] if projects else "Main Project"

    return {
        "hr_questions": [
            {
                "question": "Tell me about a time you faced a difficult technical challenge and how you solved it.",
                "category": "Behavioral",
                "ideal_answer": "Use the STAR method: Situation (setup context), Task (describe the goal), Action (what you specifically did, showcasing engineering decisions), Result (quantified outcome, e.g., 'resolved the lag and sped up requests by 20%')."
            },
            {
                "question": "Why do you want to work at Google as a Software Engineer?",
                "category": "HR",
                "ideal_answer": "Express interest in their engineering culture and scale. Connect it back to your interest in building highly optimized platforms (like TalentLens) that impact millions of users. Show that you align with their values of scalability, performance, and simplicity."
            }
        ],
        "tech_questions": [
            {
                "question": f"How would you optimize a system that parses thousands of PDF resumes concurrently using {', '.join(skills[:3])}?",
                "category": "System Design",
                "ideal_answer": "Outline horizontal scaling. Propose a task queue (like Celery with Redis) so FastAPI processes uploads asynchronously. Use S3 bucket events to trigger serverless parse functions. Implement caching on repeated text profiles to reduce processing load."
            },
            {
                "question": "What is the difference between a Vector DB (like Pinecone/ChromaDB) and a Relational DB (like PostgreSQL) for resume matching?",
                "category": "Database",
                "ideal_answer": "Explain that PostgreSQL matches exact keywords or patterns using SQL querying. Vector databases convert the resume into high-dimensional embeddings (using AI encoders) and perform similarity searches (like Cosine Similarity) to match resumes conceptually, even if the exact keyword isn't present."
            }
        ],
        "project_questions": [
            {
                "question": f"In your project '{proj_title}', what were the performance bottlenecks of the stack and how did you resolve them?",
                "category": "Project Details",
                "ideal_answer": "Highlight specific design trade-offs. For example, explain how parsing PDFs synchronously blocks the FastAPI event loop, and how you offloaded it or optimized library selection (e.g. PyMuPDF over slower parsers) to keep response times low."
            }
        ]
    }

def get_mock_tailoring(parsed: Dict[str, Any], jd: str) -> Dict[str, Any]:
    # Extract some terms from the JD to simulate tailoring
    jd_lower = jd.lower()
    changes = []
    
    tailored_skills = list(parsed.get("skills", []))
    
    # Add keywords that are typically requested but might be missing
    for keyword in ["Docker", "AWS", "Kubernetes", "Redis", "PostgreSQL", "TypeScript"]:
        if keyword.lower() in jd_lower and keyword not in tailored_skills:
            tailored_skills.append(keyword)
            changes.append(f"+ Added '{keyword}' to skills array (requested in JD)")
            
    # Tailor projects
    tailored_projects = []
    for p in parsed.get("projects", []):
        title = p.get("title", "")
        desc = p.get("description", "")
        techs = list(p.get("technologies", []))
        
        # Add a tailored description indicating metrics and cloud integrations
        if "react" in jd_lower or "next" in jd_lower:
            desc = f"Designed and deployed a responsive application tailored to JD specifications. Integrated containerized cloud environments to scale deployments."
            if "Docker" not in techs:
                techs.append("Docker")
        else:
            desc = f"Optimized performance backend systems, executing data modeling and query tuning that led to 20% latency improvements."
            
        tailored_projects.append({
            "title": title,
            "description": desc,
            "technologies": techs
        })
    changes.append("✓ Rewrote projects descriptions to emphasize quantified impact and scalable architecture")
    changes.append("✓ Realigned summary keywords to match the core job competencies")
    
    # Generate cover letter
    company = "Google"
    role = "Software Engineer"
    
    # Try to extract company/role from JD
    if "microsoft" in jd_lower:
        company = "Microsoft"
    elif "amazon" in jd_lower:
        company = "Amazon"
    elif "startup" in jd_lower:
        company = "Tech Startup"
        
    if "intern" in jd_lower:
        role = "Software Engineer Intern"
    elif "frontend" in jd_lower:
        role = "Frontend Engineer"
    elif "backend" in jd_lower:
        role = "Backend Developer"
        
    cover_letter = f"""Dear Hiring Team at {company},

I am writing to express my enthusiastic interest in the {role} position. With a strong background in software engineering, frontend framework design, and database optimizations, I am confident in my ability to contribute value to your development team.

In my recent work, I developed systems utilizing React, Next.js, and FastAPI, focusing on modularity, performance, and clean interfaces. In addition to frontend development, I have worked with backend architectures, creating endpoints and setting up containerized workflows with Docker. My project work has always centered on solving actual user problems, such as parsing documents and matching patterns using modern machine learning concepts.

I admire {company}'s commitment to engineering excellence and user-centric design. I would love the opportunity to bring my development skills, collaborative spirit, and passion for learning to your team. Thank you for your time and consideration.

Sincerely,
Candidate
"""

    return {
        "optimized_resume": {
            "skills": tailored_skills,
            "projects": tailored_projects,
            "education": parsed.get("education", []),
            "experience": parsed.get("experience", []),
            "certifications": parsed.get("certifications", [])
        },
        "changes": changes,
        "cover_letter": cover_letter
    }
