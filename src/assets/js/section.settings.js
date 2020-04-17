const DOMSettingsInputVersion = document.querySelector(".settings-input-version");
const DOMSettingsInputLanguage = document.querySelector(".settings-input-language");
const DOMSettingsInputGameDirectory = document.querySelector(".settings-input-gamedirectory");

function InitSettings() {
    DOMSettingsInputVersion.innerText = app.getVersion() + "-" + (isDev ? "dev" : "prod");

    DOMSettingsInputLanguage.querySelectorAll("option").forEach(function(optionItem) {
        if(optionItem.value == userSettings.get('language')) {
            optionItem.selected = true;
        }
    });

    DOMSettingsInputGameDirectory.value = userSettings.get('gameDirectory');
}

function SettingsChangeLanguage() {
    let selectedLanguage = DOMSettingsInputLanguage.value;
    userSettings.set('language', selectedLanguage);

    // App restart
    window.location = window.location;
}

function SettingsSelectGameDirectory() {
    dialog.showOpenDialog({ title: "Open Game Directory", properties: ['openDirectory'] }).then(result => {
        if(!result.canceled) {
            let directoryPath = result.filePaths[0];

            userSettings.set('gameDirectory', directoryPath);
            DOMSettingsInputGameDirectory.value = userSettings.get('gameDirectory');
        }
    });
}

function SettingsResetGameDirectory() {
    userSettings.set('gameDirectory', detectGameDirectory());
    DOMSettingsInputGameDirectory.value = userSettings.get('gameDirectory');
}