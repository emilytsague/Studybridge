# StudyBridge

[Portfolio](README.portfolio.md) · [Interaktiver Prototyp](docs/prototype/index.html) · [Entstehung und persönlicher Beitrag](docs/KI-TRANSPARENZ.md)

StudyBridge ist eine Lernplattform für internationale Studierende mit Deutsch als Standardsprache und Französisch und Englisch als weiteren Lernsprachen. Emily Lucresse Tsague Mboning hat die Anwendung manuell getestet, überprüft und die Oberfläche sowie die endgültigen Funktionen angepasst.

Die Anwendung läuft auf einem Node.js-Server. Jedes Konto hat einen eigenen privaten Speicher für importierte Dokumente. Das lokale Animationsstudio bietet die Figuren Aya und Noé, animierte Szenen, ein bearbeitbares Storyboard und HD-Exporte von bis zu sechs Minuten. [Animationsstudio](docs/STUDIO-ANIME.md)

## Schnellstart

1. Installiere [Node.js](https://nodejs.org/) ab Version 22.13.
2. Entpacke die ZIP-Datei und öffne das Verzeichnis in Visual Studio Code oder im Terminal.
3. Doppelklicke unter Windows auf `DEMARRER.cmd` oder führe in PowerShell die folgenden Befehle aus.

```powershell
Copy-Item .env.example .env
npm start
```

Unter Linux und macOS:

```bash
cp .env.example .env
npm start
```

4. Öffne [http://localhost:3000](http://localhost:3000). Diese Adresse entspricht `PUBLIC_ORIGIN` in der Datei `.env`.
5. Erstelle ein Konto mit einem Kennwort von mindestens zwölf Zeichen. Das Konto gilt für diese Installation.
6. Importiere bei Bedarf eigene Kurse als PDF-, TXT- oder Markdown-Dateien.

Für die eigenständige Version ist keine Installation von npm-Abhängigkeiten erforderlich. Der Server verwendet integrierte Node.js-Module. PDF.js wird samt Lizenz unter `public/vendor` mitgeliefert.

Beende den Server mit Strg+C. Starte ihn für die Entwicklung mit `npm run dev` und lade den Browser nach Änderungen am Frontend neu. Hinweise zur Sicherung und Wiederherstellung stehen in [LIRE-MOI.txt](LIRE-MOI.txt) und [docs/UTILISATION.md](docs/UTILISATION.md).

## Funktionsumfang

| Funktion | Umsetzung |
|---|---|
| Lernmaterial für Wirtschaftsinformatik (WIM) | Zehn Lerneinheiten, 30 Karteikarten, Quizze und Kurztests |
| Anmeldung und Registrierung | Eigene StudyBridge-Konten, mit HTTP-Tests geprüft |
| Private Kursdokumente | PDF, TXT und Markdown bis 15 MB bzw. 500 Seiten, PDF-Textextraktion im Browser |
| Dokumentverwaltung | Lesen, Suchen, Herunterladen und Löschen, mit Tests zur Trennung der Konten |
| Zeitgesteuerte WIM-Klausur | Automatische Abgabe nach Ablauf und automatische Auswertung der Auswahlfragen |
| Klausur zu importierten Kursen | Schriftliche Antworten zu Textauszügen und Raster zur Selbstbewertung |
| Optionaler KI-Lernassistent | Benötigt einen API-Schlüssel und ein konfiguriertes Modell |
| KI-generierte Quizfragen und Karteikarten | Als Lerntexte im Assistenten verfügbar, ohne automatische Übernahme in Lernsitzungen |
| KI-generiertes Storyboard | Über die API verfügbar und im Animationsstudio bearbeitbar |
| Lokales Animationsstudio | Drei Hintergründe, eine bis zwölf Szenen, HD-Export von 15 Sekunden bis sechs Minuten, optional mit lokaler französischer Vertonung |

Für gescannte PDFs ist eine externe Texterkennung erforderlich. KI-generierte Figuren, Stimmen und Videos würden einen zusätzlichen Dienst erfordern.

## Projektstruktur

```text
StudyBridge/
  server.mjs                 HTTP-Server, Konten, Dokumente und KI-Assistent
  package.json               npm-Befehle
  .env.example               Konfigurationsvorlage ohne Zugangsdaten
  .gitignore                 Schließt lokale Konfiguration, Daten und Protokolle aus
  public/
    index.html               Einstiegspunkt der Anwendung
    style.css                Gestaltung für verschiedene Bildschirmgrößen
    content.js               WIM-Lernmaterial in drei Sprachen
    app.js                   Lerneinheiten, Quizze, Karteikarten und Fortschritt
    extensions.js            Import, zeitgesteuerte Klausur und Animationsstudio
    portable.js              Anmeldung und Oberfläche des KI-Assistenten
    login.html, login.js     Anmeldung und Registrierung
    vendor/                  PDF.js und zugehörige Ressourcen samt Lizenz
  tests/                     Automatisierte Tests für Node.js
  docs/                      Anleitungen zu Installation, GitHub, API und Betrieb
  Dockerfile                 Optionaler Container
  compose.yaml               Docker-Start mit dauerhaftem Speicher
  .github/workflows/ci.yml   Automatisierte Tests für Pushes und Pull Requests
```

## Optionaler KI-Lernassistent

Trage in `.env` deinen API-Schlüssel und den genauen Namen eines verfügbaren Modells ein und starte den Server neu.

```dotenv
OPENAI_API_KEY=dein_api_schluessel
OPENAI_MODEL=genauer_modellname
```

Der Schlüssel bleibt auf dem Server. Bewahre ihn außerhalb von `public/`, dem Browser und Git auf. Teile die Datei `.env` nicht.

Lerneinheiten, Importe, vorhandene Quizze, Klausuren und lokale Animationen funktionieren ohne API-Schlüssel. Der Assistent sendet die Frage und bis zu fünf ausgewählte Ausschnitte des Dokuments. Die gesendeten Ausschnitte erscheinen unter der Antwort. Die Auswahl erfolgt per Stichwortsuche. KI-Antworten können Fehler enthalten. Kosten und API-Limits hängen vom Konto und vom Modell ab. [Anleitung zum KI-Assistenten](docs/IA.md)

## Daten und Betrieb

- Konten und importierte Dateien liegen im von Git ausgeschlossenen Verzeichnis `data/`.
- Ein Konto kann seine Dokumente auf mehreren Geräten abrufen, wenn alle auf denselben Server zugreifen.
- Nach der Anmeldung werden WIM-Notizen, Karteikarten, Ergebnisse und Klausurabgaben pro Konto auf dem Server gespeichert. Der lokale Zwischenspeicher ist je Konto getrennt. Im Gastmodus bleiben die Daten im Browser. Verwende auf gemeinsam genutzten Geräten getrennte Browserprofile.
- Anmeldesitzungen laufen nach sieben Tagen ab und bleiben bei einem Serverneustart erhalten. Die Kennwortwiederherstellung erfolgt lokal ohne E-Mail.
- Betreibe eine einzelne Serverinstanz mit dauerhaftem Speicher. Mehrere Instanzen dürfen nicht dieselben JSON-Dateien verwenden.
- Die mitgelieferten WIM-Lerninhalte sind für Besucher sichtbar. Selbst importierte Dokumente bleiben privat. Verweise auf das WIM-Quell-PDF setzen eine lokale Kopie voraus.

[Anleitung zu Docker, HTTPS und Datensicherung](docs/DEPLOIEMENT.md)

## Tests

```bash
npm test
```

Die automatisierten Tests prüfen unter anderem die API, die Trennung der Konten, Fehlerfälle, den Klausurablauf und simulierte KI-Antworten. Sie rufen keine echten KI-Dienste auf. Manuell wurden unter anderem PDF-Import, Speicherung, automatische Klausurabgabe und Videoexport geprüft. [Testdokumentation](docs/TESTS.md)

## Lernmaterial und Drittkomponenten

Die WIM-Lerneinheiten sind inoffizielle Lernhilfen mit Seitenverweisen auf das zugrunde liegende PDF. Prüfe vor einer Veröffentlichung die Nutzungsrechte an enthaltenen Kursmaterialien. Die Anwendung fügt importierte Dateien nicht automatisch dem Repository hinzu.

PDF.js wird unter `public/vendor/PDFJS-LICENSE` lizenziert. [Hinweise zu Drittkomponenten](THIRD_PARTY_NOTICES.md)

Konten, persönliche Dokumente, Sicherungen und das WIM-Quell-PDF sind nicht Teil der GitHub-Version. Die Sprachmodelle lassen sich mit `INSTALLER-VOIX.cmd` herunterladen. Das historische Archiv `sites-source` ist in dieser Distribution nicht enthalten.
