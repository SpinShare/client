<!-- Botch -->
<template>
    <section class="section-tournament">
        <header>
            <div class="title">Tournament WarpZone</div>
            <div class="description">
                This page looks very ugly, sorry about that &dash; Laura
            </div>
        </header>
        <div class="tournament-content" v-if="apiFinished">
            <div class="buttons">
                <SButton
                    icon="update"
                    label="Check if you're tournament-ready"
                    @click="checkCharts"
                />
                <SButton
                    icon="download"
                    label="Download all tournament charts"
                    @click="downloadCharts"
                    v-show="analyzationDone"
                />
            </div>
            <div class="check-result" v-if="missingCharts.length > 0">
                <div class="list-title title-missing">Missing</div>
                <SongRow noactions>
                    <template slot="song-list">
                        <SongItem
                            v-for="chart in missingCharts"
                            v-bind:key="chart.id"
                            v-bind="chart"
                        />
                    </template>
                </SongRow>
            </div>
            <div class="check-result" v-if="outdatedCharts.length > 0">
                <div class="list-title title-outdated">Outdated</div>
                <SongRow noactions>
                    <template slot="song-list">
                        <SongItem
                            v-for="chart in outdatedCharts"
                            v-bind:key="chart.id"
                            v-bind="chart"
                        />
                    </template>
                </SongRow>
            </div>
            <div class="check-result" v-if="okCharts.length > 0">
                <div class="list-title title-ok">OK</div>
                <SongRow noactions>
                    <template slot="song-list">
                        <SongItem
                            v-for="chart in okCharts"
                            v-bind:key="chart.id"
                            v-bind="chart"
                        />
                    </template>
                </SongRow>
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
    import SongRow from "@/components/Song/SongRow";
    import SongItem from "@/components/Song/SongItem";

    export default {
        name: 'Tournament',
        components: {
            SongRow,
            SongItem
        },
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

            ssapi.getTournamentMappool().then((data) => {
                this.$data.apiFinished = true;

                this.$data.tournamentCharts = data.data;
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
                            if(md5File.sync(files[0]) == chart.srtbMD5) {
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
                    this.$root.$emit('download', {id: chart.id, cover: chart.paths.cover, title: chart.title, artist: chart.artist, downloadPath: chart.paths.zip});
                });
                this.$data.outdatedCharts.forEach((chart) => {
                    this.$root.$emit('download', {id: chart.id, cover: chart.paths.cover, title: chart.title, artist: chart.artist, downloadPath: chart.paths.zip});
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
                display: flex;
                grid-gap: 10px;
            }
            & .check-result {
                margin-top: 25px;
                border-radius: 4px;

                & .list-title {
                    font-weight: 600;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    padding: 10px 20px;
                    border-radius: 4px;
                    margin-bottom: 15px;

                    &.title-missing {
                        background: #ff1744;
                    }
                    &.title-outdated {
                        background: #ffab40;
                    }
                    &.title-ok {
                        background: #9ccc65;
                    }
                }
            }
        }
    }
</style>