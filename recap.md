# Récapitulatif — Portfolio Samuel Andrianirina

Portfolio **one-page** en React, **entièrement administrable** via un CMS intégré (aucune modification de code nécessaire pour changer le contenu).

---

## 1. Stack technique

| Domaine | Technologies |
| --- | --- |
| **Front-end** | React 19, React Router 7, Tailwind CSS 4, Vite 6, lucide-react |
| **Back-end** | Express 4, JWT (authentification), bcryptjs, multer (upload) |
| **Base de données** | Prisma 6 + SQLite (`dev.db`) — remplaçable par PostgreSQL |
| **Serveur** | `server.ts` sert l'API `/api/*` **et** le front sur le port **3000** |

---

## 2. Démarrage

```bash
npm install                 # dépendances
npm run prisma:generate     # client Prisma
npm run prisma:push         # crée / met à jour la base
npm run db:seed             # données initiales (admin + contenu)
npm run dev                 # lance le site (http://localhost:3000)
```

- **Site public** : http://localhost:3000/
- **Administration** : http://localhost:3000/admin/user
- **Identifiants** (définis dans `.env`) :
  - **Email** : `hariniainasamuelandrianirina@gmail.com`
  - **Mot de passe** : `mdpportfolio123` *(⚠️ à ne pas partager ; changer aussi `JWT_SECRET` avant la mise en production)*

Autres scripts : `npm run build` (production), `npm run start` (prod), `npm run lint` (typecheck).

---

## 3. Sections du site public

1. **Hero** — titre, badge, CTA, technologies, photo (fondu gauche/droite)
2. **À Propos** — 2 paragraphes côte à côte + 3 chiffres clés + bouton **Télécharger mon CV**
3. **Compétences Techniques** — 4 colonnes : Front-end, Back-end, Data & Outils, Design
4. **Expérience Professionnelle** — timeline
5. **Formation** — cartes
6. **Projets Récents** — 6 projets (cartes cliquables + modale détail)
7. **Contact** — coordonnées + formulaire fonctionnel
8. **Footer**

---

## 4. Administration (CMS)

Accessible sur `/admin`. Sections gérables :

