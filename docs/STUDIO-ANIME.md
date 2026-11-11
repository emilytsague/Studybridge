# Lokales Animationsstudio

Das Studio zeichnet die Figuren Aya und Noé lokal. Beide können allein oder zusammen auftreten. Drei Hintergründe stehen zur Auswahl.

1. Wähle WIM oder einen importierten Kurs mit Text.
2. Wähle **Szenen vorbereiten** und bearbeite die aus Kursauszügen erstellten Szenen.
3. Wähle Figuren, Hintergrund und Gesamtdauer zwischen 15 Sekunden und sechs Minuten.
4. Bearbeite eine bis zwölf Szenen und prüfe sie mit der Wiedergabe, der Zeitleiste oder den Vorschaubildern.
5. Wähle **Video exportieren** und lasse den Tab sichtbar, bis der Download erscheint.

Der Export läuft in Echtzeit mit 1280 × 720 Pixeln und 24 Bildern pro Sekunde. Je nach Browser entsteht eine WebM- oder MP4-Datei. Eine unterbrochene Aufnahme wird als Teildatei gekennzeichnet. Starte den Export erneut, um die vollständige Aufnahme zu erhalten.

Das Projekt bleibt in diesem Browser und wird je Konto getrennt gespeichert. Lade exportierte Videos separat herunter. Wenn sich das Skript ändert, entfernt die Oberfläche den alten Download. Die Animation läuft lokal. Ein konfigurierter KI-Assistent kann Skripte an das Studio übergeben.

## Französische Vertonung

Aktiviere **Französische Vertonung**, damit SIWIS die Erklärungs- und Untertitelfelder vorliest. Die Stimme ist bei der Vorschau hörbar und wird im Video gespeichert. Nach Textänderungen wird die Vertonung neu erzeugt. Die Dauer jeder Szene passt sich dem gesprochenen Text an. Es gelten höchstens sechs Minuten und insgesamt 6.000 Zeichen. Beide Figuren verwenden dieselbe Stimme. Der Ton wird je Szene synchronisiert.

Piper 1.8.0 und `fr_FR-siwis-medium` werden lokal unter `.voice-runtime` und `voices` installiert. Unter Windows installiert `INSTALLER-VOIX.cmd` die Stimme mit Python und Internetzugang. Auf anderen Systemen erstelle die virtuelle Python-Umgebung, installiere `scripts/voice-requirements.txt` und führe `piper.download_voices fr_FR-siwis-medium --download-dir voices` aus. Die Vertonung erfordert ein StudyBridge-Konto und sendet keinen Text an einen externen Anbieter. Für das Docker-Basisabbild müssen Python und das Modell separat installiert werden.
