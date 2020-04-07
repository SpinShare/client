let DOMDownloadOverlay = document.querySelector(".download-overlay");
let DOMDownloadStatusBarHandle = DOMDownloadOverlay.querySelector(".download-content .download-statusbar-handle");
let DOMDownloadStatusDownloading = DOMDownloadOverlay.querySelector(".download-content .download-status-downloading");
let DOMDownloadStatusExtracting = DOMDownloadOverlay.querySelector(".download-content .download-status-extracting");
let DOMDownloadStatusInstalling = DOMDownloadOverlay.querySelector(".download-content .download-status-installing");
let DOMDownloadStatusDone = DOMDownloadOverlay.querySelector(".download-content .download-status-done");
let DOMDownloadActions = DOMDownloadOverlay.querySelector(".download-content .download-actions");

function DownloadSong(songData) {
    DOMDownloadOverlay.classList.add("active");
    DOMDownloadActions.classList.remove("active");

    DOMDownloadStatusBarHandle.style.width = "0%";

    setTimeout(function() {
        UpdateDownloadStatus(0);

        // Send download command to main.js
        ipcRenderer.send("download", {
            url: songData.paths.zip,
            properties: { directory: tempDirLocation }
        });
    }, 100);
}

function CloseDownloadOverlay() {
    DOMDownloadOverlay.classList.remove("active");
    DOMDownloadActions.classList.remove("active");

    UpdateDownloadStatus(0);
    DOMDownloadStatusBarHandle.style.width = "0%";
}

ipcRenderer.on("download-complete", (event, downloadPath) => {
    UpdateDownloadStatus(1);

    setTimeout(function() {
        srxdControl.extractBackup(downloadPath, path.basename(downloadPath)).then(function(extractResult) {
            UpdateDownloadStatus(2);

            if(extractResult) {
                installBackup(extractResult);
            } else {
                // DOMDownloadOutput.innerText = locale.get('download.status.extractingFailed');
                console.error("Backup could not be loaded!");
            }
        });
    }, 750);
});

// Install local backup folder
async function installBackup(backupLocation) {
    // Copy temp folder to game dir
    await ncp(backupLocation, userSettings.get('gameDirectory'), function(error) {
        if(error) {
            console.error(error);
            console.error("Couldn't copy backup!");

            DOMDownloadActions.classList.add("active");
            // DOMDownloadOutput.innerText = locale.get('download.status.installingFailed');
        }
        
        DOMDownloadActions.classList.add("active");
        UpdateDownloadStatus(3);
    });
}

function UpdateDownloadStatus(_status) {
    DOMDownloadStatusDownloading.classList.remove("active");
    DOMDownloadStatusExtracting.classList.remove("active");
    DOMDownloadStatusInstalling.classList.remove("active");
    DOMDownloadStatusDone.classList.remove("active");

    switch(_status) {
        default:
        case 0:
            DOMDownloadStatusDownloading.classList.add("active");
            DOMDownloadStatusBarHandle.style.width = "25%";
            break;
        case 1:
            DOMDownloadStatusExtracting.classList.add("active");
            DOMDownloadStatusBarHandle.style.width = "50%";
            break;
        case 2:
            DOMDownloadStatusInstalling.classList.add("active");
            DOMDownloadStatusBarHandle.style.width = "75%";
            break;
        case 3:
            DOMDownloadStatusDone.classList.add("active");
            DOMDownloadStatusBarHandle.style.width = "100%";
            break;
    }
}