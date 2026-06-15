"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  UploadCloud, 
  Percent, 
  Briefcase, 
  Wand2, 
  Map, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { getResumes } from "@/utils/api";

interface Resume {
  id: number;
  filename: string;
  created_at: string;
  parsed_json: any;
}

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeResumeId, setActiveResumeId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getResumes();
        setResumes(data);
        if (data.length > 0) {
          // Default to latest resume if none selected
          const stored = localStorage.getItem("activeResumeId");
          if (stored) {
            setActiveResumeId(Number(stored));
          } else {
            setActiveResumeId(data[0].id);
            localStorage.setItem("activeResumeId", String(data[0].id));
          }
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectResume = (id: number) => {
    setActiveResumeId(id);
    localStorage.setItem("activeResumeId", String(id));
  };

  const activeResume = resumes.find(r => r.id === activeResumeId);

  // Quick action cards
  const quickActions = [
    {
      name: "ATS Score & Recruiter Check",
      desc: "Simulate a senior Google recruiter shortlisting review and check formatting.",
      href: "/ats-score",
      icon: Percent,
      color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400"
    },
    {
      name: "Job Matching Engine",
      desc: "Compare your resume against LinkedIn, Wellfound, Naukri, and Internshala.",
      href: "/job-match",
      icon: Briefcase,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    },
    {
      name: "Resume Tailoring & Cover Letter",
      desc: "Align your profile to a job description and generate optimized cover letters.",
      href: "/tailor",
      icon: Wand2,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400"
    },
    {
      name: "Interview Predictor",
      desc: "Generate custom HR, technical, and project questions based on your resume.",
      href: "/interview",
      icon: MessageSquare,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-900">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            TalentLens <span className="text-gradient font-black">AI Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Parse resumes, simulate recruiters, analyze skills, and optimize roadmaps.
          </p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200"
        >
          <UploadCloud className="h-5 w-5" />
          <span>Upload New Resume</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Resumes</p>
            <h3 className="text-3xl font-bold text-white mt-1">{resumes.length}</h3>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl">
            <FileText className="h-6 w-6 text-indigo-400" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Resume</p>
            <h3 className="text-sm font-semibold text-white mt-2 truncate max-w-[180px]">
              {activeResume ? activeResume.filename : "No Resumes Uploaded"}
            </h3>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Role</p>
            <h3 className="text-sm font-semibold text-white mt-2">
              Google SWE Intern / AI Specialist
            </h3>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl">
            <TrendingUp className="h-6 w-6 text-violet-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Resumes History & Active Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Your Resumes</h2>
              <span className="text-xs px-2 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md">
                Select Active
              </span>
            </div>

            {loading ? (
              <div className="space-y-3 pt-2">
                <div className="h-14 bg-slate-900 animate-pulse rounded-xl" />
                <div className="h-14 bg-slate-900 animate-pulse rounded-xl" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl">
                <FileText className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No resumes uploaded yet.</p>
                <Link href="/upload" className="text-xs text-indigo-400 font-semibold hover:underline mt-1 inline-block">
                  Upload now
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {resumes.map((resume) => (
                  <button
                    key={resume.id}
                    onClick={() => handleSelectResume(resume.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      activeResumeId === resume.id
                        ? "bg-indigo-600/10 border-indigo-500/50 shadow-md shadow-indigo-500/5"
                        : "bg-slate-950/20 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className={`h-5 w-5 ${activeResumeId === resume.id ? "text-indigo-400" : "text-slate-400"}`} />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">{resume.filename}</p>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(resume.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {activeResumeId === resume.id && (
                      <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Roadmap Builder promotion */}
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-indigo-900/15 via-purple-950/5 to-slate-950/5 border border-indigo-950 flex flex-col justify-between h-48">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Map className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Career Planning</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Interactive Career Roadmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate custom curriculum modules for DSA, Fullstack, Open Source, and Cloud based on your target role.
              </p>
            </div>
            <Link 
              href="/roadmap" 
              className="flex items-center justify-between text-xs font-bold text-indigo-400 hover:text-indigo-300 group mt-4"
            >
              <span>Build Roadmap Now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right column: Quick Actions Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-1">AI Action Center</h2>
            <p className="text-xs text-slate-400 mb-6">
              Run analyses on your active resume: <span className="text-indigo-400 font-semibold">{activeResume ? activeResume.filename : "Please upload a resume first"}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.name}
                    className={`glass-panel p-5 rounded-2xl border bg-gradient-to-br ${action.color} flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5`}
                  >
                    <div className="space-y-2">
                      <div className="p-2 bg-slate-950/40 border border-slate-900 w-10 h-10 flex items-center justify-center rounded-xl">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-white mt-3">{action.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{action.desc}</p>
                    </div>
                    {activeResume ? (
                      <Link
                        href={action.href}
                        className="flex items-center gap-1 text-xs font-bold text-white hover:underline mt-4 group"
                      >
                        <span>Launch Analyzer</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ) : (
                      <div className="text-xs text-slate-500 font-medium mt-4">
                        Upload a resume to unlock
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
