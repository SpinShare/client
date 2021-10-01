<template>
    <section :class="!apiFinished ? 'section-song-detail-loading' : 'section-song-detail'">
        <div class="song-detail-background" v-if="apiFinished" :style="'background-image: url(' + cover + '), url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'">
            <div class="song-detail-background-cover"></div>
        </div>
        <div class="song-detail" v-if="apiFinished">
            <div class="song-meta">
                <div class="cover" :style="'background-image: url(' + cover + '), url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'"></div>
                <div class="song-metadata">
                    <div class="song-title">{{ title }}</div>
                    <div class="song-subtitle">{{ subtitle }}</div>
                    <div class="song-artist">{{ artist }} &bull; {{ $t('songdetail.createdBy', { charter: charter}) }}</div>
                </div>
            </div>
            <div :class="'song-actions ' + (previewIsPlaying ? 'player-active' : '')">
                <div v-on:click="AddToQueue()" class="action" v-if="!isInstalled" v-tooltip="'Download'">
                    <div class="icon">
                        <i class="mdi mdi-download"></i>
                    </div>
                </div>
                <div v-on:click="ShowPlayOverlay()" class="action" v-if="isInstalled" v-tooltip="'Play'">
                    <div class="icon">
                        <i class="mdi mdi-gamepad-variant"></i>
                    </div>
                </div>
                <div v-on:click="AddToQueue()" class="action" v-if="isInstalled" v-tooltip="'Redownload'">
                    <div class="icon">
                        <i class="mdi mdi-refresh"></i>
                    </div>
                </div>
                <div class="action-player">
                    <div class="icon" v-on:click="TogglePreview()" v-tooltip="previewIsPlaying ? 'Stop Preview' : 'Play Preview'">
                        <i class="mdi mdi-play" v-if="!previewIsPlaying"></i>
                        <i class="mdi mdi-stop" v-if="previewIsPlaying"></i>
                    </div>
                    <div class="volume" v-bind:class="{'volume-installed': isInstalled}">
                        <input type="range" min="0" max="100" value="50" v-model="previewVolume" class="playerVolume" v-on:input="UpdateVolume()" />
                    </div>
                </div>
                <div v-on:click="CopyLink()" class="action" v-tooltip="'Copy Link'">
                    <div class="icon">
                        <i class="mdi mdi-content-copy"></i>
                    </div>
                </div>
                <div v-on:click="OpenReport()" class="action" v-tooltip="'Report'">
                    <div class="icon">
                        <i class="mdi mdi-flag-outline"></i>
                    </div>
                </div>
            </div>
            <div class="song-statistics">
                <div class="stat">
                    <div class="icon">
                        <i class="mdi mdi-arm-flex"></i>
                    </div>
                    <div class="difficulties">
                        <div v-if="hasEasyDifficulty" class="difficulty"><span>E</span> {{ easyDifficulty ? easyDifficulty : 0 }}</div>
                        <div v-if="hasNormalDifficulty" class="difficulty"><span>N</span> {{ normalDifficulty ? normalDifficulty : 0 }}</div>
                        <div v-if="hasHardDifficulty" class="difficulty"><span>H</span> {{ hardDifficulty ? hardDifficulty : 0 }}</div>
                        <div v-if="hasExpertDifficulty" class="difficulty"><span>EX</span> {{ expertDifficulty ? expertDifficulty : 0 }}</div>
                        <div v-if="hasXDDifficulty" class="difficulty"><span>XD</span> {{ XDDifficulty ? XDDifficulty : 0 }}</div>
                    </div>
                </div>
                <div class="stat" v-if="uploadDate">
                    <div class="icon" v-tooltip="'Upload Date'">
                        <i class="mdi mdi-calendar-clock"></i>
                    </div>
                    <div class="content">
                    {{ uploadDate }}
                    </div>
                </div>
                <div class="stat" v-if="updateDate">
                    <div class="icon" v-tooltip="'Update Date'">
                        <i class="mdi mdi-calendar-clock"></i>
                    </div>
                    <div class="content">
                    {{ updateDate }}
                    </div>
                </div>
                <div class="stat">
                    <div class="icon" v-tooltip="'Views'">
                        <i class="mdi mdi-eye"></i>
                    </div>
                    <div class="content">
                    {{ views ? views : 0 }}
                    </div>
                </div>
                <div class="stat">
                    <div class="icon" v-tooltip="'Downloads'">
                        <i class="mdi mdi-download"></i>
                    </div>
                    <div class="content">
                    {{ downloads ? downloads : 0 }}
                    </div>
                </div>
            </div>
            <div class="song-uploader">
                <div class="label">{{ $t('songdetail.uploadedBy') }}</div>
                <UserItem v-bind="uploader" />
            </div>
            <div class="song-description" v-if="description || tags.length > 0">
                <CollapsableText v-bind:text="description" v-if="description" />
                <div class="tags">
                    <router-link class="tag" v-for="tag in tags" v-bind:key="tag" :to="{ name: 'Search', params: { searchQuery: tag } }">{{ tag }}</router-link>
                </div>
            </div>
        </div>
        <div class="song-social" v-if="apiFinished">
            <div class="tab-header">
                <router-link :to="{ name: 'SongDetailReviews', params: { id: id } }" class="tab-header-item tab-header-item-reviews" exact><span>{{ $t('songdetail.tabs.reviews') }}</span></router-link>
                <router-link :to="{ name: 'SongDetailSpinPlays', params: { id: id } }" class="tab-header-item tab-header-item-spinplays" exact><span>{{ $t('songdetail.tabs.spinplays') }}</span></router-link>
            </div>
            
            <router-view></router-view>
        </div>

        <Loading v-if="!apiFinished" />

        <PlayOverlay v-if="showPlayOverlay"
            v-bind:fileReference="fileReference"
            v-bind:hasEasyDifficulty="hasEasyDifficulty"
            v-bind:hasNormalDifficulty="hasNormalDifficulty"
            v-bind:hasHardDifficulty="hasHardDifficulty"
            v-bind:hasExpertDifficulty="hasExpertDifficulty"
            v-bind:hasXDDifficulty="hasXDDifficulty" />
    </section>
