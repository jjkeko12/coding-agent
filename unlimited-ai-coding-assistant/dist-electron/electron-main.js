"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
const isDev = process.env.NODE_ENV === 'development';
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 20, y: 20 },
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js'),
        },
        backgroundColor: '#0f172a',
        show: false,
        title: 'CodeCraft AI',
        ...(process.platform === 'darwin' && {
            icon: path_1.default.join(__dirname, '../../public/icon.png'),
        }),
    });
    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });
    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../out/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
// Create macOS menu
function createMenu() {
    const template = [
        {
            label: 'CodeCraft AI',
            submenu: [
                { role: 'about', label: 'About CodeCraft AI' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
            ],
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' },
            ],
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Documentation',
                    click: () => {
                        electron_1.shell.openExternal('https://github.com/your-repo/codecraft-ai');
                    },
                },
            ],
        },
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
// IPC Handlers
electron_1.ipcMain.handle('open-dialog', async (_event, options) => {
    return await electron_1.dialog.showOpenDialog(mainWindow, options);
});
electron_1.ipcMain.handle('save-dialog', async (_event, options) => {
    return await electron_1.dialog.showSaveDialog(mainWindow, options);
});
electron_1.ipcMain.handle('open-external', async (_event, url) => {
    await electron_1.shell.openExternal(url);
    return true;
});
electron_1.ipcMain.handle('get-app-path', async () => {
    return {
        userData: electron_1.app.getPath('userData'),
        documents: electron_1.app.getPath('documents'),
        desktop: electron_1.app.getPath('desktop'),
        home: electron_1.app.getPath('home'),
        downloads: electron_1.app.getPath('downloads'),
    };
});
electron_1.ipcMain.handle('read-file', async (_event, filePath) => {
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    return fs.readFileSync(filePath, 'utf-8');
});
electron_1.ipcMain.handle('write-file', async (_event, filePath, content) => {
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
});
electron_1.ipcMain.handle('read-directory', async (_event, dirPath) => {
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: path_1.default.join(dirPath, entry.name),
    }));
});
// App lifecycle
electron_1.app.whenReady().then(() => {
    createMenu();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Handle file open events on macOS
if (process.platform === 'darwin') {
    electron_1.app.on('open-file', (event, filePath) => {
        event.preventDefault();
        if (mainWindow) {
            mainWindow.show();
        }
    });
}
