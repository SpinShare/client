const { electron, remote } = require('electron');
const app = remote.app;
const path = require('path');
const fs = require('fs');

class UserSettings {
  constructor() {
    let defaults = {
      showExplicit: false,
      gameDirectory: detectGameDirectory(),
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
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

// TODO: Mac/Linux Support
function detectGameDirectory() {
  if(process.platform == "win32") {
      return path.join(app.getPath("userData"), "../..", "LocalLow", "Super Spin Digital", "Spin Rhythm XD", "Custom");
  } else {
      console.error("Unsupported system");
  }
}

module.exports = UserSettings;