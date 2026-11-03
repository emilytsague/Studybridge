# StudyBridge – Projektdokumentation

## Ziel und Abgrenzung

StudyBridge ist ein persönliches Lernprojekt für mehrsprachige Prüfungsvorbereitung. Die vollständige Anwendung und der Portfolio-Prototyp haben unterschiedliche Aufgaben: Die Anwendung enthält Konten, Imports und optionale KI-Anbindung; die Vorschau demonstriert einen kurzen Lernablauf mit selbst erstellten Beispieldaten.

## Beispielanforderungen aus der vorhandenen Funktionalität

Die folgenden Anforderungen beschreiben den aktuellen Funktionsumfang und dienen als Grundlage für nachvollziehbare Funktionsprüfungen.

| ID | Anforderung | Überprüfbares Verhalten |
|---|---|---|
| L1 | Fachbegriffe in zwei Sprachen lernen | Eine Karte zeigt Begriff und übersetzte Erklärung |
| L2 | Verständnis selbst prüfen | Ein Quiz zeigt nach der Antwort eine begründete Rückmeldung |
| L3 | Fortschritt nachvollziehen | Abgeschlossene Aktivitäten werden angezeigt |
| D1 | Eigene Dokumente verwenden | Die vollständige Anwendung nimmt unterstützte Dateitypen an |
| D2 | Kontoinhalte voneinander trennen | Zugriff auf private Dokumente erfordert das passende Konto |
| A1 | KI-Unterstützung optional nutzen | Lernen bleibt ohne bezahlten KI-Aufruf möglich |

## Architektur der vollständigen Anwendung

```mermaid
flowchart LR
    U[Studierende] --> B[Browser: HTML, CSS, JavaScript]
    B --> S[Node.js HTTP-Server]
    B --> P[PDF.js: Textextraktion]
    S --> D[Private JSON-Dateien und Dokumente]
    S -. optionale Anfrage mit ausgewählten Auszügen .-> A[KI-Anbieter]
```

- `public/app.js`: Lernansichten, Karten, Quiz und lokaler Zustand.
- `public/extensions.js`: zusätzliche Lern- und Prüfungsfunktionen.
- `public/portable.js`: Konten und optionale KI-Oberfläche.
- `public/sync.js`: Fortschrittssynchronisation.
- `server.mjs`: HTTP-Endpunkte, Konten, private Dokumente und KI-Anbindung.
- `tests/`: automatisierte Logik- und HTTP-Prüfungen.

## Lernprozess im Portfolio-Prototyp

1. Sprache auswählen.
2. Eine kurze Erklärung zum Geschäftsprozess lesen.
3. Eine Karte umdrehen und den deutschen Begriff wiederholen.
4. Eine Verständnisfrage beantworten.
5. Rückmeldung und Sitzungsfortschritt ansehen.

Die Vorschau speichert keine Daten dauerhaft, sendet keine Nachrichten und ruft keine KI auf. Der Fortschritt gilt nur für die aktuelle Sitzung.

## Bekannte Grenzen

- Kein Nachweis einer pädagogischen Wirkung oder Verbesserung von Prüfungsergebnissen.
- KI-Antworten können fehlerhaft sein; die echte Anbieterintegration ist nicht durch simulierte Tests nachgewiesen.
- Kein OCR für gescannte PDF-Dateien.
- Dateibasierter Server für eine einzelne Instanz; kein verteiltes Produktionssystem.
- Ein öffentlicher statischer Prototyp ersetzt weder den Node.js-Server noch dessen private Konten.
- Bestehende Kursmaterialien dürfen nur mit geklärten Veröffentlichungsrechten publiziert werden. Die Portfolio-Vorschau enthält ausschließlich fiktive Beispiele.

## Weiterentwicklung

Geplant sind eine systematische Dokumentation weiterer manueller Testfälle, eine Nutzererprobung und die Prüfung der Übersetzungen.

## Persönlicher Beitrag

Emily Lucresse Tsague Mboning übernimmt die manuellen Tests, Überprüfungen und Anpassungen der Oberfläche sowie der finalen Funktionen. Die Entwicklungsmethode ist unter [Entstehung und persönlicher Beitrag](KI-TRANSPARENZ.md) beschrieben.

