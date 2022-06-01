<template>
    <div
        :class="'song-item-local ' + (isSpinShare ? '' : 'song-item-onlylocal')"
        v-on:contextmenu="showContextMenu($event)"
        v-on:click="openInClient()"
        v-tooltip="'Charted by' + detail.charter ? detail.charter : 'Unknown'"
    >
        <img
            v-observe-visibility="visibilityChanged"
            :src="src"
        />
        <div class="meta">
            <h1>{{ detail.title ? detail.title : "Untitled" }}</h1>
            <h2>{{ detail.artist ? detail.artist : "Unknown" }}</h2>
        </div>
    </div>
</template>

<script>
    import path from 'path';
    const { shell } = require('@electron/remote');

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
                src: "none;"
            }
        },
        computed: {
            imageUrl() {
                return this.$data.src
            }
        },
        methods: {
            showContextMenu: function(e) {
                let items = [];
                
                if(this.isSpinShare) {
                    items.push({ icon: "eye", title: this.$t('contextmenu.open'), method: () => { this.openInClient(); } });
                    items.push({ icon: "earth", title: this.$t('contextmenu.openOnSpinShare'), method: () => { this.openOnSpinShare(); } });
                }
                
                items.push({ icon: "folder-outline", title: this.$t('contextmenu.openInExplorer'), method: () => { this.openInExplorer(); } });
                items.push({ icon: "delete", title: this.$t('contextmenu.delete'), method: () => { this.$parent.$parent.$emit('delete', this.$props.file); } });
                
                this.$root.$emit('showContextMenu', {
                    x: e.pageX,
                    y: e.pageY,
                    items: items
                });
            },
            openInClient: function() {
                if(this.isSpinShare) {
                    if(this.isSpinShare.includes("spinshare_")) {
                        this.$router.push({ name: 'SongDetailReviews', params: { id: this.isSpinShare } });
                    }
                }
            },
            openOnSpinShare: function() {
                if(this.isSpinShare) {
                    if(this.isSpinShare.includes("spinshare_")) {
                        shell.openExternal("https://spinsha.re/song/" + this.isSpinShare);
                    }
                }
            },
            openInExplorer: function() {
                shell.showItemInFolder(path.normalize(this.file));
            },
            visibilityChanged (isVisible, entry) {
                if (isVisible) {
                    this.src = this.$props.cover;
                } 
                //url(" + require('@/assets/img/defaultAlbumArt.jpg') + ");
                else {
                    this.src = "none;";
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .song-item-local {
        background: rgba(255,255,255,0.07);
        padding: 15px;
        overflow: hidden;
        border-radius: 4px;
        transition: 0.2s ease-in-out all;
        display: grid;
        grid-gap: 15px;
        grid-template-columns: 64px 1fr;

        & img {
            width: 64px;
            height: 64px;
            border-radius: 4px;
        }

        & .meta {
            & h1 {
                font-size: 16px;
                font-weight: normal;
                margin: 0;
            }

            & h2 {
                margin-top: 3px;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: normal;
                color: rgba(255, 255, 255, 0.4);
            }

            & .difficulties {
                display: flex;
                grid-gap: 5px;

                & > div {
                    padding: 3px 7px;
                    background: rgba(255, 255, 255, 0.07);
                    border-radius: 2px;
                    font-size: 10px;

                    & span:nth-child(1) {
                        font-weight: bold;
                    }

                    & span:nth-child(2) {
                        margin-left: 5px;
                    }

                    &:not(.active) {
                        opacity: 0.4;
                        cursor: not-allowed;
                    }
                }
            }
        }

        &:not(.song-item-onlylocal):hover {
            background: rgba(255,255,255,0.14);
            cursor: pointer;
        }
        &.song-item-onlylocal {
            opacity: 0.6;
        }
    }
</style>
