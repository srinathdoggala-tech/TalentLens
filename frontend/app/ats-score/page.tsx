"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Percent, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  FileX,
  Loader2,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { analyzeResume } from "@/utils/api";

interface BulletImprovement {
  before: string;
  after: string;
}

interface AnalysisResult {
  id: number;
  ats_score: number;
  recruiter_decision: string;
  recruiter_reasons: string[];
  problems: string[];
  recommendations: string[];
  bullet_improvements: BulletImprovement[];
}

export default function AtsScorePage() {
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("activeResumeId");
    if (stored) {
      setResumeId(Number(stored));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!resumeId) return;

    async function runAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const data = await analyzeResume(resumeId!);
        setAnalysis(data);
      } catch (err: any) {
        setError(err.message || "Failed to analyze resume.");
      } finally {
        setLoading(false);
      }
    }
    runAnalysis();
  }, [resumeId]);

  if (!resumeId) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-6">
        <FileX className="h-16 w-16 text-slate-700 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Active Resume Found</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Please upload a resume first before running the ATS Recruiter Simulator.
        </p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-colors"
        >
          Go to Upload
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-32 flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="h-12 w-12 text-indigo-400 animate-spin" />
        <div>
          <h2 className="text-lg font-bold text-white">Recruiter Simulation Active</h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing formatting, keyword weights, and bullet structures...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Analysis Failed</h2>
        <p className="text-xs text-red-300">{error}</p>
        <button
          onClick={() => setResumeId(resumeId)} // Re-trigger
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Determine colors based on decision
  const decision = (analysis?.recruiter_decision || "Maybe") as "Yes" | "Maybe" | "No";
  const decisionColors = {
    Yes: {
      bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      text: "Yes, Shortlist",
      badge: "bg-emerald-600",
    },
    Maybe: {
      bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      text: "Maybe / Waitlist",
      badge: "bg-amber-600",
    },
    No: {
      bg: "bg-red-500/10 border-red-500/30 text-red-400",
      text: "No, Reject",
      badge: "bg-red-600",
    }
  }[decision];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            ATS Score & <span className="text-gradient font-black">Recruiter Review</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Powered by LLM logic acting as a Senior Google Recruiter.
          </p>
        </div>
        <Link
          href="/job-match"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl hover:border-slate-700 text-xs transition-colors"
        >
          <span>Next: Match Jobs</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: circular score gauge + Recruiter Decision banner */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Circular Score card */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-indigo-400" /> ATS Rating
            </h3>
            
            {/* Simple circular graphic */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Back circle */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="8" />
                {/* Progress circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="url(#indigoGrad)" 
                  strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (analysis?.ats_score || 0) / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white">{analysis?.ats_score}</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">/ 100</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950/40 px-3.5 py-1.5 rounded-full border border-slate-900">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
              <span>Formatting & Keywords checked</span>
            </div>
          </div>

          {/* Recruiter Simulation Avatar card */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <UserCheck className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Google Recruiter Simulation</h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Senior Technical Recruiter</p>
              </div>
            </div>

            {/* Verdict block */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${decisionColors.bg}`}>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Shortlist Verdict</span>
              <span className="text-lg font-extrabold mt-1">{decisionColors.text}</span>
            </div>

            {/* Recruiter Reasons */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Recruiter's Log Notes</span>
              <ul className="space-y-2">
                {analysis?.recruiter_reasons.map((reason, idx) => (
                  <li key={idx} className="text-xs text-slate-400 leading-normal flex items-start gap-2">
                    <span className="text-indigo-500 font-bold select-none">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right column: Problems, Recommendations, Bullet Point Improvements */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Issues vs Solutions Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Problems Panel */}
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-red-400" /> Identified Weaknesses
              </h3>
              <div className="flex flex-col gap-2">
                {analysis?.problems.map((problem, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-xs text-slate-300 leading-normal">
                    {problem}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Panel */}
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-400" /> Actionable Fixes
              </h3>
              <div className="flex flex-col gap-2">
                {analysis?.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-xs text-slate-300 leading-normal">
                    {rec}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bullet point enhancer */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-400" /> Bullet Point Improvements (AI Rewrites)
            </h3>
            <p className="text-[11px] text-slate-500">
              Hover to compare. These rewrites emphasize action-oriented phrases and quantified business impact metrics.
            </p>

            <div className="space-y-4 mt-2">
              {analysis?.bullet_improvements.map((bullet, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1.5">
                    <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Before
                    </span>
                    <p className="text-xs text-slate-400 leading-normal italic">"{bullet.before}"</p>
                  </div>
                  {/* After */}
                  <div className="p-4 bg-indigo-950/20 border border-indigo-950 rounded-xl space-y-1.5 hover:border-indigo-500/40 transition-colors">
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      After (AI Optimized)
                    </span>
                    <p className="text-xs text-slate-300 leading-normal font-semibold">"{bullet.after}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
