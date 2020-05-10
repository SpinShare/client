<template>
    <div class="stream" v-if="isLive">
        <div class="header">
            <div class="viewers"><i class="mdi mdi-eye-outline"></i> {{ viewers }}</div>
            <div class="title">{{ title }}</div>
        </div>
        <div class="video-container">
            <iframe src="https://player.twitch.tv/?channel=spinshare&enableExtensions=true&muted=true&player=popout&volume=1"></iframe>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    export default {
        name: 'Stream',
        props: [
            'title',
            'viewers',
            'isLive'
        ]
    }
</script>

<style scoped lang="less">
    .stream {
        margin-top: 50px;
        
        & .header {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-gap: 15px;
            margin-bottom: 15px;

            & .viewers {
                background: #ff294d;
                color: #fff;
                padding: 5px;
                font-size: 12px;
                font-weight: bold;
                border-radius: 20px;
            }
            & .title {
                letter-spacing: 0.25em;
                font-size: 14px;
                font-weight: bold;
                text-transform: uppercase;
                align-self: center;
            }
        }
        & .video-container {
            position: relative;
            width: 100%;
            padding-top: 50%;

            & iframe {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: 100%;
                border: 0px;
            }
        }
    }
</style>
