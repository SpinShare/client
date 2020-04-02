let DOMNavigationItems = document.querySelectorAll("aside .item");
let DOMSections = document.querySelectorAll("section");

let DOMSectionSongDetail = document.querySelector(".section-song-detail");
let DOMSectionUserDetail = document.querySelector(".section-user-detail");

let currentSection = 0;

let currentSongId = 0;
let currentSongData = {};
let currentPreviewAudio;

function NavigateToSection(sectionIndex) {
    // Stop audio if playing
    SongDetailStopPreview();

    // Navigation
    DOMNavigationItems.forEach(function(DOMNavigation) {
        DOMNavigation.classList.remove("active");
    });
    if(DOMNavigationItems[sectionIndex]) {
        DOMNavigationItems[sectionIndex].classList.add("active");
    }

    // Section
    DOMSections.forEach(function(DOMSection) {
        DOMSection.classList.remove("active");
    });
    DOMSections[sectionIndex].classList.add("active");
    
    currentSection = sectionIndex;

    switch(sectionIndex) {
        case 0:
            // Startup
            InitStartup();
            break;
        case 1:
            // Search
            InitSearch();
            break;
        case 2:
            // Library
            RefreshLibrary();
            break;
        case 3:
            // Settings
            InitSettings();
            break;
        case 4:
            // SongDetail
            break;
        case 5:
            // Connection Error
            break;
        case 6:
            // 404 Error
            break;
        case 7:
            // User Detail
            break;
    }
}

NavigateToSection(0);

function NavigateToSongDetail(songId) {
    console.log("Loading Song " + songId);
    
    // Stop audio if playing
    SongDetailStopPreview();

    // Navigation
    DOMNavigationItems.forEach(function(DOMNavigation) {
        DOMNavigation.classList.remove("active");
    });

    // Section
    DOMSections.forEach(function(DOMSection) {
        DOMSection.classList.remove("active");
    });

    // Load Detail
    DOMSectionSongDetail.classList.add("active");

    SongDetailLoad(songId);
}

function NavigateToUser(userId) {
    // Stop audio if playing
    SongDetailStopPreview();

    // Navigation
    DOMNavigationItems.forEach(function(DOMNavigation) {
        DOMNavigation.classList.remove("active");
    });

    // Section
    DOMSections.forEach(function(DOMSection) {
        DOMSection.classList.remove("active");
    });

    // Load Detail
    DOMSectionUserDetail.classList.add("active");

    UserDetailLoad(userId);
}