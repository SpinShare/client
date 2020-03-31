const DOMSongDetailBackground = document.querySelector(".song-detail-background");
const DOMSongDetailActions = document.querySelector(".song-detail-actions");
const DOMSongDetail = document.querySelector(".section-song-detail .song-detail");
const DOMSongDetailCover = document.querySelector(".section-song-detail .song-cover");


const DOMButtonPreview = DOMSongDetailActions.querySelector(".button-preview");

const DOMSongTitle = DOMSongDetail.querySelector(".song-title");
const DOMSongArtist = DOMSongDetail.querySelector(".song-artist");
const DOMSongCharter = DOMSongDetail.querySelector(".song-charter span");
const DOMSongTags = DOMSongDetail.querySelector(".song-tags");

function SongDetailLoad(songId) {
    currentSongId = 0;
    currentSongData = {};

    DOMSongDetail.classList.remove("active");
    DOMSongDetailActions.classList.remove("active");

    api.getSongDetail(songId).then(function(songData) {
        DOMSongDetail.classList.add("active");
        DOMSongDetailActions.classList.add("active");

        DOMSongDetailBackground.style.backgroundImage = "url('" + songData.paths.cover + "')";
        DOMSongDetailCover.style.backgroundImage = "url('" + songData.paths.cover + "')";

        DOMSongTitle.innerText = songData.title;
        DOMSongArtist.innerText = songData.artist;
        DOMSongCharter.innerText = songData.charter;

        DOMButtonPreview.innerText = "PLAY PREVIEW";

        DOMSongTags.innerHTML = "";
        songData.tags.forEach(function(tag) {
            if(tag != "") {
                let newTag = document.createElement("div");
                newTag.classList.add("tag");
                newTag.innerText = tag;

                DOMSongTags.appendChild(newTag);
            }
        });

        currentSongId = songId;
        currentSongData = songData;
    });
}

function SongDetailTogglePreview() {
    if(currentPreviewAudio != undefined || currentPreviewAudio != null) {
        currentPreviewAudio.pause();
        currentPreviewAudio.currentTime = 0;
        currentPreviewAudio = null;

        DOMButtonPreview.innerText = "PLAY PREVIEW";
        DOMButtonPreview.classList.remove("button-primary");
    } else {
        currentPreviewAudio = new Audio(currentSongData.paths.ogg);
        currentPreviewAudio.play();
        DOMButtonPreview.innerText = "PAUSE PREVIEW";
        DOMButtonPreview.classList.add("button-primary");
    }
}

function SongDetailDownload() {
    DownloadSong(currentSongData);
}

function SongDetailCopyLink() {

}

function SongDetailReport() {
    alert("Coming soon...");
}