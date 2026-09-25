"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
    },
    openDialog: (options) => electron_1.ipcRenderer.invoke('open-dialog', options),
    saveDialog: (options) => electron_1.ipcRenderer.invoke('save-dialog', options),
    openExternal: (url) => electron_1.ipcRenderer.invoke('open-external', url),
    getAppPath: () => electron_1.ipcRenderer.invoke('get-app-path'),
    readFile: (filePath) => electron_1.ipcRenderer.invoke('read-file', filePath),
    writeFile: (filePath, content) => electron_1.ipcRenderer.invoke('write-file', filePath, content),
    readDirectory: (dirPath) => electron_1.ipcRenderer.invoke('read-directory', dirPath),
    send: (channel, data) => {
        const validChannels = ['file-explorer', 'code-generation'];
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        const validChannels = ['file-explorer', 'code-generation'];
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.on(channel, (_event, ...args) => func(...args));
        }
    },
});
