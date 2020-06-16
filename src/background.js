const { app, protocol, BrowserWindow, ipcMain, dialog } = require('electron');
const { createProtocol } = require('vue-cli-plugin-electron-builder/lib');
const isDevelopment = process.env.NODE_ENV !== 'production';
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const uniqid = require('uniqid');

let win;
let deeplinkingData;
let deeplinkingView;

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


protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);

app.setAsDefaultProtocolClient("spinshare-song");
app.setAsDefaultProtocolClient("spinshare-user");

function createWindow () {
  win = new BrowserWindow({
    title: "SpinSha.re",
    width: 1350,
    height: 700,
    minHeight: 700,
    minWidth: 1350,
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

ipcMain.on("overlays-close", () => {
  win.webContents.send("overlays-close");
});

function download(url, fileName, cb) {
    let dest = path.join(app.getPath('temp'), fileName + ".zip");
    let file = fs.createWriteStream(dest);
    var partiallength = 0 //sets partiallength to 0

    if(new URL(url).protocol == "https:") {
      let request = https.get(url, function(response) {
          response.pipe(file);

          var totallength = parseInt(response.headers['content-length'], 10); //sets totallength of file
          response.on("data", function(chunk) {
            partiallength += chunk.length //adds each time
            let decimallength = partiallength / totallength
            if (decimallength != 1) {
              win.setProgressBar(decimallength) //sets progress bar to decimal
              win.webContents.send("downloadProgress", decimallength)
            }
            else {
              win.setProgressBar(0) //sets progress bar to blank when done
              win.webContents.send("downloadProgress", 0)
            }
          });

          file.on('finish', function() {
              file.close(cb(null, dest)); // async call of the callback
          });
      }).on('error', function(err) { // Handle errors
          fs.unlink(dest); // Delete the file async. (But we don't check the result)
          if (cb) cb(err.message, dest);
      });

    } else {
      let request = http.get(url, function(response) {
          response.pipe(file);

          var totallength = parseInt(response.headers['content-length'], 10); //sets totallength of file
          response.on("data", function(chunk) {
            partiallength += chunk.length //adds each time
            let decimallength = partiallength / totallength
            if (decimallength != 1) {
              win.setProgressBar(decimallength) //sets progress bar to decimal
              win.webContents.send("downloadProgress", decimallength)
            }
            else {
              win.setProgressBar(0) //sets progress bar to blank when done
              win.webContents.send("downloadProgress", 0)
            }
          });
          
          file.on('finish', function() {
              file.close(cb(null, dest)); // async call of the callback
          });
      }).on('error', function(err) { // Handle errors
          fs.unlink(dest); // Delete the file async. (But we don't check the result)
          if (cb) cb(err.message, dest);
      });
    }
};