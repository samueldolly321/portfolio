import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ContactMessage } from '../../types';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Mail, Trash2, CheckCircle2, Archive, Eye, Calendar, User } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'READ' | 'ARCHIVED'>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data || []);
    } catch (err) {
      showToast('Erreur lors du chargement des messages.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'UNREAD' | 'READ' | 'ARCHIVED') => {
    try {
      await api.updateMessageStatus(id, status);
      showToast('Statut du message mis à jour.', 'success');
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      showToast('Erreur de mise à jour.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer ce message ?')) return;
    try {
      await api.deleteMessage(id);
      showToast('Message supprimé.', 'success');
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (activeFilter === 'ALL') return true;
    return m.status === activeFilter;
  });

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-heading text-theme-main">Messages de Contact</h1>
        <p className="text-xs text-theme-muted font-mono">
          Consultez et gérez les demandes envoyées depuis le formulaire public.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-theme pb-4">
        {(['ALL', 'UNREAD', 'READ', 'ARCHIVED'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeFilter === filter
                ? 'bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold shadow-xs'
                : 'bg-theme-surface text-theme-muted border border-theme'
            }`}
          >
            {filter === 'ALL' && 'TOUS LES MESSAGES'}
            {filter === 'UNREAD' && 'NON LUS'}
            {filter === 'READ' && 'LUS'}
            {filter === 'ARCHIVED' && 'ARCHIVÉS'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List Column */}
        <div className="lg:col-span-5 space-y-3">
          {filteredMessages.length === 0 ? (
            <p className="py-12 text-center text-xs font-mono text-theme-muted bg-theme-card border border-theme rounded-2xl">
              Aucun message dans ce dossier.
            </p>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'UNREAD') {
                    handleUpdateStatus(msg.id, 'READ');
                  }
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'bg-theme-surface border-theme-primary shadow-md'
                    : msg.status === 'UNREAD'
                    ? 'bg-theme-card border-theme-primary/50'
                    : 'bg-theme-card/60 border-theme/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold font-heading text-sm text-theme-main truncate">{msg.name}</span>
                  <span className="text-[10px] font-mono text-theme-muted shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <span className="text-xs font-semibold text-theme-primary block truncate mb-1">
                  {msg.subject || 'Sujet non spécifié'}
                </span>
                <p className="text-xs text-theme-muted line-clamp-2">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Reader Column */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="bg-theme-card border border-theme p-6 sm:p-8 rounded-2xl shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-theme pb-4">
                <div>
                  <span className="text-xs font-mono text-theme-primary font-bold block mb-1">
                    {selectedMessage.subject || 'Demande de contact'}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-theme-main flex items-center gap-2">
                    <User className="w-5 h-5 text-theme-muted" /> {selectedMessage.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="p-2 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 text-xs font-bold font-heading flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" /> Répondre
                  </a>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl border border-theme text-theme-muted hover:text-rose-400"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-theme-surface border border-theme space-y-2 text-xs font-mono">
                <div><span className="text-theme-muted">De :</span> <span className="text-theme-main">{selectedMessage.name} &lt;{selectedMessage.email}&gt;</span></div>
                <div><span className="text-theme-muted">Date :</span> <span className="text-theme-main">{new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</span></div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-theme-muted uppercase">Message :</span>
                <p className="text-sm text-theme-main leading-relaxed whitespace-pre-line p-4 rounded-xl bg-theme-surface/40 border border-theme/60">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-theme text-xs font-mono">
                <span className="text-theme-muted">Changer le statut :</span>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'UNREAD')}
                  className={`px-3 py-1 rounded-lg border ${selectedMessage.status === 'UNREAD' ? 'border-theme-primary text-theme-primary font-bold' : 'border-theme text-theme-muted'}`}
                >
                  Non Lu
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'READ')}
                  className={`px-3 py-1 rounded-lg border ${selectedMessage.status === 'READ' ? 'border-theme-primary text-theme-primary font-bold' : 'border-theme text-theme-muted'}`}
                >
                  Lu
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'ARCHIVED')}
                  className={`px-3 py-1 rounded-lg border ${selectedMessage.status === 'ARCHIVED' ? 'border-theme-primary text-theme-primary font-bold' : 'border-theme text-theme-muted'}`}
                >
                  Archiver
                </button>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs font-mono text-theme-muted bg-theme-card border border-theme rounded-2xl">
              Sélectionnez un message dans la liste pour lire son contenu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
