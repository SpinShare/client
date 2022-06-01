<template>
    <div class="download-overlay">
        <header>
            <h1>{{ $t('download.queue.header') }}</h1>
            <SButton
                icon="close"
                @click="close"
            />
        </header>

        <div class="download-list">
            <div class="download-item" v-for="(item,index) in downloadQueue">
                <div class="download-item-grid">
                <div class="cover" :style="'background-image: url(' + item.cover + '), url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'"></div>
                    <div class="meta">
                        <div class="title">{{ item.title }}</div>
                        <div class="artist">{{ item.artist }}</div>
                    </div>
                </div>
                <div class="progress-bar" v-if="index === 0" :style="{ width: downloadProgress * 100 + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { remote, ipcRenderer } from 'electron';
    const { shell } = require('@electron/remote');

    export default {
        name: 'DownloadOverlay',
        props: [
            'downloadQueue'
        ],
        data: function() {
            return {
                showUpdateOverlay: false,
                showDownloadManager: false,
                isUpdateAvailable: false,
                downloadProgress: 0
            }
        },
        mounted: function() {
            ipcRenderer.on("overlays-close", () => {
                this.close();
            });
            ipcRenderer.on('downloadProgress', (event, data) => {
                this.$data.downloadProgress = data
            });
        },
        methods: {
            close() {
                this.$root.$emit('hideDownloadOverlay');
            }
        }
    }
</script>

<style scoped lang="less">

    .download-overlay {
        position: fixed;
        z-index: 10;
        top: 60px;
        bottom: 0px;
        right: 0px;
        width: 400px;
        background: #383C3F;
        display: grid;
        grid-template-rows: auto 1fr;
        grid-gap: 15px;
        box-shadow: 4px 0px 16px rgba(0,0,0,0.3);

        & header {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-gap: 15px;
            align-items: center;
            padding: 25px 25px 0px;

            & h1 {
                font-size: 18px;
                margin: 0;
            }
        }

        & .download-list {
            overflow-y: auto;
            padding: 0px 25px;
            margin-bottom: 25px;

            & .download-item {
                background: rgba(255,255,255,0.1);
                margin-bottom: 2px;
                padding: 10px;
                border-radius: 5px;


                & .download-item-grid{
                    display: grid;
                    grid-template-columns: 50px 1fr;
                    grid-gap: 10px;

                    & .cover {
                        width: 50px;
                        height: 50px;
                        background-position: center;
                        background-size: cover;
                        border-radius: 5px;
                    }

                    & .meta {
                        align-self: center;
                        overflow: hidden;

                        & .title {
                            font-weight: bold;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        & .artist {
                            margin-top: 5px;
                            opacity: 0.6;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                }

                & .progress-bar{
                    border-radius: 5px;
                    margin-top: 6px;
                    background: #e22c78;
                    height: 3px;
                    width: 100%;
                }
            }
        }
    }
</style>
