import { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2, Clock, AlertCircle, Server, RefreshCw, Plus, Layers, Search, Filter } from 'lucide-react';

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkApiHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5001/api/health');
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      setHealth(data);
    } catch (err: any) {
      setError(err.message || 'Failed to reach backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              CareerTrack <span className="text-cyan-400 font-light">Lite</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={checkApiHealth}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700/50"
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>API Health</span>
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            </button>

            {health ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Backend Online
              </span>
            ) : error ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-3 h-3 mr-1" />
                Backend Offline
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/80 to-cyan-950/30 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Job Application Tracker</h1>
            <p className="text-slate-400 text-sm mt-1">Manage, organize, and monitor your job search journey seamlessly.</p>
          </div>
          <button className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/25">
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>

        {/* Health Check Status Banner */}
        {health && (
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span><strong>Server status:</strong> {health.message}</span>
            </div>
            <span className="text-slate-400">{new Date(health.timestamp).toLocaleTimeString()}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Applications</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-white">12</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Applied</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400">7</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Interviewing</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">3</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Offers</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">2</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search companies or job titles..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 hover:border-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>

        {/* Sample Table Preview */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-semibold text-sm text-slate-200">
            Recent Job Applications
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Google</td>
                  <td className="px-6 py-4">Full Stack Engineer</td>
                  <td className="px-6 py-4">LinkedIn</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Interviewing
                    </span>
                  </td>
                  <td className="px-6 py-4">2026-07-15</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Stripe</td>
                  <td className="px-6 py-4">Backend Developer</td>
                  <td className="px-6 py-4">Company Site</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Applied
                    </span>
                  </td>
                  <td className="px-6 py-4">2026-07-18</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Vercel</td>
                  <td className="px-6 py-4">Frontend Engineer</td>
                  <td className="px-6 py-4">Referral</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Offer Received
                    </span>
                  </td>
                  <td className="px-6 py-4">2026-07-10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
