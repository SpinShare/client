<template>
    <section :class="!apiFinished ? 'section-playlist-detail-loading' : 'section-playlist-detail'">
        <section class="section-playlist-detail" v-if="apiFinished">
            <div class="cover" :style="'background-image: url(' + cover + ');'">
                <div class="shade" v-if="!isOfficial">
                    <div class="content">
                        <div class="title">{{ title }}<span class="official-badge" v-if="isOfficial">OFFICIAL</span></div>
                        <div class="quickinfo">{{ songs.length }} Charts</div>
                    </div>
                </div>
            </div>
            <div class="playlist-content">
                <div class="playlist-detail">
                    <div class="playlist-description">
                        {{ description }}
                    </div>
                    <div class="playlist-actions">
                        <div class="action-row">
                            <div v-on:click="CopyLink()" class="action">
                                <div class="icon">
                                    <i class="mdi mdi-content-copy"></i>
                                </div>
                            </div>
                            <div v-on:click="AddToQueue()" class="action">
                                <div class="icon">
                                    <i class="mdi mdi-download"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="playlist-uploader" v-if="!isOfficial">
                        <div class="label">Created by</div>
                        <UserItem v-bind="user" />
                    </div>
                    <div class="playlist-charters" v-if="songs.length > 0">
                        <div class="label">With Charts by</div>
                        <div class="charters">
                            charters
                        </div>
                    </div>
                </div>
                <SongRow v-if="apiFinished && songs.length > 0" v-bind:playlist="true">
                    <template v-slot:song-list>
                        <SongItem
                            v-for="song in songs"
                            v-bind:key="song.id"
                            v-bind="song"
                            v-bind:cover="song.cover" />
                    </template>
                </SongRow>
                <div class="list-noresults" v-if="songs.length === 0">
                    <div class="noresults-text">This playlist is empty.</div>
                </div>
            </div>
        </section>

        <Loading v-if="!apiFinished" />
    </section>
</template>

<script>
import { remote } from 'electron';
const { clipboard, shell } = remote;

import SSAPI from '@/modules/module.api.js';
import UserSettings from '@/modules/module.usersettings.js';

import UserItem from '@/components/User/UserItem.vue';
import SongRow from '@/components/Song/SongRow.vue';
import SongItem from '@/components/Song/SongItem.vue';
import CollapsableText from '@/components/CollapsableText.vue';
import Loading from '@/components/Loading.vue';

export default {
    name: 'SongDetail',
    components: {
        UserItem,
        SongItem,
        SongRow,
        CollapsableText,
        Loading
    },
    data: function() {
        return {
            apiFinished: false,
            id: 0,
            cover: "",
            title: "",
            description: "",
            isOfficial: false,
            user: null,
            songs: [],
        }
    },
    mounted: function() {
        let ssapi = new SSAPI();
        let userSettings = new UserSettings();
        let routeID = this.$route.params.id;

        ssapi.getPlaylistDetail(routeID).then((data) => {
            if(data.status == 200) {
                this.$data.id = data.data.id;
                this.$data.cover = data.data.paths.cover;
                this.$data.title = data.data.title;
                this.$data.description = data.data.description;
                this.$data.isOfficial = data.data.isOfficial;
                this.$data.user = data.data.user;
                this.$data.songs = data.data.songs;

                this.$data.apiFinished = true;
            }  else {
                this.$router.push({ name: 'Error', params: { errorCode: data.status } });
            }
        }).catch((error) => {
            console.error(error);
            this.$router.push({ name: 'Error', params: { errorCode: 500 } });
        });
    },
    methods: {
        AddToQueue: function() {
            this.$data.songs.forEach((songItem) => {
                this.$root.$emit('download', {id: songItem.id, cover: songItem.cover, title: songItem.title, artist: songItem.artist, downloadPath: songItem.zip});
            });
        },
        CopyLink: function() {
            clipboard.writeText("https://spinsha.re/playlist/" + this.$data.id);
        },
    },
    beforeDestroy: function() {
    }
}
</script>

<style scoped lang="less">
.section-playlist-detail {
    & .cover {
        width: 100%;
        height: 300px;
        background: rgba(255, 255, 255, 0.1) center;
        background-size: cover;

        & .shade {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            transition: 0.2s ease all;
            display: flex;
            justify-content: center;
            align-items: center;

            & .content {
                text-align: center;
                text-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);

                & .title {
                    font-size: 48px;
                    margin-bottom: 5px;
                    font-family: 'Oswald', sans-serif;

                    & .official-badge {
                        display: inline-block;
                        font-family: 'Open Sans', sans-serif;
                        font-weight: bold;
                        font-size: 12px;
                        padding: 2px 10px;
                        border-radius: 4px;
                        background: #fff;
                        color: #000;
                        text-shadow: 0 0 0 transparent;
                        margin-left: 10px;
                        transform: translateY(-11px);
                    }
                }

                & .quickinfo {
                    font-size: 18px;
                    opacity: 0.6;
                }
            }
        }
    }
    & .playlist-content {
        padding: 50px;
        display: grid;
        grid-template-columns: 400px 1fr;
        grid-gap: 25px;

        & .playlist-detail {
            & .playlist-description {
                background: #383C3F;
                border-radius: 4px;
                line-height: 1.5em;
                display: grid;
                grid-gap: 20px;
                padding: 20px;

                & .text {
                    line-height: 1.5em;
                    opacity: 0.7;
                }
            }
            & .playlist-actions {
                margin-top: 25px;
                transition: all 0.2s ease-in-out;
                border-radius: 4px;
                overflow: hidden;
                background: #fff;

                & .action-row {
                    display: flex;

                    & .action {
                        background: linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
                        flex-grow: 1;
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

                        &:hover {
                            opacity: 0.6;
                        }
                    }
                }
            }
            & .playlist-uploader {
                display: grid;
                grid-template-columns: auto 1fr;
                grid-gap: 15px;
                margin-top: 25px;

                & .label {
                    align-self: center;
                    opacity: 0.6;
                }
            }
            & .playlist-charters {
                display: grid;
                grid-template-rows: auto 1fr;
                grid-gap: 8px;
                margin-top: 25px;

                & .label {
                    align-self: center;
                    opacity: 0.6;
                }
                & .charters {
                    background: #383C3F;
                    padding: 15px;
                    line-height: 1.5em;
                    border-radius: 4px;
                }
                & .username {
                    opacity: 1;
                    color: #fff;
                    text-decoration: none;
                    transition: 0.2s ease-in-out opacity;

                    &:hover {
                        opacity: 0.6;
                    }
                }
            }
        }
    }
}
</style>