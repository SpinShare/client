const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const { download } = require('electron-dl');
const isDev = require('electron-is-dev');

let win;
let deeplinkingUrl;
let deeplinkingType;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    executeDeeplink(commandLine);
  });
}

function executeDeeplink(commandLine) {
  if (process.platform == 'win32') {
    let commandLineString = commandLine.slice(1) + '';
    let commandLineArgs = commandLineString.split(",");
    let fullCommand = commandLineArgs[commandLineArgs.length - 1];

    if(fullCommand.includes("spinshare-song")) {
      deeplinkingType = "song";
      deeplinkingUrl = fullCommand.replace("spinshare-song://", "").replace("/", "");
    } else if(fullCommand.includes("spinshare-user")) {
      deeplinkingType = "user";
      deeplinkingUrl = fullCommand.replace("spinshare-user://", "").replace("/", "");
    }
  }

  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
    if(deeplinkingType == "song") {
      win.webContents.executeJavaScript(`NavigateToSongDetail("${deeplinkingUrl}")`);
    } else if(deeplinkingType == "user") {
      win.webContents.executeJavaScript(`NavigateToUser("${deeplinkingUrl}")`);
    }
  }
}

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

  win.loadFile('./src/app.htm');

  if(isDev) {
    win.webContents.openDevTools();
  }
  win.setMenuBarVisibility(false);

  if (process.platform == 'win32') {
    deeplinkingUrl = process.argv.slice(1);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on('open-url', function (event, url) {
  event.preventDefault();
  deeplinkingUrl = url;
});

app.setAsDefaultProtocolClient("spinshare-song");
app.setAsDefaultProtocolClient("spinshare-user");

ipcMain.on("download", (event, info) => {
  console.log("Download Request Received");
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => win.webContents.send("download-complete", dl.getSavePath()));
});