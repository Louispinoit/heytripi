# 🎨 HeyTripy - Brand Guidelines

> **heytripi.com** - Ton compagnon de voyage IA

---

## ✅ Décision finale

| Élément | Choix |
|---------|-------|
| **Nom** | HeyTripy |
| **Domaine** | heytripi.com |
| **Prononciation** | /heɪ ˈtrɪpi/ (hey-tri-pi) |
| **Mascotte** | Tripy (à définir) |

---

## 🎯 Pourquoi HeyTripy fonctionne

### Analyse du nom

| Critère | Score | Détail |
|---------|-------|--------|
| Universel | ⭐⭐⭐⭐⭐ | "Hey" + "Trip" compris mondialement |
| Court | ⭐⭐⭐⭐⭐ | 3 syllabes, facile à retenir |
| Prononçable | ⭐⭐⭐⭐⭐ | Identique en FR, EN, ES, DE... |
| Friendly | ⭐⭐⭐⭐⭐ | "Hey" = accueil chaleureux |
| Tech/Moderne | ⭐⭐⭐⭐ | Format "Hey[X]" très startup |
| Mascotte-ready | ⭐⭐⭐⭐⭐ | "Tripy" = personnage naturel |

### Le format "Hey[X]"
- **HeyGen** - Génération vidéo IA
- **Heyday** - Service client IA
- **Hey** (Basecamp) - Email
- → Format reconnu, moderne, conversationnel

### Parfait pour un assistant IA
- "Hey Tripy, organise mon voyage à Barcelone"
- "Demande à Tripy"
- "Tripy te suggère..."
- Naturel dans une conversation

---

## 🐾 Mascotte : Tripy

### Concept recommandé : Petite valise à roulettes animée

```
Nom         : Tripy
Type        : Valise de voyage cartoon
Personnalité: Joyeux, serviable, organisé, enthousiaste
Style       : Flat design moderne, formes rondes, grands yeux
```

### Pourquoi une valise ?
- 🎯 **Direct** : Métaphore immédiate du voyage
- 😊 **Attachant** : Objet quotidien rendu vivant (style Pixar)
- 🎨 **Flexible** : Peut porter des accessoires selon le contexte
- 📱 **Iconique** : Reconnaissable même en petit (favicon)

### Caractéristiques visuelles

```
Corps       : Valise rigide arrondie (pas rectangulaire strict)
Couleur     : Turquoise/Teal principal (#14B8A6)
Yeux        : Grands, expressifs, légèrement en haut
Bouche      : Simple, souriante, peut changer d'expression
Roulettes   : 2 petites roues = "pieds"
Poignée     : Télescopique = peut servir de "bras" levé
Accessoires : Stickers de voyage, étiquette de bagage
```

### Expressions de Tripy

| État | Expression | Usage |
|------|------------|-------|
| **Accueil** | Sourire, yeux ouverts | Message de bienvenue |
| **Réflexion** | Yeux vers le haut, petit nuage "..." | Pendant la recherche |
| **Trouvé !** | Grand sourire, étoiles autour | Résultat trouvé |
| **Excité** | Sautille, yeux brillants | Super offre ! |
| **Désolé** | Petite moue, yeux tristes | Erreur ou pas de résultat |
| **Question** | Tête penchée, "?" | Demande de précision |

### Déclinaisons

| Format | Usage | Détail |
|--------|-------|--------|
| **Icône app** | Favicon, app icon | Juste la valise, simplifié |
| **Avatar chat** | Bulle de conversation | Tête de Tripy + expression |
| **Illustration** | Marketing, landing | Corps entier + contexte |
| **Animation** | Loading, transitions | Roulettes qui tournent |
| **Emoji pack** | Réactions in-app | 8-12 expressions |

---

## 🎨 Palette de couleurs

### Couleurs principales

| Nom | Hex | Usage |
|-----|-----|-------|
| **Tripy Teal** | `#14B8A6` | Couleur principale, mascotte |
| **Sunset Orange** | `#F97316` | Accent, CTA, énergie |
| **Sky Blue** | `#0EA5E9` | Secondaire, ciel, voyage |
| **Cloud White** | `#F8FAFC` | Fond clair |
| **Night Navy** | `#0F172A` | Texte, fond dark mode |

