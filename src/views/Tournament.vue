<!-- Botch -->
<template>
    <section class="section-tournament">
        <header>
            <div class="title">Tournament WarpZone</div>
            <div class="description">
                It's gonna be better next SSSO! I promise!! &dash; Laura
            </div>
        </header>
        <div class="tournament-content" v-if="apiFinished">
            <div class="buttons">
                <div class="button" v-on:click="checkCharts()">Check if you are tournament-ready</div>
                <div class="button" v-on:click="downloadCharts()" v-show="analyzationDone">Download all tournament charts</div>
            </div>
            <div class="check-result" v-if="missingCharts.length > 0">
                <div class="list-title title-missing">Missing</div>
                <div class="item" v-for="missingChart in missingCharts" v-bind:key="missingChart.id">
                    <div class="cover" :style="'background-image: url(' + missingChart.cover + '), url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'"></div>
                    <div class="title">{{ missingChart.title }}</div>
                </div>
            </div>
            <div class="check-result" v-if="outdatedCharts.length > 0">
                <div class="list-title title-outdated">Outdated</div>
                <div class="item" v-for="outdatedChart in outdatedCharts" v-bind:key="outdatedChart.id">
                    <div class="cover" :style="'background-image: url(' + outdatedChart.cover + '), url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'"></div>
                    <div class="title">{{ outdatedChart.title }}</div>
                </div>
            </div>
            <div class="check-result" v-if="okCharts.length > 0">
                <div class="list-title title-ok">OK</div>
                <div class="item" v-for="okChart in okCharts" v-bind:key="okChart.id">
                    <div class="cover" :style="'background-image: url(' + okChart.cover + '), url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'"></div>
                    <div class="title">{{ okChart.title }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import fs from 'fs';
    import { glob, globSync } from 'glob';
    import path from 'path';
    import md5File from 'md5-file';

    import SSAPI from '@/modules/module.api.js';
    import UserSettings from '@/modules/module.usersettings.js';

    export default {
        name: 'Tournament',
        data: function() {
            return {
                tournamentCharts: [],
                missingCharts: [],
                outdatedCharts: [],
                okCharts: [],
                apiFinished: false,
                analyzationDone: false
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getPlaylistDetail(5).then((data) => {
                this.$data.apiFinished = true;

                this.$data.tournamentCharts = data.data.songs;
            });
        },
        methods: {
            checkCharts: function() {
                let userSettings = new UserSettings();

                // Clear Analyzation data
                this.$data.missingCharts = [];
                this.$data.outdatedCharts = [];
                this.$data.okCharts = [];
                this.$data.analyzationDone = false;

                this.$data.tournamentCharts.forEach((chart) => {
                    // Find SRTB
                    glob(path.join(userSettings.get('gameDirectory'), chart.fileReference + ".srtb"), (error, files) => {
                        if(files.length < 1) {
                            this.$data.missingCharts.push(chart);
                        } else {
                            // Check MD5
                            if(md5File.sync(files[0]) == chart.currentVersion) {
                                this.$data.okCharts.push(chart);
                            } else {
                                this.$data.outdatedCharts.push(chart);
                            }
                        }
                    });

                    // Note: Huge Success
                    this.$data.analyzationDone = true;
                });
            },
            downloadCharts: function() {
                // Add to Queue
                this.$data.missingCharts.forEach((chart) => {
                    this.$root.$emit('download', {id: chart.id, cover: chart.cover, title: chart.title, artist: chart.artist, downloadPath: chart.zip});
                });
                this.$data.outdatedCharts.forEach((chart) => {
                    this.$root.$emit('download', {id: chart.id, cover: chart.cover, title: chart.title, artist: chart.artist, downloadPath: chart.zip});
                });

                // Clear Analyzation data
                this.$data.missingCharts = [];
                this.$data.outdatedCharts = [];
                this.$data.okCharts = [];
                this.$data.analyzationDone = false;
            }
        }
    }
</script>

<style scoped lang="less">
    .section-tournament {
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
        & .tournament-content {
            padding: 25px 50px;
            line-height: 1.5em;
            
            & .buttons {
                width: 100%;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: 25px;
            }
            & .check-result {
                margin-top: 25px;
                border-radius: 4px;
                background: rgba(255,255,255,0.1);

                & .list-title {
                    font-weight: 600;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    padding: 10px 20px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;

                    &.title-missing {
                        background: rgba(189, 43, 43, 0.15);
                    }
                    &.title-outdated {
                        background: rgba(224, 157, 31, 0.15);
                    }
                    &.title-ok {
                        background: rgba(30, 202, 30, 0.15);
                    }
                }
                & .item {
                    display: grid;
                    grid-template-columns: 22px 1fr;
                    grid-gap: 10px;
                    padding: 15px;

                    & .cover {
                        width: 22px;
                        height: 22px;
                        background-size: cover;
                        background-position: center;
                        border-radius: 4px;
                    }
                    & .title {
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>