const { app, BrowserWindow, nativeImage, autoUpdater, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let localIconPath = path.join(__dirname, 'icon', 'favicon.ico');

function createWindowWithIcon(iconPath) {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: nativeImage.createFromPath(iconPath),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false,
            webviewTag: true,
            partition: 'persist:territorial'
        }
    });

    mainWindow.loadURL('https://territorial.io/');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createWindow() {
    createWindowWithIcon(localIconPath);
}

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();  // Automatically check for updates and notify the user
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Listen for update events
autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

// When receiving a 'restart_app' event from the renderer, quit and install the update
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});
