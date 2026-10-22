# Héberger la version autonome

## Serveur Node.js

Utilise un serveur capable d’exécuter Node.js 22.13 ou supérieur, avec un disque persistant.

```bash
npm start
```

Variables principales :

| Variable | Rôle |
|---|---|
| `PORT` | Port HTTP, 3000 par défaut |
| `HOST` | `127.0.0.1` en local ; `0.0.0.0` dans un conteneur |
| `PUBLIC_ORIGIN` | Origine exacte visible dans le navigateur, sans slash final |
| `DATA_DIR` | Chemin du stockage privé, en dehors du dossier `public/` |
| `COOKIE_SECURE` | `true` lorsque le site est servi en HTTPS |
| `REGISTRATION_CODE` | Code facultatif exigé pour créer un compte |
| `OPENAI_API_KEY` | Clé API facultative, uniquement côté serveur |
| `OPENAI_MODEL` | Modèle compatible disponible pour ton compte |
| `AI_REQUESTS_PER_HOUR` | Limite locale par utilisateur, 20 par défaut |

En production, configure `PUBLIC_ORIGIN=https://ton-domaine.example` et `COOKIE_SECURE=true`. Place un reverse proxy HTTPS devant le port Node, puis garde le serveur Node inaccessible directement depuis l’extérieur si tu relies un domaine public.

Le contrôle d’origine des requêtes protège les actions de modification. Si tu vois `invalid_origin`, vérifie l’adresse dans le navigateur et la valeur de `PUBLIC_ORIGIN`.

## Docker, optionnel

Copie d’abord `.env.example` vers `.env`, puis :

```bash
docker compose up --build -d
```

Le volume `studybridge_data` conserve les comptes et documents. L’application écoute en interne sur le port 3000. Pour un domaine public, ajoute un reverse proxy HTTPS et adapte les variables ci-dessus.

```bash
docker compose logs -f
docker compose down
```

Ne supprime pas le volume si tu veux conserver les données. La nouvelle image Docker a été construite et vérifiée localement le 21 octobre 2026, y compris la création de compte et la narration française. La configuration publique avec HTTPS est dans compose.public.yaml ; voir PUBLICATION-ETUDIANTE.md.

## Sauvegardes et exploitation

- Sauvegarde `data/` ou le volume Docker, pas seulement le dépôt Git.
- Les comptes contiennent des mots de passe hachés avec scrypt et un sel distinct. Aucun mot de passe en clair n’est stocké.
- Les sessions sont persistées sur disque avec les jetons hachés (expiration : sept jours). Les limites de requêtes restent en mémoire et redémarrent avec le processus.
- Les comptes, progression et documents utilisent des fichiers JSON et des dossiers privés. Cette version cible **une seule instance**, pas un déploiement multi-réplicas.
- Un utilisateur peut stocker au maximum 100 cours ; chaque fichier est limité à 15 Mo. Surveille l’espace disque global si tu ouvres les inscriptions.
- Les limites de requêtes de ce projet ne remplacent pas les limites de dépenses du fournisseur IA. Configure ces dernières séparément.
- Aucun e-mail de vérification ni récupération par e-mail n’est implémenté. Le propriétaire dispose d’un outil local de réinitialisation : voir UTILISATION.md.

Pour un établissement ou une utilisation à grande échelle, remplace les fichiers JSON et sessions mémoire par une base de données et un système d’identité adaptés, puis fais vérifier l’authentification et les sauvegardes. Ce projet constitue une base de travail fonctionnelle, pas une certification de sécurité.
