let DOMDownloadOverlay = document.querySelector(".download-overlay");
let DOMDownloadOutput = DOMDownloadOverlay.querySelector(".download-content .download-output");
let DOMDownloadActions = DOMDownloadOverlay.querySelector(".download-content .download-actions");

function DownloadSong(songData) {
    DOMDownloadOverlay.classList.add("active");
    DOMDownloadActions.classList.remove("active");
    DOMDownloadOutput.innerText = "Downloading...";

    // Send download command to main.js
    ipcRenderer.send("download", {
        url: songData.paths.zip,
        properties: { directory: tempDirLocation }
    });

    console.log(songData);
}

function CloseDownloadOverlay() {
    DOMDownloadOverlay.classList.remove("active");
    DOMDownloadActions.classList.remove("active");
    DOMDownloadOutput.innerText = "Downloading...";
}

function UnloadBackup() {
    // Remove temp files
    rimraf(currentBackupLocation, function() { console.log("Removed backup folder."); });

    // Reset vars
    currentBackupLocation = "";
    currentSRTBLocation = "";
    currentSongLocation = "";

    currentSongTrackInfo = {};
}

ipcRenderer.on("download-complete", (event, downloadPath) => {
    DOMDownloadOutput.innerText = "Extracing...";

    extractBackup(downloadPath, path.basename(downloadPath)).then(function(extractResult) {
        DOMDownloadOutput.innerText = "Installing...";

        if(extractResult) {
            installBackup(extractResult);
        } else {
            console.error("Backup could not be loaded!");
        }
    });
});

// TODO: Refactor these to dynamic returns
let currentBackupLocation = "";
let currentSRTBLocation = "";
let currentSongLocation = "";

let currentSongTrackInfo = {};

// Extract a local backup folder
async function extractBackup(filePath, fileName) {
    if(currentBackupLocation != "") {
        console.log("Unload previous Backup.");
        UnloadBackup();
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
    return currentBackupLocation;
}

// Install local backup folder
async function installBackup(backupLocation) {
    // Copy temp folder to game dir
    await ncp(backupLocation, gameDirLocation, function(error) {
        if(error) {
            console.error(error);
            console.error("Couldn't copy backup!");

            DOMDownloadActions.classList.add("active");
            DOMDownloadOutput.innerText = "Error!";
        }

        console.log("Successfully copied backup!");

        DOMDownloadActions.classList.add("active");
        DOMDownloadOutput.innerText = "Done!";
    });
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