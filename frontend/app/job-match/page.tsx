"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Percent, 
  TrendingUp,
  FileX,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { getJobMatches } from "@/utils/api";

interface JobMatch {
  job_title: string;
  company: string;
  location?: string;
  match_score: number;
  missing_skills: string[];
  matched_skills: string[];
  job_board: string;
}

export default function JobMatchPage() {
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [location, setLocation] = useState("All");
  const [matches, setMatches] = useState<JobMatch[]>([]);
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

    async function runMatcher() {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobMatches(resumeId!, location);
        setMatches(data);
      } catch (err: any) {
        setError(err.message || "Failed to match jobs.");
      } finally {
        setLoading(false);
      }
    }
    runMatcher();
  }, [resumeId, location]);

  if (!resumeId) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-6">
        <FileX className="h-16 w-16 text-slate-700 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Active Resume Found</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Please upload a resume first to scan and match against job descriptions.
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
          <h2 className="text-lg font-bold text-white">Matching Jobs Engine</h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing skills against LinkedIn, Wellfound, Naukri, and Internshala...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto py-24 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Job Matching Failed</h2>
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

  // Segment matches into high match (internships)
  const highMatches = matches.filter(m => m.match_score >= 80);
  const otherMatches = matches.filter(m => m.match_score < 80);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Job Matching & <span className="text-gradient font-black">Internship Engine</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Extracts resume skills and compares profiles against global board listings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Region:</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-slate-900 border border-slate-800 focus:border-indigo-500/50 outline-none rounded-xl px-3 py-2 text-xs font-bold text-white cursor-pointer"
            >
              <option value="All">🌍 All Countries</option>
              <option value="USA">🇺🇸 United States</option>
              <option value="China">🇨🇳 China</option>
              <option value="India">🇮🇳 India</option>
              <option value="Germany">🇩🇪 Germany</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="Japan">🇯🇵 Japan</option>
            </select>
          </div>
          <Link
            href="/tailor"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl hover:border-slate-700 text-xs transition-colors"
          >
            <span>Next: Tailor Resume & CL</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Internship Recommendations highlights */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-indigo-900/10 via-slate-950/20 to-slate-950/20 border border-indigo-950/45 space-y-6">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Top Internship Matches</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              These institutions match your core competencies and offer premium growth tracks:
            </p>

            <div className="flex flex-col gap-4">
              {highMatches.map((m, idx) => (
                <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-900/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between w-full">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.company}</h4>
                        {m.location && (
                          <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded">
                            {m.location}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-white mt-0.5">{m.job_title}</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg ml-2 shrink-0">
                      {m.match_score}% Match
                    </span>
                  </div>

                  {/* Skill gaps */}
                  {m.missing_skills.length > 0 && (
                    <div className="space-y-1.5 border-t border-slate-900 pt-2.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Missing Core:</span>
                      <div className="flex flex-wrap gap-1">
                        {m.missing_skills.slice(0, 3).map(sk => (
                          <span key={sk} className="text-[9px] bg-red-500/5 border border-red-500/10 text-red-400 px-2 py-0.5 rounded-md">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Main Job Feed Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Matches Across All Platforms</h2>
            <p className="text-xs text-slate-400">
              Listing positions extracted from LinkedIn, Internshala, Wellfound, and Naukri:
            </p>

            <div className="flex flex-col gap-4 mt-4">
              {matches.map((m, idx) => (
                <div key={idx} className="p-5 bg-slate-950/20 border border-slate-900 rounded-2xl flex flex-col md:flex-row justify-between gap-6 hover:border-slate-800 transition-colors">
                  
                  {/* Left part: Title, Company, Board, and Matched skills */}
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                          {m.job_board}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                          <Clock className="h-3 w-3" /> Active
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{m.job_title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold">{m.company}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-indigo-400 font-medium">{m.location}</span>
                      </div>
                    </div>

                    {/* Matched skills tags */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Matched Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {m.matched_skills.map(sk => (
                          <span key={sk} className="text-[9px] bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right part: Match Score & Missing Skills */}
                  <div className="w-full md:w-56 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-900 pt-4 md:pt-0 md:pl-6">
                    <div className="text-center md:text-left">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Match Score</span>
                      <span className="text-2xl font-extrabold text-white mt-1 block">
                        {m.match_score}%
                      </span>
                    </div>

                    {/* Missing skills gap */}
                    {m.missing_skills.length > 0 && (
                      <div className="space-y-1 mt-4">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Missing Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {m.missing_skills.map(sk => (
                            <span key={sk} className="text-[9px] bg-red-500/5 border border-red-500/10 text-red-400 px-2 py-0.5 rounded-md">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
