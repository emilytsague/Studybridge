# Studio anime local

Dans StudyBridge, ouvrir **Studio animé**. Le studio crée une vidéo avec des personnages
originaux dessinés sur l'appareil : Aya et Noé, en duo ou en solo. Ils clignent des yeux,
font des gestes et alternent les explications. Trois décors sont disponibles.

1. Choisir un cours WIM ou un document importé contenant du texte.
2. Cliquer sur **Préparer les scènes**. Des extraits deviennent le scénario ; relire et modifier le texte.
3. Choisir les personnages, le décor et la durée totale entre 15 secondes et **6 minutes maximum**.
4. Modifier, ajouter ou retirer des scènes (1 à 12). Avec la narration, le temps de chaque scène suit la longueur de sa lecture.
5. Utiliser **Lire**, la barre de lecture ou les vignettes pour vérifier le résultat.
6. Cliquer sur **Exporter la vidéo** et laisser l'onglet visible jusqu'à l'apparition du téléchargement.

L'export prend autant de temps que la vidéo : une vidéo de six minutes demande environ
six minutes d'enregistrement. La résolution est de 1280 × 720 pixels, à 24 images/seconde.
Le format est WebM ou MP4 selon le navigateur ; aucun convertisseur n'est requis.
La vidéo contient les personnages, le tableau pédagogique et les sous-titres, avec une narration française locale si la case **Narration française** est cochée.
Une interruption donne un fichier partiel explicitement signalé. Relancer l'export pour obtenir toute la vidéo.

Le projet est conservé dans ce navigateur, séparément par compte, sans synchronisation
sur le serveur. Les vidéos exportées sont à télécharger et à conserver séparément.
Le dernier téléchargement est retiré de l'interface quand le scénario change pour éviter
de confondre l'ancienne vidéo et le nouveau projet.

Les personnages et scènes sont animés localement, sans appel de génération vidéo ni frais API.
Le studio ne prétend pas générer un film d'animation par IA. L'assistant IA facultatif
peut toujours transmettre ses scénarios au studio si une clé est configurée.

## Narration française

La voix SIWIS lit exactement le champ Explication / sous-titres de chaque scène.
Elle est entendue avec Lire et intégrée à la piste audio de la vidéo exportée.
La première préparation prend quelques secondes ; modifier un texte déclenche une nouvelle synthèse.
La durée totale est augmentée si nécessaire pour ne couper aucune phrase, sans dépasser six minutes.
Au-delà, raccourcir le texte. Limite de scénario : 6 000 caractères pour la narration.
Le calage est effectué par scène, sans alignement mot à mot. Les deux personnages partagent la même voix française.

Le moteur Piper 1.8.0 et le modèle fr_FR-siwis-medium sont installés dans .voice-runtime et voices.
Ils restent locaux et ne sont pas inclus dans Git. Pour réinstaller sur Windows :
INSTALLER-VOIX.cmd (Python requis et Internet uniquement pour cette installation).
Sur un autre système, créer .voice-runtime avec Python, installer scripts/voice-requirements.txt
et utiliser piper.download_voices fr_FR-siwis-medium --download-dir voices.
La narration nécessite une connexion au compte StudyBridge. Aucun texte n’est envoyé à un fournisseur externe.
Le conteneur Docker de base ne contient pas Python ni le modèle : les installer séparément pour l’y activer.
