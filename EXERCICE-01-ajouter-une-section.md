# Exercice guidé nº1 — Ajouter une section « Témoignages » (de A à Z)

> **Objectif pédagogique** : ajouter une **vraie fonctionnalité full-stack**, piloté par la base
> de données, en traversant **toutes les couches** :
> **base (Prisma) → seed → route API (Express) → client API → composant React → page**.
>
> **Durée** : ~45-60 min. **Pré-requis** : avoir lu `TUTORIEL.md`.
>
> **Règle du jeu** : essaie d'écrire chaque étape **toi-même** d'abord, puis compare avec la
> solution fournie. Après chaque étape, il y a un ✅ **Point de contrôle** pour vérifier.

À la fin, ton portfolio aura une nouvelle section « Témoignages » avec des cartes (avis, étoiles,
auteur), animées au scroll, et un lien dans le menu.

---

## Vue d'ensemble : les 8 étapes

```
1. Modèle en base (schema.prisma)      ─┐  LE BACKEND / DONNÉES
2. Appliquer à la base (2 commandes)    │
3. Données de départ (seed.ts)          │
4. Route API (testimonials.ts + server) ─┘
5. Le type TypeScript (types/index.ts)  ─┐  LE PONT
6. Le client API (services/api.ts)      ─┘
7. Le composant React (TestimonialsSection.tsx) ─┐  LE FRONTEND
8. Brancher dans la page + le menu               ─┘
```

> ℹ️ On ne touche **pas** à ta base existante : ajouter une table est **additif** (aucune donnée
> perdue). Tu fais tout ça **en local** ; tu ne pousses en ligne que si le résultat te plaît.

---

## Étape 1 — Créer le modèle en base de données

**Fichier :** `prisma/schema.prisma`
**But :** décrire la nouvelle table `Testimonial`.

Ajoute ce bloc **à la fin** du fichier (après le dernier `model`) :

```prisma
model Testimonial {
  id        String   @id @default(uuid())
  author    String
  role      String?
  company   String?
  message   String
  rating    Int      @default(5)
  sortOrder Int      @default(0)
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Ce que tu apprends :** un `model` = une table. `?` = champ **optionnel**. `@default(...)` = valeur
par défaut. On reprend exactement les conventions des autres modèles (`sortOrder`, `isVisible`).

✅ **Point de contrôle** : le fichier est enregistré, pas d'erreur de syntaxe (les accolades sont bien fermées).

---

## Étape 2 — Appliquer le modèle à la base

**Dans le terminal, à la racine du projet :**

```powershell
npm run prisma:generate   # régénère le client Prisma (pour connaître prisma.testimonial)
npm run prisma:push       # crée la table dans dev.db
```

**Ce que tu apprends :** modifier `schema.prisma` ne suffit pas — il faut **régénérer le client**
(pour que `prisma.testimonial` existe en JS) et **pousser** le schéma vers la vraie base.

✅ **Point de contrôle** : la commande `prisma:push` affiche *« Your database is now in sync with
your Prisma schema »*. (Si `dev.db` n'existait pas, elle le crée.)

---

## Étape 3 — Ajouter des données de départ (seed)

**Fichier :** `prisma/seed.ts`
**But :** insérer 3 témoignages d'exemple.

Juste **avant** la ligne finale `console.log('🎉 Database seeding completed successfully!');`,
ajoute :

```ts
  // 10. Testimonials
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          author: 'Jean Rakoto',
          role: 'Chef de projet',
          company: 'Cliken-web',
          message: "Samuel livre un travail soigné et fiable. Il comprend le besoin métier et propose toujours des solutions pertinentes.",
          rating: 5,
          sortOrder: 1,
        },
        {
          author: 'Marie Rasoa',
          role: 'Fondatrice',
          company: 'Startup locale',
          message: "Réactif, rigoureux et de bon conseil. Notre application a été livrée dans les temps et sans accroc.",
          rating: 5,
          sortOrder: 2,
        },
        {
          author: 'Paul Andria',
          role: 'CTO',
          company: 'Agence web',
          message: "Un vrai développeur full-stack : à l'aise du front au back, jusqu'à la mise en production.",
          rating: 4,
          sortOrder: 3,
        },
      ],
    });
    console.log('✅ Testimonials seeded');
  }
```

Puis lance le seed :

```powershell
npm run db:seed
```

**Ce que tu apprends :** le `if (count === 0)` rend le seed **idempotent** (il n'insère qu'une fois).
`createMany` insère plusieurs lignes d'un coup.

✅ **Point de contrôle** : le terminal affiche `✅ Testimonials seeded`.

---

## Étape 4 — Créer la route API

**4a. Nouveau fichier :** `server/src/routes/testimonials.ts`

```ts
import { Router, Request, Response } from 'express';
import prisma from '../db.js';

const router = Router();

