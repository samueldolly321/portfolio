# Exercice guidé nº4 — Ajouter une recherche + un filtre par catégorie aux Projets

> **Objectif** : ajouter une **barre de recherche** et des **boutons de filtre par catégorie** à la
> section Projets. Tout se passe **côté frontend** (aucun backend à toucher) : les projets sont déjà
> chargés, on va juste **filtrer la liste** avant de l'afficher.
>
> **Pré-requis** : avoir lu `TUTORIEL.md`. (Indépendant des exercices 1-3.)
>
> **Durée** : ~40 min. **Concepts** : entrée contrôlée, **filtrer un tableau**, valeurs uniques
> (`Set`), `useMemo`, état vide, dérivation d'état.

---

## L'idée (important)

Contrairement aux exercices précédents, ici **on ne touche NI à la base NI à l'API**. Pourquoi ?
Parce que la section Projets **reçoit déjà toute la liste** via sa prop `projects`. Filtrer = juste
**calculer une sous-liste** à partir de ce qu'on a déjà, en fonction de ce que tape l'utilisateur.

```
projects (déjà chargés)  ──(recherche + catégorie choisie)──>  liste filtrée  ──>  affichage
```

> 🧠 **Notion clé : l'"état dérivé".** La liste filtrée n'est pas un nouvel état à stocker : elle se
> **recalcule** à partir de `projects` + `search` + `activeCategory`. On ne stocke que les **entrées**
> (le texte cherché, la catégorie active) ; le reste se **déduit**.

---

## Étape 1 — Ce qu'on va modifier

Un seul fichier : **`src/sections/ProjectsSection.tsx`**. On va :
1. ajouter deux états : `search` (texte) et `activeCategory` (catégorie choisie) ;
2. calculer la liste des **catégories** présentes (pour les boutons) ;
3. calculer la **liste filtrée** ;
4. afficher la **barre de recherche + les boutons** ;
5. mapper sur la **liste filtrée** (au lieu de `displayList`) + gérer le cas **"aucun résultat"**.

---

## Étape 2 — Les imports

En haut de `ProjectsSection.tsx`, complète les imports :

```tsx
import React, { useState, useMemo } from 'react';   // ← ajoute useMemo
import { ExternalLink, Search, X } from 'lucide-react'; // ← ajoute Search et X
```

---

## Étape 3 — Les états et le calcul de la liste filtrée

Dans le composant, **juste après** la ligne existante :

```tsx
const displayList = projects && projects.length > 0 ? projects : mockupProjects;
```

ajoute :

```tsx
  // 1. Les entrées de filtre (ce que choisit l'utilisateur)
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');

  // 2. Les catégories disponibles, calculées à partir des projets (sans doublon)
  const categories = useMemo(() => {
    const uniques = new Set(displayList.map((p) => p.category).filter(Boolean));
    return ['Tous', ...Array.from(uniques)];
  }, [displayList]);

  // 3. La liste filtrée = catégorie choisie ET texte recherché
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return displayList.filter((p) => {
      const matchCategory = activeCategory === 'Tous' || p.category === activeCategory;
      if (!q) return matchCategory; // pas de texte -> on filtre seulement par catégorie

      // on concatène les champs "cherchables" en une seule chaîne, en minuscules
      const haystack = [
        p.title,
        p.shortDescription,
        p.description,
        (p.technologies || []).join(' '),
        p.category,
      ]
        .join(' ')
        .toLowerCase();

      return matchCategory && haystack.includes(q);
    });
  }, [displayList, search, activeCategory]);
```

**Ce que tu apprends (beaucoup !) :**
- **`new Set(...)`** supprime les doublons → parfait pour obtenir la liste unique des catégories.
- **`.filter(...)`** garde les éléments qui remplissent une condition. Ici deux conditions combinées
  (catégorie **ET** texte).
- **La technique du "haystack"** : on met tous les champs cherchables dans **une seule chaîne** et on
  fait `.includes(q)`. Recherche multi-champs en une ligne, insensible à la casse (`toLowerCase`).
- **`useMemo`** : mémorise le résultat et ne le **recalcule que si** ses dépendances changent
  (`[displayList, search, activeCategory]`). Utile quand le calcul est répété à chaque frappe.

---

## Étape 4 — L'interface : barre de recherche + boutons de filtre

Dans le `return`, **juste après** le bloc de l'en-tête (le `<Reveal direction="top">...</Reveal>`
qui contient le `<h2>Projets Récents</h2>`), ajoute :

```tsx
        {/* Barre de recherche + filtres par catégorie */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un projet, une techno..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-theme-card border border-theme text-theme-main text-sm focus:outline-none focus:border-[#f38038] transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-main"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Boutons de catégorie */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  activeCategory === cat
                    ? 'bg-gradient-mockup text-white border-transparent'
                    : 'bg-theme-card text-theme-muted border-theme hover:border-[#f38038]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
```

