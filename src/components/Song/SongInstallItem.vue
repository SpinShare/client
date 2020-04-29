<template>
    <div class="song-item" v-on:click="install()">
        <div class="song-cover">
            <div class="song-icon"><i class="mdi mdi-folder-music"></i></div>
        </div>
        <div class="song-metadata">
            <div class="song-title">{{ $t('library.installed.install.title') }}</div>
            <div class="song-artist">{{ $t('library.installed.install.text') }}</div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard } = remote;

    export default {
        name: 'SongInstallItem',
        data: function() {
            return {
            }
        },
        mounted: function() {
        },
        methods: {
            install: function(e) {
            }
        }
    }
</script>

<style scoped lang="less">
    .song-item {
        background: rgba(255,255,255,0.1);
        transition: 0.2s ease-in-out transform, 0.2s ease-in-out box-shadow;
        overflow: hidden;
        border-radius: 6px;

        & .song-cover {
            background: rgba(255,255,255,0.1);
            background-size: cover;
            width: 100%;
            padding-top: 100%;
            position: relative;
            background-position: center;

            & .song-icon {
                position: absolute;
                top: 0px;
                bottom: 0px;
                left: 0px;
                right: 0px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 32px;
            }
        }

        & .song-metadata {
            padding: 15px;

            & .song-title {
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
            }
            & .song-artist {
                margin-top: 5px;
                opacity: 0.6;
                overflow: hidden;
                white-space: nowrap;
            }
            & .song-difficulties {
                margin-top: 10px;
                height: 20px;
                display: flex;
    
                & img {
                    height: 18px;
                    margin-right: 10px;
                    opacity: 0.3;
    
                    &.active {
                        opacity: 1;
                    }
                }
            }
        }

        &:hover {
            transform: scale(1.1);
            cursor: pointer;
            box-shadow: 0px 4px 20px 5px rgba(0, 0, 0, 0.4);

            & .song-cover {
                & .song-charter {
                    opacity: 1;
                }
            }
        }
    }
</style>
