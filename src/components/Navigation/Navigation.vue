<template>
    <aside>
        <nav class="items-left">
            <div class="item" v-tooltip.down="'Back'" v-on:click="navigateBack()"><i class="mdi mdi-arrow-left"></i></div>
            <div class="logo">
              <router-link to="/startup"><img src="https://spinsha.re/assets/img/logo_colored_ondark.svg" alt="SpinShare Logo" /></router-link>
            </div>
            <router-link to="/startup" exact class="item" v-tooltip.down="'Frontpage'"><i class="mdi mdi-home-outline"></i></router-link>
            <router-link to="/search" class="item" v-tooltip.down="'Search'"><i class="mdi mdi-magnify"></i></router-link>
            <router-link to="/library" class="item" v-tooltip.down="'Library'"><i class="mdi mdi-music-box-multiple-outline"></i></router-link>
            <div v-on:click="openExternal('https://spinsha.re/support');" class="item" v-tooltip.down="'Support'"><i class="mdi mdi-hand-heart"></i></div>
        </nav>

        <nav class="items-right">
            <div v-on:click="openExternal('steam://run/1058830');" class="item" v-tooltip.down="'Start SpinRhythm XD'"><i class="mdi mdi-play-outline"></i></div>
            <div v-on:click="showDownloadOverlay();" :class="'item ' + (downloadOverlayShown ? 'router-link-active' : '')" v-tooltip.down="'Download Queue'">
                <i class="mdi mdi-download-outline"></i>
                <span class="indicator" v-show="downloadQueueCount > 0">{{ downloadQueueCount }}</span>
            </div>
            <div class="item item-user" tabindex="0" v-if="userData != null">
                <div class="user-avatar" :style="'background-image: url(' + userData.avatar + ');'"></div>
                <div class="user-actions">
                    <router-link :to="{ name: 'UserDetailCharts', params: { id: userData.id } }" class="user-action-item">
                        <i class="mdi mdi-music"></i>
                        <span>My Charts</span>
                    </router-link>
                    <router-link :to="{ name: 'UserDetailReviews', params: { id: userData.id } }" class="user-action-item">
                        <i class="mdi mdi-playlist-music"></i>
                        <span>My Playlists</span>
                    </router-link>
                    <router-link :to="{ name: 'UserDetailSpinPlays', params: { id: userData.id } }" class="user-action-item">
                        <i class="mdi mdi-thumbs-up-down"></i>
                        <span>My Reviews</span>
                    </router-link>
                    <router-link :to="{ name: 'UserDetailSpinPlays', params: { id: userData.id } }" class="user-action-item">
                        <i class="mdi mdi-youtube"></i>
                        <span>My SpinPlays</span>
                    </router-link>
                    <div class="user-action-spacer"></div>
                    <router-link to="/settings" class="user-action-item">
                        <i class="mdi mdi-cog"></i>
                        <span>App-Settings</span>
                    </router-link>
                    <div v-on:click="openExternal('https://spinsha.re/settings')" class="user-action-item">
                        <i class="mdi mdi-cog"></i>
                        <span>Account-Settings</span>
                    </div>
                    <div class="user-action-spacer"></div>
                    <div v-on:click="userLogout()" class="user-action-item">
                        <i class="mdi mdi-close-circle-outline"></i>
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        </nav>
    </aside>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    import SSAPI from '@/modules/module.api.js';
    import UserSettings from '@/modules/module.usersettings.js';

    export default {
        name: 'Navigation',
        props: [
            'downloadQueueCount',
            'downloadOverlayShown'
        ],
        data: function() {
            return {
                userData: {}
            }
        },
        mounted: function () {
            let userSettings = new UserSettings();

            if(!userSettings.get("connectProfile")) {
                this.$router.replace({ name: 'Login' });
            }

            this.$data.userData = userSettings.get("connectProfile");

            this.$root.$on("LoadIntoProfile", (data) => {
                this.$data.userData = data;
            });
        },
        methods: {
            navigateBack: function() {
                this.$router.back();
            },
            showDownloadOverlay: function() {
                this.$root.$emit('toggleDownloadOverlay');
            },
            openExternal: function(url) {
                shell.openExternal(url);
            },
            userLogout: function() {
                let userSettings = new UserSettings();

                userSettings.set("connectProfile", null);
                userSettings.set("connectToken", null);
                window.location.reload();
            }
        }
    }
</script>

