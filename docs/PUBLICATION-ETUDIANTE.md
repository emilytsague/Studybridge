# Veröffentlichung auf einem Hochschulserver

Für die Veröffentlichung werden ein freigeschaltetes Hosting-Konto und ein erreichbarer Server benötigt. [Azure for Students](https://azure.microsoft.com/en-gb/free/students/) bietet ein begrenztes Guthaben. Prüfe die Kosten vor der Einrichtung und behalte das Ausgabenlimit bei. Die Person, der das Konto gehört, schließt die Hochschulverifizierung selbst ab.

## Vorbereitete Konfiguration

Der Linux-Container enthält Node.js, Piper und die französische Stimme. Caddy stellt HTTPS bereit. Ein dauerhaftes Volume speichert Konten, Dokumente, Sitzungen und Lernfortschritt. Besucher können eigene Konten erstellen. Dokumente und Lernfortschritt werden je Konto getrennt. Anmeldelimits verwenden die vom vertrauenswürdigen Proxy gemeldete Besucheradresse.

## Bereitstellung

Auf einer Linux-VM mit Docker Compose und einem DNS-Namen, der auf die IP-Adresse der VM verweist:

```sh
cp .env.public.example .env.public
# PUBLIC_DOMAIN auf den DNS-Namen des Servers setzen.
docker compose --env-file .env.public -f compose.public.yaml up --build -d
```

Gib die Ports 80 und 443 frei. Der DNS-Name des Hosting-Anbieters genügt. Prüfe `/api/health`, lege zwei Testkonten an und bestätige, dass jedes Konto nur seine eigenen Dokumente sieht. Teste Vertonung und Videodownload, bevor du den Link veröffentlichst.

Der Server startet mit eigenen Daten. Sichere das Volume `studybridge_data` und die Zertifikate regelmäßig. Verwende wegen der JSON-Speicherung eine einzelne Instanz. Studioprojekte bleiben je Konto im Browser. Exportierte Videos müssen heruntergeladen werden.

Am 21. Oktober 2026 wurden 22 automatisierte Tests, die Compose-Konfiguration und der Docker-Build geprüft. Der isolierte Container lieferte HTTP 200 beim Gesundheitscheck und HTTP 201 bei der Registrierung. Die französische Sprachsynthese funktionierte. HTTPS und Internetzugriff waren Gegenstand der ausstehenden Prüfung auf dem öffentlichen Server.
