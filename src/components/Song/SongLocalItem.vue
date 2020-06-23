<template>
    <div :class="'song-item-local ' + (isSpinShare ? '' : 'song-item-onlylocal')" v-on:contextmenu="showContextMenu($event)" v-on:click="openOnSpinShare()">
        <div class="song-cover" v-bind:style="'background-image: '+ backgroundImage +' , url(' + require('@/assets/img/defaultAlbumArt.jpg') + ');'" v-observe-visibility="visibilityChanged">
            <div class="song-charter-info">
                <div class="song-charter"><i class="mdi mdi-account-circle"></i><span>{{ detail.charter ? detail.charter : "Unknown" }}</span></div>
            </div>
        </div>
        <div class="song-metadata">
            <div class="song-title">{{ detail.title ? detail.title : "Untitled" }}</div>
            <div class="song-artist">{{ detail.artist ? detail.artist : "Unknown" }}</div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    import path from 'path';
    const { shell } = remote;

    export default {
        name: 'SongLocalItem',
        props: [
            'id',
            'file',
            'detail',
            'cover',
            'isSpinShare'
        ],
        data: function() {
            return {
                isContextMenuActive: false,
                backgroundImage: "none;"
            }
        },
        computed: {
            imageUrl() {
                return this.$data.backgroundImage
            }
        },
        mounted: function() {
        },
        methods: {
            showContextMenu: function(e) {
                let items = [];
                
                if(this.isSpinShare) {
                    items.push({ icon: "open-in-app", title: this.$t('contextmenu.openOnSpinShare'), method: () => { this.openOnSpinShare(); } });
                }
                
                items.push({ icon: "folder-outline", title: this.$t('contextmenu.openInExplorer'), method: () => { this.openInExplorer(); } });
                items.push({ icon: "delete", title: this.$t('contextmenu.delete'), method: () => { this.$parent.$parent.$emit('delete', this.$props.file); } });
                
                this.$root.$emit('showContextMenu', {
                    x: e.pageX,
                    y: e.pageY,
                    items: items
                });
            },
            openOnSpinShare: function() {
                if(this.isSpinShare) {
                    if(this.isSpinShare.includes("spinshare_")) {
                        this.$router.push({ name: 'SongDetail', params: { id: this.isSpinShare } });
                    }
                }
            },
            openInExplorer: function() {
                shell.showItemInFolder(path.normalize(this.file));
            },
            visibilityChanged (isVisible, entry) {
                if (isVisible) {
                    this.$data.backgroundImage = "url(" + this.$props.cover + ")"
                } 
                //url(" + require('@/assets/img/defaultAlbumArt.jpg') + ");
                else {
                    this.$data.backgroundImage = "none;"
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .song-item-local {
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
        }

        &:not(.song-item-onlylocal):hover {
            transform: scale(1.1);
            cursor: pointer;
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
