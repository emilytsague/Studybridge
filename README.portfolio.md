# StudyBridge

**Mehrsprachiger Lernprototyp für internationale Studierende**

StudyBridge verbindet Erklärungen auf Französisch oder Englisch mit deutschen Fachbegriffen. Das Projekt untersucht einen konkreten Lernablauf: Inhalte verstehen, mit Lernkarten wiederholen, Wissen prüfen und den eigenen Fortschritt verfolgen.

**Status:** persönliches Lernprojekt und funktionsfähiger Prototyp. Keine offizielle Hochschulanwendung.

**Projektverantwortliche:** Emily Lucresse Tsague Mboning. Mein Schwerpunkt liegt auf manuellen Tests, der Überprüfung der Bedienung sowie Anpassungen der Oberfläche und der finalen Funktionen.

![Portfolio-Vorschau](docs/prototype/apercu.png)

## Projekt ansehen

- [Interaktiver Portfolio-Prototyp](docs/prototype/index.html): fiktives Beispiel, ohne Anmeldung, API-Schlüssel oder echte Kursunterlagen.
- [Projektbeschreibung und Architektur](docs/PROJEKT-DE.md)
- [Entstehung und persönlicher Beitrag](docs/KI-TRANSPARENZ.md)
- [Installation und technische Dokumentation](README.md)
- [Tests und dokumentierte Prüfungen](docs/TESTS.md)

Die Vorschau lässt sich nach dem Herunterladen direkt im Browser öffnen. Ein Link auf eine HTML-Datei im GitHub-Repository zeigt zunächst deren Quelltext; für eine öffentliche interaktive Vorschau muss `docs/prototype/` separat statisch bereitgestellt werden.

## Problem und Zielgruppe

Internationale Studierende müssen häufig gleichzeitig fachliche Inhalte verstehen und deutsche Begriffe lernen. StudyBridge soll den Wechsel zwischen Erklärungen, Fachwortschatz und Selbsttests in einem Lernablauf zusammenführen.

## Was im vorhandenen Code enthalten ist

| Bereich | Umsetzung |
|---|---|
| Lernen | Zweisprachige Oberfläche, Lernkarten, Quiz und Fortschrittsanzeige |
| Dokumente | PDF-/TXT-/Markdown-Import; PDF-Textauszug im Browser |
| Konten | Eigene Anmeldung, Dokumente und Fortschritt pro Konto |
| Prüfungsvorbereitung | Zeitbegrenzter Übungsmodus; schriftliche Antworten mit Selbsteinschätzung |
| KI-Assistent | Optionale serverseitige Integration; benötigt eigene Konfiguration |
| Lernanimation | Lokales Storyboard und Videoexport; optionale lokale Sprachausgabe |

Der aktuelle Stand ist ein Lernprototyp. Technische Grenzen und dokumentierte Prüfungen stehen in der Projektdokumentation.

## Technologien

JavaScript, HTML, CSS, Node.js, JSON-Dateispeicherung und PDF.js. Der Server verwendet eingebaute Node.js-Module. Der kleine Portfolio-Prototyp arbeitet vollständig im Browser und ist von der vollständigen Anwendung getrennt.

## Bezug zur Wirtschaftsinformatik

StudyBridge verbindet Nutzeranforderungen, Lernprozesse und technische Umsetzung. Mein praktischer Beitrag umfasst manuelle Tests und Überprüfungen sowie Anpassungen der Oberfläche und der finalen Funktionen. Damit stehen die Nutzbarkeit und die schrittweise Verbesserung des Lernablaufs im Mittelpunkt.

## Entwicklungsmethode

Die technische Umsetzung erfolgte mit KI-unterstütztem Prototyping. Die Aufteilung zwischen Entwicklungsunterstützung und meinem persönlichen Beitrag ist unter [Entstehung und persönlicher Beitrag](docs/KI-TRANSPARENZ.md) beschrieben.

## Lokal starten

Mit Node.js ab der im Projekt angegebenen Version:

```sh
npm start
```

Die Anwendung läuft standardmäßig unter `http://localhost:3000`. Die KI-Funktionen benötigen zusätzlich eine private Serverkonfiguration. Keine API-Schlüssel, Kontodaten oder privaten Kursunterlagen in ein öffentliches Repository übernehmen.

