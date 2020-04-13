const DOMLibrarySongsList = document.querySelector(".song-row-library .song-list");
const DOMDeleteOverlay = document.querySelector(".delete-overlay");
const DOMDeleteOverlayFiles = document.querySelector(".delete-overlay .delete-files");

async function ExtractionProcess(filePath) {
    console.log(filePath);

    if(filePath.endsWith('.zip')) {
        let fileName = path.basename(filePath);
        let newControl = new SRXD();

        newControl.extractBackup(filePath, fileName).then(function(extractResults) {
            if(extractResults) {
                installBackup(extractResults).then(function() {
                    RefreshLibrary();
                });

                // I know this sucks, but it works. So don't be mad at me!
                // ~ thatanimeweirdo
                setTimeout(function() {
                    RefreshLibrary();
                }, 200);
            } else {
                console.error("Backup could not be loaded!");
            }
        });
    } else {
        console.error('Not a zip!');
    }
}

//Upload Manually
function InstallBackupManually() {
    dialog.showOpenDialog({ title: "Open Backup", properties: ['openFile', 'multiSelections'], filters: [{"name": "Backup Archive", "extensions": ["zip"]}] }).then(result => {
        if(!result.canceled) {
            result.filePaths.forEach(function(rawFilePath) {
                let filePath = glob.sync(rawFilePath);
                if(filePath.length > 0) {
                    ExtractionProcess(filePath[0]);
                }
            });
        }
    });
}

// Drag and Drop
document.ondragover = document.ondrop = function(dragndrop) {
    dragndrop.preventDefault();
}
  
document.body.ondrop = function(ev) {
    Array.from(ev.dataTransfer.files).forEach(function(file) {
        ExtractionProcess(file.path);
    });
    NavigateToSection(2);
    ev.preventDefault();
}

function RefreshLibrary() {
    console.log("Refreshing Library");

    // Clear current songs
    let installElement = DOMLibrarySongsList.firstElementChild;

    DOMLibrarySongsList.innerHTML = "";
    DOMLibrarySongsList.appendChild(installElement);

    // Load all custom songs
    let customSongs = srxdControl.getLocalSongs(userSettings.get('gameDirectory'));

    // remove current songs
    customSongs.forEach(function(customSong) {
        let songDetail = srxdControl.getSongDetail(path.join(userSettings.get('gameDirectory'), customSong));
        let spinShareReference = false;

        if(customSong.includes("spinshare_")) {
            spinShareReference = customSong.replace(".srtb", "");
        }

        DOMLibrarySongsList.appendChild(BuildLibrarySongDOM(songDetail, spinShareReference));
    });
}

function BuildLibrarySongDOM(songDetail, spinShareReference) {
    let songContainer = document.createElement("div");
    songContainer.classList.add("song-item");

    if(!spinShareReference) {
        songContainer.classList.add("song-item-local");
    }

    let songCover = document.createElement("div");
    songCover.classList.add("song-cover");
    songCover.style.backgroundImage = "url('" + songDetail[1] + "')";

    let songCharterInfo = document.createElement("div");
    songCharterInfo.classList.add("song-charter-info");
    
    let songCharter = document.createElement("div");
    songCharter.classList.add("song-charter");
    songCharter.innerHTML = "<i class=\"mdi mdi-account-circle\"></i><span>" + songDetail[0].charter + "</span>";
    songCharterInfo.appendChild(songCharter);

    songCover.appendChild(songCharterInfo);
    songContainer.appendChild(songCover);

    let songMetaData = document.createElement("div");
    songMetaData.classList.add("song-metadata");
    
    let songTitle = document.createElement("div");
    songTitle.classList.add("song-title");
    songTitle.innerText = songDetail[0].title;
    songMetaData.appendChild(songTitle);
    
    let songArtist = document.createElement("div");
    songArtist.classList.add("song-artist");
    songArtist.innerText = songDetail[0].artistName;
    songMetaData.appendChild(songArtist);
    
    songContainer.appendChild(songMetaData);

    if(spinShareReference) {
        songContainer.addEventListener('click', function() {
            NavigateToSongDetail(spinShareReference);
        });
    }

    songContainer.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        ClearContextMenu();
        AddContextMenuItem("delete", locale.get('library.contextmenu.delete'), function() { ShowDeleteOverlay(songDetail); });
        ShowContextMenu(e.pageX, e.pageY);
    });

    return songContainer;
}

let songToDelete;
function ShowDeleteOverlay(songDetail) {
    songToDelete = songDetail;

    let files = [];

    files.push(songToDelete[2]);
    files.push(songToDelete[3]);
    files.push(songToDelete[4]);

    DOMDeleteOverlayFiles.innerHTML = "";

    files.forEach(function(file) {
        let newFile = document.createElement("span");

        newFile.innerText = file.replace(userSettings.get('gameDirectory'), "");

        DOMDeleteOverlayFiles.appendChild(newFile);
    })

    DOMDeleteOverlay.classList.add("active");
}

function DeleteConfirm() {
    srxdControl.deleteFiles(songToDelete);

    DOMDeleteOverlay.classList.remove("active");
}
function DeleteDeny() {
    songToDelete = "";

    DOMDeleteOverlay.classList.remove("active");
}