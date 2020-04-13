const DOMStaffPromos = document.querySelector(".staff-promos");

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
    api.getPromos().then(function(promos) {
        DOMStaffPromos.innerHTML = "";

        promos.forEach(function (promo) {
            DOMStaffPromos.appendChild(BuildPromoDOM(promo));
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

function BuildPromoDOM(promoItem) {
    // Holder
    let promoContainer = document.createElement("div");
    promoContainer.classList.add("staff-promo");
    promoContainer.style.backgroundImage = "url('" + promoItem.image_path + "')";

    // Type
    let promoType = document.createElement("div");
    promoType.classList.add("promo-type");
    promoType.style.color = promoItem.color;
    promoType.innerText = promoItem.type;
    promoContainer.appendChild(promoType);

    // Title
    let promoTitle = document.createElement("div");
    promoTitle.classList.add("promo-title");
    promoTitle.innerHTML = promoItem.title;
    promoTitle.style.color = promoItem.textColor;
    promoContainer.appendChild(promoTitle);

    // Button
    let promoButton = document.createElement("div");
    promoButton.classList.add("promo-button");
    promoButton.style.backgroundColor = promoItem.color;
    promoButton.innerText = "CHECK IT OUT";

    switch(promoItem.button.type) {
        case 0:
            // Song
            promoButton.addEventListener('click', function() {
                NavigateToSongDetail(promoItem.button.data);
            });
            break;
        case 1:
            // Playlist
            // Unused for now
            break;
        case 2:
            // Search Query
            NavigateToSection(1);
            SearchQuery(promoItem.button.data);
            break;
        case 3:
            // External
            promoButton.addEventListener('click', function() {
                shell.openExternal(promoItem.button.data);
            });
    }

    promoContainer.appendChild(promoButton);

    return promoContainer;
}

function BuildSongDOM(songItem) {
    let songContainer = document.createElement("div");
    songContainer.classList.add("song-item");

    let songCover = document.createElement("div");
    songCover.classList.add("song-cover");
    songCover.style.backgroundImage = "url('" + songItem.cover + "'), url('assets/img/defaultAlbumArt.jpg')";

    let songCharterInfo = document.createElement("div");
    songCharterInfo.classList.add("song-charter-info");
    
    let songCharter = document.createElement("div");
    songCharter.classList.add("song-charter");
    songCharter.innerHTML = "<i class=\"mdi mdi-account-circle\"></i><span>" + (songItem.charter ? songItem.charter : "Unknown") + "</span>";
    songCharterInfo.appendChild(songCharter);
    
    songCover.appendChild(songCharterInfo);
    songContainer.appendChild(songCover);

    let songMetaData = document.createElement("div");
    songMetaData.classList.add("song-metadata");
    
    let songTitle = document.createElement("div");
    songTitle.classList.add("song-title");
    songTitle.innerText = songItem.title ? songItem.title : "Untitled";
    songMetaData.appendChild(songTitle);
    
    let songArtist = document.createElement("div");
    songArtist.classList.add("song-artist");
    songArtist.innerText = songItem.artist ? songItem.artist : "Unknown";
    songMetaData.appendChild(songArtist);

    let songDifficulties = document.createElement("div");
    songDifficulties.classList.add("song-difficulties");

    songDifficultiesEasy = document.createElement("img");
    songDifficultiesEasy.src = path.join(__dirname, "assets", "img", "difficultyEasy.svg");
    if(songItem.hasEasyDifficulty) { songDifficultiesEasy.classList.add("active"); }
    songDifficulties.appendChild(songDifficultiesEasy);

    songDifficultiesNormal = document.createElement("img");
    songDifficultiesNormal.src = path.join(__dirname, "assets", "img", "difficultyNormal.svg");
    if(songItem.hasNormalDifficulty) { songDifficultiesNormal.classList.add("active"); }
    songDifficulties.appendChild(songDifficultiesNormal);

    songDifficultiesHard = document.createElement("img");
    songDifficultiesHard.src = path.join(__dirname, "assets", "img", "difficultyHard.svg");
    if(songItem.hasHardDifficulty) { songDifficultiesHard.classList.add("active"); }
    songDifficulties.appendChild(songDifficultiesHard);

    songDifficultiesExtreme = document.createElement("img");
    songDifficultiesExtreme.src = path.join(__dirname, "assets", "img", "difficultyExtreme.svg");
    if(songItem.hasExtremeDifficulty) { songDifficultiesExtreme.classList.add("active"); }
    songDifficulties.appendChild(songDifficultiesExtreme);

    songDifficultiesXD = document.createElement("img");
    songDifficultiesXD.src = path.join(__dirname, "assets", "img", "difficultyXD.svg");
    if(songItem.hasXDDifficulty) { songDifficultiesXD.classList.add("active"); }
    songDifficulties.appendChild(songDifficultiesXD);

    songMetaData.appendChild(songDifficulties);
    
    songContainer.appendChild(songMetaData);

    songContainer.addEventListener('click', function() {
        NavigateToSongDetail(songItem.id);
    });

    return songContainer;
}

