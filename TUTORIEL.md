# Tutoriel — Comprendre et reconstruire ce portfolio (full-stack)

> **Pour qui ?** Un développeur junior, novice en React, qui veut **comprendre en profondeur**
> comment fonctionne une application web full-stack — **surtout le backend** — pour ensuite
> construire ses propres sites de qualité.
>
> **Comment lire ce document ?** Dans l'ordre. Chaque partie s'appuie sur la précédente.
> Les exemples de code viennent **directement de ce projet** : ouvre les fichiers cités en
> parallèle et relis-les après chaque section.

---

## Table des matières
0. [Le vocabulaire de base](#0)
1. [L'architecture globale](#1)
2. [Le BACKEND en profondeur](#2) ← le cœur du tuto
3. [Le FRONTEND (React pour débutant)](#3)
4. [Le cycle complet d'une fonctionnalité](#4)
5. [Build & déploiement](#5)
6. [Reconstruire un projet similaire toi-même](#6)
7. [Glossaire](#7)

---

<a name="0"></a>
## 0. Le vocabulaire de base

Avant tout, quelques mots-clés. Si tu les comprends, 80 % du reste devient logique.

- **Client / Frontend** : ce qui tourne dans le **navigateur** de l'utilisateur (HTML, CSS, JavaScript / React). Il *affiche* et *réagit*.
- **Serveur / Backend** : un programme qui tourne sur une **machine distante** (ici Node.js + Express). Il *décide*, *sécurise*, *parle à la base de données*.
- **HTTP** : le langage entre client et serveur. Le client envoie une **requête** (request), le serveur renvoie une **réponse** (response).
- **API REST** : un ensemble d'**URL** (endpoints) exposées par le backend, chacune faisant une action. Ex : `GET /api/projects` = « donne-moi la liste des projets ».
- **Verbes HTTP** : `GET` (lire), `POST` (créer), `PUT` (modifier), `DELETE` (supprimer).
- **JSON** : le format texte d'échange des données (ex : `{ "name": "Samuel" }`).
- **Base de données** : là où les données sont **stockées durablement**. Ici **SQLite** (un simple fichier `dev.db`).
- **ORM** : un outil (ici **Prisma**) qui te permet de parler à la base **en JavaScript** au lieu d'écrire du SQL à la main.

**L'image mentale à retenir :**

```
[Navigateur / React]  --- requête HTTP (JSON) --->  [Serveur Express]  ---> [Prisma] ---> [SQLite]
      (Frontend)      <--- réponse HTTP (JSON) ---      (Backend)      <---        <---   (dev.db)
```

---

<a name="1"></a>
## 1. L'architecture globale de ce projet

Particularité importante : ici, **un seul programme** (`server.ts`) fait **deux choses** :
1. il expose l'**API** sous `/api/*` (le backend),
2. il **sert le site React** (le frontend) pour tout le reste.

Ouvre **`server.ts`** (à la racine). Voici sa logique, commentée :

```ts
const app = express();                       // 1. on crée l'application serveur
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());                             // 2. middlewares "globaux" (voir §2.1)
app.use(express.json({ limit: '10mb' }));    //    -> comprendre le JSON envoyé par le client

app.use('/uploads', express.static(uploadsPath)); // 3. sert les fichiers uploadés

app.get('/api/health', ...);                 // 4. petite route de "santé"

app.use('/api/auth', authRoutes);            // 5. on "branche" chaque groupe de routes
app.use('/api/profile', profileRoutes);      //    (chaque fichier de routes = un domaine)
app.use('/api/projects', projectsRoutes);
// ... etc

if (process.env.NODE_ENV !== 'production') { // 6a. EN DEV : Vite sert le React (rechargement à chaud)
  app.use(vite.middlewares);
} else {                                     // 6b. EN PROD : on sert le React déjà "buildé" (dossier dist/)
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(distPath + '/index.html'));
}

app.listen(PORT, '0.0.0.0', ...);            // 7. on démarre l'écoute
```

**Le cycle d'une requête, concrètement :**
1. Le navigateur demande `GET /api/projects`.
2. Express regarde ses routes dans l'ordre : `/api/projects` correspond à `projectsRoutes`.
3. La route interroge la base via Prisma, met en forme, et renvoie du **JSON**.
4. React reçoit ce JSON et **affiche** les projets.

> 💡 **Point clé pour débutant** : le frontend ne touche **jamais** directement la base de
> données. Il **demande** au backend, qui est le seul à parler à la base. C'est une règle de
> sécurité fondamentale.

---

<a name="2"></a>
## 2. Le BACKEND en profondeur

C'est la partie la plus importante pour toi. On va décortiquer chaque brique.

### 2.1 Express : le squelette du serveur

**Express** est une librairie qui simplifie la création d'un serveur HTTP en Node.js.
Deux notions à maîtriser :

**a) Le middleware** = une fonction qui reçoit `(req, res, next)` et s'exécute **à chaque requête** (ou sur certaines routes). Elle peut : lire/modifier la requête, répondre, ou passer la main au suivant avec `next()`.

```ts
app.use(express.json());   // middleware : transforme le corps JSON en objet JS (req.body)
app.use(cors());           // middleware : autorise les appels depuis le navigateur
```

Imagine une **chaîne de contrôle** : chaque requête traverse une série de middlewares, dans l'ordre, jusqu'à ce que l'un d'eux réponde.

**b) Le Router** = un moyen de **regrouper** des routes par thème dans des fichiers séparés
(`server/src/routes/*.ts`), puis de les « brancher » avec `app.use('/api/xxx', xxxRoutes)`.

### 2.2 Les routes (les endpoints de l'API)

Une route = **un verbe HTTP + un chemin + une fonction**. Ouvre **`server/src/routes/profile.ts`** :

```ts
const router = Router();

// GET /api/profile  -> PUBLIC (tout le monde peut lire le profil)
router.get('/', async (_req, res) => {
  const profile = await prisma.profile.findFirst();  // lit 1 ligne en base
  return res.json(profile || {});                    // renvoie du JSON
});

// PUT /api/profile  -> PROTÉGÉ (seul l'admin connecté peut modifier)
router.put('/', authenticate, requireAdmin, async (req, res) => {
  const { firstName, lastName, ... } = req.body;     // données envoyées par le client
  const existing = await prisma.profile.findFirst();
  const updated = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data: {...} })
    : await prisma.profile.create({ data: {...} });
  return res.json(updated);
});

export default router;
```

Observe **deux choses fondamentales** :
- La route `GET` est **publique** ; la route `PUT` est précédée de `authenticate, requireAdmin`
  → ce sont des **middlewares de sécurité** (voir §2.4). Ils s'exécutent **avant** la fonction
  finale : si tu n'es pas admin connecté, tu es bloqué avant d'atteindre le code de modification.
- Les **codes de statut HTTP** : `res.json(...)` = 200 (OK par défaut), `res.status(400)` = erreur
  du client (mauvaise donnée), `res.status(401)` = non authentifié, `res.status(500)` = erreur serveur.

> **Convention REST** que tu retrouves partout : `GET /ressource` (liste),
> `GET /ressource/:id` (un élément), `POST /ressource` (créer), `PUT /ressource/:id` (modifier),
> `DELETE /ressource/:id` (supprimer).

### 2.3 La base de données avec Prisma (l'ORM)

**Le problème** : parler à une base, c'est normalement écrire du **SQL** (`SELECT * FROM ...`).
C'est verbeux et source d'erreurs. **Prisma** te laisse écrire du **JavaScript typé** à la place.

**Étape 1 — Le schéma.** Ouvre **`prisma/schema.prisma`**. C'est LA source de vérité de ta base :

```prisma
datasource db {
  provider = "sqlite"            // le type de base (ici SQLite)
  url      = env("DATABASE_URL") // où elle se trouve (lu depuis .env)
}

generator client {
  provider = "prisma-client-js"  // génère le "client" JS pour parler à la base
}

model Project {                  // "model" = une TABLE
  id               String   @id @default(uuid())  // clé primaire, auto-générée
  title            String
  slug             String   @unique               // valeur unique (pas de doublon)
  featured         Boolean  @default(false)
  technologies     String                          // (astuce JSON, voir plus bas)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

- Chaque `model` = une table. Chaque ligne = une **colonne** avec son **type** (`String`, `Int`, `Boolean`, `DateTime`…).
- Les `@` sont des **attributs** : `@id` (clé primaire), `@default(...)`, `@unique`, etc.

**Étape 2 — Créer/mettre à jour la base.** Trois commandes à connaître :
- `npm run prisma:generate` → génère le **client Prisma** (le code JS basé sur ton schéma).
- `npm run prisma:push` → applique le schéma à la base (crée/modifie les tables).
- `npm run db:seed` → remplit la base (voir §2.6).

**Étape 3 — Utiliser le client Prisma.** Dans les routes, tu écris simplement :

```ts
await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } }); // liste triée
await prisma.project.findUnique({ where: { id } });               // un par id
await prisma.project.create({ data: { title, slug, ... } });      // créer
await prisma.project.update({ where: { id }, data: { ... } });    // modifier
await prisma.project.delete({ where: { id } });                   // supprimer
```

Lisible, non ? C'est tout l'intérêt d'un ORM.

**Le "singleton" Prisma.** Ouvre **`server/src/db.ts`** : on crée **une seule** instance de
`PrismaClient` réutilisée partout. Pourquoi ? Créer une connexion à la base coûte cher ; en dev,
avec le rechargement à chaud, on risquerait d'en ouvrir des dizaines. Le singleton évite ça.

**L'astuce "JSON dans une String".** SQLite ne gère pas nativement les listes. Or un projet a une
**liste** de technologies. Solution utilisée ici : on stocke la liste en **texte JSON**.
- À l'écriture : `JSON.stringify(['React','Node'])` → `'["React","Node"]'` (voir `projects.ts`).
- À la lecture : la fonction `formatProject()` fait `JSON.parse(...)` pour reconvertir en tableau
  avant de renvoyer au frontend. C'est un pattern à connaître quand la base est "simple".

### 2.4 L'authentification (JWT) — sécuriser l'admin

C'est **le** sujet backend à bien comprendre. Objectif : que **seul toi** puisses modifier le contenu.

**Le principe du JWT (JSON Web Token)** :
1. Tu envoies email + mot de passe à `POST /api/auth/login`.
2. Le serveur vérifie le mot de passe, puis fabrique un **jeton signé** (le JWT) qui prouve ton identité.
3. Le navigateur **garde** ce jeton et le renvoie à chaque requête protégée dans un en-tête
   `Authorization: Bearer <jeton>`.
4. Le serveur **vérifie la signature** du jeton avant d'autoriser l'action.

**Le login.** Ouvre **`server/src/routes/auth.ts`** :

```ts
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Identifiants invalides.' });

  const isMatch = await bcrypt.compare(password, user.password); // compare avec le hash stocké
  if (!isMatch) return res.status(401).json({ error: 'Identifiants invalides.' });

  const token = jwt.sign(                       // on fabrique le jeton signé
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,                                 // secret connu du serveur seul
    { expiresIn: '7d' }                         // valable 7 jours
  );
  return res.json({ token, user: { ... } });
});
```

> 🔐 **Règle d'or** : on ne stocke **JAMAIS** un mot de passe en clair. On stocke son **hash**
> (via `bcrypt`). Au login, on **compare** ; on ne "déchiffre" jamais. C'est irréversible par design.

**La vérification.** Ouvre **`server/src/middleware/auth.ts`** — deux middlewares réutilisables :

```ts
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;               // "Bearer xxxxx"
  if (!authHeader?.startsWith('Bearer ')) return res.status(401)...;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);            // vérifie la signature
    req.user = decoded;                                       // attache l'utilisateur à la requête
    next();                                                   // OK, on continue
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
}

