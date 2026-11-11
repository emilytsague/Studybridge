# Nutzung und Wartung

Starte unter Windows `DEMARRER.cmd` und öffne http://localhost:3000.
Node.js ab Version 22.13 genügt. Zusätzliche Abhängigkeiten sind nicht erforderlich.
Wenn Node.js nicht im Suchpfad liegt, verwendet das Startskript die lokale Codex-Laufzeitumgebung. Installiere auf anderen Computern vorher Node.js.

## Lernfortschritt

Nach der Anmeldung speichert der Server die WIM-Notizen, abgeschlossenen Einheiten, gelernten Karteikarten, Ergebnisse und die letzte Klausur privat für jedes Konto.
Das Banner zeigt den Speicherstatus. Wähle bei einem Konflikt zwischen Fenstern ausdrücklich aus, welche Kopie du behalten möchtest. Vermeide gleichzeitige Änderungen am selben Konto in mehreren Fenstern. Nach einer Netzunterbrechung kannst du die Speicherung mithilfe der lokalen Kopie des Kontos erneut versuchen.

Frühere Gastdaten bleiben im Browser. Die Anwendung ordnet sie keinem Konto automatisch zu, damit auf gemeinsam genutzten Rechnern keine Daten vermischt werden.
Bearbeitete Studioszenen und Antworten des Assistenten werden nur vorübergehend gespeichert.
Sitzungen laufen nach sieben Tagen ab und bleiben bei einem Neustart des Servers erhalten.

## Sichern und wiederherstellen

Beende den Server vor der Wartung und führe im Projektverzeichnis die gewünschten Befehle aus.

```powershell
node --env-file-if-exists=.env scripts/maintenance.mjs backup
node --env-file-if-exists=.env scripts/maintenance.mjs restore "PFAD_ZUM_SICHERUNGSORDNER"
```

Die Wiederherstellung legt ein neues Verzeichnis an. Trage den angezeigten Pfad als `DATA_DIR` in `.env` ein und starte den Server neu. Melde dich anschließend erneut an, da die Sitzungen der wiederhergestellten Kopie ungültig werden.
Bewahre Sicherungen wegen der enthaltenen privaten Dokumente geschützt auf. Lege eine Kopie auf einem anderen Laufwerk ab und sichere `.env` separat.

## Kennwort vergessen

Die Person, die den Rechner verwaltet, kann ein lokales Kennwort bei beendetem Server zurücksetzen.

```powershell
node --env-file-if-exists=.env scripts/maintenance.mjs reset-password MEIN_BENUTZERNAME
```

Das Werkzeug sichert zuerst die Daten, erzeugt ein zufälliges Kennwort und beendet die Sitzungen des Kontos. Bewahre das neue Kennwort vertraulich auf. Die Wiederherstellung erfolgt lokal.

## KI und Funktionsumfang

Konfiguriere Schlüssel und Modell in `.env` und halte sie aus dem Browser und Git heraus. Siehe [KI-Assistent](IA.md). Lerneinheiten, Quizze, Importe, schriftliche Klausuren und Animationen funktionieren ohne KI-Konfiguration. Texterkennung und die KI-Erzeugung von Videos mit Stimmen und Figuren sind separate Funktionen.

## Späterer Serverbetrieb

Betreibe eine einzelne Instanz mit dauerhaftem Speicher. Konfiguriere HTTPS, `PUBLIC_ORIGIN` und `COOKIE_SECURE=true` gemäß der [Anleitung zum Serverbetrieb](DEPLOIEMENT.md). Bewahre Sicherungen außerhalb öffentlicher Verzeichnisse auf.
Aktualisierungen der Abhängigkeiten unter `sites-source/` sind für den eigenständigen Serverbetrieb entbehrlich.
