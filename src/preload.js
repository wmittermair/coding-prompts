const { contextBridge, ipcRenderer } = require('electron');

// IPC Channels
const IPC = {
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  GET_CLIPBOARD_CONTENT: 'GET_CLIPBOARD_CONTENT',
  MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
  MAXIMIZE_WINDOW: 'MAXIMIZE_WINDOW',
  CLOSE_WINDOW: 'CLOSE_WINDOW'
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    copyToClipboard: async (text) => {
      console.log('Preload: Kopiere in Zwischenablage:', text);
      return await ipcRenderer.invoke(IPC.COPY_TO_CLIPBOARD, text);
    },
    getClipboardContent: async () => {
      console.log('Preload: Lese aus Zwischenablage');
      return await ipcRenderer.invoke(IPC.GET_CLIPBOARD_CONTENT);
    },
    minimizeWindow: () => ipcRenderer.invoke(IPC.MINIMIZE_WINDOW),
    maximizeWindow: () => ipcRenderer.invoke(IPC.MAXIMIZE_WINDOW),
    closeWindow: () => ipcRenderer.invoke(IPC.CLOSE_WINDOW)
  }
); 