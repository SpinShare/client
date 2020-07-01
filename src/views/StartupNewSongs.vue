<template>
    <SongRow
        :title="$t('startup.newsongs.header')">
        <template v-slot:controls>
            <div :class="'item ' + (newSongsOffset == 0 ? 'disabled' : '')" v-on:click="newPrevious()"><i class="mdi mdi-chevron-left"></i></div>
            <div :class="'item ' + (newSongs.length < 11 ? 'disabled' : '')" v-on:click="newNext()"><i class="mdi mdi-chevron-right"></i></div>
        </template>
        <template v-slot:song-list>
            <SongItemPlaceholder
                v-if="isNewSongsLoading"
                v-for="n in 12"
                v-bind:key="n" />
            <SongItem
                v-if="!isNewSongsLoading"
                v-for="song in newSongs"
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
                isNewSongsLoading: true,
                newSongsOffset: 0,
                newSongs: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();
            
            ssapi.getNewSongs(this.$data.newSongsOffset).then((data) => {
                this.$data.isNewSongsLoading = false;
                this.$data.newSongs = data;
            });
        },
        components: {
            SongRow,
            SongItem,
            SongItemPlaceholder
        },
        methods: {
            newNext: function() {
                if(this.$data.newSongs.length > 11) {
                    this.$data.newSongsOffset++;
                    this.updateNew();
                }
            },
            newPrevious: function() {
                if(this.$data.newSongsOffset > 0) {
                    this.$data.newSongsOffset--;
                    this.updateNew();
                }
            },
            updateNew: function() {
                let ssapi = new SSAPI();
                this.$data.isNewSongsLoading = true;

                ssapi.getNewSongs(this.$data.newSongsOffset).then((data) => {
                    this.$data.isNewSongsLoading = false;
                    this.$data.newSongs = data;
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