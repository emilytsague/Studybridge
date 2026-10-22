# StudyBridge

**Présentation du projet :** [Portfolio en allemand](README.portfolio.md) · [Prototype interactif](docs/prototype/index.html) · [Transparence sur l’utilisation de l’IA](docs/KI-TRANSPARENZ.md).

**Reprise locale du 20 octobre 2026 :** double-clique sur `DEMARRER.cmd`. Voir `LIRE-MOI.txt` et `docs/UTILISATION.md` pour les sauvegardes et la récupération de compte. La progression et les Klausur sont désormais sauvegardés par compte.

Plateforme de révision pour étudiants internationaux : français ou anglais, avec l’allemand en parallèle.

**Cette version fonctionne hors de ChatGPT.** Elle se lance avec Node.js, dispose de ses propres comptes et stocke les documents dans un dossier privé du serveur. Le code à la racine est la version à utiliser pour ton projet GitHub.

**Studio anime local :** personnages originaux Aya et Noé, décors animés, storyboard éditable et export HD jusqu’à six minutes, sans frais API. Voir [docs/STUDIO-ANIME.md](docs/STUDIO-ANIME.md).

## Démarrage rapide sous Windows

1. Installe **Node.js 22.13 ou supérieur** sur ton ordinateur : https://nodejs.org/
2. Extrais l’archive ZIP. Ouvre le dossier `StudyBridge` dans Visual Studio Code ou dans PowerShell.
3. Exécute :

```powershell
Copy-Item .env.example .env
npm start
```

4. Ouvre **http://localhost:3000** dans ton navigateur. Utilise cette adresse exacte : elle correspond à `PUBLIC_ORIGIN` dans `.env`.
5. Clique sur **Connexion**, puis **Créer un compte**. Choisis un identifiant et un mot de passe d’au moins 12 caractères. Ce compte est propre à ton installation StudyBridge, sans lien avec ChatGPT.
6. Va dans **Importer mes cours** pour ajouter un PDF, TXT ou MD.

Sous Linux/macOS :

```bash
cp .env.example .env
npm start
```

Aucune installation de dépendances npm n’est nécessaire pour la version autonome. Le serveur utilise les modules intégrés de Node.js. Le lecteur PDF.js est fourni dans `public/vendor` avec sa licence.

Pour arrêter : `Ctrl+C`. Pour le développement avec redémarrage du serveur : `npm run dev`. Recharge le navigateur après une modification du frontend.

## Fonctionnalités et état réel

| Fonction | État |
|---|---|
| Interface français / anglais et notions allemandes | Incluse |
| 10 fiches WIM, 30 flashcards, quiz et mini-tests | Inclus |
| Création de compte et connexion indépendantes | Incluses, vérifiées par tests HTTP |
| Import PDF, TXT et Markdown, jusqu’à 15 Mo / 500 pages | Inclus ; extraction PDF dans le navigateur |
| Documents privés par compte | Isolation et accès testés |
| Lecture du texte, recherche, téléchargement, suppression | Inclus |
| Klausur WIM chronométré | Correction automatique QCM, remise à expiration |
| Klausur d’un cours importé | Réponses écrites sur des extraits, grille d’auto-évaluation |
| Assistant IA pédagogique | Code inclus ; nécessite une clé API et un modèle configurés |
| Quiz / flashcards rédigés par l’IA | Textes d’étude dans l’assistant ; pas d’intégration automatique aux sessions |
| Scénario d’animation rédigé par l’IA | Inclus avec l’API ; bouton pour l’ouvrir dans le studio |
| Studio anime local et export vidéo | Aya et Noé animés, 3 décors, 1 à 12 scènes, 15 s à 6 min, vidéo HD avec narration française locale optionnelle |
| Vidéo IA avec personnages, voix et scènes générées | Non implémentée ; nécessite un service vidéo supplémentaire |
| OCR des PDF scannés | Non inclus |

**Validation de la reprise locale :** 22 tests automatisés réussis couvrent les API, l’isolation des documents, les erreurs, l’expiration du Klausur et les réponses IA simulées. La connexion réelle à OpenAI n’a pas été testée : aucune clé API réelle n’a été utilisée. L’import du PDF WIM, la sauvegarde des notes et examens, la remise automatique et l’export vidéo ont été vérifiés dans le navigateur intégré. Voir `docs/TESTS.md`.

## Arborescence

