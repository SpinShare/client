<template>
    <div id="app">
        <main>
            <Navigation />
            <router-view />
        </main>

        <ContextMenu>
        </ContextMenu>

        <DeleteOverlay v-if="showDeleteOverlay" v-bind:deleteFiles="deleteFiles" />
    </div>
</template>

<script>
    import fs from 'fs';
    import glob from 'glob';
    import path from 'path';

    import UserSettings from '@/modules/module.usersettings.js';

    import Navigation from '@/components/Navigation/Navigation.vue';
    import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';
    import DeleteOverlay from '@/components/Overlays/DeleteOverlay.vue';

    export default {
        name: 'App',
        components: {
            Navigation,
            ContextMenu,
            DeleteOverlay
        },
        data: function() {
            return {
                downloadQueue: [],
                showDeleteOverlay: false,
                deleteFiles: []
            }
        },
        mounted: function() {
            this.$root.$on('download', (url) => {
                this.addToQueue(url);
            });
            this.$root.$on('delete', (file) => {
                this.$data.showDeleteOverlay = true;
                this.$data.deleteFiles = this.getConnectedFiles(file);
                console.log(this.$data.deleteFiles);
            });
            this.$root.$on('deleteDeny', () => {
                this.$data.showDeleteOverlay = false;
                this.$data.deleteFiles = "";
            });
            this.$root.$on('deleteConfirmed', () => {
                this.$data.deleteFiles.forEach((file) => {
                    fs.unlinkSync(file);
                });
                this.$data.showDeleteOverlay = false;
                this.$data.deleteFiles = "";
            });
        },
        methods: {
            addToQueue: function(url) {
                this.$data.downloadQueue.push(url);
                console.log("Added " + url + " to queue");
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
            }
        },
        watch: {
            downloadQueue: function(queue) {
                console.log("Downloading first item");
                console.log(this.$data.downloadQueue);
            }
        }
    }
</script>

<style lang="less">
    html {
        box-sizing: border-box;
        -webkit-user-select: none;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    html {
        width: 100%;
        height: 100%;
    }
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        background: #212629;
        color: #fff;
        overflow-x: hidden;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
    }
    ::-webkit-scrollbar {
        background: #212529;
        width: 5px;
    }
    ::-webkit-scrollbar-thumb {
        background: #fff;
    }
    main {
        display: grid;
        margin-left: 60px;
        min-height: 100vh;
        overflow-y: scroll;
    }
    section {
        &.section-library {
            padding: 50px;
        }
    }
    button, .button {
        font-family: 'Open Sans', sans-serif;
        font-size: 12px;
        color: #fff;
        background: rgba(255,255,255,0.2);
        text-transform: uppercase;
        font-weight: 700;
        border-radius: 4px;
        padding: 7px 14px;
        border: 0px;
        transition: 0.2s ease-in-out all;

        &:hover {
            background: #fff;
            color: #222;
            cursor: pointer;
        }
        &:focus {
            outline: 0;
        }

        &.button-label {
            background: transparent;

            &:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
            }
            &:active {
                background: #fff;
                color: #222;
                cursor: pointer;
            }
        }
    }
</style>
