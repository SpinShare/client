const { app, protocol, BrowserWindow, ipcMain } = require('electron');
const DownloadManager = require("electron-download-manager");
const { createProtocol } = require('vue-cli-plugin-electron-builder/lib');
const isDevelopment = process.env.NODE_ENV !== 'production';
const fs = require('fs');
const http = require('http');
const path = require('path');
const uniqid = require('uniqid');

let win;
let deeplinkingUrl;
let deeplinkingType;

DownloadManager.register({
    downloadFolder: app.getPath("temp")
});

protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow () {
  win = new BrowserWindow({
    title: "SpinSha.re",
    width: 1300,
    height: 700,
    minHeight: 700,
    minWidth: 1300,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }

  win.setMenuBarVisibility(false);

  win.on('closed', () => {
    win = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', async () => {
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.on("download", (event, ipcData) => {
    console.log("Starting download of > " + ipcData.queueItem.title);

    download(ipcData.queueItem.downloadPath, uniqid(), (error, dlInfo) => {
        if (error) {
            console.log(error);
        
            let downloadItem = {
                id: ipcData.queueItem.id,
                status: 1,
                downloadPath: null
            }
    
            win.webContents.send("download-complete", downloadItem);

            return;
        }
        
        let downloadItem = {
            id: ipcData.queueItem.id,
            status: 2,
            downloadPath: dlInfo
        }

        win.webContents.send("download-complete", downloadItem);
    });
});

function download(url, fileName, cb) {
    let dest = path.join(app.getPath('temp'), fileName + ".zip");
    let file = fs.createWriteStream(dest);
    let request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb(null, dest)); // async call of the callback
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message, dest);
    });
};