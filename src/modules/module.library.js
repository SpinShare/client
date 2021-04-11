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
        this.databaseReady = false;
        this.databaseUpdating = false;
        this.databaseUpdateProgress = 0;
    }

    async getLibrary() {
        console.log("[ChartLibrary] Get Library");

        this.connectToDatabase();

        this.db.serialize(() => {
            this.createDatabaseIfNotExists();

            console.log("[ChartLibrary] Check Library Cleanness");

            // TODO: Check if Database is up to date and update if not
            this.db.all("SELECT * FROM meta", (err, rows) => {
                if (err) {
                    console.error("[ChartLibrary] " + err.message);
                }

                console.log(rows);
            }).run();

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

    updateLibrary() {
        let userSettings = new UserSettings();

        console.log("[ChartLibrary] Library Refresh");

        this.connectToDatabase(() => {
            this.db.serialize(() => {
                this.createDatabaseIfNotExists();

                this.databaseReady = false;

                console.log("[ChartLibrary] Updating Meta");

                let folderMD5 = md5(userSettings.get('gameDirectory'));
                let clientVersion = app.getVersion();

                this.db.run(`
                    INSERT OR REPLACE INTO meta (key, value)
                    VALUES ('folderMD5', '${folderMD5}'), ('databaseVersion', 1), ('clientVersion', '${clientVersion}');
                `);

                // Clear previous entries
                /* this.db.run(`
                    DELETE FROM charts;
                    VACUUM;
                `); */

                console.log("[ChartLibrary] Reading Charts");

                this.databaseUpdating = true;

                this.db.run("BEGIN TRANSACTION");

                // Find all SRTB files
                let srtbFiles = glob.sync(path.join(userSettings.get('gameDirectory'), "*.srtb"));
                srtbFiles.forEach((file, index) => {
                    // Parse SRTB file
                    try {
                        let chartData = this.parseSRTBFile(file);

                        this.db.run(`
                            INSERT INTO charts (
                                title,
                                subtitle,
                                artist,
                                charter,
                                hasEasyDifficulty,
                                hasNormalDifficulty,
                                hasHardDifficulty,
                                hasExpertDifficulty,
                                hasXDDifficulty,
                                easyDifficulty,
                                normalDifficulty,
                                hardDifficulty,
                                expertDifficulty,
                                XDDifficulty,
                                srtbHash,
                                srtbPath,
                                oggPath,
                                coverPath
                            ) VALUES (
                                '${chartData.title}',
                                '${chartData.subtitle}',
                                '${chartData.artist}',
                                '${chartData.charter}',
                                '${chartData.hasEasyDifficulty}',
                                '${chartData.hasNormalDifficulty}',
                                '${chartData.hasHardDifficulty}',
                                '${chartData.hasExpertDifficulty}',
                                '${chartData.hasXDDifficulty}',
                                '${chartData.easyDifficulty}',
                                '${chartData.normalDifficulty}',
                                '${chartData.hardDifficulty}',
                                '${chartData.expertDifficulty}',
                                '${chartData.XDDifficulty}',
                                '${chartData.srtbHash}',
                                '${chartData.srtbPath}',
                                '${chartData.oggPath}',
                                '${chartData.coverPath}',
                            );
                        `);

                        console.log(`[ChartLibrary] Progress: ${index} / ${srtbFiles.length}`);

                        this.databaseUpdateProgress = srtbFiles.length / index * 100;
                    } catch(error) {
                        console.error(error);
                    }
                });

                this.db.run("COMMIT");

                this.databaseUpdating = false;
                this.databaseReady = true;

                console.log("[ChartLibrary] Library Refresh Done.");

                this.closeDatabase();
            });
        });
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
            srtbPath: "",
            oggPath: "",
            coverPath: "",
        }

        let srtbRawData = fs.readFileSync(srtbFilePath, "utf-8");
        let srtbData = JSON.parse( srtbRawData );

        data.srtbPath = srtbFilePath;
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

                data.coverPath = glob.sync(path.join(userSettings.get('gameDirectory'), "AlbumArt", lSVData.albumArtReference.assetName + '.*'))[0];

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
                data.oggPath = glob.sync(path.join(userSettings.get('gameDirectory'), "AudioClips", lSVData.clipAssetReference.assetName + '.*'))[0];
            }
        });

        // console.log("[ChartLibrary] Parsed SRTB: " + data.paths.srtb);

        return data;
    }

    connectToDatabase(callback) {
        this.db = new sqlite3.Database(this.path, (err) => {
            if (err) {
                console.error("[ChartLibrary] " + err.message);
            }
            console.log('[ChartLibrary] Connected to Database');

            callback();
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
        this.db.run(`
            CREATE TABLE IF NOT EXISTS meta (
                key TEXT,
                value TEXT
            );
        `);

        this.db.run(`
            CREATE TABLE IF NOT EXISTS charts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                subtitle TEXT,
                artist TEXT,
                charter TEXT,
                hasEasyDifficulty INTEGER,
                hasNormalDifficulty INTEGER,
                hasHardDifficulty INTEGER,
                hasExpertDifficulty INTEGER,
                hasXDDifficulty INTEGER,
                easyDifficulty INTEGER,
                normalDifficulty INTEGER,
                hardDifficulty INTEGER,
                expertDifficulty INTEGER,
                XDDifficulty INTEGER,
                srtbHash TEXT,
                srtbPath TEXT,
                oggPath TEXT,
                coverPath TEXT
            );
        `);

        console.log("[ChartLibrary] Created Tables");
    }
}

module.exports = ChartLibrary;