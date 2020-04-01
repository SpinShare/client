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

ipcRenderer.on("download-complete", (event, downloadPath) => {
    DOMDownloadOutput.innerText = "Extracing...";

    srxdControl.extractBackup(downloadPath, path.basename(downloadPath)).then(function(extractResult) {
        DOMDownloadOutput.innerText = "Installing...";

        if(extractResult) {
            installBackup(extractResult);
        } else {
            console.error("Backup could not be loaded!");
        }
    });
});

// Install local backup folder
async function installBackup(backupLocation) {
    // Copy temp folder to game dir
    await ncp(backupLocation, userGameDirectory, function(error) {
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