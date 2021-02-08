const axios = require('axios');

class SSAPI {
    isDev() {
        if(process.env.NODE_ENV !== 'development') {
            return false;
        } else {
            return false;
        }
    }

    connectAppApiKey = "c02b7d24a066adb747fdeb12deb21bfa";

    constructor() {
        if(this.isDev()) {
            this.apiBase = "http://localhost/www/spinshare/server/public/api/";
        } else {
            this.apiBase = "https://spinsha.re/api/";
        }
    }

    async getOpenData(apiEndpoint, showResponseData) {
        let apiPath = this.apiBase + apiEndpoint;

        return axios.get(apiPath)
            .then(function(response) {
                if(showResponseData) {
                    return response.data;
                } else {
                    return response.data.data;
                }
            }).catch(function(error) {
                console.error(error);
                return false;
            });
    }

    async ping() {
        return this.getOpenData("ping", false);
    }

    async getStreamStatus() {
        return this.getOpenData("streamStatus", false);
    }

    async getLatestVersion() {
        return this.getOpenData("latestVersion/" + process.platform, false);
    }

    async getPromos() {
        return this.getOpenData("promos", false);
    }

    async getNewSongs(_offset) {
        return this.getOpenData("songs/new/" + _offset, false);
    }

    async getUpdatedSongs(_offset) {
        return this.getOpenData("songs/updated/" + _offset, false);
    }

    async getHotThisWeekSongs(_offset) {
        return this.getOpenData("songs/hotThisWeek/" + _offset, false);
    }

    async getHotThisMonthSongs(_offset) {
        return this.getOpenData("songs/hotThisMonth/" + _offset, false);
    }

    async getSongDetail(_songId) {
        return this.getOpenData("song/" + _songId, true);
    }

    async getSongDetailReviews(_songId) {
        return this.getOpenData("song/" + _songId + "/reviews", true);
    }

    async getSongDetailSpinPlays(_songId) {
        return this.getOpenData("song/" + _songId + "/spinplays", true);
    }

    async getUserDetail(_userId) {
        return this.getOpenData("user/" + _userId, true);
    }

    async getUserCharts(_userId) {
        return this.getOpenData("user/" + _userId + "/charts", true);
    }

    async getUserPlaylists(_userId) {
        return this.getOpenData("user/" + _userId + "/playlists", true);
    }

    async getUserReviews(_userId) {
        return this.getOpenData("user/" + _userId + "/reviews", true);
    }

    async getUserSpinPlays(_userId) {
        return this.getOpenData("user/" + _userId + "/spinplays", true);
    }

    async getPlaylistDetail(_playlistId) {
        return this.getOpenData("playlist/" + _playlistId, true);
    }

    async searchAll() {
        return this.getOpenData("searchAll", true);
    }

    async search(_searchQuery) {
        let apiPath = this.apiBase + "search";

        return axios.post(apiPath, JSON.stringify({ searchQuery: _searchQuery }))
        .then(function(response) {
            console.log(response);

            return response.data;
        }).catch(function(error) {
            console.error(error);
            return false;
        });
    }

    async getTournamentMappool() {
        let apiPath = this.apiBase + "tournament/mappool";

        return this.getOpenData("tournament/mappool", true);
    }

    async getConnectToken(connectCode) {
        let apiPath = this.apiBase + "connect/getToken?connectCode=" + connectCode + "&connectAppApiKey=" + this.connectAppApiKey;

        console.log("[API] Get Token");

        console.log(apiPath);

        return axios.get(apiPath)
        .then(function(response) {
            switch(response.data.status) {
                case 200:
                    return response.data;
                case 403:
                    return false;
                case 500:
                    return false;
            }
        }).catch(function(error) {
            console.error(error);
            return false;
        });
    }

    async validateConnectToken(connectToken) {
        let apiPath = this.apiBase + "connect/validateToken/?connectToken=" + connectToken;

        console.log("[API] Validate Token");

        return axios.get(apiPath)
        .then(function(response) {
            switch(response.data.status) {
                case 200:
                    return true;
                case 403:
                    return false;
                case 500:
                    return false;
            }
        }).catch(function(error) {
            console.error(error);
            return false;
        });
    }

    async getConnectProfile(connectToken) {
        let apiPath = this.apiBase + "connect/profile/?connectToken=" + connectToken;

        return this.getOpenData("connect/profile/?connectToken=" + connectToken, false);
    }
}

module.exports = SSAPI;