export function requireAdmin(req, res, next) {                // exige le rôle ADMIN
  if (req.user?.role !== 'ADMIN') return res.status(403)...;
  next();
}
```

Résultat : il suffit d'ajouter `authenticate, requireAdmin` **avant** une route pour la protéger.
C'est exactement ce que font `PUT /api/profile`, `POST /api/projects`, etc. Les routes publiques
(`GET /api/projects`, `POST /api/contact`) n'ont pas ces gardes.

### 2.5 L'upload de fichiers (multer)

Ouvre **`server/src/routes/uploads.ts`** et **`server/src/services/storage.ts`**.

- **multer** est le middleware qui gère les fichiers envoyés. Ici il est configuré pour :
  - garder le fichier **en mémoire** le temps de le valider,
  - **limiter la taille** (5 Mo),
  - **filtrer les types** autorisés (jpg, png, webp, svg, pdf) via `fileFilter`.
- Le **service de stockage** (`storage.ts`) **renomme** chaque fichier en `timestamp-hash.ext`
  (ex. `1786516273461-06f6...jpg`). Pourquoi ? Pour éviter les collisions de noms et bloquer les
  attaques par nom de fichier (path traversal).
- On enregistre **deux choses** : le **fichier physique** (dans `uploads/`) **et** une ligne en base
  (`Media`) qui mémorise son URL. À la suppression, on efface **les deux**.

> C'est un pattern classique : « fichier sur le disque + métadonnées en base ».

### 2.6 Le seed (données initiales)

Ouvre **`prisma/seed.ts`**. Un "seed" = un script qui **remplit** la base avec un contenu de départ.
Chaque bloc est **idempotent** : il ne crée les données **que si** la table est vide.

```ts
const profileCount = await prisma.profile.count();
if (profileCount === 0) {                 // on ne réinsère pas si déjà présent
  await prisma.profile.create({ data: { firstName: 'Samuel', ... } });
}
```

Dans **ce projet**, le seed est devenu la **source de vérité du contenu** (parce qu'en ligne, sur
le plan gratuit, la base se recrée à chaque déploiement). Modifier le contenu du site en ligne =
modifier `seed.ts` puis `git push`.

---

<a name="3"></a>
## 3. Le FRONTEND (React pour débutant)

### 3.1 Comment React fonctionne

React construit l'interface avec des **composants** : des fonctions JavaScript qui **retournent
du HTML** (appelé **JSX**). Un composant peut en contenir d'autres → on obtient un **arbre**.

- **`src/main.tsx`** : le point d'entrée. Il "monte" l'appli dans la page :
  ```tsx
  createRoot(document.getElementById('root')!).render(<App />);
  ```
- **`src/App.tsx`** : la racine. Elle met en place les **providers** (contextes globaux) et le
  **routage** :
  ```tsx
  <ThemeProvider>            {/* thème clair/sombre, dispo partout */}
    <ToastProvider>          {/* notifications */}
      <AuthProvider>         {/* état de connexion admin */}
        <BrowserRouter>      {/* la navigation par URL */}
          <Routes> ... </Routes>
  ```

**Les props** = les "paramètres" qu'un composant reçoit de son parent. Exemple dans
`PortfolioPage` : `<HeroSection hero={hero} profile={profile} />`. Le composant `HeroSection`
reçoit `hero` et `profile` et les affiche.

### 3.2 Les Hooks essentiels

Les **hooks** sont des fonctions spéciales de React (préfixe `use...`). Les trois à connaître :

- **`useState`** : mémoriser une donnée qui peut changer (l'état). Quand elle change, React
  **réaffiche** le composant.
  ```tsx
  const [projects, setProjects] = useState([]);  // valeur + fonction pour la modifier
  ```
- **`useEffect`** : exécuter du code **après** l'affichage — typiquement **charger des données**.
- **`useContext`** : lire un état global (voir §3.4).

**Exemple réel — `src/pages/PortfolioPage.tsx`** (comment le site charge son contenu) :

```tsx
const [projects, setProjects] = useState<Project[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {                    // s'exécute 1 fois au chargement de la page
  const fetchAllData = async () => {
    const [profileData, heroData, ... , projData] = await Promise.all([
      api.getProfile(), api.getHero(), ..., api.getProjects(),  // appels API en parallèle
    ]);
    setProjects(projData);           // on stocke -> React réaffiche avec les données
    setIsLoading(false);
  };
  fetchAllData();
}, []);                              // [] = "une seule fois"

