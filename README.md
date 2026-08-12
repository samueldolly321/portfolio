# Portfolio — Samuel Andrianirina

Portfolio one-page **administrable** (CMS intégré) construit en React + TypeScript, avec un back-end Express et une base de données Prisma/SQLite. Tout le contenu du site public (hero, à propos, compétences, expériences, formations, projets, messages de contact) est éditable depuis un espace d'administration protégé, sans toucher au code.

## Stack

- **Front-end :** React 19, React Router 7, Tailwind CSS 4, Vite 6, lucide-react, motion
- **Back-end :** Express 4, JWT (auth), bcryptjs, multer (upload de médias)
- **Base de données :** Prisma 6 + SQLite (`dev.db`) — remplaçable par PostgreSQL via `DATABASE_URL`
- **Serveur :** `server.ts` sert l'API `/api/*` et le front (Vite en dev, `dist/` en prod) sur le port 3000

## Démarrage local

Prérequis : Node.js 20+.

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement (voir .env.example)
#    Éditez .env : JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 3. Créer la base et générer le client Prisma
npm run prisma:generate
npm run prisma:push

# 4. Injecter les données initiales (admin + contenu de démonstration)
npm run db:seed

# 5. Lancer en développement
npm run dev
```

Le site est alors disponible sur **http://localhost:3000** :

- Portfolio public : `/`
- Administration : `/admin/login`

Identifiants admin : ceux définis dans `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Serveur de développement (API + front avec HMR) |
| `npm run build` | Build de production (front `dist/` + `dist/server.cjs`) |
| `npm run start` | Démarre le serveur de production (`NODE_ENV=production`) |
| `npm run lint` | Vérification TypeScript (`tsc --noEmit`) |
| `npm run prisma:push` | Applique le schéma Prisma à la base |
| `npm run db:seed` | Injecte les données initiales |

## Administration (CMS)

Une fois connecté sur `/admin`, vous pouvez gérer :

- **Profil & Bio** — coordonnées, réseaux sociaux, photo
- **Section Hero** — titre, badge, CTA, technologies, image
- **À Propos & Stats** — texte de présentation et statistiques
- **Compétences** — par catégorie, avec niveau et visibilité
- **Expériences** — parcours professionnel (ordre, visibilité)
- **Formations** — cursus académique
- **Projets** — cartes projet, galerie, technologies, mise en avant
- **Médiathèque** — upload et gestion des images (stockées dans `/uploads`)
- **Messages** — messages reçus via le formulaire de contact

## Déploiement

1. Renseignez un `JWT_SECRET` fort et un `ADMIN_PASSWORD` robuste dans l'environnement de production.
2. (Optionnel) Basculez `DATABASE_URL` vers PostgreSQL et adaptez `provider` dans `prisma/schema.prisma`.
3. `npm run build` puis `npm run start`.

> ⚠️ Le dossier `uploads/` (médias) et la base SQLite doivent être persistés entre les déploiements.
