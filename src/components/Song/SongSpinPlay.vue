<template>
    <div class="spinplay">
        <div v-on:click="OpenVideo()" class="thumbnail" :style="'background-image: url(' + videoThumbnail + ');'"></div>
        <div class="metadata">
            <div class="avatar" :style="'background-image: url(' + user.coverReference + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"></div>
            <div class="username">{{ user.username }}</div>
            <div class="actions">
            </div>
        </div>
    </div>
</template>

<script>
    const { shell } = require('@electron/remote');

    export default {
        name: 'SongSpinPlay',
        props: [
            'id',
            'user',
            'videoUrl',
            'videoThumbnail',
            'submitDate'
        ],
        mounted: function() {
        },
        methods: {
            OpenVideo: function() {
                shell.openExternal(this.$props.videoUrl);
            }
        }
    }
</script>

<style scoped lang="less">
    .spinplay {
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
        overflow: hidden;
        color: #fff;
        text-decoration: none;

        & .thumbnail {
            width: 100%;
            display: block;
            padding-top: 56.25%;
            background: rgba(255,255,255,0.1);
            background-position: center;
            background-size: cover;
            transition: 0.2s ease-in-out opacity;
            cursor: pointer;

            &:hover {
                opacity: 0.6;
            }
        }
        & .metadata {
            padding: 15px;
            display: grid;
            grid-gap: 15px;
            align-items: center;
            grid-template-columns: auto 1fr auto;

            & .avatar {
                width: 32px;
                height: 32px;
                background: rgba(255,255,255,0.1);
                background-position: center;
                background-size: cover;
                border-radius: 40px;
            }
            & .actions {
                .action {
                    color: #fff;
                    text-decoration: none;
                    font-size: 18px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
                    border-radius: 4px;
                    padding: 5px 15px;
                    transition: 0.2s ease-in-out opacity;

                    &:hover {
                        opacity: 0.6;
                    }
                }
            }
        }
    }
</style>
