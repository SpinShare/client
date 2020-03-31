const DOMStaffAds = document.querySelector(".staff-ads");

const DOMNewSongsList = document.querySelector(".song-row-new .song-list");
const DOMPopularSongsList = document.querySelector(".song-row-popular .song-list");

const DOMNewSongsPrevious = document.querySelector(".song-row-new .row-controls-previous");
const DOMNewSongsNext = document.querySelector(".song-row-new .row-controls-next");

const DOMPopularSongsPrevious = document.querySelector(".song-row-popular .row-controls-previous");
const DOMPopularSongsNext = document.querySelector(".song-row-popular .row-controls-next");

let currentNewOffset = 0;
let currentPopularOffset = 0;

function InitStartup() {
    // Loading Ads
    api.getAds().then(function(ads) {
        DOMStaffAds.innerHTML = "";

        ads.forEach(function (ad) {
            DOMStaffAds.appendChild(BuildAdDOM(ad));
        });
    });

    // Loading New Songs
    LoadNewSongs();

    // Loading Hot Songs
    LoadPopularSongs();
}

InitStartup();

function NewSongsPrevious() {
    if(currentNewOffset == 0) return;

    currentNewOffset--;
    LoadNewSongs();
    NewSongsUpdateArrows();
}
function NewSongsNext() {
    currentNewOffset++;
    LoadNewSongs();
    NewSongsUpdateArrows();
}

function NewSongsUpdateArrows() {
    if(currentNewOffset == 0) {
        DOMNewSongsPrevious.classList.add("disabled");
    } else {
        DOMNewSongsPrevious.classList.remove("disabled");
    }
}

function PopularSongsPrevious() {
    if(currentPopularOffset == 0) return;

    currentPopularOffset--;
    LoadPopularSongs();
    PopularSongsUpdateArrows();
}
function PopularSongsNext() {
    currentPopularOffset++;
    LoadPopularSongs();
    PopularSongsUpdateArrows();
}

function PopularSongsUpdateArrows() {
    if(currentPopularOffset == 0) {
        DOMPopularSongsPrevious.classList.add("disabled");
    } else {
        DOMPopularSongsPrevious.classList.remove("disabled");
    }
}

function LoadNewSongs() {
    api.getNewSongs(currentNewOffset).then(function(songs) {
        DOMNewSongsList.innerHTML = "";

        songs.forEach(function(song) {
            DOMNewSongsList.appendChild(BuildSongDOM(song));
        });
    });
}

function LoadPopularSongs() {
    api.getPopularSongs(currentPopularOffset).then(function(songs) {
        DOMPopularSongsList.innerHTML = "";

        songs.forEach(function(song) {
            DOMPopularSongsList.appendChild(BuildSongDOM(song));
        });
    });
}

function BuildAdDOM(adItem) {
    // Holder
    let adContainer = document.createElement("div");
    adContainer.classList.add("staff-ad");
    adContainer.style.backgroundImage = "url('" + adItem.image_path + "')";

    // Type
    let adType = document.createElement("div");
    adType.classList.add("ad-type");
    adType.style.color = adItem.color;
    adType.innerText = adItem.type;
    adContainer.appendChild(adType);

    // Title
    let adTitle = document.createElement("div");
    adTitle.classList.add("ad-title");
    adTitle.innerText = adItem.title;
    adContainer.appendChild(adTitle);

    // Button
    let adButton = document.createElement("div");
    adButton.classList.add("ad-button");
    adButton.style.backgroundColor = adItem.color;
    adButton.innerText = "CHECK IT OUT";
    adContainer.appendChild(adButton);

    // TODO: Add Button Logic

    return adContainer;
}

function BuildSongDOM(songItem) {
    let songContainer = document.createElement("div");
    songContainer.classList.add("song-item");

    let songCover = document.createElement("div");
    songCover.classList.add("song-cover");
    songCover.style.backgroundImage = "url('" + songItem.cover + "')";

    let songCharterInfo = document.createElement("div");
    songCharterInfo.classList.add("song-charter-info");
    
    let songCharter = document.createElement("div");
    songCharter.classList.add("song-charter");
    songCharter.innerHTML = "<i class=\"mdi mdi-account-circle\"></i><span>" + songItem.charter + "</span>";
    songCharterInfo.appendChild(songCharter);
    
    songCover.appendChild(songCharterInfo);
    songContainer.appendChild(songCover);

    let songMetaData = document.createElement("div");
    songMetaData.classList.add("song-metadata");
    
    let songTitle = document.createElement("div");
    songTitle.classList.add("song-title");
    songTitle.innerText = songItem.title;
    songMetaData.appendChild(songTitle);
    
    let songArtist = document.createElement("div");
    songArtist.classList.add("song-artist");
    songArtist.innerText = songItem.artist;
    songMetaData.appendChild(songArtist);
    
    songContainer.appendChild(songMetaData);

    songContainer.addEventListener('click', function() {
        NavigateToSongDetail(songItem.id);
    });

    return songContainer;
}