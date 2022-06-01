<template>
    <div
        class="song-item"
        v-on:auxclick="shortDownload($event)"
        v-on:contextmenu="showContextMenu($event)"
        v-tooltip="'Charted by ' + charter"
    >
        <router-link :to="{ name: 'SongDetail', params: { id: id } }">
            <img
                :src="cover"
                v-observe-visibility="visibilityChanged"
                @error="setDefaultCover"
                :alt="title + ' Cover'"
            />
            <div class="meta">
                <h1>{{ title }}</h1>
                <h2>{{ artist }}</h2>
                <div class="difficulties">
                    <div :class="{'active': hasEasyDifficulty}">
                        <span>E</span>
                        <span v-if="hasEasyDifficulty">{{ easyDifficulty ? easyDifficulty : 0 }}</span>
                    </div>
                    <div :class="{'active': hasNormalDifficulty}">
                        <span>N</span>
                        <span v-if="hasNormalDifficulty">{{ normalDifficulty ? normalDifficulty : 0 }}</span>
                    </div>
                    <div :class="{'active': hasHardDifficulty}">
                        <span>H</span>
                        <span v-if="hasHardDifficulty">{{ hardDifficulty ? hardDifficulty : 0 }}</span>
                    </div>
                    <div :class="{'active': hasExtremeDifficulty}">
                        <span>EX</span>
                        <span v-if="hasExtremeDifficulty">{{ expertDifficulty ? expertDifficulty : 0 }}</span>
                    </div>
                    <div :class="{'active': hasXDDifficulty}">
                        <span>XD</span>
                        <span v-if="hasXDDifficulty">{{ XDDifficulty ? XDDifficulty : 0 }}</span>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
    const { clipboard, shell } = require('@electron/remote');

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
            setDefaultCover: function(e) {
                e.target.src = require('@/assets/img/defaultAlbumArt.jpg');
            },
            showContextMenu: function(e) {
                if(e !== undefined) {
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
            },
            visibilityChanged (isVisible, entry) {
                if (isVisible) {
                    this.src = this.$props.cover;
                }
                else {
                    this.src = "none;";
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.song-item {
    background: rgba(255,255,255,0.07);
    padding: 15px;
    overflow: hidden;
    border-radius: 4px;
    transition: 0.2s ease-in-out all;

    & a {
        display: grid;
        grid-gap: 15px;
        grid-template-columns: 64px 1fr;
        color: inherit;
        text-decoration: none;

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
                    }
                }
            }
        }
    }

    &:hover {
        background: rgba(255,255,255,0.14);
        cursor: pointer;
    }
}
</style>