const { ipcRenderer } = require('electron');
const { dialog, shell, app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const ncp = require('ncp');
const http = require('http');
const unzipper = require('unzipper');

// System References
let systemOS = "";
let tempDirLocation = "";
let gameDirLocation = "";

// Backup Data
let currentBackupLocation = "";
let currentSRTBLocation = "";
let currentSongLocation = "";

let currentSongTrackInfo = {};

// UI Referrences
let DOMSectionStartup = document.querySelector(".section-startup");
let DOMSectionTrackinfo = document.querySelector(".section-trackinfo");
let DOMSectionResult = document.querySelector(".section-result");

let DOMExternalBackupID = document.querySelector(".external-backup-id");
let DOMExternalBackupProgress = document.querySelector(".external-backup-progress");

let DOMUISongCover = document.querySelector(".ui-song-cover");
let DOMUISongTitle = document.querySelector(".ui-song-title");
let DOMUISongSubtitle = document.querySelector(".ui-song-subtitle");
let DOMUISongArtist = document.querySelector(".ui-song-artist");
let DOMUISongAuthor = document.querySelector(".ui-song-author");

// Init System References
Init();

function Init() {
    console.log("Initializing System.");

    systemOS = process.platform;
    tempDirLocation = app.getPath('temp');

    // TODO: Mac/Linux Support
    if(process.platform == "win32") {
        gameDirLocation = path.join(app.getPath("userData"), "../..", "LocalLow", "Super Spin Digital", "Spin Rhythm XD", "Custom");
    }
}

function UIOpenBackup() {
    dialog.showOpenDialog({ title: "Open Backup", properties: ['openFile'], filters: [{"name": "Backup Archive", "extensions": ["zip"]}] }).then(result => {
        if(!result.canceled) {
            let filePath = result.filePaths[0];
            let fileName = path.basename(filePath);

            loadBackup(filePath, fileName).then(function(result) {
                if(result) {
                    UIUpdateMetadata();
                } else {
                    console.error("Backup could not be loaded!");
                }
            });
        }
    });
}

function UICopyBackup() {
    copyBackup();
}

function UIUpdateMetadata() {
    console.log(currentSongTrackInfo);

    DOMSectionTrackinfo.classList.add("active");
    DOMUISongCover.style.backgroundImage = "url(" + getSongCover(currentSongTrackInfo.albumArtReference.assetName) + ")";
    DOMUISongTitle.innerHTML = currentSongTrackInfo.title;
    DOMUISongSubtitle.innerHTML = currentSongTrackInfo.subtitle;
    DOMUISongArtist.innerHTML = "Song by " + currentSongTrackInfo.artistName;
    DOMUISongAuthor.innerHTML = "Chart by " + currentSongTrackInfo.charter;
}

let apiVersion = 1;
function UIDownloadBackup() {
    DOMExternalBackupProgress.innerHTML = "";

    http.get('http://localhost/www/customspeens-server/public/index.php/api/song/' + DOMExternalBackupID.value, function(response) {
        let data = "";

        response.on('data', function(chunk) { data += chunk; });

        response.on('end', function() {
            let apiResponse = JSON.parse( data );

            if(apiResponse.version === apiVersion) {
                console.log(apiResponse.data);

                DOMExternalBackupProgress.innerHTML = "Downloading...";

                // Let the main renderer download the backup
                ipcRenderer.send("download", {
                    url: apiResponse.data.paths.zip,
                    properties: { directory: tempDirLocation }
                });
            } else {
                console.error("Client is outdated!");
                DOMExternalBackupProgress.innerHTML = "Client is outdated!";
            }
        });
    });
}

async function loadBackup(filePath, fileName) {
    if(currentBackupLocation != "") {
        console.log("Unload previous Backup.");
        unloadBackup();
    }

    console.log("Extracting Backup.");

    currentBackupLocation = path.join(tempDirLocation, "extract-" + fileName);
    console.info(currentBackupLocation);

    // Unzip to temp/CustomSpeens/Song
    await fs.createReadStream(filePath).pipe(unzipper.Extract({ path: currentBackupLocation })).promise();

    console.log("Loading Backup.");

    // Find SRTB & OGG files
    let srtbFilesInBackupLocation = getFilesFromPath(currentBackupLocation, ".srtb");

    if(srtbFilesInBackupLocation.length < 1) {
        console.error("No SRTB file found in backup.");
        return false;
    }

    // Load SRTB file
    currentSRTBLocation = path.join(currentBackupLocation, srtbFilesInBackupLocation[0]);
    let srtbFile = JSON.parse( fs.readFileSync(currentSRTBLocation) );

    currentSongTrackInfo = JSON.parse( srtbFile.largeStringValuesContainer.values[0].val );

    // Load OGG file
    let oggFilesInBackupLocation = getFilesFromPath(path.join(currentBackupLocation, "AudioClips"), ".ogg");
    currentSongLocation = path.join(currentBackupLocation, oggFilesInBackupLocation[0]);

    // TODO: Backup Validation
    return true;
}

function copyBackup() {
    // Copy temp folder to game dir
    ncp(currentBackupLocation, gameDirLocation, function(error) {
        DOMSectionResult.classList.add("active");

        if(error) {
            console.error(error);
            DOMSectionResult.innerHTML = error;
            return false;
        }
        
        DOMSectionResult.innerHTML = "Copied Backup Successfully!";

        return true;
    })
}

function unloadBackup() {
    // Remove temp files
    rimraf(currentBackupLocation, function() { console.log("Removed backup folder."); });

    // Reset vars
    currentBackupLocation = "";
    currentSRTBLocation = "";
    currentSongLocation = "";

    currentSongTrackInfo = {};
}

// Used to find files by file extension
// by https://stackoverflow.com/a/52024318
function getFilesFromPath(path, extension) {
    let dir = fs.readdirSync( path );
    return dir.filter( elm => elm.match(new RegExp(`.*\.(${extension})$`, 'ig')));
}
function getSongCover(extension) {
    let dir = fs.readdirSync( path.join(currentBackupLocation, "AlbumArt") );
    let fileExtension = dir.filter( elm => elm.match(new RegExp(`(${extension}).*\.$`, 'ig')));

    let finalPath = path.join(currentBackupLocation, "AlbumArt", fileExtension[0]);

    let base64Data = "data:image/jpg;base64," + fs.readFileSync(finalPath, { encoding: 'base64' });

    return base64Data;
}

ipcRenderer.on("download-complete", (event, info) => {
    loadBackup(info, path.basename(info)).then(function(result) {
        if(result) {
            DOMExternalBackupProgress.innerHTML = "";
            UIUpdateMetadata();
        } else {
            console.error("Backup could not be loaded!");
        }
    });
});
