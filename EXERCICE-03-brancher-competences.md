# Exercice guidé nº3 — Brancher la section « Compétences » sur la base (refactor)

> **Objectif** : transformer une section **codée en dur** en une section **dynamique** pilotée par
> la base de données et l'admin — **sans écrire une seule ligne de backend**.
>
> **Pré-requis** : avoir lu `TUTORIEL.md`. (Les exercices 1 et 2 aident mais ne sont pas requis.)
>
> **Durée** : ~30-45 min. **Concept central** : **regrouper un tableau par catégorie** (`reduce`)
> et afficher des données dynamiques, façon "config-driven".

---

## La situation de départ (à bien comprendre)

Pour les Compétences, **presque tout existe déjà** dans le projet :

| Couche | État | Fichier |
|---|---|---|
| Modèle en base `Skill` | ✅ existe (seedé) | `prisma/schema.prisma`, `prisma/seed.ts` |
| Route API CRUD complète | ✅ existe | `server/src/routes/skills.ts` |
| Client API (`getSkills`, `createSkill`…) | ✅ existe | `src/services/api.ts` |
| Page d'admin (créer/éditer/masquer/réordonner) | ✅ existe | `src/pages/admin/AdminSkills.tsx` (`/admin/skills`) |
| La page charge déjà `skills` et le passe à la section | ✅ existe | `src/pages/PortfolioPage.tsx` |
| **La section qui AFFICHE** | ❌ **codée en dur** | `src/sections/SkillsSection.tsx` |

👉 Le problème : **`SkillsSection.tsx` ignore la prop `skills`** et affiche un tableau écrit dans le
code. Résultat : l'admin fonctionne… mais **n'a aucun effet** sur le site. **Ton seul travail** :
faire lire à la section les vraies données. C'est un **refactor** — recâbler l'existant.

> 💡 **Leçon de dev** : très souvent, le backend existe déjà. Le travail consiste à **connecter
> les morceaux**, pas à tout réécrire.

**Vérifie par toi-même avant de commencer** : va sur `/admin/skills` (connecté), masque une
compétence ou change-en une → recharge la page d'accueil : **rien ne change**. C'est ce qu'on va corriger.

---

## Étape 1 — Regarder le problème dans le code

Ouvre **`src/sections/SkillsSection.tsx`**. Remarque deux choses :

```tsx
export const SkillsSection: React.FC<SkillsSectionProps> = () => {   // (1) la prop "skills" n'est même pas récupérée !
  //                                                    ^^ vide
  ...
  const categories = [                                                // (2) données ÉCRITES EN DUR
    { title: 'Front-end', icon: Code2, items: ['HTML/CSS', 'JavaScript', ...] },
    ...
  ];
```

Le composant **reçoit** bien `skills` (son parent le passe), mais il ne l'utilise pas. On va
remplacer les données en dur par un **regroupement** des compétences venues de la base.

✅ **Point de contrôle** : tu as identifié les 2 problèmes (prop ignorée + tableau en dur).

---

## Étape 2 — Réécrire la section en version dynamique

Remplace **tout le contenu** de `src/sections/SkillsSection.tsx` par ceci :

