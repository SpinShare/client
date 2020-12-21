<template>
    <section class="section-user-detail">
        <header v-if="apiFinished">
            <div class="detail">
                <div class="user-avatar" :style="'background-image: url(' + avatar + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"></div>
                <div class="user-data">
                    <div class="user-name"><span v-if="pronouns != ''">{{ pronouns }}</span> {{ username }} <i class="mdi mdi-patreon" v-if="isVerified"></i></div>
                    <div class="user-actions">
                        <button class="button" v-on:click="OpenReport()">{{ $t('contextmenu.report') }}</button>
                    </div>
                </div>
            </div>

            <div class="cards" v-if="cards.length > 0">
                <div class="card" v-for="card in cards" :key="card.id" :style="'background-image: url(' + card.icon + ')'" v-on:click="OpenCardOverlay(card)"></div>
            </div>

            <div class="tabs">
                <router-link :to="{ name: 'UserDetailCharts', params: { id: id } }" class="tab" exact>{{ $t('userdetail.tabs.charts', {charts: songs}) }}</router-link>
                <router-link :to="{ name: 'UserDetailPlaylists', params: { id: id } }" class="tab" exact>{{ $t('userdetail.tabs.playlists', {playlists: playlists}) }}</router-link>
                <router-link :to="{ name: 'UserDetailReviews', params: { id: id } }" class="tab" exact>{{ $t('userdetail.tabs.reviews', {reviews: reviews}) }}</router-link>
                <router-link :to="{ name: 'UserDetailSpinPlays', params: { id: id } }" class="tab" exact>{{ $t('userdetail.tabs.spinplays', {spinplays: spinplays}) }}</router-link>
            </div>
        </header>

        <transition name="fade">
            <CardOverlay v-if="showCardOverlay" v-bind:card="cardToShow" />
        </transition>

        <router-view v-if="apiFinished"></router-view>

        <Loading v-if="!apiFinished" />
    </section>
</template>

<script>
    import { remote } from 'electron';
    import moment from 'moment';
    const { clipboard, shell } = remote;

    import SSAPI from '@/modules/module.api.js';
    import SongRow from '@/components/Song/SongRow.vue';
    import SongItem from '@/components/Song/SongItem.vue';
    import Loading from '@/components/Loading.vue';
    import CardOverlay from '@/components/Overlays/CardOverlay.vue';

    export default {
        name: 'UserDetail',
        components: {
            SongRow,
            SongItem,
            Loading,
            CardOverlay
        },
        data: function() {
            return {
                apiFinished: false,
                id: 0,
                username: "",
                pronouns: "",
                isVerified: false,
                isPatreon: false,
                avatar: "",
                cards: [],
                songs: 0,
                playlists: 0,
                reviews: 0,
                spinplays: 0,
                showCardOverlay: false,
                cardToShow: null
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getUserDetail(this.$route.params.id).then((data) => {
                if(data.status == 200) {
                    this.$data.id = data.data.id;
                    this.$data.username = data.data.username;
                    this.$data.pronouns = data.data.pronouns;
                    this.$data.isVerified = data.data.isVerified;
                    this.$data.isPatreon = data.data.isPatreon;
                    this.$data.avatar = data.data.avatar;
                    this.$data.cards = data.data.cards;
                    this.$data.songs = data.data.songs;
                    this.$data.playlists = data.data.playlists;
                    this.$data.reviews = data.data.reviews;
                    this.$data.spinplays = data.data.spinplays;
                    this.$data.apiFinished = true;
                } else {
                    this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                }
            });

            this.$on('cardClose', () => {
                this.$data.showCardOverlay = false;
                this.$data.cardToShow = null;
            });
        },
        methods: {
            OpenReport: function() {
                shell.openExternal("https://spinsha.re/report/user/" + this.$data.id);
            },
            OpenCardOverlay: function(cardToShow) {
                this.$data.showCardOverlay = true;
                this.$data.cardToShow = cardToShow;
            }
        }
    }
</script>

<style scoped lang="less">
    .section-user-detail {
        & header {
            background: rgba(0,0,0,0.5);
            padding: 25px 50px;
            padding-bottom: 0px;

            & .detail {
                margin-bottom: 15px;
                display: grid;
                grid-template-columns: 80px 1fr;
                grid-gap: 15px;

                & .user-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background-position: center;
                    background-size: cover;
                    position: relative;
                    overflow: hidden;

                    & .user-avatar-change {
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        bottom: 0px;
                        right: 0px;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        opacity: 0;
                        transition: 0.2s ease opacity;
                        cursor: pointer;

                        & .mdi {
                            font-size: 28px;
                        }
                        & input {
                            position: absolute;
                            top: 0px;
                            left: 0px;
                            bottom: 0px;
                            right: 0px;
                            cursor: pointer;
                            opacity: 0;
                        }
                    }
                    &:hover {
                        & .user-avatar-change {
                            opacity: 1;
                        }
                    }
                }

                & .user-data {
                    display: grid;
                    grid-template-rows: 1fr 40px;

                    & .user-name {
                        font-size: 22px;
                        margin-bottom: 22px;

                        & span {
                            display: inline-block;
                            background: rgba(255,255,255,0.2);
                            color: #fff;
                            font-size: 8px;
                            font-weight: bold;
                            padding: 4px 6px;
                            border-radius: 2px;
                            transform: translateY(-3px);
                            margin-right: 5px;
                        }
                    }
                    & .user-actions {
                        & .button {
                            margin-right: 7px;
                        }
                    }
                }
            }
            & .cards {
                margin-bottom: 25px;
                display: flex;

                & .card {
                    width: 100px;
                    height: 100px;
                    margin-right: 10px;
                    background-position: center;
                    background-size: cover;
                    opacity: 1;
                    transition: 0.2s ease-in-out opacity;

                    &:hover {
                        opacity: 0.6;
                        cursor: pointer;
                    }
                }
            }
            & .tabs {
                display: flex;

                & .tab {
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.25em;
                    padding: 15px 40px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    background: rgba(0,0,0,0.6);
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
                        background: #212629;
                    }
                }
            }
        }

        & .song-row-user {
            padding: 50px;
            display: grid;
        }
    }
</style>