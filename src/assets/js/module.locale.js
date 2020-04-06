const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Locale {
  constructor(localeToLoad) {
    this.localePath = path.join(__dirname, "..", "..", "locale", localeToLoad + '.json');
    this.fallbackPath = path.join(__dirname, "..", "..", "locale", 'en.json');

    // Fallback to "en" if language is not supported
    if(fs.existsSync(this.localePath)) {
        this.path = this.localePath;
    } else {
        this.path = this.fallbackPath;
    }

    this.strings = parseDataFile(this.path);
    console.log("Loaded Locale " + localeToLoad);
    document.getElementsByTagName('html')[0].setAttribute('lang', localeToLoad);
  }
  
  get(key) {
    return this.strings[key];
  }
}

function parseDataFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
      throw error;
  }
}

module.exports = Locale;