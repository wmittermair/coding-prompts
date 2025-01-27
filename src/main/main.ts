import { app, BrowserWindow, globalShortcut, ipcMain, clipboard } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    transparent: false,
    resizable: true,
    movable: true,
    hasShadow: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js')
    }
  });

  mainWindow.setMinimumSize(300, 400);

  const htmlPath = path.join(__dirname, '../renderer/index.html');
  console.log('Loading HTML from:', htmlPath);
  
  // DevTools nur im Entwicklungsmodus öffnen
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  mainWindow.loadFile(htmlPath);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Space', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });

  createWindow();
  registerIpcHandlers();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Channels
const IPC = {
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  GET_CLIPBOARD_CONTENT: 'GET_CLIPBOARD_CONTENT',
  MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
  MAXIMIZE_WINDOW: 'MAXIMIZE_WINDOW',
  CLOSE_WINDOW: 'CLOSE_WINDOW'
};

// Registriere alle IPC-Handler
function registerIpcHandlers() {
  // Clipboard-Funktionen
  ipcMain.handle(IPC.COPY_TO_CLIPBOARD, (_, text) => {
    try {
      console.log('Main: Kopiere in Zwischenablage:', text);
      clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Main: Fehler beim Kopieren:', error);
      throw error;
    }
  });

  ipcMain.handle(IPC.GET_CLIPBOARD_CONTENT, () => {
    try {
      console.log('Main: Lese aus Zwischenablage');
      const text = clipboard.readText();
      console.log('Main: Inhalt der Zwischenablage:', text);
      return text;
    } catch (error) {
      console.error('Main: Fehler beim Lesen:', error);
      throw error;
    }
  });

  // Fenster-Steuerelemente
  ipcMain.handle(IPC.MINIMIZE_WINDOW, () => {
    if (!mainWindow) throw new Error('Fenster ist nicht initialisiert');
    mainWindow.minimize();
    return true;
  });

  ipcMain.handle(IPC.MAXIMIZE_WINDOW, () => {
    if (!mainWindow) throw new Error('Fenster ist nicht initialisiert');
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return true;
  });

  ipcMain.handle(IPC.CLOSE_WINDOW, () => {
    if (!mainWindow) throw new Error('Fenster ist nicht initialisiert');
    mainWindow.close();
    return true;
  });
} 