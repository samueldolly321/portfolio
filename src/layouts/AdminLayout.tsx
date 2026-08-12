import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  User,
  Sparkles,
  Info,
  Code2,
  Briefcase,
  GraduationCap,
  FolderCode,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { label: 'Profil & Bio', path: '/admin/profile', icon: User },
    { label: 'Section Hero', path: '/admin/hero', icon: Sparkles },
    { label: 'À Propos & Stats', path: '/admin/about', icon: Info },
    { label: 'Compétences', path: '/admin/skills', icon: Code2 },
    { label: 'Expériences', path: '/admin/experiences', icon: Briefcase },
    { label: 'Formations', path: '/admin/education', icon: GraduationCap },
    { label: 'Projets CMS', path: '/admin/projects', icon: FolderCode },
    { label: 'Médiathèque', path: '/admin/media', icon: ImageIcon },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/user');
  };

  return (
    <div className="min-h-screen bg-theme-main text-theme-main flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-theme-surface border-b border-theme p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-theme-primary" />
          <span className="font-heading font-bold text-sm text-theme-main">CMS Administration</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg border border-theme">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg border border-theme text-theme-main"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-theme-surface border-r border-theme p-6 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Header Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-theme">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#36E0C2] to-[#29B6E6] flex items-center justify-center text-slate-950 font-bold font-heading shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading font-bold text-base text-theme-main leading-tight">
                Samuel CMS
              </span>
              <span className="text-[10px] font-mono text-theme-primary tracking-wider uppercase">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-heading transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#36E0C2]/20 to-[#29B6E6]/20 text-theme-primary border border-theme-primary/40 shadow-xs'
                      : 'text-theme-muted hover:text-theme-main hover:bg-theme-card/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-theme-primary' : 'text-theme-muted'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-theme space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-theme text-xs font-semibold text-theme-main hover:border-theme-primary transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-theme-primary" /> Voir le site public
            </span>
          </a>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-bold text-theme-main truncate">{user?.name || 'Admin'}</span>
              <span className="text-[10px] text-theme-muted font-mono truncate">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar on Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-theme-surface/50 border-b border-theme/60 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-theme-muted">
            <span>ADMINISTRATION</span>
            <span>/</span>
            <span className="text-theme-primary font-bold uppercase">
              {location.pathname.replace('/admin', '').replace('/', '') || 'DASHBOARD'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-theme text-theme-main hover:border-theme-primary transition-colors"
              title="Changer de thème"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-card border border-theme hover:border-theme-primary text-xs font-semibold text-theme-main transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-theme-primary" /> Voir Portfolio
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
