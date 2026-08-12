# Guide d'installation — Portfolio Samuel (sur un nouveau PC)

Ce guide t'accompagne **de zéro** pour faire tourner le projet sur un autre ordinateur
(ex. ton PC à la maison), que tu copies le projet **par clé USB** ou que tu le récupères
depuis **GitHub**.

> Rédigé pour **Windows 10/11** (PowerShell). Une note pour macOS/Linux est en fin de guide.

---

## 0. Ce que tu vas obtenir

À la fin, tu auras le site qui tourne en local sur **http://localhost:3000** :
- Site public sur `/`
- Administration sur `/admin/user`

Durée : ~15-20 min (surtout le téléchargement des outils).

---

## 1. Installer les outils (à faire une seule fois)

### a) Node.js (obligatoire — inclut `npm`)
1. Va sur **https://nodejs.org**
2. Télécharge la version **LTS** (bouton de gauche, ex. « 20.x.x LTS »).
3. Lance l'installateur → **Next / Next / Install** (laisse les options par défaut,
   garde « Add to PATH » coché).
4. **Redémarre** ton terminal après l'installation.

> Le projet utilise **npm**. Le fichier `bun.lock` présent dans le projet peut être ignoré :
> **on n'utilise pas `bun`**.

### b) Git (recommandé — pour mettre à jour le site en ligne)
1. Va sur **https://git-scm.com/download/win** → le téléchargement démarre seul.
2. Installe (tu peux tout laisser par défaut).

### c) VS Code (recommandé — pour éditer le code)
1. Va sur **https://code.visualstudio.com** → télécharge et installe.

### Vérifier que tout est installé
Ouvre **PowerShell** (menu Démarrer → tape « PowerShell ») et tape :
```powershell
node -v
npm -v
git --version
```
Tu dois voir des numéros de version (ex. `v20.11.0`, `10.2.4`, `git version 2.x`).
Si `node` n'est pas reconnu → réinstalle Node.js puis rouvre le terminal.

---

## 2. Récupérer le projet

Choisis **UNE** des deux méthodes.

### Méthode A — Par clé USB (ce que tu veux faire)
1. Copie le dossier du projet **`portfolio`** sur ta clé USB.
   - 💡 **Pour gagner de la place et éviter les soucis**, tu peux **NE PAS copier** ces
     dossiers (ils seront régénérés automatiquement) :
     - `node_modules/` (très lourd, spécifique à chaque machine)
     - `dist/` (fichier de build)
   - ✅ **À bien copier** (dont des fichiers/dossiers cachés) :
     - tout le reste : `src/`, `server/`, `prisma/`, `public/`, `index.html`,
       `package.json`, `package-lock.json`, etc.
     - le fichier **`.env`** (caché, contient tes réglages — voir §3)
     - le dossier **`.git`** (caché) **si tu veux pouvoir mettre à jour le site en ligne**
       depuis ce PC sans reconfigurer Git.
   > Pour voir les fichiers cachés dans l'explorateur Windows : onglet **Affichage** →
   > coche **Éléments masqués**.
2. Sur le PC de la maison, copie le dossier depuis la clé vers un endroit simple,
   par ex. `C:\Users\TonNom\Documents\portfolio`.

### Méthode B — Depuis GitHub (alternative propre, nécessite Internet + Git)
```powershell
cd $HOME\Documents
git clone https://github.com/samueldolly321/portfolio.git
cd portfolio
```
> Avec cette méthode, le `.env` **n'est pas** inclus (il est volontairement exclu de Git) :
> il faudra le créer (voir §3).

---

## 3. Le fichier `.env` (réglages & identifiants)

Le projet a besoin d'un fichier **`.env`** à la racine.

- **Si tu l'as copié par USB** → parfait, rien à faire, passe au §4.
- **S'il manque** (méthode GitHub, ou fichier caché non copié) → crée-le :

1. À la racine du projet, copie le modèle :
   ```powershell
   Copy-Item .env.example .env
   ```
2. Ouvre `.env` dans VS Code et renseigne au minimum :
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="mets-ici-une-longue-chaine-secrete-au-hasard"
   ADMIN_EMAIL="hariniainasamuelandrianirina@gmail.com"
   ADMIN_PASSWORD="ton-mot-de-passe-admin"
   PORT=3000
   ```
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` = les identifiants pour te connecter à `/admin/user`.
   - `JWT_SECRET` = n'importe quelle longue chaîne (sert à sécuriser la connexion).

> ⚠️ Le `.env` contient des secrets : **ne le partage pas** et ne le mets pas sur Internet.
> Il est déjà ignoré par Git (donc jamais envoyé sur GitHub).

---

