## Narration locale

21 tests passent. La synthèse vocale française réelle a été effectuée avec Piper/SIWIS, puis un export complet de 15 secondes a été téléchargé. La piste vidéo VP9 et la piste audio Opus ont été vérifiées dans le fichier WebM. Les tests couvrent le mixage, le calage par scène, l’allongement de durée sans dépasser six minutes et le contrôle d’accès à la synthèse.

## Studio anime local

Quatre tests supplémentaires vérifient la limite de 360 secondes, les scènes aux extrémités de la chronologie, la sauvegarde par compte, l’échappement du scénario, la libération des pistes après export et les exports interrompus.

Vérifications navigateur : réglage 6:00, export réel de 15 secondes en 1280 × 720 téléchargé en WebM (3,66 Mo), préparation d’un storyboard WIM de quatre scènes, maintien de la durée et du décor après rechargement, disposition sur ordinateur de 1440 px et sur panneau étroit. La durée maximale est testée avec une horloge simulée ; aucun enregistrement réel de six minutes n’a été lancé.

# Validation de la reprise locale — 20 octobre 2026

21 tests automatisés réussis. Commande directe si npm est absent :

```powershell
node --test tests/learning.test.mjs tests/server.test.mjs tests/sync.test.mjs tests/maintenance.test.mjs tests/anime.test.mjs
```

Nouveaux contrôles : séparation de la progression par compte, validation des données, refus des écritures concurrentes obsolètes, conservation des sessions et notes après redémarrage, invalidation après déconnexion, sauvegarde locale en cas de panne réseau et absence de transfert automatique des notes invitées.

Vérifications navigateur effectuées sur une instance isolée : connexion, choix de langue, import et extraction du PDF WIM de 18 pages, notes et fiches terminées conservées après rechargement, réponse et chronomètre du Klausur conservés après rechargement, remise à expiration avec score correct, création et téléchargement d’une vidéo WebM silencieuse. Correction d’un dédoublement du bouton de compte et d’un problème d’horloge d’animation.

Sauvegarde réelle du dossier de données créée avant redémarrage. Restauration et récupération de compte vérifiées avec des données fictives.

La suite ci-dessous décrit la validation initiale de l’archive et les vérifications navigateur à compléter. Aucun appel IA payant n’a été effectué pendant la reprise.

# Validation effectuée

Commande : `npm test`.

Huit tests réussis :

1. Pages publiques, API privée, mot de passe haché et absence d’exposition de fichiers serveur.
2. Import, lecture, téléchargement, isolation entre deux comptes, refus d’une origine étrangère, suppression et déconnexion.
3. Rejet d’un faux PDF et message explicite quand l’IA n’est pas configurée.
4. Construction de la requête IA et extraction de sa réponse, avec fournisseur simulé.
5. Erreurs fournisseur sans divulgation de secret ni réponse inventée.
6. Expiration du Klausur, score et sauvegarde unique.
7. Conservation d’une copie écrite sans inventer de note automatique.
8. Maintien des QCM bilingues et des 30 flashcards.

Les tests de logique pédagogique utilisent un DOM simulé. Les tests serveur utilisent de vraies requêtes HTTP vers un serveur local et des dossiers temporaires.

## Vérifications historiques de l’archive

- Choisir FR puis EN, parcourir les fiches et les flashcards.
- Créer deux comptes et vérifier leurs listes de cours respectives.
- Importer un petit PDF textuel, rechercher un passage et télécharger l’original.
- Importer un PDF scanné et constater l’absence de texte/OCR sans confondre cette absence avec un import échoué.
- Lancer un Klausur de 1 minute, répondre, recharger la page et attendre la remise automatique.
- Lire une animation puis l’exporter en gardant l’onglet visible.
- Vérifier l’interface sur mobile et le fonctionnement du clavier.
- Après configuration d’une vraie clé API, contrôler une réponse en la comparant aux pages sources.

Aucun essai graphique dans un navigateur, aucun export MediaRecorder réel et aucun appel API OpenAI réel n’ont été effectués lors de la création de cette archive. Le code spécifique à Sites a été compilé séparément avec succès, mais la nouvelle version Sites n’a pas été déployée avant l’export demandé.
