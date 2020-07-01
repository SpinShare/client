<template>
    <SongRow
        :title="$t('startup.hotsongs.header')">
        <template v-slot:controls>
            <div :class="'item ' + (hotSongsOffset == 0 ? 'disabled' : '')" v-on:click="hotPrevious()"><i class="mdi mdi-chevron-left"></i></div>
            <div :class="'item ' + (hotSongs.length < 11 ? 'disabled' : '')" v-on:click="hotNext()"><i class="mdi mdi-chevron-right"></i></div>
        </template>
        <template v-slot:song-list>
            <SongItemPlaceholder
                v-if="isHotSongsLoading"
                v-for="n in 12"
                v-bind:key="n" />
            <SongItem
                v-if="!isHotSongsLoading"
                v-for="song in hotSongs"
                v-bind:key="song.id"
                v-bind="song" />
        </template>
    </SongRow>
</template>

<script>
    import SSAPI from '@/modules/module.api.js';
    import SongRow from '@/components/Song/SongRow.vue';
    import SongItem from '@/components/Song/SongItem.vue';
    import SongItemPlaceholder from '@/components/Song/SongItemPlaceholder.vue';

    export default {
        name: 'Frontpage',
        data: function() {
            return {
                isHotSongsLoading: true,
                hotSongsOffset: 0,
                hotSongs: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();
            
            ssapi.getHotSongs(this.$data.hotSongsOffset).then((data) => {
                this.$data.isHotSongsLoading = false;
                this.$data.hotSongs = data;
            });
        },
        components: {
            SongRow,
            SongItem,
            SongItemPlaceholder
        },
        methods: {
            hotNext: function() {
                if(this.$data.hotSongs.length > 11) {
                    this.$data.hotSongsOffset++;
                    this.updateHot();
                }
            },
            hotPrevious: function() {
                if(this.$data.hotSongsOffset > 0) {
                    this.$data.hotSongsOffset--;
                    this.updateHot();
                }
            },
            updateHot: function() {
                let ssapi = new SSAPI();
                this.$data.isHotSongsLoading = true;

                ssapi.getHotSongs(this.$data.hotSongsOffset).then((data) => {
                    this.$data.isHotSongsLoading = false;
                    this.$data.hotSongs = data;
                });
            }
        }
    }
</script>

<style scoped lang="less">
</style>