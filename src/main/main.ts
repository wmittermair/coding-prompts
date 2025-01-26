import { app, BrowserWindow, globalShortcut, ipcMain, clipboard } from 'electron';
import path from 'path';
import { IPC } from '../shared/ipc';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js')
    }
  });

  const htmlPath = path.join(__dirname, '../renderer/index.html');
  console.log('Loading HTML from:', htmlPath);
  
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile(htmlPath);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.on('blur', () => {
    mainWindow?.hide();
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
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler registrieren
ipcMain.handle(IPC.COPY_TO_CLIPBOARD, (_, text: string) => {
  clipboard.writeText(text);
});

ipcMain.handle(IPC.GET_CLIPBOARD_CONTENT, () => {
  return clipboard.readText();
}); 