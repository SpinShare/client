<template>
    <div class="song-item-loading">
        <div class="song-cover"></div>
        <div class="song-metadata">
            <div class="song-title">&nbsp;</div>
            <div class="song-artist">&nbsp;</div>
            <div class="song-difficulties">
                <img src="@/assets/img/difficultyEasy.svg" />
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

            & .song-title {
                height: 19px;
            }
            & .song-artist {
                margin-top: 5px;
                height: 19px;
            }
            & .song-difficulties {
                margin-top: 10px;
                height: 20px;
                display: flex;
    
                & img {
                    height: 18px;
                    margin-right: 10px;
                    opacity: 0;
                }
            }
        }
    }
    @keyframes songLoadingShimmer {
        from {
            background-position: 0px 0px;
        }
        to {
            background-position: 173px 0px;
        }
    }
</style>
