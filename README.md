# Prompt Manager

Eine Desktop-Anwendung zur effizienten Verwaltung und Organisation von Prompts und Textbausteinen.

## Beschreibung

Der Prompt Manager ist eine Desktop-Anwendung, die es ermöglicht, Textbausteine und Prompts effizient zu organisieren und schnell wiederzuverwenden. Die App kann über einen globalen Shortcut aufgerufen werden und ermöglicht die hierarchische Organisation von Texten in Kategorien.

## Features

### Kernfunktionen (Phase 1)
- Hierarchische Organisation von Textbausteinen in Kategorien
- Globaler Shortcut zum schnellen Öffnen (Ctrl+Space)
- Navigation per Pfeiltasten durch die Struktur
- Variable Textersetzung mit Zwischenablage-Inhalt ($clipboard)
- Massenimport (alle Texte einer Kategorie gleichzeitig kopieren)
- Einfache Textbearbeitung und -verwaltung
- Lokale Datenspeicherung in JSON-Format
- Automatisches Backup-System

### Geplante Erweiterungen (Phase 2)
- Suchfunktion für Texte und Kategorien
- Export/Import-Funktion
- Tagging-System
- Versionierung der Texte
- Favoriten-Markierung
- Template-System
- Markdown-Unterstützung
- Vorschau-Funktion

### Premium Features (Phase 3)
- Cloud-Synchronisation
- KI-API Integration
- Erweiterte Statistiken

## Verwendung

### Grundlegende Bedienung
1. App über Ctrl+Space öffnen
2. Mit Pfeiltasten durch Kategorien navigieren
3. Enter zum Auswählen
4. Textbausteine per Shortcut oder Klick einfügen

### Textbausteine mit Variablen
- `$clipboard` wird durch den aktuellen Inhalt der Zwischenablage ersetzt
- Beispiel: "Ich möchte ein $clipboard kaufen" → "Ich möchte ein Auto kaufen"

## Entwicklung

### Systemvoraussetzungen
- Windows 11 (primär unterstützt)
- Windows 10
- Windows 7 (eingeschränkt)
- macOS (geplant)

### Technischer Stack
- Framework: Electron.js + React (TypeScript)
- Datenspeicherung: JSON-Datei (später erweiterbar)
- State Management: React Context/Redux
- Build Tool: Vite

### Projektstruktur
```
prompt-manager/
├── src/
│   ├── main/                # Electron Hauptprozess
│   │   ├── main.ts
│   │   ├── ipc.ts
│   │   └── shortcuts.ts
│   ├── renderer/           # Frontend
│   │   ├── components/
│   │   ├── store/
│   │   └── styles/
│   ├── shared/
│   │   ├── types/
│   │   └── constants/
│   └── utils/
├── data/
│   ├── prompts.json
│   └── backups/
└── config/
```

### Entwicklungsumgebung einrichten

### Voraussetzungen
- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- Git

```bash
# Repository klonen
git clone [repository-url]

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build erstellen
npm run build
```

### Entwicklungsprozess
1. Feature-Branch erstellen
2. Änderungen implementieren
3. Tests durchführen
4. Pull Request erstellen

### Bekannte Einschränkungen
- Electron startet mit ~50-100MB RAM
- Lokale Datenspeicherung zunächst auf JSON-Basis
- Keine gleichzeitige Mehrbenutzer-Bearbeitung in der Grundversion

## Lizenz

### Lizenzmodelle
- **Free**: Grundfunktionen
- **Pro**: Alle Features
- **Enterprise**: Custom API Integration

### Rechtliches
[Lizenzdetails folgen]