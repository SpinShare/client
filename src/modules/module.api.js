const axios = require('axios');

class SSAPI {
    isDev() {
        if(process.env.NODE_ENV !== 'development') {
            return false;
        } else {
            return false;
        }
    }

    constructor() {
        if(this.isDev()) {
            this.apiBase = "http://localhost/www/spinshare/server/public/index.php/api/";
        } else {
            this.apiBase = "https://spinsha.re/api/";
        }
        this.supportedVersion = 1;
    }

    async ping() {
        let apiPath = this.apiBase + "ping";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }

            return response.data.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getStreamStatus() {
        let apiPath = this.apiBase + "streamStatus";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }

            return response.data.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getLatestVersion() {
        let apiPath = this.apiBase + "latestVersion/" + process.platform;
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }

            return response.data.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getPromos() {
        let apiPath = this.apiBase + "promos";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getNewSongs(_offset) {
        let apiPath = this.apiBase + "songs/new/" + _offset;
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getUpdatedSongs(_offset) {
        let apiPath = this.apiBase + "songs/updated/" + _offset;
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
            .then(function(response) {
                if(response.data.version !== supportedVersion) {
                    throw new Error("Client is outdated!");
                }

                return response.data.data;
            }).catch(function(error) {
                throw new Error(error);
            });
    }

    async getHotThisWeekSongs(_offset) {
        let apiPath = this.apiBase + "songs/hotThisWeek/" + _offset;
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getHotThisMonthSongs(_offset) {
        let apiPath = this.apiBase + "songs/hotThisMonth/" + _offset;
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
            .then(function(response) {
                if(response.data.version !== supportedVersion) {
                    throw new Error("Client is outdated!");
                }

                return response.data.data;
            }).catch(function(error) {
                throw new Error(error);
            });
    }

    async getSongDetail(_songId) {
        let apiPath = this.apiBase + "song/" + _songId;
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getSongDetailReviews(_songId) {
        let apiPath = this.apiBase + "song/" + _songId + "/reviews";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getSongDetailSpinPlays(_songId) {
        let apiPath = this.apiBase + "song/" + _songId + "/spinplays";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getUserDetail(_userId) {
        let apiPath = this.apiBase + "user/" + _userId;
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getUserCharts(_userId) {
        let apiPath = this.apiBase + "user/" + _userId + "/charts";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getUserReviews(_userId) {
        let apiPath = this.apiBase + "user/" + _userId + "/reviews";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getUserSpinPlays(_userId) {
        let apiPath = this.apiBase + "user/" + _userId + "/spinplays";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async search(_searchQuery) {
        let apiPath = this.apiBase + "search/" + _searchQuery;
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async searchUsers(_searchQuery) {
        let apiPath = this.apiBase + "searchUsers";
        let supportedVersion = this.supportedVersion;

        return axios.post(apiPath, {
            searchQuery: _searchQuery
        })
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }

            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async searchCharts(
        _searchQuery,
        _diffEasy,
        _diffNormal,
        _diffHard,
        _diffExpert,
        _diffXD,
        _diffRatingFrom,
        _diffRatingTo
    ) {
        let apiPath = this.apiBase + "searchCharts/";
        let supportedVersion = this.supportedVersion;

        return axios.post(apiPath, {
            searchQuery: _searchQuery,
            diffEasy: _diffEasy,
            diffNormal: _diffNormal,
            diffHard: _diffHard,
            diffExpert: _diffExpert,
            diffXD: _diffXD,
            diffRatingFrom: _diffRatingFrom,
            diffRatingTo: _diffRatingTo,
            showExplicit: true,
        })
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }

            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }

    async getTournamentMappool() {
        let apiPath = this.apiBase + "tournament/mappool";
        let supportedVersion = this.supportedVersion;

        return axios.get(apiPath)
        .then(function(response) {
            if(response.data.version !== supportedVersion) {
                throw new Error("Client is outdated!");
            }
            
            return response.data;
        }).catch(function(error) {
            throw new Error(error);
        });
    }
}

module.exports = SSAPI;
