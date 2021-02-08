<template>
    <div :class="'song-item-local ' + (isSpinShare ? '' : 'song-item-onlylocal')" v-on:contextmenu="showContextMenu($event)" v-on:click="openInClient()">
        <div class="song-cover" v-bind:style="'background-image: ' + backgroundImage + ' , url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'" v-observe-visibility="visibilityChanged">
            <div class="song-charter-info">
                <div class="song-charter"><i class="mdi mdi-account-circle"></i><span>{{ charter ? charter : "Unknown" }}</span></div>
            </div>
        </div>
        <div class="song-metadata">
            <div class="song-title">{{ title ? title : "Untitled" }}</div>
            <div class="song-artist">{{ artist ? artist : "Unknown" }}</div>
                <div class="song-difficulties">
                    <div v-if="hasEasyDifficulty" class="difficulty"><span>E</span> {{ easyDifficulty ? easyDifficulty : 0 }}</div>
                    <div v-if="hasNormalDifficulty" class="difficulty"><span>N</span> {{ normalDifficulty ? normalDifficulty : 0 }}</div>
                    <div v-if="hasHardDifficulty" class="difficulty"><span>H</span> {{ hardDifficulty ? hardDifficulty : 0 }}</div>
                    <div v-if="hasExpertDifficulty" class="difficulty"><span>EX</span> {{ expertDifficulty ? expertDifficulty : 0 }}</div>
                    <div v-if="hasXDDifficulty" class="difficulty"><span>XD</span> {{ XDDifficulty ? XDDifficulty : 0 }}</div>
                </div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    import fs from 'fs';
    import path from 'path';
    const { shell } = remote;
    import SSAPI from '@/modules/module.api.js';

    export default {
        name: 'SongLocalItem',
        props: [
            'title',
            'subtitle',
            'artist',
            'charter',
            'hasEasyDifficulty',
            'hasNormalDifficulty',
            'hasHardDifficulty',
            'hasExpertDifficulty',
            'hasXDDifficulty',
            'easyDifficulty',
            'normalDifficulty',
            'hardDifficulty',
            'expertDifficulty',
            'XDDifficulty',
            'paths'
        ],
        data: function() {
            return {
                isContextMenuActive: false,
                backgroundImage: "none;",
                baseFileName: "",
                isSpinShare: false,
                spinShareID: null,
            }
        },
        computed: {
            imageUrl() {
                return this.$data.backgroundImage;
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            this.$data.baseFileName = path.basename(this.$props.paths.srtb).replace(".srtb", "");
            ssapi.getSongDetail(this.$data.baseFileName).then(data => {
                if(data.status == 200) {
                    this.$data.isSpinShare = true;
                    this.$data.spinShareID = data.data.id;
                }
            });
        },
        methods: {
            showContextMenu: function(e) {
                let items = [];
                
                if(this.isSpinShare) {
                    items.push({ icon: "eye", title: this.$t('contextmenu.open'), method: () => { this.openInClient(); } });
                    items.push({ icon: "earth", title: this.$t('contextmenu.openOnSpinShare'), method: () => { this.openOnSpinShare(); } });
                }
                
                items.push({ icon: "folder-outline", title: this.$t('contextmenu.openInExplorer'), method: () => { this.openInExplorer(); } });
                items.push({ icon: "delete", title: this.$t('contextmenu.delete'), method: () => { this.$parent.$parent.$emit('delete', this.$props.paths.srtb); } });
                
                this.$root.$emit('showContextMenu', {
                    x: e.pageX,
                    y: e.pageY,
                    items: items
                });
            },
            openInClient: function() {
                if(this.isSpinShare) {
                    if(this.isSpinShare) {
                        this.$router.push({ name: 'SongDetailReviews', params: { id: this.spinShareID } });
                    }
                }
            },
            openOnSpinShare: function() {
                if(this.isSpinShare) {
                    if(this.isSpinShare) {
                        shell.openExternal("https://spinsha.re/song/" + this.spinShareID);
                    }
                }
            },
            openInExplorer: function() {
                shell.showItemInFolder(path.normalize(this.file));
            },
            visibilityChanged (isVisible, entry) {
                if (isVisible) {
                    this.$data.backgroundImage = "url(" + this.$props.paths.coverBase64 + ")";
                } else {
                    this.$data.backgroundImage = "none;";
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .song-item-local {
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

        &:not(.song-item-onlylocal):hover {
            cursor: pointer;
            background: rgba(255,255,255,0.2);
            box-shadow: 0px 4px 20px 5px rgba(0, 0, 0, 0.4);

            & .song-cover {
                & .song-charter {
                    opacity: 1;
                }
            }
        }
        &.song-item-onlylocal {
            opacity: 0.6;
        }
    }
</style>
