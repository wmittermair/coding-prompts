import { globalShortcut } from 'electron';

export class ShortcutManager {
  registerGlobalShortcuts() {
    // Hauptshortcut zum Öffnen
    globalShortcut.register('CommandOrControl+Space', () => {
      // Show/Hide Hauptfenster
    });
    
    // Kategorie-spezifische Shortcuts
    // ... existing code ...
  }
} 