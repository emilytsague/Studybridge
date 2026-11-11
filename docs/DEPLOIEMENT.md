# Eigenständige Version betreiben

## Node.js-Server

Verwende Node.js ab Version 22.13 und einen Datenträger mit dauerhaftem Speicher.

```bash
npm start
```

| Variable | Zweck |
|---|---|
| `PORT` | HTTP-Port, standardmäßig 3000 |
| `HOST` | Lokal `127.0.0.1`, im Container `0.0.0.0` |
| `PUBLIC_ORIGIN` | Exakte Adresse im Browser ohne abschließenden Schrägstrich |
| `DATA_DIR` | Privater Speicherpfad außerhalb von `public/` |
| `COOKIE_SECURE` | Bei Betrieb über HTTPS auf `true` setzen |
| `REGISTRATION_CODE` | Optionaler Registrierungscode |
| `OPENAI_API_KEY` | Optionaler API-Schlüssel, nur auf dem Server |
| `OPENAI_MODEL` | Kompatibles Modell für das eigene Konto |
| `AI_REQUESTS_PER_HOUR` | Anfragen je Konto und Stunde, standardmäßig 20 |

Setze im öffentlichen Betrieb `PUBLIC_ORIGIN=https://deine-domain.example` und `COOKIE_SECURE=true`. Verwende einen HTTPS-Reverse-Proxy und halte den Node.js-Port von außen unzugänglich. Prüfe bei `invalid_origin` die Browseradresse und `PUBLIC_ORIGIN`.

## Optionaler Betrieb mit Docker

Kopiere `.env.example` nach `.env` und starte den Container.

```bash
docker compose up --build -d
docker compose logs -f
docker compose down
```

Das Volume `studybridge_data` speichert Konten und Dokumente. Der interne Port ist 3000. Für öffentlichen HTTPS-Betrieb siehe `compose.public.yaml` und [Veröffentlichung](PUBLICATION-ETUDIANTE.md). Das Docker-Abbild wurde am 21. Oktober 2026 lokal einschließlich Kontoerstellung und französischer Vertonung geprüft.

## Datensicherung und Betrieb

- Sichere `data/` oder das Docker-Volume separat vom Git-Repository.
- Kennwörter werden mit scrypt und individuellem Salt gehasht. Sitzungen werden mit gehashten Token für sieben Tage auf dem Datenträger gespeichert. Anfragelimits liegen im Arbeitsspeicher und werden beim Neustart zurückgesetzt.
- JSON-Dateien und private Verzeichnisse sind für eine einzelne Serverinstanz ausgelegt.
- Jedes Konto kann bis zu 100 Kurse speichern. Dateien dürfen bis zu 15 MB groß sein. Überwache bei offener Registrierung den verfügbaren Speicherplatz.
- Lege Ausgabenlimits beim KI-Anbieter separat fest.
- Die lokale Kennwortwiederherstellung ist in der [Wartungsanleitung](UTILISATION.md) beschrieben. E-Mail-Bestätigung und Kennwortwiederherstellung per E-Mail sind nicht implementiert.

Für einen größeren institutionellen Einsatz sind eine geeignete Datenbank, ein Identitätssystem und eine Überprüfung von Authentifizierung und Sicherung erforderlich.
