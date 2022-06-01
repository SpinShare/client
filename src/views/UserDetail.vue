<template>
    <section class="section-user-detail">
        <aside v-if="apiFinished">
            <div class="detail">
                <div class="user-avatar" :style="'background-image: url(' + avatar + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"></div>
                <div class="user-meta">
                    <div class="user-name">
                        <span>{{ username }}</span>
                        <span
                            v-if="isPatreon"
                            class="mdi mdi-patreon"
                            v-tooltip="'Patreon Member'"
                        ></span>
                        <span
                            v-if="isVerified"
                            class="mdi mdi-check-decagram"
                            v-tooltip="'Verified'"
                        ></span>
                    </div>
                    <div
                        v-if="pronouns"
                        class="user-pronouns"
                    >
                        {{ pronouns }}
                    </div>
                </div>
                <div class="user-actions">
                    <SButton
                        icon="flag"
                        :label="$t('userdetail.actions.reportButton')"
                        @clikc="OpenReport"
                    />
                </div>
            </div>

            <div class="cards" v-if="cards.length > 0">
                <div class="card" v-for="card in cards" :key="card.id" :style="'background-image: url(' + card.icon + ')'" v-on:click="OpenCardOverlay(card)"></div>
            </div>
        </aside>

        <transition name="fade">
            <CardOverlay v-if="showCardOverlay" v-bind:card="cardToShow" />
        </transition>

        <div class="content" v-if="apiFinished">
            <div class="tabs">
                <router-link :to="{ name: 'UserDetailCharts', params: { id: id } }" class="tab" exact>Charts ({{ songs }})</router-link>
                <router-link :to="{ name: 'UserDetailReviews', params: { id: id } }" class="tab" exact>Reviews ({{ reviews }})</router-link>
                <router-link :to="{ name: 'UserDetailSpinPlays', params: { id: id } }" class="tab" exact>SpinPlays ({{ spinplays }})</router-link>
            </div>

            <router-view></router-view>
        </div>
    </section>
</template>

<script>
    const { shell } = require('@electron/remote');

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
                reviews: 0,
                spinplays: 0,
                showCardOverlay: false,
                cardToShow: null
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getUserDetail(this.$route.params.id).then((data) => {
                if(data.status === 200) {
                    this.id = data.data.id;
                    this.username = data.data.username;
                    this.pronouns = data.data.pronouns;
                    this.isVerified = data.data.isVerified;
                    this.isPatreon = data.data.isPatreon;
                    this.avatar = data.data.avatar;
                    this.cards = data.data.cards;
                    this.songs = data.data.songs;
                    this.reviews = data.data.reviews;
                    this.spinplays = data.data.spinplays;
                    this.apiFinished = true;
                } else {
                    this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                }
            });

            this.$on('cardClose', () => {
                this.showCardOverlay = false;
                this.cardToShow = null;
            });
        },
        methods: {
            OpenReport: function() {
                shell.openExternal("https://spinsha.re/report/user/" + this.id);
            },
            OpenCardOverlay: function(cardToShow) {
                this.showCardOverlay = true;
                this.cardToShow = cardToShow;
            }
        }
    }
</script>

<style scoped lang="less">
    .section-user-detail {
        display: grid;
        grid-template-columns: 300px 1fr;
        overflow: hidden;

        & aside {
            background: #161616;
            padding: 25px;

            & .detail {
                margin-bottom: 15px;
                display: flex;
                grid-gap: 15px;
                flex-direction: column;
                align-items: center;

                & .user-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background-position: center;
                    background-size: cover;
                    position: relative;
                    overflow: hidden;
                }

                & .user-meta {
                    text-align: center;

                    & .user-name {
                        display: flex;
                        grid-gap: 5px;
                        align-items: center;
                    }
                    & .user-pronouns {
                        opacity: 0.6;
                        font-size: 12px;
                        margin-top: 4px;
                    }
                }
            }
            & .cards {
                margin-bottom: 25px;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-gap: 5px;

                & .card {
                    padding-top: 100%;
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
        }

        & .content {
            padding: 50px;
            overflow-y: scroll;

            & .tabs {
                display: flex;
                grid-gap: 10px;
                margin-bottom: 15px;

                & .tab {
                    font-size: 12px;
                    font-weight: bold;
                    padding: 7px 20px;
                    border-radius: 100px;
                    background: rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.4);
                    transition: 0.2s ease-in-out all;
                    text-decoration: none;

                    &:not(.router-link-exact-active):hover {
                        cursor: pointer;
                        background: rgba(255,255,255,0.14);
                        color: rgba(255,255,255,0.75);
                    }
                    &.router-link-exact-active {
                        opacity: 1;
                        color: #e35b98;
                        background: rgba(227, 91, 152, 0.4);
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