<style scoped lang="less">
    aside {
        background: #000;
        box-shadow: 0px 4px 12px rgba(0,0,0,0.6);
        display: grid;
        position: fixed;
        z-index: 1000;
        top: 0px;
        left: 0px;
        right: 0px;
        grid-template-columns: 1fr 1fr;

        & nav {
            display: flex;
            flex-direction: row;
            align-items: center;
            
            &.items-left { justify-content: flex-start; }
            &.items-right { justify-content: flex-end; }
            & .logo {
                width: 160px;
                padding: 15px;
                height: 60px;
                & img {
                    height: 100%;
                }
            }
            & .upload-button {
                align-items: center;
                justify-content: center;
                padding: 0px 15px;
            }
            & .item {
                min-width: 60px;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: transparent;
                border-bottom: 2px solid transparent;
                color :#fff;
                position: relative;
                transition: 0.2s ease opacity, 0.2s ease background;
    
                & .indicator {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 20px;
                    height: 20px;
                    font-size: 10px;
                    font-weight: bold;
                    background: rgb(226, 44, 120);
                    border-radius: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                }

                &:hover {
                    cursor: pointer;

                    & > .mdi {
                        opacity: 1;
                    }
                }
                &.router-link-active {
                    border-color: rgb(226, 44, 120);

                    & .mdi {
                        opacity: 1;
                    }
                }
    
                & > .mdi {
                    font-size: 22px;
                    opacity: 0.4;
                }
            }
            & .item-notifications {
                position: relative;

                & .notification-box {
                    width: 400px;
                    height: 500px;
                    position: absolute;
                    top: 70px;
                    right: 10px;
                    border-radius: 4px;
                    background: #000;
                    cursor: default;
                    box-shadow: 0px 4px 12px rgba(0,0,0,0.6);
                    display: none;
                    grid-template-rows: auto 1fr;

                    & > header {
                        display: grid;
                        grid-template-columns: 1fr auto;
                        padding: 10px 15px;
                        align-items: center;

                        & span {
                            font-size: 14px;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 0.25em;
                        }
                    }

                    & .notification-list {
                        overflow-y: scroll;
                        display: flex;
                        background: rgba(255,255,255,0.075);
                        flex-direction: column;

                        & .notification-item {
                            display: grid;
                            grid-template-columns: 32px 1fr;
                            grid-gap: 10px;
                            padding: 10px;
                            color: #fff;
                            text-decoration: none;
                            align-items: center;

                            & .notification-icon {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 32px;
                                height: 32px;
                            }
                            & .cover {
                                width: 32px;
                                height: 32px;
                                background-position: center;
                                background-size: cover;
                            }

                            & .notification-text {
                                font-size: 12px;
                                line-height: 1.5;
                            }

                            &:hover {
                                background: rgba(255,255,255,0.1);
                                cursor: pointer;
                            }
                        }
                    }

                    &:after {
                        bottom: 100%;
                        right: 12px;
                        border: solid transparent;
                        content: " ";
                        height: 0;
                        width: 0;
                        position: absolute;
                        pointer-events: none;
                        border-color: rgba(0, 0, 0, 0);
                        border-bottom-color: #000;
                        border-width: 8px;
                    }
                }
                &:focus-within {
                    outline: 0;

                    & .notification-box {
                        display: grid;
                    }
                    & > .mdi {
                        opacity: 1;
                    }
                }
            }
            & .item-user {
                position: relative;

                & .user-avatar {
                    width: 32px;
                    height: 32px;
                    background-position: center;
                    background-size: cover;
                    border-radius: 50px;
                }
                & .user-actions {
                    width: 300px;
                    position: absolute;
                    top: 70px;
                    right: 10px;
                    overflow: hidden;
                    border-radius: 4px;
                    background: #000;
                    box-shadow: 0px 4px 12px rgba(0,0,0,0.6);
                    display: none;

                    & .user-action-item {
                        color: #fff;
                        text-decoration: none;
                        display: grid;
                        grid-template-columns: 50px 1fr;

                        & .mdi {
                            width: 50px;
                            height: 50px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 22px;
                            opacity: 0.6;
                        }
                        & span {
                            align-self: center;
                        }
                        &:hover {
                            background: rgba(255,255,255,0.1);
                        }
                    }
                    & .user-action-spacer {
                        margin: 5px 15px;
                        height: 1px;
                        width: auto;
                        background: rgba(255,255,255,0.2);
                    }

                    &:after {
                        bottom: 100%;
                        right: 12px;
                        border: solid transparent;
                        content: " ";
                        height: 0;
                        width: 0;
                        position: absolute;
                        pointer-events: none;
                        border-color: rgba(0, 0, 0, 0);
                        border-bottom-color: #000;
                        border-width: 8px;
                    }
                }
                &:focus-within {
                    outline: 0;

                    & .user-actions {
                        display: grid;
                    }
                }
            }
        }
    }
</style>