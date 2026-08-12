# Exercice guidé nº2 — Rendre la section « Témoignages » administrable (CRUD complet)

> **Objectif** : ajouter un **back-office** pour gérer les témoignages depuis `/admin`, sans
> toucher au code : **créer, lire, modifier, supprimer** (le fameux **CRUD**), plus afficher/masquer.
>
> **Pré-requis** : avoir **terminé l'exercice nº1** (le modèle `Testimonial`, le seed, la route
> publique `GET /api/testimonials`, le type, `api.getTestimonials`, la section et le lien de menu
> doivent exister).
>
> **Durée** : ~60-75 min. **Concepts clés** : routes **protégées** (auth), CRUD, formulaire
> d'édition (modale), rafraîchissement de liste.

---

## C'est quoi le « CRUD » ?

| Lettre | Action | Verbe HTTP | Route |
|---|---|---|---|
| **C**reate | Créer | `POST` | `/api/testimonials` |
| **R**ead | Lire | `GET` | `/api/testimonials` (public) et `/api/testimonials/all` (admin) |
| **U**pdate | Modifier | `PUT` | `/api/testimonials/:id` |
| **D**elete | Supprimer | `DELETE` | `/api/testimonials/:id` |

Toutes les actions d'écriture (C/U/D) et la lecture « admin » seront **protégées** : il faudra être
**connecté en admin** (jeton JWT). C'est exactement le rôle des middlewares `authenticate` +
`requireAdmin` vus dans le `TUTORIEL.md` §2.4.

---

## Vue d'ensemble : les 4 parties

```
A. Backend  : routes protégées CRUD (testimonials.ts)
B. Pont     : 4 fonctions dans le client API (services/api.ts)
C. Frontend : la page d'admin (AdminTestimonials.tsx)
D. Branchement : route admin (App.tsx) + lien dans le menu admin (AdminLayout.tsx)
```

> 🧭 **Modèle à copier** : ce projet a déjà exactement ce pattern pour les Expériences. Garde
> ouverts `server/src/routes/experiences.ts` et `src/pages/admin/AdminExperiences.tsx` : tu verras
> qu'on fait la même chose, en plus simple (les témoignages n'ont pas de champs "liste").

---

## Partie A — Backend : les routes CRUD protégées

