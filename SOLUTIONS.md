# Branche `solutions` — corrigé des 4 exercices

Cette branche contient **le résultat fini** des 4 exercices guidés appliqués au projet. Elle sert de
**corrigé** : tu peux l'exécuter pour voir le résultat, et la comparer avec ton propre travail.

> ⚠️ La branche `main` (et le site en ligne) **ne sont pas affectés** : Render ne déploie que `main`.

## Ce qui est appliqué ici

| Exercice | Fonctionnalité | Fichiers principaux |
|---|---|---|
| **1** | Section **Témoignages** (pilotée par la base) | `prisma/schema.prisma`, `prisma/seed.ts`, `server/src/routes/testimonials.ts`, `src/types/index.ts`, `src/services/api.ts`, `src/sections/TestimonialsSection.tsx`, `src/pages/PortfolioPage.tsx`, `src/components/Navbar.tsx` |
| **2** | **Admin CRUD** des témoignages | `server/src/routes/testimonials.ts` (routes protégées), `src/services/api.ts`, `src/pages/admin/AdminTestimonials.tsx`, `src/App.tsx`, `src/layouts/AdminLayout.tsx` |
| **3** | Section **Compétences** branchée sur la base | `src/sections/SkillsSection.tsx` (réécrite) |
| **4** | **Recherche + filtre** sur les Projets | `src/sections/ProjectsSection.tsx` |

## Lancer le corrigé

```powershell
git checkout solutions
npm install
npm run prisma:generate
npm run prisma:push      # ajoute la table Testimonial à dev.db
npm run db:seed          # ajoute 3 témoignages d'exemple
npm run dev              # http://localhost:3000
```

À voir :
- **Accueil** : nouvelle section « Témoignages », Compétences affichées depuis la base (8 catégories),
  barre de recherche + filtres sur les Projets.
- **Admin** (`/admin/user` puis menu « Témoignages ») : créer / modifier / masquer / supprimer.

## Comparer avec ton travail

```powershell
git diff main solutions                       # tout le diff
git diff main solutions -- src/sections/ProjectsSection.tsx   # un fichier précis
```

## Revenir à la branche principale

```powershell
git checkout main
```

> Après un aller-retour sur `main`, si tu relances l'app, tu peux refaire `npm run prisma:push`
> pour resynchroniser `dev.db` avec le schéma de la branche courante.
