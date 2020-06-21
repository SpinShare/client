<template>
    <section class="section-library" @dragover.prevent @drop.stop.prevent="drop()">
        <header>
            <div class="title">{{ $t('library.header') }}</div>
            <div class="actions">
                <div class="button" v-on:click="install()">{{ $t('library.actions.install') }}</div>
                <div class="button" v-on:click="refreshLibrary()">{{ $t('library.actions.refresh') }}</div>
                <div class="button" v-on:click="openLibrary()">{{ $t('library.actions.open') }}</div>
                <span></span>
            </div>
        </header>

        <div class="cleanup-banner" v-if="hasUnusedFiles">
            <div class="icon">
                <i class="mdi mdi-hand-water"></i>
            </div>
            <div class="text">
                <div class="title">{{ $t('library.cleanup.title') }}</div>
                <div class="copy">{{ $t('library.cleanup.copy') }}</div>
            </div>
            <div class="button" v-on:click="cleanLibrary()">{{ $t('library.cleanup.action') }}</div>
        </div>

        <SongRow noactions="true">
            <template v-slot:song-list>
                <SongLocalItem
                    v-for="song in librarySongs"
                    v-bind:key="song.detail.id"
                    v-bind="song" />
            </template>
        </SongRow>

        <div class="loading" v-if="!apiFinished">
            <Loading />
        </div>

        <DeleteOverlay v-if="showDeleteOverlay" v-bind:deleteFiles="deleteFiles" />
    </section>
</template>

