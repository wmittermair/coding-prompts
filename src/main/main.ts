import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import Store from 'electron-store';

console.log('[Main] Starte Electron App');

// Store initialisieren
const store = new Store({
  name: 'test-store',
  defaults: {
    testData: 'Hallo Welt'
  }
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Debug: Zeige aktuelle Pfade
  console.log('[Main] Current directory:', __dirname);
  const preloadPath = path.join(__dirname, '../preload/index.js');
  console.log('[Main] Preload path:', preloadPath);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      sandbox: false,
      preload: preloadPath,
      devTools: true
    }
  });

  // DevTools öffnen
  mainWindow.webContents.openDevTools();

  // Debug-Events für die Webseite
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Main] Webseite wurde geladen');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('[Main] Fehler beim Laden der Webseite:', errorCode, errorDescription);
  });

  // Test-Daten speichern
  const testData = 'Test ' + new Date().toISOString();
  console.log('[Main] Speichere Test-Daten:', testData);
  store.set('testData', testData);
  console.log('[Main] Gespeicherte Daten:', store.get('testData'));

  // IPC Handler registrieren
  ipcMain.handle('TEST_STORE', () => {
    const data = store.get('testData');
    console.log('[Main] TEST_STORE aufgerufen, sende:', data);
    return data;
  });

  // HTML laden
  const htmlPath = path.join(__dirname, '../renderer/index.html');
  console.log('[Main] Lade HTML von:', htmlPath);
  mainWindow.loadFile(htmlPath);

  // Debug: Log alle IPC Events
  mainWindow.webContents.on('ipc-message', (event, channel, ...args) => {
    console.log('[Main] IPC Message:', { channel, args });
  });
}

// App starten
app.whenReady().then(() => {
  console.log('[Main] App ist bereit');
  createWindow();

  // Registriere globale Fehlerbehandlung
  process.on('uncaughtException', (error) => {
    console.error('[Main] Unbehandelter Fehler:', error);
  });

  process.on('unhandledRejection', (error) => {
    console.error('[Main] Unbehandelte Promise-Ablehnung:', error);
  });
}); 