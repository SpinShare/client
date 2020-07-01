<template>
    <section class="section-user-detail">
        <div class="user-detail-background" :style="'background-image: url(' + avatar + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'" v-if="apiFinished">
            <div class="user-detail-dim">
                <div class="user-detail">
                    <div class="user-avatar" :style="'background-image: url(' + avatar + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"></div>
                    <div class="user-meta-data">
                        <div class="user-name">{{ username }}</div>
                        <div class="user-badge user-badge-verified">
                            <i class="mdi mdi-check-decagram"></i>
                        </div>
                        <div class="user-badge user-badge-patreon">
                            <i class="mdi mdi-patreon"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="user-detail-actions" v-if="apiFinished">
            <button class="button-report button" v-on:click="OpenReport">{{ $t('userdetail.actions.reportButton') }}</button>
        </div>
        <SongRow
            class="song-row-user"
            :title="$t('userdetail.uploaded.header')"
            v-if="apiFinished && songs.length > 0">
            <template v-slot:song-list>
                <SongItem
                    v-for="song in songs"
                    v-bind:key="song.id"
                    v-bind="song" />
            </template>
        </SongRow>

        <Loading v-if="!apiFinished" />
    </section>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard, shell } = remote;

    import SSAPI from '@/modules/module.api.js';
    import SongRow from '@/components/Song/SongRow.vue';
    import SongItem from '@/components/Song/SongItem.vue';
    import Loading from '@/components/Loading.vue';

    export default {
        name: 'UserDetail',
        components: {
            SongRow,
            SongItem,
            Loading
        },
        data: function() {
            return {
                apiFinished: false,
                id: 0,
                username: "",
                isVerified: false,
                isPatreon: false,
                avatar: "",
                songs: [] 
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getUserDetail(this.$route.params.id).then((data) => {
                if(data.status == 200) {
                    this.$data.id = data.data.id;
                    this.$data.username = data.data.username;
                    this.$data.isVerified = data.data.isVerified;
                    this.$data.isPatreon = data.data.isPatreon;
                    this.$data.avatar = data.data.avatar;
                    this.$data.songs = data.data.songs;
                    this.$data.apiFinished = true;
                } else {
                    this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                }
            });
        },
        methods: {
            OpenReport: function() {
                shell.openExternal("https://spinsha.re/report/user/" + this.$data.id);
            }
        }
    }
</script>

<style scoped lang="less">
    .section-user-detail {
        & .user-detail-background {
            background-size: cover;
            background-position: center;

            & .user-detail-dim {
                backdrop-filter: blur(10px);
                background: linear-gradient(180deg, rgba(0,0,0,0.4), #212629);

                & .user-detail {
                    padding: 50px;
                    display: grid;
                    grid-template-columns: 200px 1fr;
                    grid-gap: 25px;

                    & .user-avatar {
                        width: 200px;
                        height: 200px;
                        align-self: center;
                        background: #eee;
                        border-radius: 50%;
                        background-size: cover;
                        background-position: center;
                    }
                    & .user-meta-data {
                        display: flex;
                        height: 48px;
                        align-items: center;
                        
                        & .user-name {
                            font-weight: bold;
                            font-size: 48px;
                        }
                        & .user-badge {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 32px;
                            margin-left: 20px;
                        }
                    }
                }
            }
        }
        & .user-detail-actions {
            padding: 50px;
            padding-top: 0px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-gap: 25px;

            & .button {
                padding: 15px 0px;
                font-size: 16px;
                transition: 0.2s ease-in-out all, 0.1s ease-in-out transform;

                &.button-primary {
                    background: #fff;
                    color: #222;

                    &:hover {
                        background: #fff;
                        color: #222;
                    }
                }

                &:hover {
                    background: rgba(255,255,255,0.2);
                    color: #fff;
                    opacity: 0.6;
                    transform: translateY(-4px);
                }
                &:active {
                    transform: translateY(-2px);
                }
            }
        }

        & .song-row-user {
            display: grid;
            padding: 50px;
        }
    }
</style>