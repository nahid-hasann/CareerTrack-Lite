import { Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-6 py-12 font-sans text-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Error 404
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white">Page Not Found</h1>
          <p className="text-xs text-slate-400">
            Oops! The page you are looking for might have been moved or does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex items-center space-x-2 text-slate-500 text-xs">
        <Briefcase className="w-4 h-4 text-cyan-400" />
        <span>CareerTrack Lite</span>
      </div>
    </div>
  );
}
