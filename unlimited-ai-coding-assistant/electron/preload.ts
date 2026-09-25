import { contextBridge, ipcRenderer, OpenDialogOptions, SaveDialogOptions } from 'electron';

interface ElectronAPI {
  platform: NodeJS.Platform;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
  openDialog: (options?: OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>;
  saveDialog: (options?: SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>;
  openExternal: (url: string) => Promise<boolean>;
  getAppPath: () => Promise<{
    userData: string;
    documents: string;
    desktop: string;
    home: string;
    downloads: string;
  }>;
  readFile: (filePath: string) => Promise<string>;
  writeFile: (filePath: string, content: string) => Promise<boolean>;
  readDirectory: (dirPath: string) => Promise<Array<{
    name: string;
    isDirectory: boolean;
    path: string;
  }>>;
  send: (channel: string, data: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  openDialog: (options?: OpenDialogOptions) => ipcRenderer.invoke('open-dialog', options),
  saveDialog: (options?: SaveDialogOptions) => ipcRenderer.invoke('save-dialog', options),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),
  readDirectory: (dirPath: string) => ipcRenderer.invoke('read-directory', dirPath),
  send: (channel: string, data: any) => {
    const validChannels = ['file-explorer', 'code-generation'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['file-explorer', 'code-generation'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
} as ElectronAPI);

// Declare the global type
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
