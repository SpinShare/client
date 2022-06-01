<template>
    <SongRow>
        <template v-slot:controls>
            <div :class="'button ' + (hotMonthSongsOffset === 0 ? 'button-disabled' : '')" v-on:click="hotMonthPrevious()"><i class="mdi mdi-chevron-left"></i> {{ $t('songrow.navigation.previous' )}}</div>
            <div :class="'button ' + (hotMonthSongs.length < 9 ? 'button-disabled' : '')" v-on:click="hotMonthNext()">{{ $t('songrow.navigation.next' )}} <i class="mdi mdi-chevron-right"></i></div>
        </template>
        <template v-slot:song-list>
            <SongItemPlaceholder
                v-if="isHotMonthSongsLoading"
                v-for="n in 10"
                v-bind:key="n" />
            <SongItem
                v-if="!isHotMonthSongsLoading"
                v-for="song in hotMonthSongs"
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
            isHotMonthSongsLoading: true,
            hotMonthSongsOffset: 0,
            hotMonthSongs: []
        }
    },
    mounted: function() {
        let ssapi = new SSAPI();

        ssapi.getHotThisMonthSongs(this.$data.hotMonthSongsOffset).then((data) => {
            this.$data.isHotMonthSongsLoading = false;
            this.$data.hotMonthSongs = data;
        });
    },
    components: {
        SongRow,
        SongItem,
        SongItemPlaceholder
    },
    methods: {
        hotMonthNext: function() {
            if(this.$data.hotMonthSongs.length > 9) {
                this.$data.hotMonthSongsOffset++;
                this.updateHotMonth();
            }
        },
        hotMonthPrevious: function() {
            if(this.$data.hotMonthSongsOffset > 0) {
                this.$data.hotMonthSongsOffset--;
                this.updateHotMonth();
            }
        },
        updateHotMonth: function() {
            let ssapi = new SSAPI();
            this.$data.isHotMonthSongsLoading = true;

            ssapi.getHotThisMonthSongs(this.$data.hotMonthSongsOffset).then((data) => {
                this.$data.isHotMonthSongsLoading = false;
                this.$data.hotMonthSongs = data;
            });
        }
    }
}
</script>

<style scoped lang="less">
.song-row {
    padding: 50px;
}
</style>