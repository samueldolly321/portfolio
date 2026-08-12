import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardData } from '../../types';
import {
  FolderCode,
  Code2,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Database,
  HardDrive,
  Activity,
  Plus,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const stats = await api.getDashboardStats();
        setData(stats);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-theme-primary/20 border-t-theme-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-mono text-theme-muted mt-3">Chargement du Tableau de bord...</p>
      </div>
    );
  }

  const counts = data?.counts || {
    projects: 0,
    skills: 0,
    experiences: 0,
    education: 0,
    messages: 0,
    unreadMessages: 0,
  };

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-theme-surface to-theme-card border border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" /> CMS ACTIF
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-theme-main">
            Bienvenue dans votre Administration
          </h1>
          <p className="text-sm text-theme-muted">
            Gérez en temps réel tout le contenu de votre portfolio sans toucher au code source.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-heading font-bold text-xs shadow-md hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" /> Nouveau Projet
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-theme-card border border-theme p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold font-heading text-theme-main block">
              {counts.projects}
            </span>
            <span className="text-xs text-theme-muted font-mono uppercase">Projets Portfolio</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-surface text-theme-primary border border-theme">
            <FolderCode className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-theme-card border border-theme p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold font-heading text-theme-main block">
              {counts.skills}
            </span>
            <span className="text-xs text-theme-muted font-mono uppercase">Compétences</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-surface text-cyan-400 border border-theme">
            <Code2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-theme-card border border-theme p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold font-heading text-theme-main block">
              {counts.experiences}
            </span>
            <span className="text-xs text-theme-muted font-mono uppercase">Expériences</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-surface text-sky-400 border border-theme">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-theme-card border border-theme p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold font-heading text-theme-main block flex items-center gap-2">
              {counts.messages}
              {counts.unreadMessages > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-mono font-bold">
                  {counts.unreadMessages} non lu(s)
                </span>
              )}
            </span>
            <span className="text-xs text-theme-muted font-mono uppercase">Messages Reçus</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-surface text-teal-400 border border-theme">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Content Shortcuts & Health Indicator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-7 bg-theme-card border border-theme p-6 rounded-2xl shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-theme">
            <h3 className="font-heading font-bold text-lg text-theme-main flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-theme-primary" />
              Derniers Messages de Contact
            </h3>
            <Link to="/admin/messages" className="text-xs font-mono text-theme-primary hover:underline">
              Tout voir →
            </Link>
          </div>

          {data?.recentMessages && data.recentMessages.length > 0 ? (
            <div className="space-y-3">
              {data.recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    msg.status === 'UNREAD'
                      ? 'bg-theme-surface border-theme-primary/50'
                      : 'bg-theme-surface/50 border-theme/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-theme-main">{msg.name}</span>
                    <span className="text-[10px] font-mono text-theme-muted">
                      {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-theme-secondary block mb-1">
                    {msg.subject || 'Nouveau Message'}
                  </span>
                  <p className="text-xs text-theme-muted line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-theme-muted font-mono py-8 text-center">
              Aucun message de contact pour le moment.
            </p>
          )}
        </div>

        {/* System & Content Quick Status */}
        <div className="lg:col-span-5 bg-theme-card border border-theme p-6 rounded-2xl shadow-md space-y-6">
          <h3 className="font-heading font-bold text-lg text-theme-main flex items-center gap-2 border-b border-theme pb-3">
            <Activity className="w-5 h-5 text-theme-primary" /> État du Système CMS
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-theme-surface border border-theme text-xs font-mono">
              <span className="flex items-center gap-2 text-theme-main">
                <Database className="w-4 h-4 text-emerald-400" /> Base de Données
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                CONNECTÉ (Prisma)
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-theme-surface border border-theme text-xs font-mono">
              <span className="flex items-center gap-2 text-theme-main">
                <HardDrive className="w-4 h-4 text-cyan-400" /> Stockage Média
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                LOCAL / UPLOADS
              </span>
            </div>

            <div className="pt-4 border-t border-theme space-y-2">
              <span className="text-xs font-mono text-theme-muted block">Raccourcis d'édition :</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <Link
                  to="/admin/hero"
                  className="p-2.5 rounded-xl bg-theme-surface border border-theme hover:border-theme-primary text-theme-main text-center"
                >
                  Gérer Hero
                </Link>
                <Link
                  to="/admin/skills"
                  className="p-2.5 rounded-xl bg-theme-surface border border-theme hover:border-theme-primary text-theme-main text-center"
                >
                  Compétences
                </Link>
                <Link
                  to="/admin/experiences"
                  className="p-2.5 rounded-xl bg-theme-surface border border-theme hover:border-theme-primary text-theme-main text-center"
                >
                  Expériences
                </Link>
                <Link
                  to="/admin/media"
                  className="p-2.5 rounded-xl bg-theme-surface border border-theme hover:border-theme-primary text-theme-main text-center"
                >
                  Médiathèque
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