- **Profil & Bio** — coordonnées, réseaux, **photo (upload depuis l'ordinateur)**
- **Section Hero** — titre, badge, CTA, technologies
- **À Propos & Stats** — texte de présentation, statistiques, **upload du CV (PDF)**
- **Compétences** *(voir note plus bas)*
- **Expériences**, **Formations**, **Projets** (CRUD complet)
- **Médiathèque** — gestion des fichiers uploadés (`/uploads`)
- **Messages** — messages reçus via le formulaire de contact

---

## 5. Historique des modifications réalisées

### Mise en route
- Installation, création de la base, seed, correction d'une base SQLite corrompue.
- Vérification complète (API, auth, front) : site fonctionnel de bout en bout.

### Personnalisation
- **Titre du site** → « Portfolio - Samuel » (+ `lang="fr"`).
- **Menu** : police portée à `1rem` ; **suppression de tous les liens admin** (navbar + footer).
- **Sécurité** : retrait de l'affichage des identifiants admin en clair sur la page de login.
- **Photo de profil** : champ URL remplacé par un **upload depuis l'ordinateur** (glisser-déposer).
- **Section À Propos** : 2 paragraphes **en ligne** (côte à côte), 3 blocs chiffres **en colonnes**.
  - Le texte de présentation est désormais **éditable dans l'admin** → *À Propos & Stats → « Texte Parcours & Philosophie »* (séparer les 2 paragraphes par une ligne vide).
- **Projets** : ajout du projet **Gestion d'école** (React, Node.js, PostgreSQL) + fallback d'image robuste.
- **Formulaire de contact** : rendu réellement fonctionnel (vraie gestion succès/erreur).
- **Titres de section (h2)** : dégradé violet → rose (`#8b2b9e` → `#d73f73`).
- **Bouton « Télécharger mon CV »** dans À Propos, avec **upload du CV en PDF depuis l'admin**.

### Compétences
- **Data & Outils** : retrait de *Docker* ; ajout de **XAMPP, VS Code, Local WP, FTP**.
- Nouveau bloc **Design** : **Photoshop, Figma, Canva**.

### Animations
- Composant réutilisable **`Reveal`** (fade-in au scroll, directions *left / right / top / up*, effet cascade).
- Appliqué à toutes les sections (Hero, À Propos, Compétences, Expérience, Formation, Projets, Contact).
- Respecte `prefers-reduced-motion` ; `overflow-x: hidden` global pour éviter tout débordement.
- Composant **`CountUp`** : les 3 chiffres d'**À Propos** s'animent (0 → valeur) au scroll, en conservant les suffixes (`+`, `%`). Respecte `prefers-reduced-motion`.

### Mise à jour d'après le CV & ajustements
- **CV** : le bouton « Télécharger mon CV » force désormais le nom `CV-Samuel-Andrianirina.pdf` (au lieu du nom technique du fichier stocké).
- **Admin** : URL de login **`/admin/user`** (au lieu de `/admin/login`) ; mot de passe changé ; **œil afficher/masquer** sur le champ mot de passe.
- **Contact** : ajout des cartes cliquables **GitHub** et **LinkedIn** (repli sur les URLs du profil admin).
- **Compétences → Data & Outils** : retrait de **MongoDB** et **AWS**.
- **Expériences** (données du CV) : Salathis, Softibox, Prestatics — avec le **stack utilisé mis en évidence** en badges sous chaque poste.
- **Formations** (données du CV) : INSCAE, IT University, ISPM, Lycée Saint François Xavier — **établissement mis en évidence** (badge + icône).
- **Hero** : suppression du badge « DÉVELOPPEUR WEB » et du bloc flottant sur la photo ; titre reformaté (« Je transforme » / « les idées en » / « solutions web. »).
- **Titres** : « Expériences Professionnelles » et « Formations » (pluriel, sections + menu).
- **Responsive navbar** : entre `md` et `lg` (~840px), police du menu réduite (`text-sm`) + menu centré prenant l'espace disponible (`flex-1`, wrap possible) → reste propre sur une ligne.
- **Photo** : conservée telle quelle (déjà en haute résolution **1254×1254**).

---

## 6. Points à connaître / pistes d'amélioration

- ⚠️ **La section Compétences est actuellement codée en dur** dans `src/sections/SkillsSection.tsx` (elle n'utilise pas encore l'admin « Compétences »). Peut être branchée sur la base sur demande.
- 🔒 **Avant mise en production** : changer `JWT_SECRET` et `ADMIN_PASSWORD` dans l'environnement.
- 💾 **À persister entre déploiements** : le dossier `uploads/` (médias, photo, CV) et la base de données.
- 🗄️ **Base** : possibilité de basculer vers PostgreSQL via `DATABASE_URL` + `provider` dans `prisma/schema.prisma`.

---

## 7. Structure du projet

```
portfolio/
├── server.ts                 # Point d'entrée serveur (API + front)
├── server/src/
│   ├── routes/               # Endpoints API (auth, profile, hero, about, skills…)
│   ├── middleware/auth.ts     # Authentification JWT
│   └── services/storage.ts    # Stockage des fichiers uploadés
├── src/
│   ├── sections/             # Sections du site public
│   ├── pages/admin/          # Pages du CMS
│   ├── components/           # Reveal, MediaUploader, Navbar, Footer…
│   ├── context/              # Auth, Theme, Toast
│   └── services/api.ts        # Client API front
├── prisma/
│   ├── schema.prisma         # Modèle de données
│   └── seed.ts               # Données initiales
├── uploads/                  # Fichiers uploadés (photo, CV…)
└── stitch/                   # Design de référence (DESIGN.md, screen.png)
```
