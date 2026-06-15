"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles,
  BookOpen,
  Briefcase,
  Layers,
  Award,
  Terminal
} from "lucide-react";
import { uploadResume } from "@/utils/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setParsedData(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.toLowerCase().split('.').pop();
      if (ext === 'pdf' || ext === 'docx') {
        setFile(droppedFile);
        setError(null);
        setParsedData(null);
      } else {
        setError("Unsupported file format. Please upload a PDF or DOCX file.");
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const result = await uploadResume(file);
      setParsedData(result.parsed_json);
      // Set this as the active resume in localStorage
      localStorage.setItem("activeResumeId", String(result.id));
    } catch (err: any) {
      setError(err.message || "Something went wrong during file parsing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-900">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Resume <span className="text-gradient font-black">Upload & Parser</span>
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Supports PDF and DOCX files. Our AI will instantly parse and structure your resume details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left upload controls: 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-indigo-400" />
              <span>Select Resume File</span>
            </h2>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* Dropzone container */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors text-center cursor-pointer bg-slate-950/20 group ${
                  isDragActive ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5" : "border-slate-800 hover:border-indigo-500/50"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />
                <div className="space-y-4">
                  <div className={`p-3 bg-slate-900 rounded-2xl w-fit mx-auto border transition-all ${
                    isDragActive ? "border-indigo-500 bg-indigo-600/10" : "border-slate-800 group-hover:border-indigo-500/30 group-hover:bg-indigo-600/5"
                  }`}>
                    <FileText className={`h-8 w-8 transition-colors ${
                      isDragActive ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-400"
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {file ? file.name : "Click to browse or drag & drop"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      PDF, DOCX formats (Max size 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 leading-normal">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Parsing Document...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Parse Resume</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right parser results: 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl min-h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-emerald-400" />
                  <span>Parsed Extracted Data</span>
                </h2>
                {parsedData && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 animate-pulse-slow">
                    <CheckCircle2 className="h-4 w-4" /> Parsed Success
                  </span>
                )}
              </div>

              {!parsedData && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
                  <Layers className="h-12 w-12 text-slate-700 mb-3" />
                  <p className="text-sm font-semibold">Ready to parse</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-[280px]">
                    Upload your file to see the structured JSON nodes.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center space-y-4">
                  <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-white">Reading file contents...</p>
                    <p className="text-xs text-slate-600 mt-1">Extracting sentences, tables, and skills</p>
                  </div>
                </div>
              )}

              {parsedData && (
                <div className="space-y-6">
                  {/* Skills tags */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-indigo-400" /> Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills?.map((skill: string) => (
                        <span key={skill} className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-xl">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Projects details */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Terminal className="h-4 w-4 text-cyan-400" /> Projects
                    </h3>
                    <div className="space-y-3">
                      {parsedData.projects?.map((proj: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 space-y-2">
                          <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.technologies?.map((tech: string) => (
                              <span key={tech} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience block */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-emerald-400" /> Work Experience
                    </h3>
                    <div className="space-y-3">
                      {parsedData.experience?.map((exp: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{exp.company}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-semibold bg-slate-900 px-2 py-0.5 rounded-md">
                              {exp.duration}
                            </span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1">
                            {exp.achievements?.map((ach: string, i: number) => (
                              <li key={i} className="text-xs text-slate-400 leading-normal">{ach}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education details */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-purple-400" /> Education
                    </h3>
                    <div className="space-y-2">
                      {parsedData.education?.map((edu: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-950/20 border border-slate-900 rounded-xl">
                          <div>
                            <p className="text-xs font-bold text-white">{edu.degree}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{edu.institution}</p>
                          </div>
                          <span className="text-xs font-bold text-indigo-400">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications list */}
                  {parsedData.certifications?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-amber-400" /> Certifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {parsedData.certifications.map((cert: string) => (
                          <div key={cert} className="p-3 bg-slate-950/30 border border-slate-900 rounded-xl text-xs font-medium text-slate-300">
                            {cert}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {parsedData && (
              <div className="pt-6 border-t border-slate-900 flex justify-end">
                <button
                  onClick={() => router.push("/ats-score")}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Proceed to Recruiter Review
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
