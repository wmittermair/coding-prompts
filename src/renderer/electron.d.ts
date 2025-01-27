export interface ITestAPI {
  ping: () => string;
  echo: (msg: string) => string;
  getTime: () => string;
  testIpc: () => Promise<string>;
}

export interface IElectronAPI {
  testStore: () => Promise<string>;
  copyToClipboard: (text: string) => Promise<boolean>;
  getClipboardContent: () => Promise<string>;
  minimizeWindow: () => Promise<boolean>;
  maximizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<boolean>;
  loadCategories: () => Promise<any>;
  saveCategories: (categories: any) => Promise<boolean>;
  addCategory: () => Promise<any>;
  addTextBlock: (categoryId: string) => Promise<any>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
    test: ITestAPI;
  }
} 