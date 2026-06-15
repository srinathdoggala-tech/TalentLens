const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/resume/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "Failed to upload resume.");
  }
  return response.json();
}

export async function getResumes() {
  const response = await fetch(`${API_BASE_URL}/api/resumes`);
  if (!response.ok) throw new Error("Failed to load resumes.");
  return response.json();
}

export async function getResume(resumeId: number) {
  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}`);
  if (!response.ok) throw new Error("Failed to load resume details.");
  return response.json();
}

export async function analyzeResume(resumeId: number) {
  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}/analyze`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to analyze resume.");
  return response.json();
}

export async function getJobMatches(resumeId: number) {
  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}/job-match`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to run job matching.");
  return response.json();
}

export async function tailorResume(resumeId: number, jobDescription: string) {
  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}/tailor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: jobDescription }),
  });
  if (!response.ok) throw new Error("Failed to tailor resume.");
  return response.json();
}

export async function generateRoadmap(currentProfile: string, targetRole: string) {
  const response = await fetch(`${API_BASE_URL}/api/career/roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current_profile: currentProfile, target_role: targetRole }),
  });
  if (!response.ok) throw new Error("Failed to generate career roadmap.");
  return response.json();
}

export async function getInterviewPrep(resumeId: number) {
  const response = await fetch(`${API_BASE_URL}/api/resume/${resumeId}/interview`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to generate interview questions.");
  return response.json();
}
