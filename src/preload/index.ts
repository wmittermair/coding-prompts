import { contextBridge, ipcRenderer } from 'electron';

console.log('[Preload] Start des Preload-Skripts');

// Test-Funktionen
const testFunctions = {
  ping: () => 'pong',
  echo: (msg: string) => msg,
  getTime: () => new Date().toISOString(),
  testIpc: async () => {
    try {
      return await ipcRenderer.invoke('TEST_STORE');
    } catch (error) {
      console.error('[Preload] IPC Test fehlgeschlagen:', error);
      throw error;
    }
  }
};

// Expose Test-API
try {
  console.log('[Preload] Exponiere Test-API...');
  contextBridge.exposeInMainWorld('test', testFunctions);
  console.log('[Preload] Test-API erfolgreich exponiert');
} catch (error) {
  console.error('[Preload] Fehler beim Exponieren der Test-API:', error);
}

// Expose Haupt-API
try {
  console.log('[Preload] Exponiere Haupt-API...');
  contextBridge.exposeInMainWorld('electron', {
    testStore: () => ipcRenderer.invoke('TEST_STORE'),
    copyToClipboard: (text: string) => ipcRenderer.invoke('COPY_TO_CLIPBOARD', text),
    getClipboardContent: () => ipcRenderer.invoke('GET_CLIPBOARD_CONTENT'),
    minimizeWindow: () => ipcRenderer.invoke('MINIMIZE_WINDOW'),
    maximizeWindow: () => ipcRenderer.invoke('MAXIMIZE_WINDOW'),
    closeWindow: () => ipcRenderer.invoke('CLOSE_WINDOW'),
    loadCategories: () => ipcRenderer.invoke('LOAD_CATEGORIES'),
    saveCategories: (categories: any) => ipcRenderer.invoke('SAVE_CATEGORIES', categories),
    addCategory: () => ipcRenderer.invoke('ADD_CATEGORY'),
    addTextBlock: (categoryId: string) => ipcRenderer.invoke('ADD_TEXTBLOCK', categoryId)
  });
  console.log('[Preload] Haupt-API erfolgreich exponiert');
} catch (error) {
  console.error('[Preload] Fehler beim Exponieren der Haupt-API:', error);
}

// Test der APIs nach der Exposition
const testApis = () => {
  console.log('[Preload] Teste APIs...');
  
  // @ts-ignore
  const testApi = window.test;
  if (testApi) {
    console.log('[Preload] Test-API gefunden');
    try {
      const pingResult = testApi.ping();
      console.log('[Preload] Ping Test:', pingResult);
      
      const echoResult = testApi.echo('Hallo Test');
      console.log('[Preload] Echo Test:', echoResult);
      
      const timeResult = testApi.getTime();
      console.log('[Preload] Zeit Test:', timeResult);
    } catch (error) {
      console.error('[Preload] Test-API Tests fehlgeschlagen:', error);
    }
  } else {
    console.error('[Preload] Test-API nicht gefunden!');
  }
  
  // @ts-ignore
  const electronApi = window.electron;
  if (electronApi) {
    console.log('[Preload] Electron API gefunden:', Object.keys(electronApi));
  } else {
    console.error('[Preload] Electron API nicht gefunden!');
  }
};

// Warte kurz und führe dann die Tests durch
setTimeout(testApis, 100); 