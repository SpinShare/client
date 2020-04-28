<template>
    <SongRow
        :title="$t('startup.popularsongs.header')">
        <template v-slot:controls>
            <div :class="'item ' + (popularSongsOffset == 0 ? 'disabled' : '')" v-on:click="popularPrevious()"><i class="mdi mdi-chevron-left"></i></div>
            <div :class="'item ' + (popularSongs.length < 11 ? 'disabled' : '')" v-on:click="popularNext()"><i class="mdi mdi-chevron-right"></i></div>
        </template>
        <template v-slot:song-list>
            <SongItemPlaceholder
                v-if="isPopularSongsLoading"
                v-for="n in 12"
                v-bind:key="n" />
            <SongItem
                v-if="!isPopularSongsLoading"
                v-for="song in popularSongs"
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
        name: 'Startup',
        data: function() {
            return {
                isPopularSongsLoading: true,
                popularSongsOffset: 0,
                popularSongs: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI(process.env.NODE_ENV === 'development');
            
            ssapi.getPopularSongs(this.$data.popularSongsOffset).then((data) => {
                this.$data.isPopularSongsLoading = false;
                this.$data.popularSongs = data;
            });
        },
        components: {
            SongRow,
            SongItem,
            SongItemPlaceholder
        },
        methods: {
            popularNext: function() {
                if(this.$data.popularSongs.length > 11) {
                    this.$data.popularSongsOffset++;
                    this.updatePopular();
                }
            },
            popularPrevious: function() {
                if(this.$data.popularSongsOffset > 0) {
                    this.$data.popularSongsOffset--;
                    this.updatePopular();
                }
            },
            updatePopular: function() {
                let ssapi = new SSAPI(process.env.NODE_ENV === 'development');
                this.$data.isPopularSongsLoading = true;

                ssapi.getPopularSongs(this.$data.popularSongsOffset).then((data) => {
                    this.$data.isPopularSongsLoading = false;
                    this.$data.popularSongs = data;
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .song-row {
        margin-top: 25px;
    }
</style>