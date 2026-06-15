"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  LayoutDashboard, 
  UploadCloud, 
  Percent, 
  Briefcase, 
  Wand2, 
  Map, 
  MessageSquare,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Resume Upload", href: "/upload", icon: UploadCloud },
    { name: "ATS & Recruiter Review", href: "/ats-score", icon: Percent },
    { name: "Job Matcher & Jobs", href: "/job-match", icon: Briefcase },
    { name: "Resume Tailoring & CL", href: "/tailor", icon: Wand2 },
    { name: "Career Roadmap", href: "/roadmap", icon: Map },
    { name: "Interview Predictor", href: "/interview", icon: MessageSquare },
  ];

  return (
    <nav className="w-64 glass-panel border-r border-slate-800 h-screen fixed top-0 left-0 flex flex-col justify-between py-6 z-10">
      <div>
        {/* Logo Section */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-white">TalentLens</h1>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-widest">AI Platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 border-t border-slate-900 pt-4">
        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-center">
          <p className="text-xs text-slate-500 font-medium">Model Active</p>
          <p className="text-xs text-indigo-400 font-semibold mt-0.5">Gemini / OpenAI</p>
        </div>
      </div>
    </nav>
  );
}