if (isLoading) return <Spinner />;  // pendant le chargement, on montre un loader
return <ProjectsSection projects={projects} /> // ensuite, on affiche
```

> `Promise.all([...])` lance **tous les appels en même temps** au lieu d'attendre l'un après
> l'autre → la page se charge plus vite. Bon réflexe à retenir.

### 3.3 Le routage (react-router)

Ouvre **`src/App.tsx`**. Le routage associe une **URL** à un **composant** :

```tsx
<Route path="/" element={<PortfolioPage />} />          {/* site public */}
<Route path="/admin/user" element={<AdminLogin />} />   {/* page de login */}

<Route element={<ProtectedRoute />}>                    {/* barrière de sécurité */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="projects/edit/:id" element={<AdminProjectEdit />} /> {/* :id = paramètre */}
  </Route>
</Route>
```

- **`:id`** est un **paramètre d'URL** : dans le composant, on le lit avec `useParams()`.
- **`ProtectedRoute`** (ouvre `src/components/ProtectedRoute.tsx`) : si tu n'es pas connecté, il te
  **redirige** vers `/admin/user`. Sinon il affiche la page enfant via `<Outlet />`. C'est le
  pendant **frontend** de la sécurité (le vrai verrou reste le backend, §2.4).

### 3.4 Le Context (l'état global)

Problème : comment savoir « suis-je connecté ? » depuis **n'importe quel** composant, sans se
passer l'info de parent en enfant sur 10 niveaux (le "prop drilling") ? Réponse : le **Context**.

Ouvre **`src/context/AuthContext.tsx`** :
- `AuthProvider` **fournit** l'état d'authentification (user, token, `login`, `logout`) à tout l'arbre.
- N'importe quel composant y accède avec le hook **`useAuth()`** :
  ```tsx
  const { isAuthenticated, login, logout } = useAuth();
  ```
- Au démarrage, un `useEffect` vérifie le jeton stocké dans le navigateur (`localStorage`) et
  appelle `GET /api/auth/me` pour confirmer qu'il est encore valide.

`ThemeContext` (clair/sombre) et `ToastContext` (notifications) suivent exactement le même patron.

### 3.5 Le client API (le pont front → back)

Ouvre **`src/services/api.ts`**. Au lieu d'écrire `fetch(...)` partout, on centralise tous les
appels dans un objet `api`. Points clés :

```ts
const API_BASE = '/api';                     // URL relative -> marche en local ET en ligne

function getAuthHeader() {                   // ajoute le jeton pour les routes protégées
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

getProjects: async () => {                   // exemple d'appel GET
  const res = await fetch(`${API_BASE}/projects`);
  return handleResponse(res);                // gère les erreurs de façon uniforme
},

updateProject: async (id, data) => {         // exemple d'appel PUT protégé
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
},
```

> C'est le **miroir** de ton backend : à chaque route Express correspond une fonction `api.xxx`.

### 3.6 Le style avec Tailwind CSS

Ici, pas de fichiers CSS séparés par composant : on utilise **Tailwind**, des **classes utilitaires**
directement dans le JSX.

```tsx
<div className="flex items-center gap-4 p-6 rounded-2xl bg-theme-card border border-theme">
```
- `flex items-center gap-4` = disposition, `p-6` = padding, `rounded-2xl` = coins arrondis…
- **Responsive** : les préfixes `sm:` `md:` `lg:` appliquent une classe **à partir** d'une largeur
  d'écran. Ex. `text-sm lg:text-base` = petit texte, puis normal sur grand écran (c'est ce qui gère
  le menu à ~840px).
- Les classes `bg-theme-*`, `text-theme-*` sont des **jetons de thème** définis dans
  `src/index.css` (pour gérer le mode clair/sombre). Les effets personnalisés (dégradé des boutons,
  animations de scroll) y sont aussi.

### 3.7 Deux patterns réutilisables à étudier

- **`src/components/Reveal.tsx`** : anime l'apparition au scroll grâce à l'**IntersectionObserver**
  (une API du navigateur qui prévient quand un élément entre dans l'écran).
- **`src/components/CountUp.tsx`** : anime un compteur de 0 à une valeur, avec `requestAnimationFrame`.
- **Formulaire contrôlé** (`ContactSection.tsx`) : chaque champ est lié à un `useState`
  (`value={...}` + `onChange={...}`). React est la "source de vérité" de ce que contient le champ.

---

<a name="4"></a>
## 4. Le cycle complet d'une fonctionnalité (fil rouge)

Rien ne vaut un exemple **de bout en bout**. Suivons un **message de contact**.

**1) Frontend — le formulaire** (`src/sections/ContactSection.tsx`) :
```tsx
const [formData, setFormData] = useState({ name:'', email:'', subject:'', message:'' });

const handleSubmit = async (e) => {
  e.preventDefault();                          // empêche le rechargement de page
  await api.sendMessage(formData);             // 2) appelle le client API
  showToast('Message envoyé !', 'success');    // 5) notifie l'utilisateur
};
```

**2) Client API** (`src/services/api.ts`) :
```ts
sendMessage: async (data) => {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),                // JS -> texte JSON
  });
  return handleResponse(res);
}
```

**3) Le voyage** : la requête `POST /api/contact` part vers le serveur avec le JSON dans son "corps".

**4) Backend — la route** (`server/src/routes/contact.ts`) :
```ts
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;    // récupère les données
  if (!name || !email || !message)                       // validation
    return res.status(400).json({ error: '...' });
  await prisma.contactMessage.create({ data: {...} });   // enregistre en base
  return res.status(201).json({ success: true });        // répond "créé"
});
```

**5) Retour** : la réponse revient au frontend, qui affiche une notification de succès. Le message
est visible ensuite dans l'admin (`/admin/messages`), qui fait un `GET /api/messages` **protégé**.

➡️ **Ce schéma se répète pour TOUT** : afficher des projets, se connecter, modifier le profil…
Formulaire/état (React) → client API (fetch) → route Express (validation + sécurité) → Prisma (base)
→ réponse JSON → mise à jour de l'affichage. **Si tu maîtrises ce cycle, tu maîtrises le full-stack.**

---

<a name="5"></a>
## 5. Build & déploiement (résumé)

- **`npm run dev`** : mode développement. Vite sert le React avec **rechargement à chaud**, et
  `tsx watch` relance le serveur à chaque modif backend.
- **`npm run build`** : fabrique la version **optimisée** : Vite compile le React dans `dist/`
  (fichiers minifiés), et esbuild empaquette `server.ts` en `dist/server.cjs`.
- **`npm run start`** : lance cette version de production.
- **En ligne** : hébergé sur **Render** (voir `recap.md` §8). Chaque `git push` sur `main`
  redéploie automatiquement. Base **SQLite**, contenu figé dans le **seed**.

---

<a name="6"></a>
## 6. Reconstruire un projet similaire toi-même

### 6.1 La feuille de route (dans l'ordre)

1. **Créer le front** : `npm create vite@latest mon-site -- --template react-ts` → `npm install`.
2. **Ajouter le serveur** : `npm i express cors` et un `server.ts` minimal (comme le §1).
3. **Ajouter la base** : `npm i -D prisma` puis `npx prisma init --datasource-provider sqlite`.
   Définis tes `model` dans `schema.prisma`, puis `npx prisma db push`.
4. **Écrire tes routes** : commence par un simple `GET /api/items` qui fait `prisma.item.findMany()`.
5. **Connecter le front** : un client `api.ts` avec `fetch('/api/items')`, affiché via `useState` +
   `useEffect` (comme le §3.2).
6. **Ajouter l'authentification** (quand tu es à l'aise) : `bcrypt` + `jsonwebtoken`, une route
   `login`, un middleware `authenticate` (copie la logique du §2.4).
7. **Styliser** avec Tailwind.
8. **Déployer** sur Render/Railway (réutilise `render.yaml` comme modèle).

### 6.2 Quoi apprendre, et dans quel ordre

Ne saute pas d'étapes — chaque brique s'appuie sur la précédente :

1. **JavaScript moderne** : `const/let`, fonctions fléchées, `async/await`, `map/filter`,
   destructuring (`const { a } = obj`), les modules `import/export`. **C'est la base de tout.**
2. **TypeScript (bases)** : les types (`string`, `number`, interfaces). Pas besoin d'être expert.
3. **HTTP & REST** : requête/réponse, verbes, codes de statut, JSON.
4. **React** : composants, JSX, props, `useState`, `useEffect`, listes (`.map`), formulaires
   contrôlés, puis `useContext` et react-router.
5. **Node.js + Express** : middlewares, routes, `req`/`res`.
6. **SQL de base + Prisma** : modèles, relations, requêtes.
7. **Auth** : hashage (bcrypt), JWT.
8. **Déploiement** : variables d'environnement, build, hébergeur.

### 6.3 Ressources recommandées

- **MDN** (developer.mozilla.org) — la référence pour JavaScript et le web.
- **react.dev** — la doc officielle React (excellente, avec un tutoriel interactif).
- **expressjs.com** — la doc Express.
- **prisma.io/docs** — la doc Prisma (le "Getting Started" est parfait).
- **La méthode la plus efficace** : **relis ce projet** en te posant à chaque fichier la question
  « qu'est-ce que ça fait, et pourquoi ? ». Puis reconstruis un petit clone (ex. une "todo-list"
  full-stack) **sans copier-coller**.

---

<a name="7"></a>
## 7. Glossaire express

| Terme | En une phrase |
|---|---|
| **Frontend / Backend** | Ce qui tourne dans le navigateur / sur le serveur. |
| **API REST** | Des URL exposées par le backend pour lire/écrire des données. |
| **Endpoint / Route** | Une URL + un verbe (ex. `GET /api/projects`). |
| **Middleware** | Fonction qui s'exécute pendant une requête (sécurité, parsing…). |
| **ORM (Prisma)** | Outil pour parler à la base en JS au lieu de SQL. |
| **Migration / db push** | Appliquer le schéma à la vraie base. |
| **Seed** | Script qui remplit la base d'un contenu initial. |
| **JWT** | Jeton signé qui prouve l'identité de l'utilisateur connecté. |
| **bcrypt / hash** | Transformer un mot de passe en empreinte irréversible. |
| **Hook (React)** | Fonction `use...` (état, effets, contexte). |
| **State (useState)** | Donnée qui, en changeant, réaffiche l'interface. |
| **Props** | Données passées d'un composant parent à un enfant. |
| **Context** | État partagé accessible partout sans "prop drilling". |
| **Build** | Compilation optimisée du code pour la production. |
| **Variable d'environnement** | Réglage sensible (secret, URL) hors du code, dans `.env`. |

---

**Fichiers connexes** : `recap.md` (récapitulatif fonctionnel), `INSTALLATION.md` (installer le
projet sur un autre PC). **Bon apprentissage — et n'hésite pas à casser puis réparer le code : c'est
la meilleure façon de comprendre.** 🚀
