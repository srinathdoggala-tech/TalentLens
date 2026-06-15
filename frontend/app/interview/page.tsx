"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  UserCheck, 
  Terminal, 
  FileX, 
  Loader2, 
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { getInterviewPrep } from "@/utils/api";

interface Question {
  question: string;
  category: string;
  ideal_answer: string;
}

interface InterviewResponse {
  hr_questions: Question[];
  tech_questions: Question[];
  project_questions: Question[];
}

export default function InterviewPage() {
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [prep, setPrep] = useState<InterviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"hr" | "tech" | "proj">("hr");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

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

    async function runPredictor() {
      setLoading(true);
      setError(null);
      try {
        const data = await getInterviewPrep(resumeId!);
        setPrep(data);
      } catch (err: any) {
        setError(err.message || "Failed to predict interview questions.");
      } finally {
        setLoading(false);
      }
    }
    runPredictor();
  }, [resumeId]);

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  if (!resumeId) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-6">
        <FileX className="h-16 w-16 text-slate-700 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Active Resume Found</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Please upload a resume first to generate custom-tailored interview prep questions.
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
          <h2 className="text-lg font-bold text-white">Generating Predicted Questions</h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing projects, experiences, and technical stacks to predict interview curves...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Question Generation Failed</h2>
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

  // Get active list
  const questions = {
    hr: prep?.hr_questions || [],
    tech: prep?.tech_questions || [],
    proj: prep?.project_questions || [],
  }[activeTab];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI Interview <span className="text-gradient font-black">Question Predictor</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Tailored HR, Technical, and Project questions compiled from resume experience metrics.
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl hover:border-slate-700 text-xs transition-colors"
        >
          <span>Back to Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Tab Selection */}
        <div className="flex gap-2 p-1.5 bg-slate-950/60 border border-slate-900 rounded-2xl w-fit">
          <button
            onClick={() => { setActiveTab("hr"); setExpandedIdx(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "hr"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>HR / Behavioral</span>
          </button>
          <button
            onClick={() => { setActiveTab("tech"); setExpandedIdx(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "tech"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Technical / System</span>
          </button>
          <button
            onClick={() => { setActiveTab("proj"); setExpandedIdx(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "proj"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Project Deep-Dive</span>
          </button>
        </div>

        {/* Questions list container */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden border border-slate-900/60">
              
              {/* Question header click block */}
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full flex items-center justify-between p-5 text-left bg-slate-950/20 hover:bg-slate-950/40 transition-colors gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mt-0.5 shrink-0">
                    <HelpCircle className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{q.category}</span>
                    <h3 className="text-sm font-bold text-white mt-1 leading-normal">{q.question}</h3>
                  </div>
                </div>
                {expandedIdx === idx ? (
                  <ChevronUp className="h-5 w-5 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-500 shrink-0" />
                )}
              </button>

              {/* Expandable answer panel */}
              {expandedIdx === idx && (
                <div className="p-6 bg-indigo-950/5 border-t border-slate-900 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Lightbulb className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ideal Answer Framework & Advice</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6 whitespace-pre-line">
                    {q.ideal_answer}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
