<template>
    <div class="song-item" v-on:auxclick="shortDownload($event)" v-on:contextmenu="showContextMenu($event)">
        <router-link :to="{ name: 'SongDetail', params: { id: id } }">
            <div class="song-cover" :style="'background-image: url(' + cover + '), url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'">
                <div class="song-charter-info">
                    <div class="song-charter"><i class="mdi mdi-account-circle"></i><span>{{ charter }}</span></div>
                </div>
            </div>
            <div class="song-metadata">
                <div class="song-title">{{ title }}</div>
                <div class="song-artist">{{ artist }}</div>
                <div class="song-difficulties">
                    <div v-if="hasEasyDifficulty" class="difficulty"><span>E</span> {{ easyDifficulty ? easyDifficulty : 0 }}</div>
                    <div v-if="hasNormalDifficulty" class="difficulty"><span>N</span> {{ normalDifficulty ? normalDifficulty : 0 }}</div>
                    <div v-if="hasHardDifficulty" class="difficulty"><span>H</span> {{ hardDifficulty ? hardDifficulty : 0 }}</div>
                    <div v-if="hasExtremeDifficulty" class="difficulty"><span>EX</span> {{ expertDifficulty ? expertDifficulty : 0 }}</div>
                    <div v-if="hasXDDifficulty" class="difficulty"><span>XD</span> {{ XDDifficulty ? XDDifficulty : 0 }}</div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard, shell } = remote;

    export default {
        name: 'SongItem',
        props: [
            'id',
            'cover',
            'title',
            'subtitle',
            'artist',
            'charter',
            'hasEasyDifficulty',
            'hasNormalDifficulty',
            'hasHardDifficulty',
            'hasExtremeDifficulty',
            'hasXDDifficulty',
            'easyDifficulty',
            'normalDifficulty',
            'hardDifficulty',
            'expertDifficulty',
            'XDDifficulty',
            'zip'
        ],
        data: function() {
            return {
                isContextMenuActive: false
            }
        },
        mounted: function() {
        },
        methods: {
            showContextMenu: function(e) {
                if(e != undefined) {
                    e.preventDefault();
                }

                this.$root.$emit('showContextMenu', {
                    x: e.pageX,
                    y: e.pageY,
                    items: [
                        { icon: "eye", title: this.$t('contextmenu.open'), method: () => { this.$router.push({ name: 'SongDetail', params: { id: this.$props.id } }); } },
                        { icon: "earth", title: this.$t('contextmenu.openOnSpinShare'), method: () => { shell.openExternal("https://spinsha.re/report/song/" + this.$props.id); } },
                        { icon: "link", title: this.$t('contextmenu.copyLink'), method: () => { clipboard.writeText('https://spinsha.re/song/' + this.$props.id); } },
                        { icon: "download", title: this.$t('contextmenu.download'), method: () => { this.download(); } }
                    ]});
            },
            shortDownload: function(e) {
                if(e != undefined) {
                    e.preventDefault();
                }

                if(e.which == 2) {
                    this.download(e);
                }
            },
            download: function(e) {
                if(e != undefined) {
                    e.preventDefault();
                }

                this.$root.$emit('download', {id: this.$props.id, cover: this.$props.cover, title: this.$props.title, artist: this.$props.artist, downloadPath: this.$props.zip});
            }
        }
    }
</script>

<style scoped lang="less">
    .song-item {
        background: rgba(255,255,255,0.1);
        transition: 0.2s ease-in-out transform, 0.2s ease-in-out background, 0.2s ease-in-out box-shadow;
        overflow: hidden;
        border-radius: 6px;

        & .song-cover {
            background: rgba(255,255,255,0.1);
            background-size: cover;
            width: 100%;
            padding-top: 100%;
            position: relative;
            background-position: center;

            & .song-charter {
                position: absolute;
                color: #fff;
                text-decoration: none;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                background: linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.8));
                opacity: 0;
                padding: 15px;
                overflow: hidden;
                display: grid;
                transition: 0.2s ease-in-out opacity;
                grid-template-columns: auto 1fr;
                grid-gap: 10px;
                align-items: flex-end;

                & .song-charter-info {
                    display: grid;
                    align-items: center;

                    & .mdi {
                        font-size: 18px;
                    }
                    & span {
                        font-size: 12px;
                        color: transparent;
                        transition: 0.2s ease-in-out color;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }
        }

        & .song-metadata {
            padding: 15px;
            color: #fff;
            text-decoration: none;

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

                & .difficulty {
                    background: #fff;
                    color: #000;
                    border-radius: 4px;
                    padding: 3px 5px;
                    margin-right: 4px;
                    font-size: 10px;

                    & span {
                        // padding-right: 3px;
                        font-weight: bold;
                    }
                }
            }
        }

        &:hover {
            cursor: pointer;
            background: rgba(255,255,255,0.2);
            box-shadow: 0px 4px 20px 5px rgba(0, 0, 0, 0.4);

            & .song-cover {
                & .song-charter {
                    opacity: 1;
                }
            }
        }
    }
</style>
