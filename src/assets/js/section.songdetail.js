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
const DOMDifficultyEasy = DOMSongDetail.querySelector(".song-difficulties .difficulty-easy");
const DOMDifficultyNormal = DOMSongDetail.querySelector(".song-difficulties .difficulty-normal");
const DOMDifficultyHard = DOMSongDetail.querySelector(".song-difficulties .difficulty-hard");
const DOMDifficultyExtreme = DOMSongDetail.querySelector(".song-difficulties .difficulty-extreme");
const DOMDifficultyXD = DOMSongDetail.querySelector(".song-difficulties .difficulty-xd");
const DOMSongUploader = DOMSongDetail.querySelector(".song-uploader");

function SongDetailLoad(songId) {
    currentSongId = 0;
    currentSongData = {};

    DOMSongDetail.classList.remove("active");
    DOMSongDetailActions.classList.remove("active");

    DOMDifficultyEasy.classList.remove("active");
    DOMDifficultyNormal.classList.remove("active");
    DOMDifficultyHard.classList.remove("active");
    DOMDifficultyExtreme.classList.remove("active");
    DOMDifficultyXD.classList.remove("active");

    api.getSongDetail(songId).then(function(apiResponse) {
        let songData = apiResponse.data;

        if(apiResponse.status == 404 || songData.length == 0) {
            NavigateToSection(7);
        } else {
            api.getUserDetail(songData.uploader).then(function(uploaderResponse) {
                let uploaderData = uploaderResponse.data;

                DOMSongDetail.classList.add("active");
                DOMSongDetailActions.classList.add("active");

                DOMSongDetailBackground.style.backgroundImage = "url('" + songData.paths.cover + "'), url('assets/img/defaultAlbumArt.jpg')";
                DOMSongDetailCover.style.backgroundImage = "url('" + songData.paths.cover + "'), url('assets/img/defaultAlbumArt.jpg')";

                DOMSongTitle.innerText = songData.title ? songData.title : "Untitled";
                DOMSongSubtitle.innerText = songData.subtitle ? songData.subtitle : "";
                DOMSongArtist.innerText = songData.artist ? songData.artist : "Unknown";
                DOMSongCharter.innerText = locale.get('songdetail.createdBy') + " " + (songData.charter ? songData.charter : "Unknown");

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

                if(songData.hasEasyDifficulty) {
                    DOMDifficultyEasy.classList.add("active");
                }
                if(songData.hasNormalDifficulty) {
                    DOMDifficultyNormal.classList.add("active");
                }
                if(songData.hasHardDifficulty) {
                    DOMDifficultyHard.classList.add("active");
                }
                if(songData.hasExtremeDifficulty) {
                    DOMDifficultyExtreme.classList.add("active");
                }
                if(songData.hasXDDifficulty) {
                    DOMDifficultyXD.classList.add("active");
                }
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
    shell.openExternal("https://spinsha.re/report/song/" + currentSongId);
}