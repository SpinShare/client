const DOMSongDetailBackground = document.querySelector(".song-detail-background");
const DOMSongDetailActions = document.querySelector(".song-detail-actions");
const DOMSongDetail = document.querySelector(".section-song-detail .song-detail");
const DOMSongDetailCover = document.querySelector(".section-song-detail .song-cover");

let isPlayingPreview = false;

const DOMButtonPreview = DOMSongDetailActions.querySelector(".button-preview");

const DOMSongTitle = DOMSongDetail.querySelector(".song-title");
const DOMSongSubtitle = DOMSongDetail.querySelector(".song-subtitle");
const DOMSongArtist = DOMSongDetail.querySelector(".song-artist");
const DOMSongCharter = DOMSongDetail.querySelector(".song-charter");
const DOMSongTags = DOMSongDetail.querySelector(".song-tags");
const DOMSongUploader = DOMSongDetail.querySelector(".song-uploader");

function SongDetailLoad(songId) {
    currentSongId = 0;
    currentSongData = {};

    DOMSongDetail.classList.remove("active");
    DOMSongDetailActions.classList.remove("active");

    api.getSongDetail(songId).then(function(apiResponse) {
        let songData = apiResponse.data;

        if(apiResponse.status == 404 || songData.length == 0) {
            NavigateToSection(7);
        } else {
            api.getUserDetail(songData.uploader).then(function(uploaderResponse) {
                let uploaderData = uploaderResponse.data;

                DOMSongDetail.classList.add("active");
                DOMSongDetailActions.classList.add("active");

                DOMSongDetailBackground.style.backgroundImage = "url('" + songData.paths.cover + "')";
                DOMSongDetailCover.style.backgroundImage = "url('" + songData.paths.cover + "')";

                DOMSongTitle.innerText = songData.title;
                DOMSongSubtitle.innerText = songData.subtitle;
                DOMSongArtist.innerText = songData.artist;
                DOMSongCharter.innerText = locale.get('songdetail.createdBy') + " " + songData.charter;

                DOMSongUploader.innerHTML = "";
                DOMSongUploader.appendChild(BuildUserDOM(uploaderData));

                DOMButtonPreview.innerText = locale.get('songdetail.actions.playPreviewButton');

                DOMSongTags.innerHTML = "";
                songData.tags.forEach(function(tag) {
                    if(tag != "") {
                        let newTag = document.createElement("div");
                        newTag.classList.add("tag");
                        newTag.innerText = tag;

                        newTag.addEventListener('click', function() {
                            NavigateToSection(1);
                            SearchQuery(tag);
                        });

                        DOMSongTags.appendChild(newTag);
                    }
                });
            });
        }

        currentSongId = songId;
        currentSongData = songData;
    }).catch(function(error) {
        console.error(error);
        NavigateToSection(6);
    });
}

function SongDetailTogglePreview() {
    if(isPlayingPreview) {
        SongDetailStopPreview();
    } else {
        SongDetailStartPreview();
    }
}
function SongDetailStartPreview() {
    currentPreviewAudio = new Audio(currentSongData.paths.ogg);
    currentPreviewAudio.volume = 0.4;
    currentPreviewAudio.play();
    currentPreviewAudio.onended = function() {
        SongDetailStopPreview();
    }
    isPlayingPreview = true;
    DOMButtonPreview.innerText = locale.get('songdetail.actions.stopPreviewButton');
    DOMButtonPreview.classList.add("button-primary");
}
function SongDetailStopPreview() {
    if(currentPreviewAudio) {
        currentPreviewAudio.pause();
        currentPreviewAudio.currentTime = 0;
    }
    currentPreviewAudio = null;
    isPlayingPreview = false;

    DOMButtonPreview.innerText = locale.get('songdetail.actions.playPreviewButton');
    DOMButtonPreview.classList.remove("button-primary");
}

function SongDetailDownload() {
    DownloadSong(currentSongData);
}

function SongDetailCopyLink() {
    clipboard.writeText("https://spinsha.re/song/" + currentSongId);
}

function SongDetailReport() {
    shell.openExternal("https://spinsha.re/report/" + currentSongId);
}