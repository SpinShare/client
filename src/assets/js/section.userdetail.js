const DOMUserDetailBackground = document.querySelector(".user-detail-background");
const DOMUserDetailActions = document.querySelector(".user-detail-actions");
const DOMUserDetail = document.querySelector(".section-user-detail .user-detail");
const DOMUserDetailAvatar = document.querySelector(".section-user-detail .user-avatar");
const DOMUserSongRow = document.querySelector(".song-row-user");

let currentUserId = 0;

const DOMUserName = DOMUserDetail.querySelector(".user-name");
const DOMUserBadgeVerified = DOMUserDetail.querySelector(".user-badge-verified");
const DOMUserBadgePatreon = DOMUserDetail.querySelector(".user-badge-patreon");
const DOMUserSongsList = document.querySelector(".song-row-user .song-list");
const DOMUserSongsNoResults = document.querySelector(".song-row-user .song-list-noresults");

function UserDetailLoad(userId) {
    DOMUserDetail.classList.remove("active");
    DOMUserDetailActions.classList.remove("active");
    DOMUserSongRow.classList.remove("active");
    DOMUserSongsNoResults.classList.remove("active");

    DOMUserSongsList.innerHTML = "";

    api.getUserDetail(userId).then(function(apiResponse) {
        let userData = apiResponse.data;

        currentUserId = userData.id;

        if(apiResponse.status == 404) {
            NavigateToSection(7);
        } else {
            DOMUserDetail.classList.add("active");
            DOMUserSongRow.classList.add("active");
            DOMUserDetailActions.classList.add("active");

            DOMUserDetailBackground.style.backgroundImage = "url('" + userData.avatar + "')";
            DOMUserDetailAvatar.style.backgroundImage = "url('" + userData.avatar + "')";

            DOMUserName.innerText = userData.username;

            if(userData.isVerified) {
                DOMUserBadgeVerified.classList.add("active");
            } else {
                DOMUserBadgeVerified.classList.remove("active");
            }
            
            if(userData.isPatreon) {
                DOMUserBadgePatreon.classList.add("active");
            } else {
                DOMUserBadgePatreon.classList.remove("active");
            }

            if(userData.songs.length > 0) {
                userData.songs.forEach(function(song) {
                    DOMUserSongsList.appendChild(BuildSongDOM(song));
                });
            } else {
                DOMUserSongsNoResults.classList.add("active");
            }
        }
    }).catch(function(error) {
        console.error(error);
        NavigateToSection(6);
    });
}

function UserDetailReport() {
    shell.openExternal("https://spinsha.re/report/user/" + currentUserId);
}