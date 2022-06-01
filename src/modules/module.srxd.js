const glob = require('glob');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const ncp = require('ncp');
const admzip = require('adm-zip');
const uniqid = require('uniqid');
const { app } = require('@electron/remote');
const UserSettings = require('./module.usersettings');

class SRXD {
    constructor() {
        this.backupLocation = "";
        this.srtbLocation = "";
        this.songTrackInfo = {};
        this.songLocation = "";

        this.userSettings = new UserSettings();
    }

    // Extract a local backup folder
    async extractBackup(filePath, fileName) {
        if(this.backupLocation !== "") {
            console.log("{EXTRACT] Unloading previous Backup.");
            await this.unloadBackup();
        }
    
        console.log("[EXTRACT] Starting Extraction.");
    
        this.backupLocation = path.join(app.getPath('temp'), "extract-" + uniqid());
        console.info("[EXTRACT] Backup Location: " + this.backupLocation);
    
        // Unzip to temp/CustomSpeens/Song
        try {
            console.log("[EXTRACT] Unzipping.");
            console.log("[EXTRACT] " + filePath);
            console.log("[EXTRACT] " + this.backupLocation);
            let zip = admzip(filePath);
            await zip.extractAllTo(this.backupLocation, true);
        } catch(e) {
            console.log("[EXTRACT] Couldn't unzip backup");
            console.error(e);
            return false;
        }

        return this.backupLocation;
    }

    async installBackup(backupLocation, gameDirLocation) {
        // Copy Protection
        // Check if game copy is legitimate
        /* let piratePath = path.join(app.getPath('userData'), "..", "Goldberg SteamEmu Saves");

        try {
            let isAPirate = fs.lstatSync(piratePath).isDirectory();

            if(isAPirate) {
                // Break all OGG previews in Backup
                let srtbFiles = glob.sync(path.join(backupLocation, "*.srtb"));
                
                srtbFiles.forEach(srtbFile => {
                    let aaa = "\\\"previewLoopBars\\\":{\\\"min\\\":-1,\\\"max\\\":-1},";
                    let srtbFileContent = fs.readFileSync(srtbFile, "utf8");
                    let changedSrtbContent = srtbFileContent.replace(/\\"previewLoopBars\\":{\\"(.*)\":\d{1,2},\\"(.*)\\":\d{1,2}},/, "");
                    let changedSrtb = changedSrtbContent;
                    fs.writeFileSync(srtbFile, changedSrtb);
                });
            }
        } catch(error) {
            
        }; */

        await ncp(backupLocation, gameDirLocation, function(error) {
            if(error) {
                console.error(error);
                console.error("[COPY] Couldn't copy backup!");
                return false;
            }

            console.info("[COPY] Copied backup!");
        });
    }

    async unloadBackup() {
        // Remove temp files
        console.log("Removing Backup Folder: " + this.backupLocation);
        try {
            rimraf(this.backupLocation, function() { console.log("Removed backup folder."); });
        } catch(error) {
            console.error(error);
        }
    
        // Reset vars
        this.backupLocation = "";
        this.srtbLocation = "";
        this.songTrackInfo = {};
        this.songLocation = "";
    }

    getSongDetail(rootPath, songPath) {
        let srtbPath = path.join(rootPath, songPath);
        let srtbFile = JSON.parse( fs.readFileSync(srtbPath) );
        let songTrackInfo = "";
        let songOggInfo = "";

        srtbFile.largeStringValuesContainer.values.forEach(function(value) {
            if(value.key === "SO_TrackInfo_TrackInfo") {
                songTrackInfo = JSON.parse( value.val );
            }
            if(value.key === "SO_ClipInfo_ClipInfo_0") {
                songOggInfo = JSON.parse( value.val );
            }
        });

        return [songTrackInfo, this.getSongCover(songTrackInfo.albumArtReference.assetName), this.getSongAssetDirectory(songOggInfo.clipAssetReference.assetName, "AudioClips"), this.getSongAssetDirectory(songTrackInfo.albumArtReference.assetName, "AlbumArt"), srtbPath];
    }

    // Used to find files by file extension
    // by https://stackoverflow.com/a/52024318
    getFilesFromPath(path, extension) {
        let dir = fs.readdirSync( path );
        return dir.filter( elm => elm.match(new RegExp(`.*\.(${extension})$`, 'ig')));
    }
    getLocalSongs(path) {
        let dir = fs.readdirSync( path );
        return dir.filter( elm => elm.match(new RegExp(`.*\.srtb$`, 'ig')));
    }
    getFileExtension(fileName, filePath){
        let filePathJoined = path.join(filePath, fileName);
        let files = glob.sync(filePathJoined+".*");
        if (files[0] != undefined){return [path.parse(files[0]).base];}
        else {return [];}
    }
    getSongCover(fileName) {
        let fileExtension = this.getFileExtension(fileName, path.join(this.userSettings.get('gameDirectory'), "AlbumArt") );
    
        if(fileExtension.length > 0) {
            let finalPath = path.join(this.userSettings.get('gameDirectory'), "AlbumArt", fileExtension[0]);
    
            try {
                let base64Data = "data:image/jpg;base64," + fs.readFileSync(finalPath, { encoding: 'base64' });
            } catch(e) {
                return "";
            }
        
            return base64Data;
        } else {
            return "";
        }
    }
    
    getSongTrackInfo() {
        return this.songTrackInfo;
    }

    //Gets directory of files to delete
    getSongAssetDirectory(fileName, fileType) {
        let fileExtension = this.getFileExtension(fileName, path.join(this.userSettings.get('gameDirectory'), fileType));
        if (fileExtension.join() !== '') {
            return path.join(this.userSettings.get('gameDirectory'), fileType, fileExtension.join());
        }
        else {return fileName;}        
    }
    //Deletes Files
    deleteFiles(songDetail) {
        let deleteFiles = [songDetail[2], songDetail[3], songDetail[4]];
            deleteFiles.forEach(function(file) {
                try{
                    let foundFiles = glob.sync(file);
                    if(foundFiles.length > 0) {
                        fs.unlinkSync(foundFiles[0]);
                    }
                }
                catch(err){}
        });
    }
}

module.exports = SRXD;
