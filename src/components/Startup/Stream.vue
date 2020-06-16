<template>
    <div class="stream" v-if="isLive">
        <div class="video-container">
            <iframe src="https://player.twitch.tv/?channel=spinshare&enableExtensions=true&muted=true&volume=1&parent=localhost"></iframe>
        </div>
    </div>
</template>

<script>
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
        width: 720px;
        margin: 0 auto;
        margin-bottom: 50px;
        
        & .video-container {
            position: relative;
            width: 100%;
            padding-top: 56.25%;

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