**Fichier :** `server/src/routes/testimonials.ts` (celui créé à l'exercice 1).

**A1.** En haut, ajoute l'import des middlewares de sécurité :
```ts
import { authenticate, requireAdmin } from '../middleware/auth.js';
```

**A2.** Ajoute ces **4 routes** (après ta route `GET '/'` existante, avant `export default router;`) :

```ts
// GET /api/testimonials/all  -> TOUS les témoignages (admin), y compris masqués
router.get('/all', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const all = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
    return res.json(all);
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des témoignages.' });
  }
});

// POST /api/testimonials  -> créer
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { author, role, company, message, rating, sortOrder, isVisible } = req.body;
    if (!author || !message) {
      return res.status(400).json({ error: "L'auteur et le message sont obligatoires." });
    }
    // on calcule le prochain ordre d'affichage
    const maxSort = await prisma.testimonial.aggregate({ _max: { sortOrder: true } });
    const nextOrder = sortOrder ?? ((maxSort._max.sortOrder || 0) + 1);

    const created = await prisma.testimonial.create({
      data: {
        author,
        role: role || null,
        company: company || null,
        message,
        rating: rating !== undefined ? Number(rating) : 5,
        sortOrder: nextOrder,
        isVisible: isVisible ?? true,
      },
    });
    return res.status(201).json(created);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du témoignage.' });
  }
});

// PUT /api/testimonials/:id  -> modifier (mise à jour PARTIELLE)
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { author, role, company, message, rating, sortOrder, isVisible } = req.body;

    // On ne met à jour QUE les champs réellement envoyés (les autres restent inchangés)
    const data: any = {};
    if (author !== undefined) data.author = author;
    if (role !== undefined) data.role = role;
    if (company !== undefined) data.company = company;
    if (message !== undefined) data.message = message;
    if (rating !== undefined) data.rating = Number(rating);
    if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
    if (isVisible !== undefined) data.isVisible = Boolean(isVisible);

    const updated = await prisma.testimonial.update({ where: { id }, data });
    return res.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification du témoignage.' });
  }
});

// DELETE /api/testimonials/:id  -> supprimer
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression du témoignage.' });
  }
});
```

**Ce que tu apprends (important) :**
- **Route protégée** = on met `authenticate, requireAdmin` **avant** la fonction. Sans jeton valide,
  la requête est bloquée (401/403) **avant** d'atteindre la base.
- **Deux lectures** : `GET '/'` (public, filtré `isVisible: true`, pour le site) et `GET '/all'`
  (admin, tout, pour la gestion). L'admin doit voir **aussi** les témoignages masqués.
- **Mise à jour partielle** : on ne remplit `data` qu'avec les champs envoyés. Ça permet à un simple
  bouton « afficher/masquer » d'envoyer **seulement** `{ isVisible: false }` sans écraser le reste.
  (C'est même plus propre que l'exemple des Expériences 😉.)
- `res.status(201)` = « créé », `res.status(400)` = donnée manquante.

✅ **Point de contrôle** : le serveur redémarre (il est en `tsx watch`). Ouvre dans le navigateur
**http://localhost:3000/api/testimonials/all** → tu dois recevoir une **erreur 401** (`Token manquant`).
👉 **C'est le comportement attendu** : la route est protégée, et tu n'es pas connecté dans le navigateur.
La route publique **http://localhost:3000/api/testimonials** doit, elle, continuer à répondre normalement.

---

## Partie B — Le pont : 4 fonctions dans le client API

**Fichier :** `src/services/api.ts`. Ajoute ces fonctions dans l'objet `api = { ... }` (à côté de
`getTestimonials` de l'exercice 1) :

```ts
  getAllTestimonials: async (): Promise<Testimonial[]> => {
    const res = await fetch(`${API_BASE}/testimonials/all`, {
      headers: { ...getAuthHeader() },           // envoie le jeton
    });
    return handleResponse<Testimonial[]>(res);
  },

  createTestimonial: async (data: Partial<Testimonial>): Promise<Testimonial> => {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Testimonial>(res);
  },

  updateTestimonial: async (id: string, data: Partial<Testimonial>): Promise<Testimonial> => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Testimonial>(res);
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    await handleResponse<{ success: boolean }>(res);
  },
```

**Ce que tu apprends :** `getAuthHeader()` ajoute l'en-tête `Authorization: Bearer <jeton>` (le jeton
est stocké dans le navigateur après le login). C'est ce qui **prouve** au backend que tu es admin.
Remarque le `method:` qui change (`POST`/`PUT`/`DELETE`) et le `body` en JSON pour créer/modifier.

✅ **Point de contrôle** : `npm run lint` passe.

---

## Partie C — Le frontend : la page d'administration