<script>
    import { remote } from 'electron';
    const { dialog, shell } = remote;

    import fs from 'fs';
    import { glob, globSync } from 'glob';
    import path from 'path';

    import UserSettings from '@/modules/module.usersettings.js';
    import SSAPI from '@/modules/module.api.js';
    import SRXD from '@/modules/module.srxd.js';

    import SongRow from '@/components/Song/SongRow.vue';
    import SongLocalItem from '@/components/Song/SongLocalItem.vue';
    import Loading from '@/components/Loading.vue';
    import DeleteOverlay from '@/components/Overlays/DeleteOverlay.vue';

    export default {
        name: 'Library',
        data: function() {
            return {
                librarySongs: [],
                showDeleteOverlay: false,
                deleteFiles: [],
                hasUnusedFiles: false,
                apiFinished: false,
                useAPIForLibrary: false
            }
        },
        components: {
            SongRow,
            SongLocalItem,
            Loading,
            DeleteOverlay
        },
        mounted: function() {
            this.refreshLibrary();
            
            this.$on('delete', (file) => {
                this.$data.showDeleteOverlay = true;
                this.$data.deleteFiles = this.getConnectedFiles(file);
            });
            this.$on('deleteDeny', () => {
                this.$data.showDeleteOverlay = false;
                this.$data.deleteFiles = "";
            });
            this.$on('deleteConfirm', () => {
                this.$data.deleteFiles.forEach((file) => {
                    fs.unlinkSync(file);
                });
                this.refreshLibrary();
                this.$data.showDeleteOverlay = false;
                this.$data.deleteFiles = "";
            });
            this.$on('install', () => {
                this.install();
            });
        },
        methods: {
            // TODO: Make this truly async
            refreshLibrary: async function() {
                let ssapi = new SSAPI(process.env.NODE_ENV === 'development');
                let userSettings = new UserSettings();

                this.$data.hasUnusedFiles = false;
                this.$data.librarySongs = [];
                this.$data.apiFinished = false;

                await ssapi.ping().then((data) => {
                    this.$data.useAPIForLibrary = true;
                    console.log(data);
                }).catch((error) => {
                    console.log(error);
                    this.$data.useAPIForLibrary = false;
                    console.log("ERROR WHILE PINGING API");
                });
                
                // Load local .srtb
                glob(path.join(userSettings.get('gameDirectory'), "*.srtb"), (error, files) => {
                    files.forEach((file) => {
                        // Get Detail Data
                        this.getSongDetail(file).then((songDetail) => {
                            let librarySong = {};
                            let fileReference = false;
                            
                            if(path.basename(file).includes("spinshare_")) {
                                fileReference = path.basename(file).replace(".srtb", "");
                            }
                            
                            let songCover = glob.sync(path.join(userSettings.get('gameDirectory'), "AlbumArt", songDetail.coverReference + ".*"))[0];

                            if(songCover) {
                                songCover = "data:image/jpg;base64," + fs.readFileSync(songCover, { encoding: 'base64' });
                            }

                            librarySong = {
                                file: file,
                                detail: songDetail,
                                cover: songCover,
                                modifiedDate: fs.statSync(file).mtime,
                                isSpinShare: fileReference
                            };

                            this.$data.librarySongs.push(librarySong);
                            this.$data.apiFinished = true;
                        });
                    });

                    // Order library by modifiedDate
                    this.$data.librarySongs.sort(function(a, b) {
                        return new Date(b.modifiedDate) - new Date(a.modifiedDate);
                    });
                });

                this.getUnusedFiles().then((data) => {
                    if(data.differingAssets.length > 0) {
                        this.$data.hasUnusedFiles = true;
                    } else {
                        this.$data.hasUnusedFiles = false;
                    }
                });
            },
            openLibrary: function() {
                let userSettings = new UserSettings();

                shell.openExternal(userSettings.get('gameDirectory'));
            },
            install: function() {
                this.$parent.$parent.$emit('install');
            },
            getSongDetail: async function(filePath) {
                let ssapi = new SSAPI(process.env.NODE_ENV === 'development');
                let trackInfo = {};
                let fileReference = path.basename(filePath).replace(".srtb", "");

                let srtbContent = JSON.parse( fs.readFileSync(filePath) );
                let stringValueContainers = srtbContent['largeStringValuesContainer'].values;

                stringValueContainers.forEach((stringValueContainer) => {
                    if(stringValueContainer.key == "SO_TrackInfo_TrackInfo") {
                        let rawTrackInfo = JSON.parse( stringValueContainer.val );
                        trackInfo = {
                            title: rawTrackInfo.title,
                            artist: rawTrackInfo.artistName,
                            charter: rawTrackInfo.charter,
                            coverReference: rawTrackInfo.albumArtReference.assetName
                        };
                    }
                });

                return trackInfo;
            },
            getConnectedFiles: function(srtbFilePath) {
                let userSettings = new UserSettings();
                let srtbContent = JSON.parse( fs.readFileSync(srtbFilePath) );
                let connectedFiles = [];

                connectedFiles.push(srtbFilePath);

                let stringValueContainers = srtbContent['largeStringValuesContainer'].values;

                stringValueContainers.forEach((stringValueContainer) => {
                    if(stringValueContainer.key == "SO_TrackInfo_TrackInfo") {
                        let rawTrackInfo = JSON.parse( stringValueContainer.val );
                        let coverPath = glob.sync(path.join(userSettings.get('gameDirectory'), "AlbumArt", rawTrackInfo.albumArtReference.assetName + ".*"))[0];

                        if(coverPath) {
                            connectedFiles.push(coverPath);
                        }
                    }
                    if(stringValueContainer.key.includes("SO_ClipInfo")) {
                        let rawClipInfo = JSON.parse( stringValueContainer.val );
                        let clipPath = glob.sync(path.join(userSettings.get('gameDirectory'), "AudioClips", rawClipInfo.clipAssetReference.assetName + ".*"))[0];

                        if(clipPath) {
                            connectedFiles.push(clipPath);
                        }
                    }
                });

                return connectedFiles;
            },
            getUnusedFiles: async function() {
                let userSettings = new UserSettings();
                let allLinkedAssets = [];
                let differingAssets = [];

                // Create array of assets from the srtb files
                let allLinkedAssetsPromise = new Promise((resolve, reject) => {
                    glob(path.join(userSettings.get('gameDirectory'), "*.srtb"), (error, files) => {
                        files.forEach((file) => {
                            allLinkedAssets.push((this.getConnectedFiles(file)).slice(1)[0]);
                            allLinkedAssets.push((this.getConnectedFiles(file)).slice(1)[1]);
                            allLinkedAssets.push(file);
                        });
                        resolve(allLinkedAssets);
                    })
                });

                // Waits for resolve in order to avoid bug where all songs would be added to differingAssets
                let allLinkedAssetsResults = await allLinkedAssetsPromise;

                // Whitelisted filenames
                let whitelistedFiles = [
                    "Settings.txt",             // Programmatic's SRTB Editor
                    "SRTB_Editor.exe",          // Programmatic's SRTB Editor
                    "SRTB_Editor.pdb"           // Programmatic's SRTB Editor
                ]

                // Create an array of all files in the root, audioclips and albumart folders
                let allRootFiles = glob.sync(path.join(userSettings.get('gameDirectory'), "*"));
                let allAudioClipsFiles = glob.sync(path.join(userSettings.get('gameDirectory'), "AudioClips", "*"));
                let allAlbumArtFiles = glob.sync(path.join(userSettings.get('gameDirectory'), "AlbumArt", "*"));

                let allFiles = allRootFiles.concat(allAudioClipsFiles, allAlbumArtFiles);

                allFiles.forEach((file) => {
                    if (!allLinkedAssetsResults.includes(file) && fs.statSync(file).isFile()) {
                        // Exclude whitelisted files & .zip files
                        if(!whitelistedFiles.includes(path.basename(file)) && !path.basename(file).includes(".zip")) {
                            differingAssets.push(file);
                        }
                    }
                });
                
                let thisData = this.$data;
                return {differingAssets, thisData};
            },
            install: function(e) {
                dialog.showOpenDialog({ title: this.$t('library.installmodal.title'), properties: ['openFile', 'multiSelections'], filters: [{"name": this.$t('library.installmodal.filetype'), "extensions": ["zip"]}] }).then(result => {
                    if(!result.canceled) {
                        result.filePaths.forEach((rawFilePath) => {
                            this.extract(rawFilePath)
                        });
                    }
                });
            },
            drop: function(e) {
                event.dataTransfer.files.forEach((file) => {
                    this.extract(file.path);
                });
            },
            extract: function(rawFilePath) {
                let filePath = glob.sync(rawFilePath);
                if(filePath.length > 0) {
                    let srxdControl = new SRXD();
                    let userSettings = new UserSettings();
                    srxdControl.extractBackup(filePath[0], path.basename(filePath[0])).then((extractResult) => {
                        if(extractResult !== false) {
                            srxdControl.installBackup(extractResult, userSettings.get('gameDirectory')).then((result) => {
                                console.log("[COPY] Backup installed!");
                                setTimeout(() => {
                                    this.refreshLibrary();
                                }, 250);
                            }).catch(error => {
                                console.error(error);
                            });
                        } else {
                            console.error("[COPY] Backup could not be installed!");
                        }
                    }).catch(error => {
                        console.error(error);
                    });
                }
            },
            cleanLibrary: function() {
                this.getUnusedFiles().then( (data) => {
                    data.thisData.deleteFiles = data.differingAssets;
                    data.thisData.showDeleteOverlay = true;
                });
            }
        }
    }
</script>

<style scoped lang="less">
    section {
        & header {
            background: rgba(0,0,0,0.3);
            padding: 50px;
            padding-bottom: 25px;

            & .title {
                font-size: 32px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 15px;
                font-family: 'Oswald', sans-serif;
            }
            & .actions {
                display: grid;
                grid-template-columns: auto auto auto auto 1fr;
                grid-gap: 15px;
            }
        }
        & .cleanup-banner {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 4px;
            display: grid;
            grid-template-columns: 40px 1fr auto;
            grid-gap: 15px;
            margin: 0px 50px;
            margin-top: 25px;
            align-items: center;

            & .icon {
                width: 40px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;

                & .mdi {
                    font-size: 32px;
                }
            }

            & .text {
                & .title {
                    margin: 0;
                    letter-spacing: 0.25em;
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                & .text {
                    opacity: 0.6;
                    line-height: 1.5;
                }
            }
        }

        & .song-row {
            padding: 50px;
            padding-top: 25px;
        }
    }
</style>