<template>
    <SongRow>
        <template v-slot:controls>
            <SButton
                :disabled="hotMonthSongsOffset === 0"
                icon="chevron-left"
                :label="$t('songrow.navigation.previous')"
                @click="hotMonthPrevious"
            />
            <SButton
                :disabled="hotMonthSongs.length < 11"
                icon="chevron-right"
                :label="$t('songrow.navigation.next')"
                @click="hotMonthNext"
            />
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