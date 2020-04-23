<template>
    <div class="song-item-loading">
        <div class="song-cover"></div>
        <div class="song-metadata">
            <div class="song-title">&nbsp;</div>
            <div class="song-artist">&nbsp;</div>
            <div class="song-difficulties">
            </div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    export default {
        name: 'SongItemPlaceholder',
    }
</script>

<style scoped lang="less">
    .song-item-loading {
        overflow: hidden;
        border-radius: 6px;
        background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.1));
        animation-name: songLoadingShimmer;
        animation-fill-mode: forwards;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-duration: 2s;

        & .song-cover {
            width: 100%;
            padding-top: 100%;
            opacity: 0;
            position: relative;
            background-position: center;
        }

        & .song-metadata {
            padding: 15px;

            & .song-artist {
                margin-top: 5px;
            }
            & .song-difficulties {
                margin-top: 10px;
                height: 20px;
                display: flex;
            }
        }
    }
</style>
