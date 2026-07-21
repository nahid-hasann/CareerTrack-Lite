import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import type { Application, DashboardStats } from '../types/application';
import ApplicationModal from '../components/ApplicationModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import AIAnalyzerModal from '../components/AIAnalyzerModal';
import Footer from '../components/Footer';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  LogOut,
  User as UserIcon,
  Server,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Bookmark,
  Send,
  FileCheck,
  MessageSquare,
  XCircle,
  Trophy,
  Layers,
  Calendar,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

const INITIAL_DEMO_APPS: Application[] = [
  {
    id: 'demo-1',
    userId: 'demo-guest-user-123',
    companyName: 'Google',
    jobTitle: 'Senior Full Stack Engineer',
    jobUrl: 'https://careers.google.com',
    source: 'LinkedIn',
    status: 'INTERVIEW',
    applicationDate: new Date('2026-07-10').toISOString(),
    notes: 'System design interview scheduled for next Thursday at 3 PM',
  },
  {
    id: 'demo-2',
    userId: 'demo-guest-user-123',
    companyName: 'Stripe',
    jobTitle: 'Backend Infrastructure Engineer',
    jobUrl: 'https://stripe.com/jobs',
    source: 'Company Website',
    status: 'APPLIED',
    applicationDate: new Date('2026-07-15').toISOString(),
    notes: 'Submitted application via employee referral',
  },
  {
    id: 'demo-3',
    userId: 'demo-guest-user-123',
    companyName: 'Vercel',
    jobTitle: 'Frontend Engineer',
    jobUrl: 'https://vercel.com/careers',
    source: 'Bdjobs',
    status: 'OFFER',
    applicationDate: new Date('2026-07-02').toISOString(),
    notes: 'Offer letter received! Reviewing compensation package.',
  },
  {
    id: 'demo-4',
    userId: 'demo-guest-user-123',
    companyName: 'Meta',
    jobTitle: 'Software Engineer - React Core',
    jobUrl: 'https://metacareers.com',
    source: 'LinkedIn',
    status: 'ASSESSMENT',
    applicationDate: new Date('2026-07-18').toISOString(),
    notes: 'Completed coding assessment on HackerRank',
  },
  {
    id: 'demo-5',
    userId: 'demo-guest-user-123',
    companyName: 'Microsoft',
    jobTitle: 'Cloud Solutions Architect',
    jobUrl: 'https://careers.microsoft.com',
    source: 'Indeed',
    status: 'SAVED',
    applicationDate: new Date('2026-07-19').toISOString(),
    notes: 'Need to customize resume for Azure platform experience',
  },
];

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const isGuestMode = token === 'demo-guest-token-123';

  // State
  const [applications, setApplications] = useState<Application[]>(() => {
    const stored = localStorage.getItem('demo_applications');
    return stored ? JSON.parse(stored) : INITIAL_DEMO_APPS;
  });

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    saved: 0,
    applied: 0,
    assessment: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // API Health check state
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  // Modal State
  const [isAppModalOpen, setIsAppModalOpen] = useState<boolean>(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState<boolean>(false);

  // AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Helper to recalculate stats
  const calculateStats = (appList: Application[]) => {
    const newStats: DashboardStats = {
      total: appList.length,
      saved: 0,
      applied: 0,
      assessment: 0,
      interview: 0,
      rejected: 0,
      offer: 0,
    };
    appList.forEach((app) => {
      const s = app.status.toUpperCase();
      if (s === 'SAVED') newStats.saved++;
      else if (s === 'APPLIED') newStats.applied++;
      else if (s === 'ASSESSMENT') newStats.assessment++;
      else if (s === 'INTERVIEW') newStats.interview++;
      else if (s === 'REJECTED') newStats.rejected++;
      else if (s === 'OFFER') newStats.offer++;
    });
    setStats(newStats);
  };

  // Fetch Data (Backend or Guest fallback)
  const fetchData = useCallback(async () => {
    if (isGuestMode) {
      const stored = localStorage.getItem('demo_applications');
      const list: Application[] = stored ? JSON.parse(stored) : INITIAL_DEMO_APPS;
      setApplications(list);
      calculateStats(list);
      return;
    }

    setLoading(true);
    try {
      const [statsRes, appsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/applications', {
          params: {
            q: search.trim() || undefined,
            status: statusFilter || undefined,
          },
        }),
      ]);

      setStats(statsRes.data.stats);
      setApplications(appsRes.data.applications);
    } catch (err: any) {
      console.warn('Backend server unavailable, switching to local mode:', err.message);
      const stored = localStorage.getItem('demo_applications');
      const list: Application[] = stored ? JSON.parse(stored) : INITIAL_DEMO_APPS;
      setApplications(list);
      calculateStats(list);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, isGuestMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Health check
  const checkApiHealth = async () => {
    setLoadingHealth(true);
    setHealthError(null);
    try {
      const res = await api.get('/health');
      setHealth(res.data);
    } catch (err: any) {
      setHealthError(err.message || 'Failed to reach backend server');
      setHealth(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Add / Edit Handlers
  const handleOpenAddModal = () => {
    setEditingApplication(null);
    setIsAppModalOpen(true);
  };

  const handleOpenEditModal = (app: Application) => {
    setEditingApplication(app);
    setIsAppModalOpen(true);
  };

  const handleSaveApplication = async (data: Partial<Application>) => {
    setIsSubmittingApp(true);
    try {
      if (!isGuestMode) {
        try {
          if (editingApplication) {
            await api.patch(`/applications/${editingApplication.id}`, data);
          } else {
            await api.post('/applications', data);
          }
          await fetchData();
          return;
        } catch (apiErr) {
          console.warn('API error, saving locally in Guest Mode:', apiErr);
        }
      }

      // Guest / Offline fallback save
      let updatedList: Application[];
      if (editingApplication) {
        updatedList = applications.map((item) =>
          item.id === editingApplication.id ? ({ ...item, ...data } as Application) : item
        );
      } else {
        const newApp: Application = {
          id: 'app-' + Date.now(),
          userId: user?.id || 'guest-id',
          companyName: data.companyName || 'Company',
          jobTitle: data.jobTitle || 'Role',
          jobUrl: data.jobUrl || null,
          source: data.source || 'LinkedIn',
          status: data.status || 'APPLIED',
          applicationDate: data.applicationDate || new Date().toISOString(),
          notes: data.notes || null,
        };
        updatedList = [newApp, ...applications];
      }

      setApplications(updatedList);
      calculateStats(updatedList);
      localStorage.setItem('demo_applications', JSON.stringify(updatedList));
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Delete Handlers
  const handleOpenDeleteModal = (app: Application) => {
    setDeletingApp(app);
    setIsDeleteModalOpen(true);
  };

  const ConfirmDeleteApplication = async () => {
    if (!deletingApp) return;
    setIsDeleting(true);
    try {
      if (!isGuestMode) {
        try {
          await api.delete(`/applications/${deletingApp.id}`);
          setIsDeleteModalOpen(false);
          setDeletingApp(null);
          await fetchData();
          return;
        } catch (apiErr) {
          console.warn('API error during delete, fallback to local:', apiErr);
        }
      }

      const updatedList = applications.filter((a) => a.id !== deletingApp.id);
      setApplications(updatedList);
      calculateStats(updatedList);
      localStorage.setItem('demo_applications', JSON.stringify(updatedList));
      setIsDeleteModalOpen(false);
      setDeletingApp(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Sort applications
  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        !search.trim() ||
        app.companyName.toLowerCase().includes(search.toLowerCase().trim()) ||
        app.jobTitle.toLowerCase().includes(search.toLowerCase().trim());
      const matchesStatus = !statusFilter || app.status.toUpperCase() === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.applicationDate).getTime();
      const dateB = new Date(b.applicationDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    const uppercaseStatus = status.toUpperCase();
    switch (uppercaseStatus) {
      case 'SAVED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Bookmark className="w-3 h-3 mr-1" /> Saved
          </span>
        );
      case 'APPLIED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Send className="w-3 h-3 mr-1" /> Applied
          </span>
        );
      case 'ASSESSMENT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileCheck className="w-3 h-3 mr-1" /> Assessment
          </span>
        );
      case 'INTERVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MessageSquare className="w-3 h-3 mr-1" /> Interviewing
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      case 'OFFER':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Trophy className="w-3 h-3 mr-1" /> Offer Received
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
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
              onClick={() => setIsAIModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-xs text-cyan-300 transition-all border border-cyan-500/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">AI Assistant</span>
            </button>

            <button
              onClick={checkApiHealth}
              disabled={loadingHealth}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700/50"
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>API Health</span>
              <RefreshCw className={`w-3 h-3 ${loadingHealth ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            </button>

            {health ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Backend Online
              </span>
            ) : healthError ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-3 h-3 mr-1" />
                Backend Offline
              </span>
            ) : null}

            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2.5 text-sm font-medium text-slate-200 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span>{user?.name}</span>
                {isGuestMode && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold">
                    Demo Mode
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 border border-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/80 to-cyan-950/30 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
              {isGuestMode && <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />}
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Track your job search progress, interview invites, and offer letters in real-time.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Job Analyzer</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* Total */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Total</span>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-bold text-white">{stats.total}</div>
          </div>
          {/* Saved */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Saved</span>
              <Bookmark className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div className="text-xl font-bold text-violet-400">{stats.saved}</div>
          </div>
          {/* Applied */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Applied</span>
              <Send className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-400">{stats.applied}</div>
          </div>
          {/* Assessment */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">Assessment</span>
              <FileCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-400">{stats.assessment}</div>
          </div>
          {/* Interview */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Interview</span>
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400">{stats.interview}</div>
          </div>
          {/* Rejected */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">Rejected</span>
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-400">{stats.rejected}</div>
          </div>
          {/* Offer */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Offer</span>
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">{stats.offer}</div>
          </div>
        </div>

        {/* Toolbar Controls: Search, Status Filter & Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company name or job title..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative flex items-center">
              <Filter className="w-4 h-4 absolute left-3 text-slate-500 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="SAVED">Saved</option>
                <option value="APPLIED">Applied</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="INTERVIEW">Interview</option>
                <option value="REJECTED">Rejected</option>
                <option value="OFFER">Offer Received</option>
              </select>
            </div>

            {/* Sort Order Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-4 h-4 absolute left-3 text-slate-500 pointer-events-none" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Applications List</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {filteredApplications.length}
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
              <p className="text-sm">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-300">No applications found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {search || statusFilter
                  ? 'No applications match your current search query or filter.'
                  : 'Start tracking your job opportunities by clicking "Add Application" above.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Company & Role</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Source</th>
                    <th className="px-6 py-3.5">Applied Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Company & Role */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center font-bold text-cyan-400 text-sm shadow-md shrink-0">
                            {app.companyName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors flex items-center space-x-2">
                              <span>{app.companyName}</span>
                              {app.jobUrl && (
                                <a
                                  href={app.jobUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View job posting"
                                  className="text-slate-500 hover:text-cyan-400 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{app.jobTitle}</div>
                            {app.notes && (
                              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                                "{app.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(app.status)}
                      </td>

                      {/* Source */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                        {app.source || 'Direct'}
                      </td>

                      {/* Applied Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(app.applicationDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(app)}
                            title="Edit application"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(app)}
                            title="Delete application"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700/60 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Application Add / Edit Modal */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onSubmit={handleSaveApplication}
        initialData={editingApplication}
        isLoading={isSubmittingApp}
      />

      {/* AI Job Assistant Modal */}
      <AIAnalyzerModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={ConfirmDeleteApplication}
        companyName={deletingApp?.companyName || ''}
        jobTitle={deletingApp?.jobTitle || ''}
        isLoading={isDeleting}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
