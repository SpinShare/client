<template>
    <SongRow>
        <template v-slot:controls>
            <SButton
                :disabled="updatedSongsOffset === 0"
                icon="chevron-left"
                :label="$t('songrow.navigation.previous')"
                @click="updatedPrevious"
            />
            <SButton
                :disabled="updatedSongs.length < 11"
                icon="chevron-right"
                :label="$t('songrow.navigation.next')"
                @click="updatedNext"
            />
        </template>
        <template v-slot:song-list>
            <SongItemPlaceholder
                v-if="isUpdatedSongsLoading"
                v-for="n in 10"
                v-bind:key="n" />
            <SongItem
                v-if="!isUpdatedSongsLoading"
                v-for="song in updatedSongs"
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
            isUpdatedSongsLoading: true,
            updatedSongsOffset: 0,
            updatedSongs: []
        }
    },
    mounted: function() {
        let ssapi = new SSAPI();

        ssapi.getUpdatedSongs(this.$data.updatedSongsOffset).then((data) => {
            this.$data.isUpdatedSongsLoading = false;
            this.$data.updatedSongs = data;
        });
    },
    components: {
        SongRow,
        SongItem,
        SongItemPlaceholder
    },
    methods: {
        updatedNext: function() {
            if(this.$data.updatedSongs.length > 9) {
                this.$data.updatedSongsOffset++;
                this.updateUpdated();
            }
        },
        updatedPrevious: function() {
            if(this.$data.updatedSongsOffset > 0) {
                this.$data.updatedSongsOffset--;
                this.updateUpdated();
            }
        },
        updateUpdated: function() {
            let ssapi = new SSAPI();
            this.$data.isUpdatedSongsLoading = true;

            ssapi.getUpdatedSongs(this.$data.updatedSongsOffset).then((data) => {
                this.$data.isUpdatedSongsLoading = false;
                this.$data.updatedSongs = data;
            });
        }
    }
}
</script>