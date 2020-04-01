// Backup Data
let currentBackupLocation = "";
let currentSRTBLocation = "";
let currentSongLocation = "";

let currentSongTrackInfo = {};

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