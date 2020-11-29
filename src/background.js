const { app, protocol, BrowserWindow, ipcMain, dialog } = require('electron');
const { createProtocol } = require('vue-cli-plugin-electron-builder/lib');
const isDevelopment = process.env.NODE_ENV !== 'production';
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const uniqid = require('uniqid');
const keytar = require('keytar')

let win;
let deeplinkingData;
let deeplinkingView;

// Force one instance of the app
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('open-url', function (event, data) {
    event.preventDefault();
    executeDeeplink(data);
  });
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    let fullCommand = "";

    if (process.platform == 'win32') {
      let commandLineString = commandLine.slice(1) + '';
      let commandLineArgs = commandLineString.split(",");
      fullCommand = commandLineArgs[commandLineArgs.length - 1];
    }

    executeDeeplink(fullCommand);
  });
}

function executeDeeplink(deeplink) {
  if(deeplink.includes("spinshare-song")) {
    deeplinkingView = "SongDetail";
    deeplinkingData = deeplink.replace("spinshare-song://", "").replace("/", "");
  } else if(deeplink.includes("spinshare-user")) {
    deeplinkingView = "UserDetail";
    deeplinkingData = deeplink.replace("spinshare-user://", "").replace("/", "");
  }

  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
    
    win.webContents.send("deeplink", {
      view: deeplinkingView,
      data: deeplinkingData
    });
  }
}

// Setup Deeplinks
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);

app.setAsDefaultProtocolClient("spinshare-song");
app.setAsDefaultProtocolClient("spinshare-user");

function createWindow () {
  win = new BrowserWindow({
    title: "SpinSha.re",
    width: 1300,
    height: 800,
    minHeight: 800,
    minWidth: 1300,
    backgroundColor: '#212629',
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

  if (process.platform == 'win32') {
    if(process.argv.length > 1) {
    executeDeeplink(process.argv[1]);
    }
  }

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

ipcMain.on("getDeeplink", (event) => {
  win.webContents.send("deeplink", {
    view: deeplinkingView,
    data: deeplinkingData
  });
});

// Send a global event to close all overlays
ipcMain.on("overlays-close", () => {
  win.webContents.send("overlays-close");
});

function download(url, fileName, cb) {
    let dest = path.join(app.getPath('temp'), fileName + ".zip");
    let file = fs.createWriteStream(dest);
    let partiallength = 0;

    // Adapter Switch for HTTP/HTTPS protocol: https://stackoverflow.com/a/38465918
    let protocol = (function() { 
      var url = require('url'),
        adapters = {
          'http:': http,
          'https:': https,
        };
      return function(inputUrl) {
        return adapters[url.parse(inputUrl).protocol]
      }
    }());

    let request = protocol(url).get(url, function(response) {
        response.pipe(file);

        // Figure out total length
        let totallength = parseInt(response.headers['content-length'], 10);

        // Add the length of the newly received chunk everytime we receive one
        response.on("data", function(chunk) {
          partiallength += chunk.length;
          let decimallength = partiallength / totallength;
          if (decimallength != 1) {
            // Report back the progress
            win.setProgressBar(decimallength);
            win.webContents.send("downloadProgress", decimallength);
          }
          else {
            // Report back finished download
            win.setProgressBar(0);
            win.webContents.send("downloadProgress", 0);
          }
        });

        // Call definied Callback on finish
        file.on('finish', function() {
            file.close(cb(null, dest));
        });
    }).on('error', function(err) {
        fs.unlink(dest);
        if (cb) cb(err.message, dest);
    });
};

ipcMain.on("setToken", (event, ipcData) => {
  keytar.setPassword('Spinshare', 'ConnectToken', ipcData.ConnectToken);
})
