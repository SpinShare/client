<template>
    <div class="frontpage">
        <!-- <Stream v-bind="streamStatus" /> -->

        <div class="staff-promos">
            <StaffPromoPlaceholder
                v-if="isPromoLoading"
                v-for="n in 2"
                v-bind:key="n" />
            <StaffPromo
                v-if="!isPromoLoading"
                v-for="staffPromo in staffPromos"
                v-bind:key="staffPromo.id"
                v-bind="staffPromo" />
        </div>

        <div class="social-buttons">
            <div v-on:click="OpenDiscord()" class="item item-discord"><i class="mdi mdi-discord"></i></div>
            <div v-on:click="OpenTwitter()" class="item item-twitter"><i class="mdi mdi-twitter"></i></div>
            <div v-on:click="OpenYouTube()" class="item item-youtube"><i class="mdi mdi-youtube"></i></div>
            <div v-on:click="OpenTwitch()" class="item item-twitch"><i class="mdi mdi-twitch"></i></div>
            <div v-on:click="OpenPatreon()" class="item item-patreon"><i class="mdi mdi-patreon"></i></div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    import SSAPI from '@/modules/module.api.js';
    import StaffPromo from '@/components/Startup/StaffPromo.vue';
    import StaffPromoPlaceholder from '@/components/Startup/StaffPromoPlaceholder.vue';
    import Stream from '@/components/Startup/Stream.vue';

    export default {
        name: 'StartupFrontpage',
        data: function() {
            return {
                isPromoLoading: true,
                staffPromos: [],
                streamStatus: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getPromos().then((data) => {
                this.$data.isPromoLoading = false;
                this.$data.staffPromos = data;
            });

            ssapi.getStreamStatus().then((data) => {
                // Gracefully fail if Twitch API is ratelimited
                this.$data.streamStatus = data;
            });
        },
        components: {
            StaffPromo,
            StaffPromoPlaceholder,
            Stream
        },
        methods: {
            OpenDiscord: function() {
                shell.openExternal("https://spinsha.re/discord");
            },
            OpenTwitter: function() {
                shell.openExternal("https://twitter.com/WeAreSpinShare");
            },
            OpenYouTube: function() {
                shell.openExternal("https://www.youtube.com/channel/UCh7ftpzIqlHw5p_-HXHwMBw");
            },
            OpenTwitch: function() {
                shell.openExternal("https://twitch.tv/SpinShare");
            },
            OpenPatreon: function() {
                shell.openExternal("https://patreon.com/spinshare");
            }
        }
    }
</script>

<style scoped lang="less">
    .staff-promos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 25px;
        width: 1114px;
        margin: 0 auto;

        &:empty {
            display: none;
        }
    }
    .social-buttons {
        display: grid;
        width: 650px;
        margin: 0 auto;
        margin-top: 25px;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 15px;

        & .item {
            height: 75px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
            background: rgba(255,255,255,0.2);
            border-radius: 6px;
            transition: 0.2s ease-in-out all;

            &.item-discord {
                background: linear-gradient(135deg, #99aab5, #7289da);
            }
            &.item-twitter {
                background: linear-gradient(135deg, #d0e6f7, #1da1f2);
            }
            &.item-youtube {
                background: linear-gradient(135deg, #ff0000, #c20000);
            }
            &.item-twitch {
                background: linear-gradient(135deg, #b9a3e3, #6441a5);
            }
            &.item-patreon {
                background: linear-gradient(135deg, #ff8575, #e75744);
            }

            &:hover {
                transform: scale(1.1);
            box-shadow: 0px 4px 16px rgba(0,0,0,0.4);
                cursor: pointer;
            }
        }
    }
</style>