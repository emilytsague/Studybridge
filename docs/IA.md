# Assistant IA : configuration et limites

## Configuration indépendante

La version autonome n’a besoin d’aucun plugin ChatGPT. Elle utilise une clé API définie sur **ton propre serveur**.

1. Obtiens une clé dans ton compte développeur OpenAI, puis configure les paramètres de facturation et de limites appropriés à ton usage.
2. Renseigne `OPENAI_API_KEY` et `OPENAI_MODEL` dans `.env`.
3. Choisis un modèle auquel ton compte a accès et qui accepte les entrées texte de l’API Responses. Aucun modèle par défaut n’est imposé dans le projet.
4. Redémarre le serveur, connecte-toi dans StudyBridge, ouvre **Assistant IA**, choisis le cours et pose une question.

L’état « API configurée » signifie que les deux variables sont présentes. Il ne garantit pas la validité de la clé, la disponibilité du modèle ou le crédit du compte : ces points sont vérifiés lors d’un appel réel.

## Requête implémentée

- Requête serveur vers `https://api.openai.com/v1/responses`.
- La clé n’est jamais incluse dans le code envoyé au navigateur.
- `store: false` et limite de sortie de 2 600 tokens.
- Une question, la langue choisie, un cours autorisé pour l’utilisateur.
- Recherche par mots-clés, au maximum cinq extraits de 2 800 caractères.
- Réponses affichées comme texte échappé, pas comme HTML exécutable.
- Les instructions contenues dans les documents sont traitées comme des données, pas comme des commandes de l’utilisateur.
- Délai maximal de 60 secondes, erreurs explicites et quota par utilisateur.

Le paramètre `store: false` désactive le stockage de la réponse prévu par cet appel. Il n’est pas présenté ici comme une garantie générale de rétention zéro des données du fournisseur.

## Actions disponibles

1. Explication pédagogique en allemand et en français/anglais.
2. Rédaction de cinq questions avec réponses et explications.
3. Rédaction de huit flashcards.
4. Rédaction d’un scénario de trois scènes que le studio peut animer.

Les questions et flashcards générées s’affichent comme un texte d’étude. Elles ne sont pas ajoutées automatiquement à la banque de quiz ni à la progression. Les exercices peuvent être faux : l’étudiant doit les vérifier dans le cours.

## Vidéo

Le studio sait animer du texte sur un canvas et l’enregistrer sans audio via le navigateur. Il ne synthétise ni personnages, ni voix, ni séquences vidéo par IA. Si le scénario vient de l’IA, l’animation reste déterministe.

Pour une véritable génération vidéo IA, il faut ajouter un fournisseur, son authentification, les coûts, une gestion de tâches longues et un stockage des vidéos. Cette intégration n’est pas incluse et aucun bouton ne prétend la déclencher.

## Tests et sources

Les tests automatisés substituent une réponse simulée au fournisseur pour vérifier le format et les erreurs. **Aucun appel avec une vraie clé n’a été effectué.**

Documentation officielle consultée pour l’implémentation :

- Génération de texte et API Responses : https://developers.openai.com/api/docs/guides/text
- Documentation générale : https://developers.openai.com/api/docs
- Choix du modèle : https://developers.openai.com/api/docs/models

L’implémentation lit les éléments `message` contenant `output_text` dans le tableau `output`, sans supposer que le premier élément contient la réponse.
