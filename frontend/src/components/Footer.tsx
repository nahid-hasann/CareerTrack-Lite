import { GraduationCap, Heart, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-medium text-slate-300">CareerTrack Lite</span>
          <span className="text-slate-600">•</span>
          <span>Full-Stack Job Tracker System</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 shadow-inner">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer: <strong className="text-white font-semibold">Md Hasan Nahid</strong></span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 shadow-inner">
            <span className="text-xs text-slate-400">Student ID:</span>
            <span className="font-mono text-cyan-400 font-bold">2026-CT-1088</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-slate-500 text-xs">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 inline" />
          <span>using React & Express</span>
        </div>
      </div>
    </footer>
  );
}
