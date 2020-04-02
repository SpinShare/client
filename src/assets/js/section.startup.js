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
    console.log("Refreshing Startup");
    
    // Loading Ads
    api.getAds().then(function(ads) {
        DOMStaffAds.innerHTML = "";

        ads.forEach(function (ad) {
            DOMStaffAds.appendChild(BuildAdDOM(ad));
        });
    }).catch(function(error) {
        NavigateToSection(6);
        console.error(error);
    });

    // Loading New Songs
    LoadNewSongs();

    // Loading Hot Songs
    LoadPopularSongs();
}

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
    }).catch(function(error) {
        NavigateToSection(6);
        console.error(error);
    });
}

function LoadPopularSongs() {
    api.getPopularSongs(currentPopularOffset).then(function(songs) {
        DOMPopularSongsList.innerHTML = "";

        songs.forEach(function(song) {
            DOMPopularSongsList.appendChild(BuildSongDOM(song));
        });
    }).catch(function(error) {
        NavigateToSection(6);
        console.error(error);
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
    adTitle.innerHTML = adItem.title;
    adTitle.style.color = adItem.textColor;
    adContainer.appendChild(adTitle);

    // Button
    let adButton = document.createElement("div");
    adButton.classList.add("ad-button");
    adButton.style.backgroundColor = adItem.color;
    adButton.innerText = "CHECK IT OUT";

    switch(adItem.button.type) {
        case 0:
            // Song
            adButton.addEventListener('click', function() {
                NavigateToSongDetail(adItem.button.data);
            });
            break;
        case 1:
            // Playlist
            // Unused for now
            break;
        case 2:
            // Search Query
            NavigateToSection(1);
            SearchQuery(adItem.button.data);
            break;
        case 3:
            // External
            adButton.addEventListener('click', function() {
                shell.openExternal(adItem.button.data);
            });
    }

    adContainer.appendChild(adButton);

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

