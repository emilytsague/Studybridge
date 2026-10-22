# Utilisation et entretien

Lancer `DEMARRER.cmd` sous Windows, puis ouvrir http://localhost:3000.
Node.js 22.13+ suffit ; aucune installation de dépendances n'est requise.
Si Node n'est pas dans le PATH, le lanceur utilise le runtime Codex présent sur cet ordinateur.
Sur un autre ordinateur, installer Node.js au préalable.

## Progression

Après connexion, les notes WIM, fiches terminées, cartes mémorisées, résultats
et dernier Klausur sont sauvegardés dans le dossier privé du serveur par compte.
Le bandeau indique l'état de sauvegarde. En cas de conflit entre fenêtres,
choisir explicitement la copie à conserver. Éviter de modifier le même compte
simultanément sur plusieurs fenêtres. Une copie locale par compte permet de
réessayer une sauvegarde après une interruption réseau.

Les anciennes données du mode invité restent dans le navigateur. Elles ne sont
pas attribuées automatiquement à un compte, pour éviter un mélange sur un ordinateur partagé.
Les scènes éditées dans le studio et réponses de l'assistant restent temporaires.
Les sessions expirent après sept jours et survivent au redémarrage du serveur.

## Sauvegarder et restaurer

Arrêter le serveur avant toute opération de maintenance. Depuis le dossier du projet :

```powershell
node --env-file-if-exists=.env scripts/maintenance.mjs backup
node --env-file-if-exists=.env scripts/maintenance.mjs restore "CHEMIN_DU_DOSSIER_DE_SAUVEGARDE"
```

La restauration crée un nouveau dossier sans écraser les données courantes.
Copier le chemin affiché dans `DATA_DIR` dans `.env`, puis redémarrer.
Les connexions de la copie restaurée sont invalidées : se reconnecter.
Les sauvegardes contiennent des documents privés : les conserver à l'abri et
en garder une copie sur un autre disque. Le fichier `.env` se sauvegarde séparément.

## Mot de passe oublié

Le propriétaire de l'ordinateur peut réinitialiser un compte local, serveur arrêté :

```powershell
node --env-file-if-exists=.env scripts/maintenance.mjs reset-password MON_IDENTIFIANT
```

L'outil sauvegarde d'abord les données, génère un mot de passe aléatoire et
invalide les connexions de ce compte. Conserver le nouveau mot de passe en privé.
Il n'existe pas de récupération par e-mail.

## IA et limites

Configurer la clé et le modèle dans `.env`, jamais dans le navigateur ni dans Git.
Voir `IA.md`. Sans ces paramètres, le site garde ses fiches, quiz, imports,
examens écrits et animations. L'IA, l'OCR et la génération de vidéos avec voix
et personnages sont des fonctions distinctes : seules les fonctions décrites
comme implémentées sont disponibles.

## Hébergement futur

Conserver une seule instance de serveur avec un disque persistant.
Configurer HTTPS, `PUBLIC_ORIGIN` et `COOKIE_SECURE=true` selon `DEPLOIEMENT.md`.
Ne pas transférer le dossier de sauvegardes dans un répertoire public.
Les mises à jour de dépendances de `sites-source/` ne sont pas nécessaires au serveur autonome.
