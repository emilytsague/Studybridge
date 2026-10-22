# Mettre StudyBridge sur ton GitHub

## Méthode recommandée : Git depuis ton ordinateur

1. Extrais l’archive et ouvre le dossier qui contient `server.mjs` et `package.json`.
2. Installe Git si nécessaire : https://git-scm.com/downloads
3. Connecte-toi à ton compte sur https://github.com/ et crée un nouveau dépôt nommé `StudyBridge`.
4. Choisis privé ou public. Pour ce premier envoi, laisse décochées les options de création d’un README, d’une licence et d’un `.gitignore`, car les fichiers du projet sont déjà fournis.
5. Dans le terminal ouvert à la racine du projet, exécute :

```bash
git init
git add .
git commit -m "Initial version of StudyBridge"
git branch -M main
git remote add origin https://github.com/TON_IDENTIFIANT/StudyBridge.git
git push -u origin main
```

La dernière commande peut ouvrir une demande d’authentification GitHub. Utilise ton propre compte.

Si Git demande ton nom et ton adresse de commit, configure-les pour ce dépôt :

```bash
git config user.name "Ton nom"
git config user.email "Ton adresse de commit GitHub"
```

Puis recommence la commande de commit. Tu peux utiliser l’adresse `noreply` fournie dans tes paramètres GitHub.

## Vérification avant l’envoi

```bash
git status
git ls-files .env data
```

La seconde commande ne doit afficher aucun fichier. Le modèle `.env.example` peut être publié ; le vrai `.env` et `data/` doivent rester exclus.

## Après une modification

```bash
git add .
git commit -m "Describe the change"
git push
```

## Depuis un autre ordinateur

```bash
git clone https://github.com/TON_IDENTIFIANT/StudyBridge.git
cd StudyBridge
```

Copie `.env.example` vers `.env`, puis lance `npm start`. Les données de ton ancien ordinateur ne sont pas dans Git : copie aussi ton dossier `data/` en dehors du dépôt si tu veux transférer les comptes et documents.

## Le rôle de GitHub

GitHub conserve ton code et ses versions. Le serveur `server.mjs` doit être exécuté sur ton ordinateur ou un hébergement Node.js/Docker. Publier le code ne démarre pas automatiquement le serveur ni l’IA. Un hébergement purement statique ne peut pas exécuter les fonctions de comptes, fichiers privés et IA de ce projet.

Le fichier `.github/workflows/ci.yml` propose un contrôle automatisé avec `npm test`. Ce workflow n’a pas été exécuté sur ton compte ; il démarrera après l’envoi si GitHub Actions y est autorisé.
