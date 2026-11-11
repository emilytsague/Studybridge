# Drittkomponenten und Lernmaterialien

## PDF.js

PDF.js 5.6.205 wird mit Schriftdateien, Zeichentabellen und WebAssembly-Ressourcen unter `public/vendor/` mitgeliefert. Die Lizenz steht in `public/vendor/PDFJS-LICENSE`. [PDF.js-Quellcode](https://github.com/mozilla/pdf.js)

## WIM-Kurs

`public/content.js` enthält didaktische Bearbeitungen mit französischen, englischen und deutschen Fassungen. Seitenverweise beziehen sich auf `public/WIM_Cours_complet_FR.pdf`, sofern das Quelldokument lokal vorliegt. Das Archiv gewährt keine zusätzlichen Rechte an den Lernmaterialien.

## Historische Sites-Variante

Die historische Variante in `sites-source/` verwendet Vinext/React und Sites-Komponenten. Manifest und Sperrdatei beschreiben ihre Abhängigkeiten. Installierte Abhängigkeiten und Zwischenspeicher sind nicht enthalten.

## Lokale Vertonung mit Piper und SIWIS

[Piper 1.8.0](https://github.com/OHF-Voice/piper1-gpl) steht unter GPL-3.0 und wird getrennt in `.voice-runtime` installiert. Das Modell `fr_FR-siwis-medium` wird getrennt heruntergeladen und ist von Git ausgeschlossen. Die [Modellkarte](https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/medium/MODEL_CARD) nennt CC BY 4.0 für den [SIWIS-Datensatz](https://datashare.is.ed.ac.uk/handle/10283/2353).
