const { app, BrowserWindow, ipcMain } = require('electron');
const { download } = require('electron-dl');

let win;

const PROTOCOL_PREFIX = "csinstall";
app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);

function createWindow () {
  win = new BrowserWindow({
    width: 1300,
    height: 700,
    minHeight: 700,
    minWidth: 1300,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('./src/app.htm');

  win.webContents.openDevTools();
  win.setMenuBarVisibility(false);

  protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {
    const fullUrl = formFullTodoUrl(req.url);
    console.log(fullUrl);
  });
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

ipcMain.on("download", (event, info) => {
  console.log("Download Request Received");
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => win.webContents.send("download-complete", dl.getSavePath()));
});