### Palette complète (Tailwind)

```css
:root {
  /* Primary - Tripy Teal */
  --tripi-50: #F0FDFA;
  --tripi-100: #CCFBF1;
  --tripi-200: #99F6E4;
  --tripi-300: #5EEAD4;
  --tripi-400: #2DD4BF;
  --tripi-500: #14B8A6;  /* Principal */
  --tripi-600: #0D9488;
  --tripi-700: #0F766E;
  --tripi-800: #115E59;
  --tripi-900: #134E4A;

  /* Accent - Sunset Orange */
  --sunset-400: #FB923C;
  --sunset-500: #F97316;  /* Principal */
  --sunset-600: #EA580C;

  /* Secondary - Sky Blue */
  --sky-400: #38BDF8;
  --sky-500: #0EA5E9;  /* Principal */
  --sky-600: #0284C7;
}
```

### Dégradés

```css
/* Dégradé hero principal */
.gradient-hero {
  background: linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%);
}

/* Dégradé sunset (CTA, highlights) */
.gradient-sunset {
  background: linear-gradient(135deg, #F97316 0%, #FB923C 100%);
}

/* Dégradé ciel (backgrounds) */
.gradient-sky {
  background: linear-gradient(180deg, #0EA5E9 0%, #38BDF8 50%, #F0FDFA 100%);
}
```

---

## 🔤 Typographie

### Polices recommandées

| Usage | Police | Fallback |
|-------|--------|----------|
| **Titres** | Plus Jakarta Sans | system-ui |
| **Corps** | Inter | system-ui |
| **Mono** | JetBrains Mono | monospace |

### Hiérarchie

```css
/* Titres */
h1 { font-size: 3rem; font-weight: 800; } /* 48px */
h2 { font-size: 2.25rem; font-weight: 700; } /* 36px */
h3 { font-size: 1.5rem; font-weight: 600; } /* 24px */

/* Corps */
body { font-size: 1rem; font-weight: 400; } /* 16px */
.lead { font-size: 1.25rem; font-weight: 400; } /* 20px */
.small { font-size: 0.875rem; } /* 14px */
```

### Import Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## 📝 Tone of Voice

### Personnalité de marque

| Trait | Description | Exemple |
|-------|-------------|---------|
| **Friendly** | Comme un ami qui aide | "Hey ! Où veux-tu aller ?" |
| **Enthousiaste** | Passionné par le voyage | "J'ai trouvé une super offre ! 🎉" |
| **Expert** | Connaisseur mais accessible | "Barcelone en mars ? Parfait, il fait 18°C en moyenne" |
| **Rassurant** | Prend en charge | "Ne t'inquiète pas, je m'occupe de tout" |
| **Concis** | Va à l'essentiel | Pas de blabla inutile |

### Do's ✅

- Utiliser "tu" (pas "vous")
- Utiliser des emojis avec parcimonie 🌍✈️
- Poser des questions ouvertes
- Célébrer les choix de l'utilisateur
- Proposer des alternatives

### Don'ts ❌

- Pas de jargon technique
- Pas de phrases trop longues
- Pas de ton corporate/froid
- Pas de négativité ("malheureusement", "impossible")
- Pas de sur-promesse

### Exemples de messages

```
✅ "Hey ! Raconte-moi ton voyage idéal 🌴"
❌ "Bienvenue sur notre plateforme de planification de voyages."

✅ "Super choix ! Barcelone va te plaire 😍"
❌ "Votre destination a été enregistrée."

✅ "Hmm, c'est un peu au-dessus de ton budget. Que dirais-tu de cet hôtel à la place ?"
❌ "Erreur : budget insuffisant."

✅ "J'ai trouvé 3 vols parfaits pour toi !"
❌ "Résultats de recherche : 3 vols disponibles."
```

---

## 📐 Logo

### Concept

Le logo combine :
1. **Wordmark** : "HeyTripy" en Plus Jakarta Sans Bold
2. **Icône** : Tripy la valise (simplifiée)

### Versions

| Version | Usage |
|---------|-------|
| **Logo complet** | Site web, marketing |
| **Logo horizontal** | Header, emails |
| **Icône seule** | Favicon, app icon, avatar |
| **Monochrome** | Sur fond coloré |

