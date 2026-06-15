"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Wand2, 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle, 
  FileX, 
  Loader2, 
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { tailorResume } from "@/utils/api";

interface TailoredResponse {
  changes: string[];
  cover_letter: string;
  optimized_resume: any;
}

export default function TailorPage() {
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<TailoredResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"cl" | "resume">("cl");

  useEffect(() => {
    const stored = localStorage.getItem("activeResumeId");
    if (stored) {
      setResumeId(Number(stored));
    }
  }, []);

  const handleTailor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeId || !jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await tailorResume(resumeId, jobDescription);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to tailor resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (!result?.cover_letter) return;
    navigator.clipboard.writeText(result.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!resumeId) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-6">
        <FileX className="h-16 w-16 text-slate-700 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Active Resume Found</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Please upload a resume first before tailoring it to job descriptions.
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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Resume Tailoring & <span className="text-gradient font-black">Cover Letter</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Optimize projects, keywords, and draft matching cover letters dynamically.
          </p>
        </div>
        <Link
          href="/roadmap"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl hover:border-slate-700 text-xs transition-colors"
        >
          <span>Next: Career Roadmap</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left column: input Job Description (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-indigo-400" />
              <span>Target Job Description</span>
            </h2>

            <form onSubmit={handleTailor} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Paste JD text below:
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g. Google Software Engineer Intern. Requirements: Python, React, Docker, AWS..."
                  className="w-full h-80 px-4 py-3.5 bg-slate-950/60 border border-slate-900 focus:border-indigo-500/50 outline-none rounded-xl text-xs text-slate-300 placeholder-slate-600 resize-none"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 leading-normal">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!jobDescription.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Tailoring Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Tailored Assets</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right column: results tabs (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl min-h-[500px] flex flex-col justify-between">
            
            <div>
              {/* Tab Selector */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-900">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("cl")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === "cl"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Cover Letter
                  </button>
                  <button
                    onClick={() => setActiveTab("resume")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === "resume"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Optimized Resume & Changes
                  </button>
                </div>
                {result && activeTab === "cl" && (
                  <button
                    onClick={handleCopyCoverLetter}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Letter</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {!result && !loading && (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-center">
                  <FileText className="h-12 w-12 text-slate-700 mb-3" />
                  <p className="text-sm font-semibold">Ready to tailor assets</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-[280px]">
                    Paste the Job Description and trigger tailoring to generate files.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-center space-y-4">
                  <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-white">Aligning skills and rewriting achievements...</p>
                    <p className="text-xs text-slate-600 mt-1">Refactoring project tech details and keywords</p>
                  </div>
                </div>
              )}

              {/* COVER LETTER TAB */}
              {result && activeTab === "cl" && (
                <div className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl font-serif text-slate-300 text-xs leading-relaxed whitespace-pre-line select-all min-h-[350px]">
                  {result.cover_letter}
                </div>
              )}

              {/* OPTIMIZED RESUME & CHANGES TAB */}
              {result && activeTab === "resume" && (
                <div className="space-y-6">
                  {/* Changes List */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Optimization Audit Log</span>
                    <div className="flex flex-col gap-2">
                      {result.changes.map((chg, idx) => (
                        <div key={idx} className="p-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-xl text-xs font-semibold">
                          {chg}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Optimized preview */}
                  <div className="space-y-2 border-t border-slate-900 pt-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Optimized Skills Matrix</span>
                    <div className="flex flex-wrap gap-2">
                      {result.optimized_resume.skills.map((sk: string) => (
                        <span key={sk} className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-xl">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects Optimized preview */}
                  <div className="space-y-3 border-t border-slate-900 pt-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Optimized Projects Descriptions</span>
                    <div className="space-y-3">
                      {result.optimized_resume.projects.map((proj: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2">
                          <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed italic">"{proj.description}"</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.technologies?.map((tech: string) => (
                              <span key={tech} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-md">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="pt-6 border-t border-slate-900 flex justify-end">
                <Link
                  href="/roadmap"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Proceed to Roadmap
                </Link>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
