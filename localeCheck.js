const fs = require('fs');
const glob = require('glob');
const path = require('path');
const chalk = require('chalk');
const chalkTable = require('chalk-table');

const localeBaseRaw = fs.readFileSync(path.join(__dirname, '/src/i18n/en.json'), 'utf8');
const localeBase = JSON.parse(localeBaseRaw);


console.clear();
console.log('---- LOCALE CHECK ----');
console.log('');

let results = [];

const allLocales = glob.sync(path.join(__dirname, '/src/i18n', '*.json'));
allLocales.forEach((locale) => {
    if(!locale.includes("en.json")) {
        let rawLocale = locale.split("/")[locale.split("/").length - 1];

        let localeNewRaw = fs.readFileSync(locale, 'utf8');
        let localeNew = JSON.parse(localeNewRaw);
        
        let newKeys = 0;
        let removedKeys = 0;

        // Find missing keys
        for (let [key, value] of Object.entries(localeBase)) {
          if (!localeNew.hasOwnProperty(key)) {
            newKeys++;
          }
        }
        
        // Find removed keys
        for (let [key, value] of Object.entries(localeNew)) {
          if (!localeBase.hasOwnProperty(key)) {
            removedKeys++;
          }
        }

        results.push({
            locale: rawLocale,
            missing: newKeys + " keys",
            removed: removedKeys + " keys",
            ready: ((newKeys == 0 && removedKeys == 0) ? chalk.green("READY") : chalk.red("NOT READY"))
        });
    }
});

let tableOptions = {
    leftPad: 2,
    columns: [
        { field: "locale", name: chalk.cyan("Locale")},
        { field: "missing", name: chalk.cyan("Missing")},
        { field: "removed", name: chalk.cyan("Removed")},
        { field: "ready", name: chalk.white("Ready to ship?")},
    ]
}

console.log(chalkTable(tableOptions, results));

console.log('');
console.log('---------------------');