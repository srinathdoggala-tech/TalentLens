"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Map, 
  ChevronRight, 
  BookOpen, 
  Award, 
  HelpCircle, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Database,
  Terminal,
  Compass
} from "lucide-react";
import { generateRoadmap } from "@/utils/api";

interface RoadmapStep {
  stage: number;
  title: string;
  description: string;
  skills_to_learn: string[];
  resources: string[];
}

interface RoadmapResponse {
  current_profile: string;
  target_role: string;
  steps: RoadmapStep[];
}

export default function RoadmapPage() {
  const [currentProfile, setCurrentProfile] = useState("2nd Year AIML Student");
  const [targetRole, setTargetRole] = useState("Google SWE Intern");
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile.trim() || !targetRole.trim()) return;

    setLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      const data = await generateRoadmap(currentProfile, targetRole);
      setRoadmap(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI Career <span className="text-gradient font-black">Roadmap Builder</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Input your current level and target role to generate structured milestones.
          </p>
        </div>
        <Link
          href="/interview"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl hover:border-slate-700 text-xs transition-colors"
        >
          <span>Next: Interview Predictor</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Form: inputs (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-400" />
              <span>Target Vector</span>
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Current Profile:
                </label>
                <input
                  type="text"
                  value={currentProfile}
                  onChange={(e) => setCurrentProfile(e.target.value)}
                  placeholder="e.g. 2nd Year AIML"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-900 focus:border-indigo-500/50 outline-none rounded-xl text-xs text-slate-300 placeholder-slate-600"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Target Role:
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Google SWE"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-900 focus:border-indigo-500/50 outline-none rounded-xl text-xs text-slate-300 placeholder-slate-600"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-300 leading-normal">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !currentProfile.trim() || !targetRole.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg text-xs transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mapping Path...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Map</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right timeline display (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
            
            <div className="pb-4 border-b border-slate-900 mb-6 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Map className="h-5 w-5 text-indigo-400" />
                <span>Interactive Learning Path</span>
              </h2>
              {roadmap && (
                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {roadmap.current_profile} → {roadmap.target_role}
                </span>
              )}
            </div>

            {!roadmap && !loading && (
              <div className="flex flex-col items-center justify-center py-28 text-slate-500 text-center">
                <Compass className="h-12 w-12 text-slate-700 mb-3 animate-spin-slow" />
                <p className="text-sm font-semibold">Ready to chart course</p>
                <p className="text-xs text-slate-600 mt-1 max-w-[280px]">
                  Fill out your starting profile and target goal to generate milestones.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-28 text-slate-500 text-center space-y-4">
                <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                <div>
                  <p className="text-sm font-semibold text-white">Synthesizing milestones and resources...</p>
                  <p className="text-xs text-slate-600 mt-1">Sourcing guides from LeetCode, GitHub, and System Design courses</p>
                </div>
              </div>
            )}

            {roadmap && (
              <div className="relative border-l border-slate-800 ml-4 md:ml-8 pl-6 md:pl-10 space-y-12 py-4">
                
                {roadmap.steps.map((step) => (
                  <div key={step.stage} className="relative">
                    
                    {/* Node circle wrapper */}
                    <div className="absolute -left-[45px] md:-left-[61px] top-1.5 w-10 h-10 rounded-2xl bg-slate-950 border-2 border-indigo-500/60 shadow-lg shadow-indigo-500/10 flex items-center justify-center font-bold text-white text-sm z-2">
                      {step.stage}
                    </div>

                    {/* Milestone Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4 hover:border-indigo-500/30 transition-colors">
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed pt-1">
                          {step.description}
                        </p>
                      </div>

                      {/* Skills Tags */}
                      <div className="space-y-2 border-t border-slate-900/50 pt-3">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Key Competencies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.skills_to_learn.map((sk) => (
                            <span key={sk} className="text-[10px] bg-slate-900 border border-slate-800 text-indigo-300 px-2.5 py-0.5 rounded-lg">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Learning resources */}
                      <div className="space-y-2 border-t border-slate-900/50 pt-3">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Recommended Guides & Resources:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {step.resources.map((res, i) => (
                            <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-xs font-semibold text-slate-300">
                              <BookOpen className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                              <span className="truncate">{res}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
