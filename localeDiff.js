const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const languageToCompare = process.argv[2];

// Load reference (en) and target locale
const localeBaseRaw = fs.readFileSync(path.join(__dirname, '/src/i18n/en.json'), 'utf8');
const localeNewRaw = fs.readFileSync(path.join(__dirname, '/src/i18n', languageToCompare + '.json'), 'utf8');

const localeBase = JSON.parse(localeBaseRaw);
const localeNew = JSON.parse(localeNewRaw);

console.clear();
console.log('---- LOCALE DIFF ----');
console.log('');

let newKeys = 0;
let removedKeys = 0;

// Find missing keys
for (let [key, value] of Object.entries(localeBase)) {
  if (!localeNew.hasOwnProperty(key)) {
    console.log('[' + languageToCompare + '][' + chalk.red('MISSING') + '] "' + key + '": "' + value + '"');
    newKeys++;
  }
}

// Find removed keys
for (let [key, value] of Object.entries(localeNew)) {
  if (!localeBase.hasOwnProperty(key)) {
    console.log('[en][' + chalk.blue('REMOVED') + '] "' + key + '": "' + value + '"');
    removedKeys++;
  }
}

console.log('');
console.log('------ RESULTS ------');
console.log('');

if (newKeys > 0 || removedKeys > 0) {
  console.log(
    chalk.white('There are ') +
    chalk.red(newKeys + ' keys') +
    chalk.white(' missing in ') +
    chalk.green(languageToCompare) +
    chalk.white(' and ') +
    chalk.blue(removedKeys + ' keys') +
    chalk.white(' which are not present in en anymore.')
  )
} else {
  console.log(
    chalk.green('Language ') +
    chalk.white(languageToCompare) +
    chalk.green(' is up to date with ') + chalk.white('en')
  );
}

console.log('');
console.log('---------------------');