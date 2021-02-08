<template>
    <SongRow>
        <template v-slot:controls>
            <div :class="'button ' + (offset == 0 ? 'button-disabled' : '')" v-on:click="newPrevious()"><i class="mdi mdi-chevron-left"></i> {{ $t('songrow.navigation.previous' )}}</div>
            <div :class="'button ' + (songs.length < 9 ? 'button-disabled' : '')" v-on:click="newNext()">{{ $t('songrow.navigation.next' )}} <i class="mdi mdi-chevron-right"></i></div>
        </template>
        <template v-slot:song-list>
            <SongItemPlaceholder
                v-if="isLoading"
                v-for="n in 10"
                v-bind:key="n" />
            <SongItem
                v-if="!isLoading"
                v-for="song in songs"
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
        name: 'StartupHotThisMonth',
        data: function() {
            return {
                isLoading: true,
                offset: 0,
                songs: []
            }
        },
        mounted: function() {
            this.loadSongs();
        },
        components: {
            SongRow,
            SongItem,
            SongItemPlaceholder
        },
        methods: {
            newNext: function() {
                if(this.$data.songs.length > 9) {
                    this.$router.push({ name: 'StartupHotThisMonth', params: { offset: (this.$data.offset + 1) } });
                    this.loadSongs();
                }
            },
            newPrevious: function() {
                if(this.$data.offset > 0) {
                    this.$router.push({ name: 'StartupHotThisMonth', params: { offset: (this.$data.offset - 1) } });
                    this.loadSongs();
                }
            },
            loadSongs: function() {   
                let ssapi = new SSAPI(); 
                this.$data.isLoading = true;

                if(this.$route.params.offset != undefined) {
                    this.$data.offset = this.$route.params.offset;
                }

                ssapi.getHotThisMonthSongs(this.$data.offset).then((data) => {
                    this.$data.isLoading = false;
                    this.$data.songs = data;
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