**Ce que tu apprends :**
- **Entrée contrôlée** : `value={search}` + `onChange={... setSearch(...)}`. React est la source de
  vérité du champ (comme le formulaire de contact).
- **Bouton "effacer"** conditionnel : `{search && ( ... )}` → n'apparaît que s'il y a du texte.
- **Style conditionnel** : le bouton de catégorie actif reçoit le dégradé (`activeCategory === cat`).

---

## Étape 5 — Afficher la liste filtrée + l'état "aucun résultat"

Dans la grille, remplace **`displayList.map(...)`** par **`filtered.map(...)`** :

```tsx
{filtered.map((project, idx) => (
   // ... (le contenu de la carte ne change pas)
))}
```

Puis, **juste après** la `</div>` qui ferme la grille (`grid grid-cols-1 ...`), ajoute un message
quand il n'y a aucun résultat :

```tsx
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm font-mono text-theme-muted">
              Aucun projet ne correspond à votre recherche.
            </p>
            <button
              type="button"
              onClick={() => { setSearch(''); setActiveCategory('Tous'); }}
              className="mt-4 px-5 py-2 rounded-xl bg-theme-card border border-theme text-xs font-semibold text-theme-main hover:border-[#f38038] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
```

**Ce que tu apprends :** toujours prévoir **l'état vide**. Une liste filtrée peut être vide — un bon
site le dit clairement au lieu d'afficher une zone blanche.

✅ **Point de contrôle final** :
1. `npm run lint` passe.
2. Recharge **http://localhost:3000/** → tu vois la barre de recherche + les boutons de catégorie.
3. **Tape** « react » → seuls les projets contenant "react" (titre, description ou techno) restent.
4. **Clique** une catégorie (ex. « Application métier ») → la liste se réduit à cette catégorie.
5. **Combine** les deux (catégorie + texte) → ça filtre sur les deux critères.
6. Tape un texte introuvable (ex. « zzz ») → le message "Aucun projet…" + bouton "Réinitialiser" apparaît.
7. Clique une carte → la **modale de détail** s'ouvre toujours (on n'a rien cassé). 🎉

---

## Le schéma mental à retenir

```
[input] --onChange--> setSearch(...)          ┐
[bouton] --onClick--> setActiveCategory(...)   �development├──> React réaffiche
                                               ┘
   useMemo recalcule "filtered" à partir de (projects, search, activeCategory)
                                               │
                                               ▼
                              filtered.map(...) -> cartes affichées
```

C'est le pattern **"entrées → état dérivé → affichage"**. Tu le retrouveras partout : recherche,
tri, pagination, tableaux de bord…

---

## Dépannage

| Problème | Cause / solution |
|---|---|
| `Search`/`X` : *is not defined* | Ajout d'import oublié à l'étape 2. |
| `useMemo is not defined` | Il faut `import React, { useState, useMemo } from 'react';`. |
| La grille ne se filtre pas | Tu as bien remplacé `displayList.map` par `filtered.map` ? |
| Les boutons de catégorie sont vides | `categories` se calcule à partir de `displayList` : vérifie que les projets ont bien un `category`. |
| La recherche est sensible à la casse | Vérifie les `.toLowerCase()` (sur le "haystack" ET sur `q`). |
| Rien ne s'affiche du tout | Ouvre la console (F12) pour l'erreur exacte ; souvent une balise mal fermée dans le JSX ajouté. |

---

## Bonus — pour aller plus loin

1. **Compteur de résultats** : affiche « X projet(s) trouvé(s) » au-dessus de la grille
   (`{filtered.length} projet{filtered.length > 1 ? 's' : ''}`).
2. **Filtre par techno** (au lieu de catégorie) : construis les boutons à partir de
   `p.technologies` (attention, il faut aplatir les tableaux : `flatMap` puis `Set`).
3. **Filtre "En vedette"** : un bouton qui ne montre que les projets `featured === true`.
4. **Anti-rebond (debounce)** : ne filtrer qu'après ~200 ms d'inactivité de frappe (avec
   `useEffect` + `setTimeout`) — utile quand la liste est grande.
5. **Filtre dans l'URL** : synchroniser la recherche avec l'URL (`?q=react`) via react-router, pour
   des liens partageables.

---

## Récap du fichier touché
`src/sections/ProjectsSection.tsx` — **c'est tout** (exercice 100 % frontend, aucune modif backend).

**La leçon** : tout n'a pas besoin du serveur. Quand les données sont **déjà là**, filtrer/trier/
chercher se fait **côté client**, instantanément, sans requête réseau. Savoir choisir entre "faire au
front" et "faire au back" est une compétence clé du développeur web. 🚀
