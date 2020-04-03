const DOMLibrarySongsList = document.querySelector(".song-row-library .song-list");

function ExtractionProcess(filePath) {
if (filePath.endsWith('.zip')){
    let fileName = path.basename(filePath);
    srxdControl.extractBackup(filePath, fileName).then(function(extractResults) {
        if(extractResults) {
            installBackup(extractResults);
            setTimeout(function() {
                RefreshLibrary();
            }, 200);
        } else {
            console.error("Backup could not be loaded!");
        }
    });   
}
    else {console.error('Not a zip!');}
}

//Upload Manually
function InstallBackupManually() {
    dialog.showOpenDialog({ title: "Open Backup", properties: ['openFile'], filters: [{"name": "Backup Archive", "extensions": ["zip"]}] }).then(result => {
        if(!result.canceled) {
            let filePath = result.filePaths[0];
            ExtractionProcess(filePath);
        }
    });
}

//(Counter is for applying and deleting the dragenter notice)
// Drag and Drop
document.ondragover = document.ondrop = function(dragndrop) {
    dragndrop.preventDefault();
}
  
document.body.ondrop = function(ev) {
    let filePath = (ev.dataTransfer.files[0].path);
    ev.preventDefault();
    NavigateToSection(2);
    ClearDragAndDrop(dragCounter);
    ExtractionProcess(filePath);
}

// Drag and Drop Notice 
document.ondragenter = function(){
    dragCounter++;
    if (dragCounter === 1) { 
        //create dark background
        var dragDarken = document.createElement('div');
        dragDarken.className = "drag-darken drag";
        dragDarken.id = "drag-darken";
        document.body.appendChild(dragDarken);
        //create box
        var dragNotice = document.createElement('div');
        dragNotice.className = "drag-notice";
        dragNotice.id = "drag-notice";
        document.getElementById("drag-darken").appendChild(dragNotice);
        //create text
        var dragNoticeInstall = document.createElement('i');
        dragNoticeInstall.className = "mdi mdi-folder-music";
        document.getElementById("drag-notice").appendChild(dragNoticeInstall);        
    }
}
document.ondragleave = function(){
    ClearDragAndDrop(dragCounter);
}
//Clear the drag and drop objects
var dragCounter = 0;
function ClearDragAndDrop(){
    dragCounter--;
    if (dragCounter === 0) { 
        //Delete Dark back
        var drag = document.getElementsByClassName("drag");
            while(drag.length > 0){
                drag[0].remove();
            }       
        }
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
    })
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

    return songContainer;
}