# Publication sur un serveur étudiant

La publication n'a pas encore eu lieu. Un compte d'hébergement activé par son propriétaire
et un serveur accessible sont nécessaires. L'offre Azure for Students fournit des crédits
limités, pas une garantie de serveur gratuit à vie : https://azure.microsoft.com/en-gb/free/students/

## Ce qui est préparé

- Conteneur Linux avec Node.js, moteur vocal Piper et voix française.
- HTTPS avec Caddy ; le port applicatif n'est pas exposé directement.
- Volume permanent pour comptes, documents, sessions et progression.
- Inscription ouverte : chaque visiteur crée son identifiant et son mot de passe.
- Documents et progression séparés côté serveur par utilisateur.
- Limites de connexion par adresse de visiteur transmise par le proxy de confiance.

## Étape à effectuer par le propriétaire

Activer Azure for Students avec son adresse universitaire et terminer la vérification.
Ne pas communiquer son mot de passe, ses codes de connexion ni ses clés dans le chat.
Conserver le plafond de dépenses de l'offre et ne pas convertir l'abonnement en offre payante.
Le dimensionnement et le coût estimé du serveur restent à vérifier avant sa création.

## Déploiement une fois le serveur fourni

Sur une VM Linux avec Docker Compose et un nom DNS pointant vers son IP :

```sh
cp .env.public.example .env.public
# Remplacer PUBLIC_DOMAIN par le nom DNS réel du serveur.
docker compose --env-file .env.public -f compose.public.yaml up --build -d
```

Autoriser les ports 80 et 443 sur le serveur. Le nom DNS fourni par l'hébergeur peut
être utilisé ; l'achat d'un domaine personnel n'est pas nécessaire.

Vérifier ensuite `/api/health`, créer deux comptes, importer un document dans le premier
et vérifier qu'il est inaccessible au second. Tester une narration et le téléchargement
d'une vidéo. Le lien public ne sera annoncé qu'après ces contrôles.

Le serveur public démarre avec ses propres données ; les données de l'ordinateur
ne sont pas envoyées automatiquement. Sauvegarder régulièrement le volume
`studybridge_data` et les certificats. Ne pas supprimer les volumes à l'arrêt.
Conserver une seule instance de l'application avec ce stockage en fichiers JSON.

Les projets de studio restent enregistrés dans le navigateur de chaque personne,
séparément par compte. Les vidéos doivent être téléchargées par leur auteur.

## Validation du 21 octobre 2026

22 tests automatisés réussis. La configuration Compose publique a été validée et l’image Docker a été construite avec succès. Dans un conteneur Linux isolé sans réseau externe : contrôle de santé HTTP 200, inscription HTTP 201 et synthèse vocale française fonctionnelle. HTTPS et accès depuis Internet restent à valider après l’activation du compte étudiant et la création du serveur.
