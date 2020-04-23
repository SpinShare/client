<template>
    <section class="section-library">
        <SongRow title="Installed Songs">
            <template v-slot:controls>
                <div class="item"></div>
                <div class="item" v-on:click="refreshLibrary()"><i class="mdi mdi-refresh"></i></div>
            </template>
            <template v-slot:song-list>
                <SongInstallItem />

                <SongLocalItem
                    v-for="song in librarySongs"
                    v-bind:key="song.detail.id"
                    v-bind="song" />
            </template>
        </SongRow>
    </section>
</template>

<script>
    import glob from 'glob';
    import fs from 'fs';
    import path from 'path';

    import UserSettings from '@/modules/module.usersettings.js';
    import SRXD from '@/modules/module.srxd.js';

    import SongRow from '@/components/Song/SongRow.vue';
    import SongLocalItem from '@/components/Song/SongLocalItem.vue';
    import SongInstallItem from '@/components/Song/SongInstallItem.vue';

    export default {
        name: 'Library',
        data: function() {
            return {
                librarySongs: []
            }
        },
        components: {
            SongRow,
            SongLocalItem,
            SongInstallItem
        },
        mounted: function() {
            this.refreshLibrary();
        },
        methods: {
            refreshLibrary: function() {
                let userSettings = new UserSettings();

                this.$data.librarySongs = [];
                
                // Load local .srtb
                glob(path.join(userSettings.get('gameDirectory'), "*.srtb"), (error, files) => {
                    files.forEach((file) => {
                        // Get Detail Data
                        let songDetail = this.getSongDetail(file);
                        let songCover = glob.sync(path.join(userSettings.get('gameDirectory'), "AlbumArt", songDetail.coverReference + ".*"))[0];
                        let songSpinShareReference = false;

                        if(file.split("/")[file.split("/").length - 1].replace(".srtb", "").includes("spinshare_")) {
                            songSpinShareReference = file.split("/")[file.split("/").length - 1].replace(".srtb", "");
                        }

                        if(songCover) {
                            songCover = "data:image/jpg;base64," + fs.readFileSync(songCover, { encoding: 'base64' });
                        }

                        let librarySong = {
                            file: file,
                            detail: songDetail,
                            cover: songCover,
                            isSpinShare: songSpinShareReference
                        };

                        this.$data.librarySongs.push(librarySong)
                    });
                });
            },
            getSongDetail: function(filePath) {
                let srtbContent = JSON.parse( fs.readFileSync(filePath) );
                let trackInfo = {};

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
            }
        }
    }
</script>

<style scoped lang="less">
    section {
        padding: 50px;
    }
</style>