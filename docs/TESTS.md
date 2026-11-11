# Prüfungen

```bash
npm test
```

Ohne npm kannst du die Tests direkt starten.

```powershell
node --test tests/learning.test.mjs tests/server.test.mjs tests/sync.test.mjs tests/maintenance.test.mjs tests/anime.test.mjs
```

Die Tests zur Lernlogik nutzen ein simuliertes DOM. Die Serverprüfungen senden HTTP-Anfragen an einen lokalen Server und verwenden temporäre Datenverzeichnisse. Der KI-Anbieter wird simuliert.

## Automatisierte Prüfungen

- Anmeldung, Registrierung, Kennwort-Hashing, Sitzungen und Zugriffsgrenzen.
- Import, Lesen, Herunterladen, Löschen und Trennung der Dokumente verschiedener Konten.
- Abgelaufene Klausuren, einmalige Ergebnisablage und schriftliche Antworten ohne automatische Note.
- Lernfortschritt, veraltete Schreibversuche, Speicherung bei Netzfehlern und getrennte Gastdaten.
- Lokale Wartung, Datensicherung, Wiederherstellung und Kennwortzurücksetzung.
- Animation, Zeitgrenzen, getrennte Projekte, sichere Textausgabe und Freigabe von Aufnahmespuren.
- Vertonung, Zeitzuordnung je Szene, Dauergrenze und Zugriffsschutz.

## Historische Browserprüfungen

Am 20. Oktober 2026 wurden Anmeldung, Sprachwahl, Import und Textextraktion des 18-seitigen WIM-PDFs, Speicherung nach dem Neuladen, Klausurablauf und ein stummer WebM-Export in einer isolierten Instanz geprüft. Eine Datensicherung wurde erstellt. Wiederherstellung und Kontowiederherstellung wurden mit Testdaten geprüft.

Ein späterer 15-Sekunden-Export mit Piper/SIWIS enthielt VP9-Video und Opus-Audio. Ein lokaler Anime-Export wurde mit 1280 × 720 Pixeln geprüft. Die Oberflächenprüfung umfasste eine Breite von 1440 Pixeln und einen schmalen Bereich. Die maximale Dauer von sechs Minuten wurde mit einer simulierten Uhr geprüft. Es wurde kein kostenpflichtiger KI-Aufruf durchgeführt.