## 4. Installer et lancer le projet

Ouvre **PowerShell dans le dossier du projet**.
(Astuce : dans l'explorateur, va dans le dossier `portfolio`, clique la barre d'adresse,
tape `powershell` et Entrée.)

Tape ces commandes **dans l'ordre** :

```powershell
npm install            # 1. installe les dépendances (~1-2 min)
npm run prisma:generate # 2. génère le client de base de données
npm run prisma:push     # 3. crée la base SQLite (fichier dev.db)
npm run db:seed         # 4. remplit la base avec le contenu (profil, projets…)
npm run dev             # 5. démarre le site
```

Quand tu vois **`🚀 Server running on http://0.0.0.0:3000`**, c'est prêt.

> Les étapes 2 à 4 ne sont à refaire que si tu changes la base. Ensuite, au quotidien,
> **`npm run dev`** suffit pour relancer.

> ℹ️ **À propos de la base de données** — Le projet utilise **SQLite**, pas PostgreSQL.
> La base est un simple **fichier `dev.db`** créé automatiquement : **aucun serveur de
> base à installer** (ni PostgreSQL, ni MySQL, ni XAMPP). L'étape `prisma:push` crée le
> fichier, `db:seed` le remplit avec le contenu (défini dans `prisma/seed.ts`). Tu n'as
> pas besoin de copier `dev.db` depuis l'USB : il se régénère à l'identique.

---

## 5. Ouvrir le site

Dans ton navigateur :
- **Site public** → http://localhost:3000/
- **Administration** → http://localhost:3000/admin/user
  (connexion avec `ADMIN_EMAIL` / `ADMIN_PASSWORD` de ton `.env`)

Pour **arrêter** le serveur : dans le terminal, appuie sur **Ctrl + C**.

---

## 6. Modifier le contenu et mettre à jour le site EN LIGNE

Le site en ligne (Render) se met à jour tout seul quand tu **pousses** sur GitHub.

> Rappel : en ligne (plan gratuit), la **source de vérité du contenu = le seed**
> (`prisma/seed.ts`) et le code. Les modifs faites via l'admin *en ligne* ne sont pas
> permanentes. Pour un changement définitif, on modifie le code/seed puis on pousse.

Workflow depuis ce PC (nécessite le dossier `.git` copié, ou la méthode B) :
```powershell
git pull                       # récupère les dernières versions (au cas où)
# … fais tes modifications dans le code / prisma/seed.ts …
git add -A
git commit -m "Décris ta modification"
git push                       # envoie sur GitHub → Render redéploie (~2-3 min)
```

- Pendant le redéploiement, le site affiche brièvement « Not Found » : **c'est normal**,
  attends que Render repasse **Live**.
- La 1ʳᵉ fois que tu pousses depuis ce PC, Git peut te demander de te connecter à
  GitHub (fenêtre de navigateur) : accepte.

---

## 7. Dépannage (problèmes fréquents)

| Symptôme | Solution |
|---|---|
| `node`/`npm` : *n'est pas reconnu* | Réinstalle Node.js (§1a) puis **rouvre** le terminal. |
| Le port 3000 est déjà utilisé | Ferme l'autre appli, ou change `PORT=3001` dans `.env` et relance. |
| `npm install` échoue | Vérifie `node -v` ≥ 18. Supprime `node_modules` puis refais `npm install`. |
| Erreur Prisma / base | Refais `npm run prisma:generate` puis `npm run prisma:push`. |
| Page blanche / erreurs bizarres | Arrête (Ctrl+C), refais `npm run dev`, recharge la page (Ctrl+Shift+R). |
| La photo / le CV ne s'affichent pas | Normal seulement si `public/` n'a pas été copié — vérifie que le dossier `public/` est bien présent. |
| Repartir d'une base propre | Supprime `dev.db` puis refais §4 étapes 3-4 (`prisma:push` + `db:seed`). |

> `bun.lock` dans le projet : **à ignorer**, on utilise `npm`.

---

## 8. Commandes utiles (mémo)

```powershell
npm run dev            # démarrer en développement (rechargement auto)
npm run build          # construire la version de production (dossier dist/)
npm run start          # lancer la version de production (après build)
npm run lint           # vérifier les types (TypeScript)
npm run db:seed        # (re)remplir la base avec le contenu du seed
```

---

## Note macOS / Linux

Mêmes étapes, avec le terminal habituel :
- Installer Node.js LTS (https://nodejs.org) ou via `brew install node` (Mac).
- Copier `.env.example` → `.env` : `cp .env.example .env`.
- Les commandes `npm ...` sont identiques.

---

**Récapitulatif complet du projet** : voir le fichier `recap.md`.
