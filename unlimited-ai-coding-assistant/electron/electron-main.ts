import { app, BrowserWindow, Menu, ipcMain, shell, dialog } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 20 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#0f172a',
    show: false,
    title: 'CodeCraft AI',
    ...(process.platform === 'darwin' && {
      icon: path.join(__dirname, '../../public/icon.png'),
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
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create macOS menu
function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
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
            shell.openExternal('https://github.com/your-repo/codecraft-ai');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle('open-dialog', async (_event, options: Electron.OpenDialogOptions) => {
  return await dialog.showOpenDialog(mainWindow!, options);
});

ipcMain.handle('save-dialog', async (_event, options: Electron.SaveDialogOptions) => {
  return await dialog.showSaveDialog(mainWindow!, options);
});

ipcMain.handle('open-external', async (_event, url: string) => {
  await shell.openExternal(url);
  return true;
});

ipcMain.handle('get-app-path', async () => {
  return {
    userData: app.getPath('userData'),
    documents: app.getPath('documents'),
    desktop: app.getPath('desktop'),
    home: app.getPath('home'),
    downloads: app.getPath('downloads'),
  };
});

ipcMain.handle('read-file', async (_event, filePath: string) => {
  const fs = await import('fs');
  return fs.readFileSync(filePath, 'utf-8');
});

ipcMain.handle('write-file', async (_event, filePath: string, content: string) => {
  const fs = await import('fs');
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
});

ipcMain.handle('read-directory', async (_event, dirPath: string) => {
  const fs = await import('fs');
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries.map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    path: path.join(dirPath, entry.name),
  }));
});

// App lifecycle
app.whenReady().then(() => {
  createMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle file open events on macOS
if (process.platform === 'darwin') {
  app.on('open-file', (event, filePath: string) => {
    event.preventDefault();
    if (mainWindow) {
      mainWindow.show();
    }
  });
}
