const { electron, remote } = require('electron');
const app = remote.app;
const md5 = require('md5');
const fs = require('fs');
const { glob } = require('glob');
const path = require('path');
const UserSettings = require('@/modules/module.usersettings.js');
const sqlite3 = require('sqlite3').verbose();

class ChartLibrary {
    constructor() {
        const userDataPath = app.getPath('userData');
        this.path = path.join(userDataPath, 'ChartLibrary.sqlite');
        this.db = null;
    }

    async getLibrary() {
        console.log("[ChartLibrary] Get Library");

        this.connectToDatabase();

        this.db.serialize(() => {
            this.createDatabaseIfNotExists();

            // TODO: Check if Database is up to date and update if not
            this.db.get('SELECT * FROM meta', (err, row) => {
                if (err) {
                    console.error("[ChartLibrary] " + err.message);
                }

                console.log(row);
            });

            // TODO: Get Library
        });

        this.closeDatabase();

        /*
        let data = this.parseDataFile(this.path, false);

        if(data == false) {
            return this.updateLibrary();
        } else {
            if(data.folderMD5 != md5(userSettings.get('gameDirectory'))) {
                return this.updateLibrary();
            } else {
                return data;
            }
        } */
    }

    async updateLibrary() {
        console.log("[ChartLibrary] Library Refresh");

        this.connectToDatabase();

        this.db.serialize(() => {
            this.createDatabaseIfNotExists();

            // TODO: Update Library and Save to DB
        });

        this.closeDatabase();

        /*
        let userSettings = new UserSettings();
        let data = {
            folderMD5: "",
            charts: []
        };

        data.folderMD5 = md5(userSettings.get('gameDirectory'));

        // Find all SRTB files
        let srtbFiles = glob.sync(path.join(userSettings.get('gameDirectory'), "*.srtb"));
        srtbFiles.forEach((file) => {
            // Parse SRTB file
            try {
                data.charts.push(this.parseSRTBFile(file));
            } catch(error) {
                console.error(error);
            }
        });

        console.log("[ChartLibrary] Library Refresh Done.");

        // Save changes
        fs.writeFileSync(this.path, JSON.stringify(data));
        console.log("[ChartLibrary] Wrote Library to: " + this.path);

        return data;
        */
    }

    parseSRTBFile(srtbFilePath) {
        let userSettings = new UserSettings();

        let data = {
            title: "",
            subtitle: "",
            artist: "",
            charter: "",
            hasEasyDifficulty: false,
            hasNormalDifficulty: false,
            hasHardDifficulty: false,
            hasExpertDifficulty: false,
            hasXDDifficulty: false,
            easyDifficulty: 0,
            normalDifficulty: 0,
            hardDifficulty: 0,
            expertDifficulty: 0,
            XDDifficulty: 0,
            srtbHash: "",
            paths: {
                srtb: "",
                ogg: "",
                cover: "",
                coverBase64: "",
            }
        }

        let srtbRawData = fs.readFileSync(srtbFilePath, "utf-8");
        let srtbData = JSON.parse( srtbRawData );

        data.paths.srtb = srtbFilePath;
        data.srtbHash = md5( srtbData );

        srtbData.largeStringValuesContainer.values.forEach(lSV => {
            let lSVData = JSON.parse( lSV.val );

            // Parse TrackInfo
            if(lSV.key.includes("TrackInfo")) {
                // Extract values
                data.title = lSVData.title;
                data.subtitle = lSVData.subtitle;
                data.artist = lSVData.artistName;
                data.charter = lSVData.charter;

                data.paths.cover = glob.sync(path.join(userSettings.get('gameDirectory'), "AlbumArt", lSVData.albumArtReference.assetName + '.*'))[0];
                if(data.paths.cover != undefined) {
                    try {
                        data.paths.coverBase64 = "data:image/jpg;base64," + fs.readFileSync(data.paths.cover, { encoding: 'base64' })
                    } catch(error) {
                        console.error(error);
                    }
                }

                lSVData.difficulties.forEach(difficulty => {
                    if(difficulty._active) {
                        switch(difficulty._difficulty) {
                            case 2:
                                // Easy
                                data.hasEasyDifficulty = true;
                                break;
                            case 3:
                                // Normal
                                data.hasNormalDifficulty = true;
                                break;
                            case 4:
                                // Hard
                                data.hasHardDifficulty = true;
                                break;
                            case 5:
                                // Expert
                                data.hasExpertDifficulty = true;
                                break;
                            case 6:
                                // XD
                                data.hasXDDifficulty = true;
                                break;
                        }
                    }
                });
            }

            // Parse TrackData
            if(lSV.key.includes("TrackData")) {
                if(lSVData != null) {
                    switch(lSVData.difficultyType) {
                        case 2:
                            // Easy
                            data.easyDifficulty = lSVData.difficultyRating;
                            break;
                        case 3:
                            // Normal
                            data.normalDifficulty = lSVData.difficultyRating;
                            break;
                        case 4:
                            // Hard
                            data.hardDifficulty = lSVData.difficultyRating;
                            break;
                        case 5:
                            // Expert
                            data.expertDifficulty = lSVData.difficultyRating;
                            break;
                        case 6:
                            // XD
                            data.XDDifficulty = lSVData.difficultyRating;
                            break;
                    }
                }
            }

            // Parse ClipInfo
            if(lSV.key.includes("ClipInfo")) {
                data.paths.ogg = glob.sync(path.join(userSettings.get('gameDirectory'), "AudioClips", lSVData.clipAssetReference.assetName + '.*'))[0];
            }
        });

        // console.log("[ChartLibrary] Parsed SRTB: " + data.paths.srtb);

        return data;
    }

    connectToDatabase() {
        this.db = new sqlite3.Database(this.path, (err) => {
            if (err) {
                console.error("[ChartLibrary] " + err.message);
            }
            console.log('[ChartLibrary] Connected to Database');
        });
    }

    closeDatabase() {
        this.db.close((err) => {
            if (err) {
                console.error("[ChartLibrary] " + err.message);
            }
            console.log('[ChartLibrary] Database Closed');
        });
    }

    createDatabaseIfNotExists() {
        // TODO: Finalize Database Structure
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS meta (folderMD5 TEXT, clientVersion TEXT);
        `).run().finalize();
    }
}

module.exports = ChartLibrary;