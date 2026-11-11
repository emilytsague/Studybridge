# Portfolio veröffentlichen

Die Präsentation und der eigenständige Prototyp wurden am 21. Oktober 2026 lokal vorbereitet. Diese Notiz beschreibt den damaligen Stand.

- [Portfolio](../README.portfolio.md) stellt StudyBridge auf Deutsch vor.
- [Projektdokumentation](PROJEKT-DE.md) beschreibt Ziele, Anforderungen, Architektur und Grenzen.
- [Entstehung und persönlicher Beitrag](KI-TRANSPARENZ.md) dokumentiert die Beiträge und den Einsatz von KI.
- [Prototyp](prototype/index.html) demonstriert den Lernablauf auf Deutsch und Französisch ohne Kontodaten oder Kursdateien.

## Demonstration

Öffne `docs/prototype/index.html`. Wähle eine Sprache, drehe die Karte um, beantworte die Quizfrage und prüfe den Fortschritt. Du kannst die Sprache wechseln, ohne die Antworten der laufenden Übung zu verlieren.

Für statisches Hosting genügt `docs/prototype/`. Passe bei einer eigenständigen Veröffentlichung den Link zur KI-Dokumentation an. Die vollständige Anwendung benötigt für ihre Serverfunktionen eine Node.js-Umgebung.

## Veröffentlichung prüfen

Schließe `.env`, `data/`, `backups/`, `.voice-runtime/` und persönliche Daten aus. Prüfe die Rechte am WIM-PDF und an abgeleiteten Texten. Die Portfolio-Demonstration enthält dieses Material nicht.

Bei der Vorbereitung bestanden 21 automatisierte Tests. Der Prototyp wurde im Browser auf Kartenwechsel, richtige und falsche Antworten, Fortschritt, Sprachwechsel und Zurücksetzen geprüft. Die Prüfungen des Prototyps wurden vom Assistenten durchgeführt. [Bildschirmfoto](prototype/apercu.png)