```text
StudyBridge/
  server.mjs                 Serveur HTTP, comptes, documents, assistant IA
  package.json               Commandes npm, aucun module externe requis
  .env.example               Modèle de configuration, sans secrets
  .gitignore                 Exclut .env, données, dépendances et journaux
  public/
    index.html               Point d’entrée du site
    style.css                Styles et responsive
    content.js               Contenu pédagogique WIM en trois langues
    app.js                   Fiches, quiz, flashcards et progression
    extensions.js            Import, Klausur chronométré, studio animé
    portable.js              Connexion indépendante et interface IA
    login.html, login.js     Connexion et création de compte
    vendor/                  PDF.js et ressources, avec licence
    WIM_Cours_complet_FR.pdf  Document source fourni
  tests/                     Tests Node.js
  docs/                      Installation, GitHub, API, déploiement, tests
  Dockerfile                 Conteneur optionnel
  compose.yaml               Démarrage Docker avec volume persistant
  .github/workflows/ci.yml   Exécution des tests à chaque push / pull request
  sites-source/              Copie séparée du code spécifique à ChatGPT Sites
```

`sites-source/` est fourni pour conserver le code de la version Sites et de ses modifications. **Tu n’en as pas besoin pour lancer la version indépendante.** Ses dépendances et son infrastructure sont distinctes. Aucun identifiant de déploiement, jeton Git, compte utilisateur ou secret n’est exporté.

## GitHub

Le guide complet est dans **[docs/GITHUB.md](docs/GITHUB.md)**. Depuis le dossier `StudyBridge` :

```bash
git init
git add .
git commit -m "Initial version of StudyBridge"
git branch -M main
git remote add origin https://github.com/TON_IDENTIFIANT/StudyBridge.git
git push -u origin main
```

Remplace `TON_IDENTIFIANT` par ton identifiant GitHub et crée d’abord le dépôt vide sur GitHub. Aucun dépôt n’a été créé ni alimenté automatiquement dans ton compte.

## Activer l’IA

Dans `.env`, ajoute ta propre clé et le nom exact d’un modèle disponible pour ton compte API :

```dotenv
OPENAI_API_KEY=ta_cle_api
OPENAI_MODEL=nom_exact_du_modele
```

Puis redémarre le serveur. La clé reste côté serveur. Ne la place jamais dans `public/`, le navigateur ou un commit. Ne partage pas ton fichier `.env`.

L’API est facultative : cours, imports, quiz existants, Klausur et animations déterministes restent utilisables sans clé. L’assistant envoie seulement la question et jusqu’à cinq extraits du document sélectionné. Il ne lit pas nécessairement tout le document. Les extraits transmis apparaissent sous sa réponse.

La sélection des extraits est une recherche simple par mots-clés, sans embeddings. Les réponses IA peuvent comporter des erreurs. Les limites API et les coûts dépendent de ton compte et du modèle choisi. L’application ne génère pas de vidéo IA et ne contient pas de clé prépayée.

Détails et documentation officielle : **[docs/IA.md](docs/IA.md)**.

## Données et déploiement

- Les comptes et fichiers importés sont dans `data/`, exclu de Git.
- Un compte retrouve ses documents sur plusieurs appareils s’ils accèdent au **même serveur**.
- Les notes WIM, flashcards, résultats et copie du Klausur sont sauvegardés par compte sur le serveur après connexion, avec un cache local séparé. En mode invité, ils restent dans le navigateur. Sur un ordinateur partagé, utilise des profils de navigateur séparés.
- Les sessions de connexion sont en mémoire : un redémarrage du serveur impose une nouvelle connexion.
- Il n’y a pas de récupération de mot de passe par e-mail dans cette version.
- Cette version est prévue pour une seule instance serveur avec un disque persistant. Ne lance pas plusieurs instances sur les mêmes fichiers JSON.
- Les contenus WIM et leur PDF sont accessibles aux visiteurs du site. Les documents importés restent privés par compte.

Pour un hébergement indépendant avec Docker, HTTPS et sauvegardes : **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)**.

## Tests

```bash
npm test
```

Les tests n’appellent aucun fournisseur IA réel et n’entraînent aucun usage API facturable.

## Sources pédagogiques et composants tiers

Les fiches WIM sont des adaptations du PDF fourni, avec des références de pages. Elles ne remplacent pas le cours officiel. Les traductions sont des aides de révision non officielles.

PDF.js est distribué avec sa licence dans `public/vendor/PDFJS-LICENSE`. Voir aussi `THIRD_PARTY_NOTICES.md`. Avant de rendre un dépôt public, assure-toi de pouvoir y publier les supports de cours que tu y inclus. Les fichiers importés via l’application ne sont jamais ajoutés automatiquement au dépôt.


## Distribution GitHub

Les comptes, documents personnels, sauvegardes et le PDF source WIM ne sont pas inclus. Les liens vers le PDF WIM nécessitent une copie locale de ce document. Les modèles de voix se téléchargent avec INSTALLER-VOIX.cmd. Le dossier sites-source est une archive historique non incluse dans cette distribution.