```tsx
import React from 'react';
import { Skill } from '../types';
import { Code2, Server, Database, Globe, Shield, Monitor, Wrench, Sparkles, Layers } from 'lucide-react';
import { Reveal } from '../components/Reveal';

interface SkillsSectionProps {
  skills: Skill[];
}

// "Config" d'affichage : pour chaque catégorie de la base, un joli libellé + une icône.
// L'ordre de ce tableau = l'ordre d'affichage des cartes.
const CATEGORY_CONFIG: { key: string; label: string; icon: React.ElementType }[] = [
  { key: 'FRONT-END',       label: 'Front-end',              icon: Code2 },
  { key: 'BACK-END',        label: 'Back-end',               icon: Server },
  { key: 'DATABASE & ORM',  label: 'Base de données & ORM',  icon: Database },
  { key: 'CMS & WEB',       label: 'CMS & Web',              icon: Globe },
  { key: 'API & SECURITY',  label: 'API & Sécurité',         icon: Shield },
  { key: 'DESKTOP',         label: 'Desktop',                icon: Monitor },
  { key: 'TOOLS',           label: 'Outils',                 icon: Wrench },
  { key: 'AI & AUTOMATION', label: 'IA & Automatisation',    icon: Sparkles },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // 1. On ne garde que les compétences visibles
  const visible = (skills || []).filter((s) => s.isVisible !== false);

  // 2. On REGROUPE par catégorie -> { 'FRONT-END': [...], 'BACK-END': [...], ... }
  const grouped = visible.reduce((acc, skill) => {
    (acc[skill.category] = acc[skill.category] || []).push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // 3. On ordonne les catégories : celles de la config d'abord, puis toute catégorie "inconnue"
  const orderedKeys = [
    ...CATEGORY_CONFIG.map((c) => c.key).filter((k) => grouped[k]?.length),
    ...Object.keys(grouped).filter((k) => !CATEGORY_CONFIG.some((c) => c.key === k)),
  ];

  // Petits utilitaires : icône et libellé d'une catégorie (avec valeurs par défaut)
  const iconFor = (key: string) => CATEGORY_CONFIG.find((c) => c.key === key)?.icon || Layers;
  const labelFor = (key: string) => CATEGORY_CONFIG.find((c) => c.key === key)?.label || key;

  // Si aucune compétence en base, on n'affiche rien (garde-fou)
  if (orderedKeys.length === 0) return null;

  return (
    <section id="skills" className="py-24 bg-theme-main relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <Reveal direction="top">
          <div className="text-left mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient-h2 font-heading tracking-tight">
              Compétences Techniques
            </h2>
            <p className="mt-2 text-theme-muted text-sm sm:text-base max-w-2xl">
              Aperçu des technologies et outils que j'utilise au quotidien pour construire des solutions modernes et robustes.
            </p>
          </div>
        </Reveal>

        {/* Une carte par catégorie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderedKeys.map((key, idx) => {
            const Icon = iconFor(key);
            const items = grouped[key];
            return (
              <Reveal key={key} direction="up" delay={idx * 120}>
                <div className="h-full bg-theme-card border border-theme rounded-2xl p-6 sm:p-7 shadow-xl hover:border-[#f38038]/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-theme-surface border border-theme text-[#f38038]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-theme-main font-heading">{labelFor(key)}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {items.map((tech) => (
                      <span
                        key={tech.id}
                        className="px-3 py-1.5 rounded-lg bg-theme-surface border border-theme text-xs font-mono text-theme-main flex items-center gap-1.5 hover:border-[#f38038] transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f38038]" />
                        <span>{tech.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
```

✅ **Point de contrôle** : `npm run lint` passe, puis recharge **http://localhost:3000/** →
la section Compétences affiche maintenant **les catégories de la base** (celles du seed : Front-end,
Back-end, Base de données & ORM, CMS & Web, API & Sécurité, Desktop, Outils, IA & Automatisation).