// GET /api/testimonials  -> liste publique des témoignages visibles
router.get('/', async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });
    return res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des témoignages.' });
  }
});

export default router;
```

> ⚠️ **Détail important** : l'import est `'../db.js'` (avec `.js`), pas `.ts`. C'est la convention
> de ce projet (modules ES). Respecte-la, sinon erreur au démarrage.

**4b. Brancher la route** dans `server.ts` :

1. En haut, avec les autres imports de routes, ajoute :
   ```ts
   import testimonialsRoutes from './server/src/routes/testimonials.js';
   ```
2. Plus bas, avec les autres `app.use('/api/...')`, ajoute :
   ```ts
   app.use('/api/testimonials', testimonialsRoutes);
   ```

**Ce que tu apprends :** un fichier de routes = un « domaine ». On le **branche** sur un préfixe
d'URL. Ta route `GET '/'` devient donc accessible à `GET /api/testimonials`.

✅ **Point de contrôle** : le serveur tourne (`npm run dev`). Ouvre dans le navigateur
**http://localhost:3000/api/testimonials** → tu dois voir un **tableau JSON** avec tes 3 témoignages.
> Si le serveur ne s'était pas rechargé : il est en `tsx watch`, il redémarre seul ; sinon relance `npm run dev`.

---

## Étape 5 — Déclarer le type TypeScript

**Fichier :** `src/types/index.ts`
**But :** décrire la forme d'un témoignage côté frontend (pour l'autocomplétion et la sécurité de type).

Ajoute (par exemple à la fin du fichier) :

```ts
export interface Testimonial {
  id: string;
  author: string;
  role?: string | null;
  company?: string | null;
  message: string;
  rating: number;
  sortOrder?: number;
  isVisible?: boolean;
}
```

**Ce que tu apprends :** le type miroir du modèle Prisma. `?` = optionnel, `| null` = peut être nul.

✅ **Point de contrôle** : pas d'erreur TypeScript (`npm run lint` doit passer).

---

## Étape 6 — Ajouter la fonction au client API

**Fichier :** `src/services/api.ts`

1. En haut, ajoute `Testimonial` à la liste des types importés (dans le `import { ... } from '../types'`).
2. Dans l'objet `api = { ... }`, ajoute une fonction (à côté de `getProjects`, par exemple) :

```ts
  getTestimonials: async (): Promise<Testimonial[]> => {
    const res = await fetch(`${API_BASE}/testimonials`);
    return handleResponse<Testimonial[]>(res);
  },
