# Préparation de la publication

La documentation et le prototype ont été préparés localement le 21 octobre 2026. Aucun fichier n'a été publié sur GitHub à cette étape : le compte connecté est ArielBleriot, tandis que le profil fourni indique emilytsague. Le dépôt exact doit être confirmé.

## Fichiers de présentation

- `README.portfolio.md` : présentation allemande du projet pour un recruteur.
- `docs/PROJEKT-DE.md` : objectifs, exigences observées, architecture et limites.
- `docs/KI-TRANSPARENZ.md` : aide importante de l'IA et contributions personnelles à documenter.
- `docs/prototype/` : démonstration indépendante, en allemand et français, sans données de compte ni support de cours.

Pour l'intégrer à un dépôt existant, ajouter ces fichiers et le lien de présentation dans son README. Ne pas remplacer un dépôt distant sans comparer son contenu au projet local.

## Démonstration

Ouvrir `docs/prototype/index.html` dans un navigateur. Parcours : choisir la langue, retourner la carte, répondre au quiz, consulter le progrès et recommencer. La sélection d'une bonne réponse valide l'exercice. La langue peut changer sans perdre les réponses de la séance.

Le prototype peut être hébergé sur un site statique en publiant uniquement ce sous-dossier. Pour une publication isolée, remplacer le lien Markdown de transparence par le lien GitHub réel vers `docs/KI-TRANSPARENZ.md`. Le code complet de l'application requiert un hébergement Node.js distinct pour ses fonctions serveur.

## Avant de publier l'application complète

Utiliser une sélection de fichiers contrôlée. Exclure `.env`, `data/`, `backups/`, `.voice-runtime/` et les données personnelles. Vérifier les droits sur le PDF WIM et sur les textes adaptés avant de les rendre publics. La démonstration créée pour le portfolio ne les utilise pas.

Ne pas attribuer à Emily des tests ou des développements personnels tant qu'elle ne les a pas précisés. Indiquer l'assistance importante de l'IA dans la présentation, sans ajouter de badges de plateforme ou de texte conversationnel dans l'interface.

## Vérification du 21 octobre 2026

Les 21 tests automatisés existants de l'application passent. Les premiers essais HTTP ont été bloqués par les restrictions locales, puis ont réussi avec l'accès local autorisé. Aucun appel réel au fournisseur IA.

Le prototype a été vérifié dans le navigateur : retournement de carte, bonne réponse et progression 2/2, changement de langue, remise à zéro et mauvaise réponse avec explication. Un aperçu est conservé dans `docs/prototype/apercu.png`. Ces contrôles ont été réalisés par l'assistant; ils ne sont pas présentés comme des tests effectués personnellement par Emily.