> ⚠️ **Normal** : le contenu affiché **change** ! Avant, c'étaient 4 blocs écrits en dur. Maintenant,
> ce sont les compétences **réelles de la base**. C'est précisément le but : le site reflète enfin
> la base. (Pour remettre TON contenu exact, voir l'étape 4.)

---

## Étape 3 — La récompense : l'admin fonctionne enfin ! (aucun code)

Maintenant que la section lit la base, l'admin qui existait déjà **agit** sur le site. Teste :

1. Va sur **http://localhost:3000/admin/skills** (connecté).
2. **Masque** une compétence (icône œil) → recharge l'accueil : elle **disparaît**.
3. **Ajoute** une compétence (bouton « Nouvelle Compétence », choisis une catégorie) → elle **apparaît**
   dans la bonne carte.
4. **Réordonne** (flèches ↑/↓) → l'ordre change sur le site.

🎉 **Tu viens de "débloquer" tout un back-office** qui existait déjà mais ne servait à rien. Voilà
la puissance d'une architecture bien séparée : la donnée, l'API, l'admin et l'affichage sont
indépendants — il suffisait de connecter le dernier maillon.

---

## Comment ça marche : le regroupement (le point clé à retenir)

Le cœur de l'exercice tient en 4 lignes :

```ts
const grouped = visible.reduce((acc, skill) => {
  (acc[skill.category] = acc[skill.category] || []).push(skill);
  return acc;
}, {} as Record<string, Skill[]>);
```

- On part d'un **tableau plat** : `[{name:'React', category:'FRONT-END'}, {name:'Node', category:'BACK-END'}, ...]`.
- `reduce` construit un **objet** où **chaque clé est une catégorie**, et la valeur un tableau :
  `{ 'FRONT-END': [React, ...], 'BACK-END': [Node, ...] }`.
- `acc[cat] = acc[cat] || []` : « si la catégorie n'existe pas encore, crée un tableau vide », puis on
  `push` la compétence dedans.

**Regrouper une liste par un champ** est l'une des opérations les plus utiles en développement web
(grouper des commandes par client, des messages par date, etc.). Mémorise ce pattern.

L'autre bonne pratique ici est le **"config-driven"** : au lieu de coder chaque catégorie en dur, on
a un tableau `CATEGORY_CONFIG` qui décrit **libellé + icône + ordre**. Pour ajouter une catégorie, on
ajoute **une ligne** — pas du JSX.

---

## Étape 4 (optionnelle) — Remettre TON contenu exact

Le contenu affiché vient maintenant de la base (le seed). Si tu veux retrouver tes anciennes
compétences (ex. Design : Photoshop/Figma/Canva, ou Outils : XAMPP, VS Code…), **deux façons** :

**Option A — via l'admin (rapide, mais non permanent en ligne)** : sur `/admin/skills`, ajoute/edite
les compétences voulues. Parfait en local.

**Option B — via le seed (permanent, recommandé)** : ouvre `prisma/seed.ts`, section `// 6. Skills`,
et ajuste la liste `skillsList` (ajoute/retire des lignes `{ name, category, icon, level, sortOrder }`).
Puis, pour repartir d'une base propre en local :
```powershell
# supprime la base locale puis reseede (SANS risque : tout est régénéré depuis le seed)
Remove-Item dev.db -ErrorAction SilentlyContinue
npm run prisma:push
npm run db:seed
```

> Si tu ajoutes une **nouvelle catégorie** (ex. `DESIGN`), pense à ajouter une ligne correspondante
> dans `CATEGORY_CONFIG` (dans `SkillsSection.tsx`) pour lui donner un joli libellé et une icône —
> sinon elle s'affichera quand même, mais avec l'icône par défaut et son nom en MAJUSCULES.

---

## Dépannage

| Problème | Cause / solution |
|---|---|
| La section est vide | La base n'a pas de compétences → lance `npm run db:seed`. Ou toutes sont masquées (`isVisible=false`). |
| Une catégorie s'affiche en MAJUSCULES avec une icône générique | Elle n'est pas dans `CATEGORY_CONFIG` → ajoute-la (clé exacte = valeur en base). |
| Les modifs de l'admin ne s'affichent pas | Tu as bien remplacé **tout** `SkillsSection.tsx` ? La prop doit être `({ skills })`, pas `()`. |
| Erreur TypeScript sur `skill.category` / `skill.id` | Vérifie que le type `Skill` (dans `types/index.ts`) contient bien `category`, `id`, `isVisible`. |
| L'ordre des compétences dans une carte est bizarre | La liste vient triée par `sortOrder` (route `skills.ts`). Réordonne via l'admin. |

---

## Bonus — pour aller plus loin

1. **Barre de niveau** : chaque compétence a un `level` (0-100). Affiche une petite barre de
   progression sous le nom (`<div style={{ width: `${tech.level}%` }} />`).
2. **Trier les catégories par nombre** : afficher d'abord les catégories qui ont le plus de compétences.
3. **Icône par compétence** : la base a un champ `icon` (nom d'icône). Fais une table de correspondance
   `nom → composant lucide` pour afficher une vraie icône par techno (attention aux noms manquants).
4. **Mettre à jour la doc** : dans `recap.md`, la section Compétences n'est plus « codée en dur » —
   corrige la note (§6) pour refléter qu'elle est désormais pilotée par l'admin.

---

## Récap des fichiers touchés
`src/sections/SkillsSection.tsx` *(réécrit)* — et **c'est tout** côté code obligatoire.
Optionnel : `prisma/seed.ts` (contenu), `recap.md` (doc).

**La grande leçon de cet exercice** : une bonne architecture sépare **donnée / API / admin /
affichage**. Ici, il suffisait de brancher le dernier maillon pour tout activer. Quand tu construis
tes propres sites, garde cette séparation : ça rend le code **évolutif** et **réutilisable**. 🚀
