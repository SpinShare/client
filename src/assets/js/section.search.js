const DOMSearchBar = document.querySelector(".search-bar input");
const DOMSearchResultsUsers = document.querySelector(".search-results-users");
const DOMSearchResultsSongs = document.querySelector(".search-results-songs");
const DOMSearchResultsNoresults = document.querySelector(".search-results-noresults");
const DOMUsersList = DOMSearchResultsUsers.querySelector(".user-list");
const DOMSongsList = DOMSearchResultsSongs.querySelector(".song-list");

function InitSearch() {
    SearchQuery("");
}

function SearchQuery(query) {
    DOMSearchBar.value = query;

    DOMSearchResultsUsers.classList.remove("active");
    DOMSearchResultsSongs.classList.remove("active");
    DOMSearchResultsNoresults.querySelector(".noresults-title").innerText = query;
    DOMSearchResultsNoresults.classList.remove("active");

    DOMUsersList.innerHTML = "";
    DOMSongsList.innerHTML = "";

    if(query != "") {
        api.search(query).then(function(searchResults) {
            if(searchResults.data.users.length == 0 && searchResults.data.songs.length == 0) {
                DOMSearchResultsNoresults.classList.add("active");
            } else {
                if(searchResults.data.users.length > 0) {
                    DOMSearchResultsUsers.classList.add("active");
                    searchResults.data.users.forEach(function(user) {
                        DOMUsersList.appendChild(BuildUserDOM(user));
                    });
                }
                if(searchResults.data.songs.length > 0) {
                    DOMSearchResultsSongs.classList.add("active");
                    searchResults.data.songs.forEach(function(song) {
                        DOMSongsList.appendChild(BuildSongDOM(song));
                    });
                }
            }
        }).catch(function(error) {
            NavigateToSection(6);
            console.error(error);
        });
    }
}

function BuildUserDOM(userItem) {
    let userContainer = document.createElement("div");
    userContainer.classList.add("user-item");

    let userAvatar = document.createElement("div");
    userAvatar.classList.add("user-avatar");
    userAvatar.style.backgroundImage = "url('" + userItem.avatar + "')";
    
    userContainer.appendChild(userAvatar);

    let userMetaData = document.createElement("div");
    userMetaData.classList.add("user-metadata");
    
    let userName = document.createElement("div");
    userName.classList.add("user-username");
    userName.innerText = userItem.username;
    userMetaData.appendChild(userName);
    
    if(userItem.isVerified) {
        let userBadgeVerified = document.createElement("div");
        userBadgeVerified.classList.add("user-badge");
        userBadgeVerified.innerHTML = "<i class=\"mdi mdi-check-decagram\"></i>";
        userMetaData.appendChild(userBadgeVerified);
    }
    if(userItem.isPatreon) {
        let userBadgePatreon = document.createElement("div");
        userBadgePatreon.classList.add("user-badge");
        userBadgePatreon.innerHTML = "<i class=\"mdi mdi-patreon\"></i>";
        userMetaData.appendChild(userBadgePatreon);
    }
    
    userContainer.appendChild(userMetaData);

    userContainer.addEventListener('click', function() {
        NavigateToUser(userItem.id);
    });

    return userContainer;
}