const { app, BrowserWindow, protocol } = require('electron');

const PROTOCOL_PREFIX = "csinstall";
app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);

function createWindow () {
  const win = new BrowserWindow({
    width: 1300,
    height: 700,
    minHeight: 590,
    minWidth: 840,
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