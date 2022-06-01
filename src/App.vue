<template>
    <div id="app" :class="platform != 'darwin' ? 'app' : 'app-darwin'" tabindex="-1" v-on:keydown.esc="closeOverlays()">
        <!-- <WindowTitleBar /> -->

        <main>
            <Navigation v-bind:downloadQueueCount="downloadQueue.length" v-bind:downloadOverlayShown="showDownloadOverlay" />
            <router-view :key="$route.fullPath" />
        </main>

        <ContextMenu></ContextMenu>

        <transition name="fade">
            <UpdateOverlay v-if="showUpdateOverlay" v-bind:isAvailable="isUpdateAvailable"></UpdateOverlay>
        </transition>
        
        <transition name="slideDownloadOverlay">
            <DownloadOverlay v-if="showDownloadOverlay" v-bind:downloadQueue="downloadQueue" v-bind:finishedQueue="finishedQueue" v-bind:failedQueue="failedQueue"></DownloadOverlay>
        </transition>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';
    const remote = require('@electron/remote');
    const { app, dialog } = remote;

    import fs from 'fs';
    import glob from 'glob';
    import path from 'path';

    import UserSettings from '@/modules/module.usersettings.js';
    import SSAPI from '@/modules/module.api.js';
    import SRXD from '@/modules/module.srxd.js';

    import WindowTitleBar from '@/components/WindowTitleBar.vue';
    import Navigation from '@/components/Navigation/Navigation.vue';
    import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';
    import UpdateOverlay from '@/components/Overlays/UpdateOverlay.vue';
    import DownloadOverlay from '@/components/Overlays/DownloadOverlay.vue';

    export default {
        name: 'App',
        components: {
            WindowTitleBar,
            Navigation,
            ContextMenu,
            UpdateOverlay,
            DownloadOverlay
        },
        data: function() {
            return {
                platform: "win32",
                downloadQueue: [],
                finishedQueue: [],
                failedQueue: [],
                downloadQueueProcessing: false,
                showUpdateOverlay: false,
                showDownloadOverlay: false,
                isUpdateAvailable: false
            }
        },
        mounted: function() {
            this.$data.platform = process.platform;
            
            document.addEventListener('auxclick', function(e) {
                e.preventDefault();
            });

            ipcRenderer.send("getDeeplink");
            ipcRenderer.on('deeplink', (event, data) => {
                switch(data.view) {
                    case "Settings":
                        this.$router.push('Settings');
                        break;
                    case "SongDetail":
                        this.$router.push({ name: 'SongDetail', params: { id: data.data } });
                        break;
                    case "UserDetail":
                        this.$router.push({ name: 'UserDetail', params: { id: data.data } });
                        break;
                }
            });

            this.$root.$on('download', (url) => {
                let userSettings = new UserSettings();
                if(userSettings.get('silentQueue') != true) {
                    this.$data.showDownloadOverlay = true;
                }
                this.addToQueue(url);
            });
            this.$root.$on('showDownloadOverlay', () => {
                this.$data.showDownloadOverlay = true;
            });
            this.$root.$on('toggleDownloadOverlay', () => {
                this.$data.showDownloadOverlay = !this.$data.showDownloadOverlay;
            });
            this.$root.$on('hideDownloadOverlay', () => {
                this.$data.showDownloadOverlay = false;
            });

            this.$root.$on('showUpdateOverlay', (isAvailable) => {
                this.$data.showUpdateOverlay = true;
                this.$data.isUpdateAvailable = isAvailable;
            });
            this.$root.$on('hideUpdateOverlay', () => {
                this.$data.showUpdateOverlay = false;
                this.$data.isUpdateAvailable = false;
            });

            let ssapi = new SSAPI();

            ssapi.getLatestVersion().then((data) => {
                if(data.stringVersion != app.getVersion() && process.env.NODE_ENV !== 'development') {
                    this.$data.showUpdateOverlay = true;
                    this.$data.isUpdateAvailable = true;
                }
            });

            window.onbeforeunload = (e) => {
                if (this.$data.downloadQueue.length != 0) {
                    e.returnValue = false;
                    const options = {
                        type: 'question',
                        buttons: ['No', 'Yes'],
                        message: 'Do you really want to quit?',
                        detail: 'Quitting while a chart is downloading may cause errors.',
                    };
                    dialog.showMessageBox(null, options, (response) => {
                        if (response == 1) {
                            remote.getCurrentWindow().destroy();
                        }
                    });
                }
            };

            ipcRenderer.on("download-complete", (event, downloadItem) => {
                let srxdControl = new SRXD();
                let userSettings = new UserSettings();

                let queueItem = this.$data.downloadQueue.findIndex(function(i) {
                    return i.id === downloadItem.id;
                });

                console.info("████ #" + queueItem + " - '" + this.$data.downloadQueue[queueItem].title + "' ████");

                if(downloadItem.status == 1) {
                    // Failed, add to failed Array
                    this.$data.failedQueue.push(queueItem);
                    this.$data.downloadQueue.splice(queueItem, 1);
                } else {
                    // Finished, unpacking
                    srxdControl.extractBackup(downloadItem.downloadPath, path.basename(downloadItem.downloadPath)).then((extractResult) => {
                        if(extractResult !== false) {
                            srxdControl.installBackup(extractResult, userSettings.get('gameDirectory')).then((result) => {
                                console.log("[COPY] Backup installed!");

                                this.$data.downloadQueueProcessing = false;
                                console.log("[QUEUE] Remaining Items: " + this.$data.downloadQueue.length);

                                this.$data.finishedQueue.push(queueItem);
                                this.$data.downloadQueue.splice(queueItem, 1);

                                if(this.$data.downloadQueue.length > 0) {
                                    this.processQueue();
                                }
                            }).catch(error => {
                                console.error(error);
                            });
                        } else {
                            console.error("[COPY] Backup could not be installed!");

                            this.$data.downloadQueueProcessing = false;
                            console.log("[QUEUE] Remaining Items: " + this.$data.downloadQueue.length);

                            this.$data.failedQueue.push(queueItem);
                            this.$data.downloadQueue.splice(queueItem, 1);

                            if(this.$data.downloadQueue.length > 0) {
                                this.processQueue();
                            }
                        }
                    }).catch(error => {
                        console.error(error);

                        this.$data.downloadQueueProcessing = false;
                        console.log("[QUEUE] Remaining Items: " + this.$data.downloadQueue.length);

                        this.$data.failedQueue.push(queueItem);
                        this.$data.downloadQueue.splice(queueItem, 1);

                        if(this.$data.downloadQueue.length > 0) {
                            this.processQueue();
                        }
                    });
                }
            });
        },
        methods: {
            addToQueue: function(url) {
                this.$data.downloadQueue.push(url);
                if(!this.$data.downloadQueueProcessing) {
                    this.processQueue();
                }
            },
            processQueue: function() {
                this.$data.downloadQueueProcessing = true;

                if(this.$data.downloadQueue.length > 0) {
                    let downloadItem = this.$data.downloadQueue[0];

                    ipcRenderer.send("download", {
                        queueItem: downloadItem
                    });
                }
            },
            closeOverlays: function() {
                ipcRenderer.send("overlays-close");
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
        background: #222;
        color: #fff;
        overflow: hidden;
        font-family: 'Work Sans', sans-serif;
        letter-spacing: -0.025em;
        font-size: 14px;
    }
    ::-webkit-scrollbar {
        background: #212529;
        width: 5px;
    }
    ::-webkit-scrollbar-thumb {
        background: #fff;
    }
    a {  text-decoration: none; }
    #app:focus {
        outline: none;
    }
    main {
        display: grid;
        position: absolute;
        top: 60px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        overflow-y: scroll;
    }
    .app-darwin main {
        top: 40px;
    }
    input[type='range'] {
        overflow: hidden;
        width: 100%;
        outline: none;
        -webkit-appearance: none;
        background-color: #ddd;
    }
    input[type='range']::-webkit-slider-runnable-track {
        height: 10px;
        -webkit-appearance: none;
        color: #13bba4;
        margin-top: -1px;
    }
    input[type='range']::-webkit-slider-thumb {
        width: 10px;
        -webkit-appearance: none;
        height: 10px;
        cursor: ew-resize;
        background: #000;
        box-shadow: -800px 0 0 800px rgb(226, 44, 120);
    }
    /** FF*/
    input[type="range"]::-moz-range-progress {
        background-color: rgb(226, 44, 120); 
    }
    input[type="range"]::-moz-range-track {  
        background-color: #ddd;
    }
    /* IE*/
    input[type="range"]::-ms-fill-lower {
        background-color: rgb(226, 44, 120); 
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .slideDownloadOverlay-enter-active, .slideDownloadOverlay-leave-active {
        transform: translateX(0px);
        transition: transform .5s;
    }
    .slideDownloadOverlay-enter, .slideDownloadOverlay-leave-to {
        transform: translateX(400px);
    }
    .tooltip {
        background: #000000;
        font-size: 12px;
        padding: 5px 15px;
        border-radius: 4px;

        &[x-placement='top'] {
            margin-bottom: 5px;
        }

        &[x-placement='right'] {
            margin-left: 5px;
        }

        &[x-placement='down'] {
            margin-bottom: 5px;
        }
    }
</style>