**Nouveau fichier :** `src/pages/admin/AdminTestimonials.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Testimonial } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Edit2, Eye, EyeOff, Quote, Star } from 'lucide-react';

export const AdminTestimonials: React.FC = () => {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // état du formulaire (null = fermé)
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const data = await api.getAllTestimonials();   // liste ADMIN (tout)
      setTestimonials(data || []);
    } catch (err) {
      showToast('Erreur lors du chargement des témoignages.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (t?: Testimonial) => {
    // avec un témoignage -> édition ; sans -> création (valeurs par défaut)
    setEditing(t ? { ...t } : {
      author: '', role: '', company: '', message: '',
      rating: 5, isVisible: true, sortOrder: testimonials.length + 1,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.author || !editing?.message) {
      showToast("L'auteur et le message sont requis.", 'error');
      return;
    }
    try {
      if (editing.id) {
        await api.updateTestimonial(editing.id, editing);  // U : modifier
        showToast('Témoignage mis à jour.', 'success');
      } else {
        await api.createTestimonial(editing);              // C : créer
        showToast('Témoignage créé.', 'success');
      }
      setShowModal(false);
      setEditing(null);
      fetchData();                                          // R : on recharge la liste
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce témoignage ?')) return;
    try {
      await api.deleteTestimonial(id);                      // D : supprimer
      showToast('Témoignage supprimé.', 'success');
      fetchData();
    } catch {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleToggle = async (t: Testimonial) => {
    try {
      await api.updateTestimonial(t.id, { isVisible: !t.isVisible }); // maj partielle
      fetchData();
    } catch {
      showToast('Erreur de visibilité.', 'error');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center font-mono text-xs text-theme-muted">Chargement...</div>;
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* En-tête + bouton "Nouveau" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-theme-main">Témoignages</h1>
          <p className="text-xs text-theme-muted font-mono">Gérez les avis affichés sur le site public.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 font-bold font-heading text-xs shadow-md"
        >
          <Plus className="w-4 h-4" /> Nouveau témoignage
        </button>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {testimonials.length === 0 && (
          <p className="text-sm text-theme-muted font-mono">Aucun témoignage pour l'instant.</p>
        )}

        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`p-6 rounded-2xl border transition-all ${
              t.isVisible ? 'bg-theme-card border-theme shadow-md' : 'bg-theme-surface/30 border-theme/40 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <Quote className="w-6 h-6 text-[#f38038] mb-2" />
                <p className="text-sm text-theme-muted leading-relaxed mb-3">{t.message}</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-[#f38038] fill-[#f38038]' : 'text-theme-muted'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-theme-main font-heading">{t.author}</span>
                {(t.role || t.company) && (
                  <span className="text-xs text-theme-muted"> — {[t.role, t.company].filter(Boolean).join(' · ')}</span>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(t)} className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-main" title="Afficher/Masquer">
                  {t.isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                </button>
                <button onClick={() => handleOpenModal(t)} className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-theme-primary" title="Modifier">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg border border-theme text-theme-muted hover:text-rose-400" title="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modale de création/édition */}
      {showModal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="bg-theme-card border border-theme max-w-lg w-full p-6 sm:p-8 rounded-2xl space-y-4 shadow-2xl text-left my-8">
            <h3 className="text-xl font-bold font-heading text-theme-main">
              {editing.id ? 'Modifier le témoignage' : 'Nouveau témoignage'}
            </h3>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">AUTEUR *</label>
              <input type="text" required value={editing.author || ''}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">RÔLE</label>
                <input type="text" value={editing.role || ''}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">ENTREPRISE</label>
                <input type="text" value={editing.company || ''}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">MESSAGE *</label>
              <textarea rows={4} required value={editing.message || ''}
                onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm" />
            </div>

            <div className="flex items-center gap-6">
              <div>
                <label className="block text-xs font-mono font-semibold text-theme-main mb-1.5">NOTE</label>
                <select value={editing.rating ?? 5}
                  onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                  className="px-4 py-2.5 rounded-xl bg-theme-surface border border-theme text-theme-main text-sm">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 mt-5 cursor-pointer">
                <input type="checkbox" checked={editing.isVisible ?? true}
                  onChange={(e) => setEditing({ ...editing, isVisible: e.target.checked })}
                  className="rounded text-theme-primary focus:ring-0" />
                <span className="text-xs font-mono font-semibold text-theme-main">Visible sur le site</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme">
              <button type="button" onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-theme-surface border border-theme text-xs font-semibold text-theme-main">
                Annuler
              </button>
              <button type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#36E0C2] to-[#29B6E6] text-slate-950 text-xs font-bold font-heading">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
```

**Ce que tu apprends :**
- **Un seul formulaire** sert à créer ET modifier : s'il y a `editing.id`, c'est une modification,
  sinon une création. Malin et courant.
- **Le pattern "recharger après action"** : après create/update/delete, on rappelle `fetchData()`
  pour resynchroniser la liste avec la base. Simple et robuste pour débuter.
- **`useToast`** pour le retour visuel (succès/erreur), **`window.confirm`** pour sécuriser la suppression.
- On réutilise **les mêmes classes** que les autres pages admin → cohérence immédiate.

✅ **Point de contrôle** : `npm run lint` passe (le fichier compile sans erreur de type).

---

## Partie D — Brancher la page dans l'admin

**D1. La route** — `src/App.tsx`
1. Importe la page (avec les autres imports admin) :
   ```tsx
   import { AdminTestimonials } from './pages/admin/AdminTestimonials';
   ```
2. Ajoute la route **à l'intérieur** du bloc `<Route path="/admin" element={<AdminLayout />}>`
   (par ex. juste après la ligne `messages`) :
   ```tsx
   <Route path="testimonials" element={<AdminTestimonials />} />
   ```

**D2. Le lien du menu admin** — `src/layouts/AdminLayout.tsx`
1. Ajoute `Quote` à l'import des icônes lucide en haut du fichier (à côté de `MessageSquare`, etc.).
2. Dans le tableau `navItems`, ajoute une entrée (par ex. après « Formations ») :
   ```tsx
   { label: 'Témoignages', path: '/admin/testimonials', icon: Quote },
   ```

✅ **Point de contrôle final (le grand test !)** :
1. `npm run dev` si besoin, puis va sur **http://localhost:3000/admin/user** et connecte-toi.
2. Dans le menu de gauche, clique **« Témoignages »** → tu vois la liste (tes 3 témoignages du seed).
3. **Créer** : clique « Nouveau témoignage », remplis, Enregistrer → il apparaît dans la liste.
4. **Modifier** : clique le crayon, change le texte, Enregistrer → mis à jour.
5. **Masquer** : clique l'œil → le témoignage devient grisé (masqué).
6. **Supprimer** : clique la corbeille → confirme → il disparaît.
7. Va sur **http://localhost:3000/** (site public) → tes changements sont visibles (et les masqués n'apparaissent pas). 🎉

**Bravo — tu as construit un back-office CRUD complet, protégé par authentification !**

---

## Le cycle CRUD, vu de haut

```
[Page admin React] --(clic "Enregistrer")--> api.createTestimonial(data)
       │                                             │  (ajoute le jeton Bearer)
       │                                             ▼
       │                          POST /api/testimonials  ── authenticate ─ requireAdmin ─┐
       │                                                                                   ▼
       │                                                                     prisma.testimonial.create()
       │                                             ┌───────────── réponse JSON ──────────┘
       ▼                                             ▼
   fetchData()  ◀── met à jour la liste ── api.getAllTestimonials()
```

C'est le **même cycle** que le `TUTORIEL.md` §4, avec en plus la **couche de sécurité** (jeton +
middlewares) sur les actions d'écriture.

---

## Dépannage

| Problème | Cause / solution |
|---|---|
| `/api/testimonials/all` renvoie 401 dans le navigateur | **Normal** hors admin : la route est protégée. Depuis la page admin (connecté), l'appel envoie le jeton. |
| La page admin est vide / erreur au chargement | Vérifie que `getAllTestimonials` appelle bien `/testimonials/all` **avec** `getAuthHeader()`. |
| « Enregistrer » ne fait rien | Ouvre la console (F12) : erreur 400 = champ requis manquant ; 401/403 = pas connecté (reconnecte-toi). |
| Le lien « Témoignages » n'apparaît pas dans le menu | Import `Quote` manquant dans `AdminLayout.tsx`, ou entrée pas ajoutée à `navItems`. |
| La page `/admin/testimonials` renvoie à l'accueil | Route pas ajoutée dans `App.tsx` **à l'intérieur** du bloc `AdminLayout`. |
| `rating` devient bizarre après un toggle visibilité | Tu as bien utilisé la **mise à jour partielle** (le `if (x !== undefined)`) côté backend ? |

---

## Bonus — pour aller plus loin

1. **Réordonner** (flèches ↑/↓) : ajoute une route `PUT /api/testimonials/reorder` (copie
   `experiences.ts`) + `api.reorderTestimonials` + les boutons `ArrowUp/ArrowDown` (copie
   `AdminExperiences.tsx`, fonction `handleMoveOrder`).
2. **Photo de l'auteur** : ajoute `avatarUrl String?` au modèle, un `<MediaUploader>` dans la modale
   (comme `AdminAbout.tsx`), et un rond avatar dans la carte publique.
3. **Confirmation stylée** : remplace `window.confirm` par une petite modale de confirmation maison.
4. **Compteur au dashboard** : affiche le nombre de témoignages sur `/admin` (page `AdminDashboard`).

---

## Récap des fichiers touchés
`server/src/routes/testimonials.ts` *(complété)*, `src/services/api.ts`,
`src/pages/admin/AdminTestimonials.tsx` *(nouveau)*, `src/App.tsx`, `src/layouts/AdminLayout.tsx`.

Tu maîtrises maintenant **le pattern le plus important d'une app de gestion** : un CRUD protégé,
de la base jusqu'à l'interface. Tu peux le **répliquer pour n'importe quelle entité** (services,
certifications, articles de blog…). 🚀
