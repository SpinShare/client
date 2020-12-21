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
                    <div :class="hasEasyDifficulty ? 'difficulty active' : 'difficulty'"><span>E</span></div>
                    <div :class="hasNormalDifficulty ? 'difficulty active' : 'difficulty'"><span>N</span></div>
                    <div :class="hasHardDifficulty ? 'difficulty active' : 'difficulty'"><span>H</span></div>
                    <div :class="hasExtremeDifficulty ? 'difficulty active' : 'difficulty'"><span>EX</span></div>
                    <div :class="hasXDDifficulty ? 'difficulty active' : 'difficulty'"><span>XD</span></div>
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
                    { icon: "earth", title: this.$t('contextmenu.openOnSpinShare'), method: () => { shell.openExternal("https://spinsha.re/song/" + this.$props.id); } },
                    { icon: "link", title: this.$t('contextmenu.copyLink'), method: () => { clipboard.writeText('https://spinsha.re/playlist/' + this.$props.id); } },
                    { icon: "download", title: this.$t('contextmenu.download'), method: () => { this.download(); } }
                ]});
        }
    }
}
</script>

<style scoped lang="less">
</style>
