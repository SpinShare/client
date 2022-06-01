<template>
    <SongRow>
        <template v-slot:controls>
            <SButton
                :disabled="hotWeekSongsOffset === 0"
                icon="chevron-left"
                :label="$t('songrow.navigation.previous')"
                @click="hotWeekPrevious"
            />
            <SButton
                :disabled="hotWeekSongs.length < 11"
                icon="chevron-right"
                :label="$t('songrow.navigation.next')"
                @click="hotWeekNext"
            />
        </template>
        <template v-slot:song-list>
            <SongItemPlaceholder
                v-if="isHotWeekSongsLoading"
                v-for="n in 10"
                v-bind:key="n" />
            <SongItem
                v-if="!isHotWeekSongsLoading"
                v-for="song in hotWeekSongs"
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
                isHotWeekSongsLoading: true,
                hotWeekSongsOffset: 0,
                hotWeekSongs: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();
            
            ssapi.getHotThisWeekSongs(this.$data.hotWeekSongsOffset).then((data) => {
                this.$data.isHotWeekSongsLoading = false;
                this.$data.hotWeekSongs = data;
            });
        },
        components: {
            SongRow,
            SongItem,
            SongItemPlaceholder
        },
        methods: {
            hotWeekNext: function() {
                if(this.$data.hotWeekSongs.length > 9) {
                    this.$data.hotWeekSongsOffset++;
                    this.updateHotWeek();
                }
            },
            hotWeekPrevious: function() {
                if(this.$data.hotWeekSongsOffset > 0) {
                    this.$data.hotWeekSongsOffset--;
                    this.updateHotWeek();
                }
            },
            updateHotWeek: function() {
                let ssapi = new SSAPI();
                this.$data.isHotWeekSongsLoading = true;

                ssapi.getHotThisWeekSongs(this.$data.hotWeekSongsOffset).then((data) => {
                    this.$data.isHotWeekSongsLoading = false;
                    this.$data.hotWeekSongs = data;
                });
            }
        }
    }
</script>