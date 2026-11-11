# KI-Lernassistent einrichten

Der eigenständige Server verwendet einen eigenen API-Schlüssel. Ein ChatGPT-Plugin ist dafür nicht erforderlich.

1. Erstelle einen Schlüssel im OpenAI-Entwicklerkonto und konfiguriere Abrechnung und Limits.
2. Trage `OPENAI_API_KEY` und `OPENAI_MODEL` in `.env` ein. Wähle ein verfügbares Modell, das Texteingaben über die Responses API akzeptiert.
3. Starte den Server neu, melde dich an und wähle im KI-Assistenten einen Kurs aus.

„API konfiguriert“ bedeutet, dass beide Variablen gesetzt sind. Ob Zugang, Modell und Kontingent funktionieren, zeigt eine Anfrage.

## Verarbeitung

Der Server ruft `https://api.openai.com/v1/responses` mit `store: false` und höchstens 2.600 Ausgabetokens auf. Der Schlüssel bleibt auf dem Server. Pro Anfrage werden die Frage, die Lernsprache und bis zu fünf per Stichwortsuche ausgewählte Kursauszüge mit je höchstens 2.800 Zeichen verarbeitet. Der Kurs muss für das Konto zugänglich sein.

Dokumenttexte werden als Daten behandelt. Antworten werden als Text angezeigt. Die Zeitgrenze beträgt 60 Sekunden. Fehler werden angezeigt und Anfragen je Konto begrenzt. `store: false` deaktiviert die Speicherung der Antwort durch diesen Aufruf. Daraus ergibt sich keine allgemeine Garantie zur Aufbewahrung von Anbieterdaten.

## Aufgaben

- Fachbegriffe auf Deutsch und gegebenenfalls zusätzlich in der gewählten Lernsprache erklären.
- Fünf Fragen mit Antworten und Erklärungen erstellen.
- Acht Karteikarten formulieren.
- Ein Skript mit drei Szenen für das lokale Animationsstudio erstellen.

KI-Quizze und Karteikarten erscheinen als Lerntexte. Prüfe sie anhand der Kursunterlagen. Sie werden nicht automatisch in die Übungen oder den Fortschritt übernommen.

Das Studio animiert bearbeitbare Skripte lokal. Die Animation folgt auch bei einem KI-generierten Skript den eingebauten Regeln. Ein Dienst für KI-generierte Videos ist nicht enthalten.

## Tests und technische Quellen

Die automatisierten Tests verwenden einen simulierten Anbieter. Es wurde kein echter API-Schlüssel verwendet. Die Implementierung sucht im Array `output` nach Nachrichten mit `output_text`.

- [Texterzeugung mit der Responses API](https://developers.openai.com/api/docs/guides/text)
- [API-Dokumentation](https://developers.openai.com/api/docs)
- [Modelle](https://developers.openai.com/api/docs/models)
