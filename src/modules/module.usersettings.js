const { electron } = require('electron');
const remote = require('@electron/remote');
const app = remote.app;
const path = require('path');
const fs = require('fs');

class UserSettings {
  constructor() {
    let defaults = {
      showExplicit: false,
      gameDirectory: this.detectGameDirectory(),
      language: app.getLocale()
    };

    const userDataPath = app.getPath('userData');
    this.path = path.join(userDataPath, 'UserSettings.json');
    this.data = parseDataFile(this.path, defaults);
  }
  
  get(key) {
    return this.data[key];
  }
  
  set(key, val) {
    this.data[key] = val;
    this.write();
  }

  clear(key) {
    this.data[key] = null;
    this.write();
  }

  write() {
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  // TODO: Custom Dir Support
  detectGameDirectory() {
    switch(process.platform) {
      default:
        alert("Unsupported platform!");
        break;
      case "win32":
        return path.join(app.getPath("userData"), "../..", "LocalLow", "Super Spin Digital", "Spin Rhythm XD", "Custom");
        break;
      case "darwin":
        return path.join(app.getPath("appData"), "Super Spin Digital", "Spin Rhythm XD", "Custom");
        break;
      case "linux":
        let linuxHomedir = require('os').homedir();
        return path.join(linuxHomedir, ".local", "share", "Steam", "steamapps", "compatdata", "1058830", "pfx", "drive_c", "users", "steamuser", "AppData", "LocalLow", "Super Spin Digital", "Spin Rhythm XD", "Custom");
        break;
    }
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

module.exports = UserSettings;