# Entwicklerdokumentation

## Architektur

### Hauptkomponenten
- **Main Process** (Electron)
  - Globale Shortcuts
  - Fenster-Management
  - Datei-Operationen

- **Renderer Process** (React)
  - UI-Komponenten
  - State Management
  - Textbaustein-Verwaltung

### Datenfluss
1. Benutzer öffnet App (Ctrl+Space)
2. Daten werden aus prompts.json geladen
3. Kategoriebaum wird gerendert
4. Bei Textauswahl:
   - Variable ($clipboard) wird ersetzt
   - Text wird in Zwischenablage kopiert

## Entwicklungsrichtlinien

### Code-Struktur
- Komponenten: src/renderer/components/
- Utilities: src/utils/
- Types: src/shared/types/
- Hauptprozess: src/main/

### Wichtige Befehle
```bash
# Entwicklung
npm run dev

# Tests
npm test

# Build
npm run build
```

### Git Workflow
1. Feature-Branch von 'main' erstellen
2. Änderungen committen
3. Tests durchführen
4. Pull Request erstellen

### Checkliste vor Commits
- [ ] TypeScript Compiler läuft ohne Fehler
- [ ] Keine Linter-Warnungen
- [ ] Tests sind aktualisiert
- [ ] Dokumentation ist aktuell 