const { contextBridge, ipcRenderer } = require('electron');

// IPC Channels
const IPC = {
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  GET_CLIPBOARD_CONTENT: 'GET_CLIPBOARD_CONTENT',
  MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
  MAXIMIZE_WINDOW: 'MAXIMIZE_WINDOW',
  CLOSE_WINDOW: 'CLOSE_WINDOW'
};

// Wrapper für IPC-Aufrufe mit Fehlerbehandlung
const handleIpcError = async (channel: string, ...args: any[]) => {
  try {
    console.log(`Sende IPC-Aufruf: ${channel}`, args);
    const result = await ipcRenderer.invoke(channel, ...args);
    console.log(`IPC-Aufruf erfolgreich: ${channel}`, result);
    return result;
  } catch (error) {
    console.error(`Fehler bei IPC-Aufruf ${channel}:`, error);
    throw error;
  }
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    copyToClipboard: (text: string) => handleIpcError(IPC.COPY_TO_CLIPBOARD, text),
    getClipboardContent: () => handleIpcError(IPC.GET_CLIPBOARD_CONTENT),
    minimizeWindow: () => handleIpcError(IPC.MINIMIZE_WINDOW),
    maximizeWindow: () => handleIpcError(IPC.MAXIMIZE_WINDOW),
    closeWindow: () => handleIpcError(IPC.CLOSE_WINDOW)
  }
); 