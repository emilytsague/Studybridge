# Composants et contenus tiers

## PDF.js

Le lecteur PDF.js est fourni dans `public/vendor/`. Sa licence est conservée dans `public/vendor/PDFJS-LICENSE`. Les ressources de polices, tables de caractères et WebAssembly sont conservées avec le lecteur. Source du projet : https://github.com/mozilla/pdf.js

## Cours WIM

`public/WIM_Cours_complet_FR.pdf` est le document fourni par l’utilisateur. Les fiches dans `public/content.js` sont des adaptations pédagogiques de ce support, avec traductions françaises, anglaises et allemandes. Leurs numéros de pages renvoient au PDF inclus.

Aucune licence supplémentaire sur les supports pédagogiques n’est accordée par cette archive. Vérifie tes droits avant de les redistribuer dans un dépôt public.

## Variante Sites

`sites-source/` conserve une variante utilisant Vinext/React et des composants de démarrage Sites. Leurs dépendances sont décrites par le manifeste et le lockfile de ce sous-dossier. Les dépendances installées et leurs caches ne sont pas inclus.

Version PDF.js incluse : 5.6.205

## Narration locale Piper / SIWIS

Piper 1.8.0 : https://github.com/OHF-Voice/piper1-gpl (GPL-3.0). Le moteur est installé séparément dans .voice-runtime, exclu de Git. Conserver ses licences et respecter ses conditions en cas de redistribution.

Modèle fr_FR-siwis-medium, publié par rhasspy : https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/siwis/medium . Fiche du modèle : https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/medium/MODEL_CARD . Données SIWIS : https://datashare.is.ed.ac.uk/handle/10283/2353 , attribution CC-BY 4.0 selon cette fiche. Les poids sont téléchargés séparément et exclus de Git.