### Zones de protection

```
┌──────────────────────────────────┐
│                                  │
│   [X]  ┌─────────────────────┐   │
│        │                     │   │
│   [X]  │   🧳 HeyTripy       │   │
│        │                     │   │
│   [X]  └─────────────────────┘   │
│                                  │
└──────────────────────────────────┘

X = hauteur du "H" = espace minimum autour du logo
```

### Tailles minimales

| Format | Taille min |
|--------|------------|
| Print | 25mm de large |
| Digital | 120px de large |
| Favicon | 32x32px (icône seule) |
| App icon | 512x512px |

---

## 🌐 Baselines / Taglines

### Principale

| Langue | Baseline |
|--------|----------|
| 🇫🇷 FR | **"Ton compagnon de voyage IA"** |
| 🇬🇧 EN | **"Your AI travel buddy"** |

### Alternatives

| FR | EN |
|----|-----|
| "Dis-moi où tu veux aller" | "Tell me where you want to go" |
| "Le voyage, en mieux" | "Travel, upgraded" |
| "Planifie en discutant" | "Plan by chatting" |
| "L'aventure commence ici" | "Adventure starts here" |

---

## 📱 Réseaux sociaux

### Handles à réserver

| Plateforme | Handle | Statut |
|------------|--------|--------|
| Twitter/X | @heytripi | ❓ À vérifier |
| Instagram | @heytripi | ❓ À vérifier |
| TikTok | @heytripi | ❓ À vérifier |
| LinkedIn | /company/heytripi | ❓ À créer |
| YouTube | @heytripi | ❓ À vérifier |

### Photo de profil
- Utiliser l'icône Tripy (mascotte seule)
- Fond Tripy Teal (#14B8A6)
- Format carré, centré

### Bannière
- Dégradé hero + logo complet
- Baseline dans la langue principale du compte

---

## 📋 Checklist branding

### Immédiat
- [x] Nom choisi : HeyTripy
- [x] Domaine : heytripi.com
- [ ] Acheter le domaine
- [ ] Réserver les handles sociaux
- [ ] Brief mascotte au designer

### Court terme
- [ ] Design mascotte Tripy (illustrateur)
- [ ] Logo wordmark + icône
- [ ] Favicon et app icons
- [ ] Kit réseaux sociaux

### Moyen terme
- [ ] Pack d'expressions Tripy (8-12)
- [ ] Animations loading
- [ ] Guide de style complet
- [ ] Templates marketing

---

## 🎨 Brief pour designer/illustrateur

```
PROJET : Mascotte HeyTripy

CLIENT : HeyTripy - Assistant voyage IA
NOM MASCOTTE : Tripy

CONCEPT :
Petite valise de voyage à roulettes, animée et expressive.
Style cartoon moderne, friendly, pas enfantin.

RÉFÉRENCES VISUELLES :
- Duolingo (Duo) - Expressivité
- Headspace - Simplicité
- Notion - Modernité
- Pixar (Luxo Jr.) - Personnalité d'un objet

PERSONNALITÉ :
- Joyeux et enthousiaste
- Serviable et attentionné
- Un peu excité quand il trouve quelque chose
- Rassurant et fiable

STYLE :
- Flat design avec légère profondeur
- Formes arrondies (pas de coins durs)
- Grands yeux expressifs (2/3 de la "tête")
- Palette : Teal (#14B8A6), Orange (#F97316), White, Navy

LIVRABLES :
1. Character sheet (face, profil, 3/4)
2. 8 expressions (neutre, content, réfléchit, excité, triste, question, trouvé!, bye)
3. Version simplifiée pour icône (32px)
4. Fichiers : AI, SVG, PNG (@1x, @2x, @3x)

DEADLINE : [À définir]
BUDGET : [À définir]
```

---

## 🚀 Prochaines étapes

1. **Acheter heytripi.com** sur Namecheap/Gandi
2. **Réserver @heytripi** sur Twitter, Instagram, TikTok
3. **Trouver un illustrateur** (Fiverr, Dribbble, 99designs)
4. **Valider la mascotte** avec quelques personnes
5. **Intégrer dans le code** (logo, favicon, meta tags)

---

*Document créé le 16/01/2026 - HeyTripy Brand Guidelines v1.0*
