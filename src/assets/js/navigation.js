let DOMNavigationItems = document.querySelectorAll("aside .item");
let DOMSections = document.querySelectorAll("section");

let DOMSectionSongDetail = document.querySelector(".section-song-detail");

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
    }
}

NavigateToSection(0);

function NavigateToSongDetail(songId) {
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