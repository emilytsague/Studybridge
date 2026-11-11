# StudyBridge auf GitHub veröffentlichen

Entpacke das Archiv und öffne den Ordner mit `server.mjs` und `package.json`. Installiere bei Bedarf [Git](https://git-scm.com/downloads). Erstelle auf GitHub ein privates oder öffentliches Repository namens StudyBridge. Beim ersten Upload brauchst du keine zusätzlichen Dateien über GitHub anzulegen.

## Vor der Veröffentlichung prüfen

```bash
git init
git status
git ls-files .env data
```

Die letzte Zeile darf keine Dateien auflisten. `.env.example` ist die öffentliche Vorlage. Die eigentliche Konfiguration und `data/` bleiben lokal. Prüfe auch die Liste der Dateien, die du zum Commit hinzufügst.

```bash
git add .
git commit -m "Erste Version von StudyBridge"
git branch -M main
git remote add origin https://github.com/DEIN_BENUTZERNAME/StudyBridge.git
git push -u origin main
```

Melde dich bei einer Authentifizierungsabfrage mit deinem GitHub-Konto an. Falls Git Angaben zur Autorin verlangt, kannst du für dieses Repository deinen Namen und deine GitHub-Commit-Adresse eintragen. GitHub bietet dafür in den Kontoeinstellungen auch eine `noreply`-Adresse an.

```bash
git config user.name "Dein Name"
git config user.email "Deine GitHub-Commit-Adresse"
```

Füge nach Änderungen die gewünschten Dateien hinzu, erstelle einen Commit mit einer aussagekräftigen Nachricht und übertrage ihn mit `git push`.

## Auf einem anderen Rechner starten

```bash
git clone https://github.com/DEIN_BENUTZERNAME/StudyBridge.git
cd StudyBridge
```

Kopiere `.env.example` nach `.env` und führe `npm start` aus. Übertrage `data/` separat, falls du bestehende Konten und Dokumente übernehmen möchtest.

GitHub speichert den Quellcode und seine Versionen. Für Konten, private Dateien und KI muss `server.mjs` lokal oder auf einem Node.js- bzw. Docker-Server laufen. Der Workflow `.github/workflows/ci.yml` führt bei aktiviertem GitHub Actions `npm test` aus.