```

**Ce que tu apprends :** à chaque route backend correspond **une fonction** dans le client API.
`API_BASE` vaut `/api`, donc l'appel vise `/api/testimonials`.

✅ **Point de contrôle** : `npm run lint` passe toujours.

---

## Étape 7 — Créer le composant React de la section

**Nouveau fichier :** `src/sections/TestimonialsSection.tsx`

```tsx
import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Testimonial } from '../types';
import { Reveal } from '../components/Reveal';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  // Si aucune donnée, on n'affiche rien (section masquée)
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête (même style que les autres sections) */}
        <Reveal direction="top">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              Témoignages
            </h2>
            <p className="mt-2 text-theme-muted text-sm sm:text-base max-w-2xl">
              Ce que mes clients et collaborateurs disent de mon travail.
            </p>
          </div>
        </Reveal>

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Reveal key={t.id} direction="up" delay={idx * 120}>
              <div className="h-full bg-theme-card border border-theme rounded-2xl p-6 sm:p-7 shadow-xl hover:border-[#f38038]/50 transition-all duration-300 flex flex-col">
                <Quote className="w-8 h-8 text-[#f38038] mb-4" />

                <p className="text-theme-muted text-sm sm:text-base leading-relaxed flex-1">
                  {t.message}
                </p>

                {/* Étoiles */}
                <div className="flex items-center gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'text-[#f38038] fill-[#f38038]' : 'text-theme-muted'}`}
                    />
                  ))}
                </div>

                {/* Auteur */}
                <div className="mt-4 pt-4 border-t border-theme">
                  <span className="block text-sm font-bold text-theme-main font-heading">{t.author}</span>
                  {(t.role || t.company) && (
                    <span className="block text-xs text-theme-muted">
                      {[t.role, t.company].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
```

**Ce que tu apprends beaucoup ici :**
- **`props`** : le composant reçoit `testimonials` de son parent.
- **`.map(...)`** : transformer un tableau de données en un tableau de cartes JSX. Le **`key`** unique
  (`t.id`) aide React à suivre chaque élément.
- **Affichage conditionnel** : `if (... ) return null` (rien si vide), et `{condition && <jsx/>}`.
- **Réutilisation** : on réemploie le composant `Reveal` (animation) et les classes de thème
  (`bg-theme-card`, `text-gradient-h2`) → cohérence visuelle gratuite.
- **Astuce étoiles** : `Array.from({ length: 5 })` crée 5 cases ; on compare l'index au `rating`.

✅ **Point de contrôle** : `npm run lint` passe.

---

## Étape 8 — Brancher la section dans la page et le menu

**8a. La page** — `src/pages/PortfolioPage.tsx` (3 petits ajouts) :

1. **Importer** le composant et le type :
   ```tsx
   import { TestimonialsSection } from '../sections/TestimonialsSection';
   // et ajoute "Testimonial" dans l'import de types existant
   ```
2. **Ajouter un état** (à côté des autres `useState`) :
   ```tsx
   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
   ```
3. **Charger les données** : dans le `Promise.all([...])`, ajoute `api.getTestimonials()`
   à la liste, récupère le résultat, et fais `setTestimonials(...)`. Exemple :
   ```tsx
   const [ /* ...les autres... */, testiData ] = await Promise.all([
     /* ...les autres appels... */,
     api.getTestimonials(),
   ]);
   setTestimonials(testiData || []);
   ```
4. **Afficher** la section dans le `return`, par exemple après `<ProjectsSection ... />` :
   ```tsx
   <TestimonialsSection testimonials={testimonials} />
   ```

**8b. Le menu** — `src/components/Navbar.tsx` : ajoute une entrée dans le tableau `navLinks` :
```tsx
{ label: 'Témoignages', href: '#testimonials' },
```
(le `href="#testimonials"` correspond au `id="testimonials"` de ta `<section>` → clic = défilement vers la section.)

✅ **Point de contrôle final** :
1. `npm run dev` (s'il ne tourne pas déjà).
2. Ouvre **http://localhost:3000/** → tu vois la section **Témoignages** avec 3 cartes animées.
3. Clique **« Témoignages »** dans le menu → la page défile jusqu'à la section.
4. `npm run lint` passe sans erreur.

🎉 **Bravo, tu viens d'ajouter une fonctionnalité full-stack complète !**

---

## Dépannage (si ça coince)

| Problème | Cause probable / solution |
|---|---|
| `/api/testimonials` renvoie une erreur / 404 | La route n'est pas branchée dans `server.ts` (import + `app.use`), ou serveur pas redémarré. |
| `Cannot find module '../db.js'` | Import mal écrit — garde bien l'extension **`.js`**. |
| `prisma.testimonial is undefined` | Tu as oublié `npm run prisma:generate` après avoir modifié le schéma. |
| La section est vide | La table est vide → relance `npm run db:seed`. Ou tu as filtré `isVisible: true` alors que les données sont `false`. |
| Erreur TypeScript sur `Testimonial` | Type non exporté dans `types/index.ts`, ou pas importé là où tu l'utilises. |
| Rien ne s'affiche + erreur console | Ouvre les **DevTools** du navigateur (F12) → onglet Console/Network pour voir l'erreur exacte. |

---

## Bonus — pour aller plus loin (facultatif)

Quand la base fonctionne, essaie **par toi-même** (tu as tous les modèles dans le projet) :

1. **Rendre la section administrable** : crée `POST/PUT/DELETE /api/testimonials` (protégés par
   `authenticate, requireAdmin`, comme `projects.ts`), une page `AdminTestimonials.tsx` et une route
   dans `App.tsx` + un lien dans `AdminLayout.tsx`. → tu ajoutes un **CRUD complet**.
2. **Ajouter une photo** : ajoute `avatarUrl String?` au modèle et affiche un rond avatar dans la carte.
3. **Trier / limiter** : n'afficher que les témoignages 5 étoiles, ou les 6 plus récents.
4. **Figer dans le seed pour la prod** : une fois satisfait, ce contenu est déjà dans `seed.ts` → un
   `git push` le déploiera (rappel : en ligne, le seed est la source de vérité).

---

## Annuler l'exercice (si tu veux repartir propre)

Comme tout est suivi par Git, tu peux tout annuler d'un coup **si tu n'as pas encore committé** :
```powershell
git status                 # voir ce qui a changé
git restore .              # annuler les modifs de fichiers suivis
# (supprime à la main les nouveaux fichiers non suivis : testimonials.ts, TestimonialsSection.tsx)
```
Pour la base, tu peux supprimer la table en retirant le modèle du schéma puis `npm run prisma:push`,
ou simplement laisser la table (sans conséquence).

---

**Récap des fichiers touchés** :
`prisma/schema.prisma`, `prisma/seed.ts`, `server/src/routes/testimonials.ts` *(nouveau)*, `server.ts`,
`src/types/index.ts`, `src/services/api.ts`, `src/sections/TestimonialsSection.tsx` *(nouveau)*,
`src/pages/PortfolioPage.tsx`, `src/components/Navbar.tsx`.

Tu retrouves **exactement** le cycle du `TUTORIEL.md` §4 : base → API → client → composant → page. 💪