</template>

<script>
    import path from 'path';
    import moment from 'moment';
    import fs from 'fs';
    const { clipboard, shell } = require('@electron/remote');

    import SSAPI from '@/modules/module.api.js';
    import UserSettings from '@/modules/module.usersettings.js';
    
    import UserItem from '@/components/User/UserItem.vue';
    import CollapsableText from '@/components/CollapsableText.vue';
    import Loading from '@/components/Loading.vue';
    import PlayOverlay from '@/components/Overlays/PlayOverlay.vue';

    export default {
        name: 'SongDetail',
        components: {
            UserItem,
            CollapsableText,
            Loading,
            PlayOverlay
        },
        data: function() {
            return {
                apiFinished: false,
                id: 0,
                cover: "",
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
                tags: [],
                uploader: null,
                uploadDate: null,
                updateDate: null,
                fileReference: "",
                isInstalled: false,
                previewPath: "",
                downloadPath: "",
                downloads: 0,
                views: 0,
                description: "",
                previewIsPlaying: false,
                currentPreviewAudio: null,
                previewVolume: 50,
                showPlayOverlay: false
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();
            let userSettings = new UserSettings();
            let routeID = this.$route.params.id;

            ssapi.getSongDetail(routeID).then((data) => {
                if(data.status == 200) {
                    // transform filereference to id
                    if(typeof routeID === 'string') {
                        if(routeID.includes("spinshare_")) {
                            this.$router.push({ name: 'SongDetailReviews', params: { id: data.data.id } });
                        }
                    }

                    console.log(data.data);

                    this.$data.id = data.data.id;
                    this.$data.cover = data.data.paths.cover;
                    this.$data.title = data.data.title;
                    this.$data.subtitle = data.data.subtitle;
                    this.$data.artist = data.data.artist;
                    this.$data.charter = data.data.charter;
                    this.$data.hasEasyDifficulty = data.data.hasEasyDifficulty;
                    this.$data.hasNormalDifficulty = data.data.hasNormalDifficulty;
                    this.$data.hasHardDifficulty = data.data.hasHardDifficulty;
                    this.$data.hasExpertDifficulty = data.data.hasExtremeDifficulty;
                    this.$data.hasXDDifficulty = data.data.hasXDDifficulty;
                    this.$data.easyDifficulty = data.data.easyDifficulty;
                    this.$data.normalDifficulty = data.data.normalDifficulty;
                    this.$data.hardDifficulty = data.data.hardDifficulty;
                    this.$data.expertDifficulty = data.data.expertDifficulty;
                    this.$data.XDDifficulty = data.data.XDDifficulty;
                    if(data.data.tags != "") {
                        this.$data.tags = data.data.tags;
                    }
                    this.$data.previewPath = data.data.paths.ogg;
                    this.$data.downloadPath = data.data.paths.zip;
                    this.$data.downloads = data.data.downloads;
                    this.$data.views = data.data.views;
                    this.$data.description = data.data.description;
                    if(data.data.uploadDate) {
                        this.$data.uploadDate = moment(data.data.uploadDate.date).format(this.$t('locale.dateFormat'));
                    }
                    if(data.data.updateDate) {
                        this.$data.updateDate = moment(data.data.updateDate.date).format(this.$t('locale.dateFormat'));
                    }
                    this.$data.fileReference = data.data.fileReference;

                    // Check if Song is already installed by searching for the srtb file
                    this.$data.isInstalled = fs.existsSync(path.join(userSettings.get('gameDirectory'), this.$data.fileReference + ".srtb"));

                    ssapi.getUserDetail(data.data.uploader).then((data) => {
                        if(data.status == 200) {
                            this.$data.uploader = data.data;
                            this.$data.apiFinished = true;
                        } else {
                            this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                        }
                    }).catch((error) => {
                        console.error(error);
                        this.$router.push({ name: 'Error', params: { errorCode: 500 } });
                    });
                }  else {
                    this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                }
            }).catch((error) => {
                console.error(error);
                this.$router.push({ name: 'Error', params: { errorCode: 500 } });
            });
            
            this.$on('closePlayOverlay', () => {
                this.$data.showPlayOverlay = false;
            });
        },
        methods: {
            ShowPlayOverlay: function() {
                this.$data.showPlayOverlay = true;
            },
            AddToQueue: function() {
                this.$root.$emit('download', {id: this.$data.id, cover: this.$data.cover, title: this.$data.title, artist: this.$data.artist, downloadPath: this.$data.downloadPath});
            },
            CopyLink: function() {
                clipboard.writeText("https://spinsha.re/song/" + this.$data.id);
            },
            OpenReport: function() {
                shell.openExternal("https://spinsha.re/report/song/" + this.$data.id);
            },
            TogglePreview: function() {    
                this.$data.previewIsPlaying = !this.$data.previewIsPlaying;

                if(this.$data.previewIsPlaying) {
                    this.PlayPreview();
                } else {
                    this.StopPreview();
                }
            },
            PlayPreview: function() {
                this.$data.currentPreviewAudio = new Audio(this.$data.previewPath);
                this.$data.previewVolume = 50;
                this.$data.currentPreviewAudio.volume = this.$data.previewVolume / 100;
                this.$data.currentPreviewAudio.play();
                this.$data.currentPreviewAudio.onended = () => {
                    this.StopPreview();
                }
                this.$data.previewIsPlaying = true;
            },
            StopPreview: function() {
                if(this.$data.currentPreviewAudio) {
                    this.$data.currentPreviewAudio.pause();
                    this.$data.currentPreviewAudio.currentTime = 0;
                }
                this.$data.currentPreviewAudio = null;
                this.$data.previewIsPlaying = false;
            },
            UpdateVolume: function() {
                this.$data.currentPreviewAudio.volume = this.$data.previewVolume / 100;
            }
        },
        beforeDestroy: function() {
            this.StopPreview();
        }
    }
</script>

<style scoped lang="less">
    .section-song-detail {
        display: grid;
        grid-template-columns: 500px 1fr;
        grid-gap: 25px;
        padding: 50px;

        & .song-detail-background {
            background-position: center;
            background-size: cover;
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            height: 300px;
            z-index: -1;

            & .song-detail-background-cover {
                position: absolute;
                top: 0px;
                left: 0px;
                bottom: 0px;
                right: 0px;
                background: linear-gradient(180deg, rgba(33,38,41,0.7) 0%, rgba(33,38,41,1) 100%);
            }
        }
        
        & .song-detail {
            & .song-meta {
                display: grid;
                grid-template-columns: auto 1fr;
                background: #383C3F;
                border-radius: 4px;
                overflow: hidden;

                & .cover {
                    margin-left: 10px;
                    align-self: center;
                    justify-self: center;
                    height: 64px;
                    width: 64px;
                    border-radius: 4px;
                    background-position: center;
                    background-size: cover;
                }

                & .song-metadata {
                    padding: 20px;

                    & .song-title {
                        font-weight: bold;
                        font-size: 18px;
                        margin-bottom: 2px;
                    }

                    & .song-subtitle {
                        margin-bottom: 5px;
                    }

                    & .song-artist {
                        opacity: 0.6;
                    }
                }
            }
            & .song-actions {
                margin-top: 25px;
                width: 500px;
                display: flex;
                transition: all 0.2s ease-in-out;
                border-radius: 4px;
                overflow: hidden;
                background: #fff;

                & .action, & .action-player {
                    background: linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
                    width: 25%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #222;
                    text-decoration: none;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;

                    & .icon {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 48px;
                        width: 48px;
                        font-size: 24px;
                    }
                    & .volume {
                        width: 0px;
                        overflow: hidden;
                        padding-left: 0px;
                        transition: all 0.2s ease-in-out;
                    }

                    &:hover {
                        opacity: 0.6;
                    }
                }

                &.player-active {
                    & .action {
                        width: calc((100% - 250px) / 3);
                    }
                    & .action-player {
                        width: 250px;

                        & .volume{
                            width: 170px;
                            padding-left: 20px;
                        }

                        & .volume-installed{
                            width: 150px;
                            padding-left: 10px;
                            padding-right: 10px;
                        }
                    }
                }
            }
            & .song-statistics {
                display: grid;
                grid-template-columns: 1fr;
                grid-gap: 10px;
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 4px;
                margin-top: 25px;

                & .stat {
                    display: grid;
                    grid-template-columns: 30px 1fr;
                    grid-gap: 15px;

                    & .icon {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 22px;
                    }

                    & .difficulties {
                        align-self: center;
                        height: 20px;
                        display: flex;
            
                        & .difficulty {
                            background: #fff;
                            color: #000;
                            border-radius: 4px;
                            padding: 3px 8px;
                            margin-right: 4px;
                            font-size: 10px;
            
                            & span {
                                // padding-right: 3px;
                                font-weight: bold;
                            }
                        }
                    }

                    & .content {
                        align-self: center;
                        opacity: 0.6;
                    }
                }
            }
            & .song-uploader {
                display: grid;
                grid-template-columns: auto 1fr;
                grid-gap: 15px;
                margin-top: 25px;

                & .label {
                    align-self: center;
                    opacity: 0.6;
                }
            }
            & .song-description {
                background: #383C3F;
                border-radius: 4px;
                margin-top: 25px;
                display: grid;
                grid-gap: 20px;
                padding: 20px;

                & .text {
                    line-height: 1.5em;
                    opacity: 0.7;
                }
                & .tags {
                    display: flex;
                    flex-wrap: wrap;

                    & .tag {
                        display: block;
                        margin-right: 10px;
                        margin-bottom: 10px;
                        color: #fff;
                        background: rgba(255,255,255,0.2);
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        text-decoration: none;
                        transition: 0.2s ease-in-out all;

                        &:hover {
                            cursor: pointer;
                            color: #222;
                            background: #fff;
                        }
                    }
                }
            }
        }
        & .song-social {
            & .tab-header {
                display: flex;

                & .tab-header-item {
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.25em;
                    padding: 15px 40px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    background: #1C2022;
                    color: rgba(255,255,255,0.4);
                    transition: 0.2s ease-in-out all;
                    text-decoration: none;

                    &:not(.active):hover {
                        cursor: pointer;
                        background: #272c2e;
                        color: rgba(255,255,255,0.75);
                    }

                    &.router-link-active {
                    opacity: 1;
                    color: rgba(255,255,255,1);
                    background: #383C3F;
                    }
                }
            }
            & .tab {
                background: #383C3F;
                border-radius: 4px;
                border-top-left-radius: 0px;
                padding: 20px;
                display: grid;
                grid-gap: 25px;
            }
        }
    }
    .section-song-detail-loading {
        display: grid;
        grid-template-columns: 1fr;
        padding: 50px;
    }

    @media screen and (min-width: 1700px) {
        .section-song-detail {
            & .song-social { 
                & .tab.tab-spinplays {
                    & .spinplays {
                        grid-template-columns: 1fr 1fr 1fr;
                    }
                }
            }
        }
    }
</style>