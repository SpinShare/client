<template>
    <section class="section-startup">
        <div class="staff-promos">
            <StaffPromoPlaceholder
                v-if="isPromoLoading"
                v-for="n in 2"
                v-bind:key="n" />
            <StaffPromo
                v-if="!isPromoLoading"
                v-for="staffPromo in staffPromos"
                v-bind:key="staffPromo.id"
                v-bind="staffPromo" />
        </div>

        <SongRow
            title="New Songs">
            <template v-slot:controls>
                <div :class="'item ' + (newSongsOffset == 0 ? 'disabled' : '')" v-on:click="newPrevious()"><i class="mdi mdi-chevron-left"></i></div>
                <div :class="'item ' + (newSongs.length < 5 ? 'disabled' : '')" v-on:click="newNext()"><i class="mdi mdi-chevron-right"></i></div>
            </template>
            <template v-slot:song-list>
                <SongItemPlaceholder
                    v-if="isNewSongsLoading"
                    v-for="n in 6"
                    v-bind:key="n" />
                <SongItem
                    v-if="!isNewSongsLoading"
                    v-for="song in newSongs"
                    v-bind:key="song.id"
                    v-bind="song" />
            </template>
        </SongRow>

        <SongRow
            title="Popular Songs">
            <template v-slot:controls>
                <div :class="'item ' + (popularSongsOffset == 0 ? 'disabled' : '')" v-on:click="popularPrevious()"><i class="mdi mdi-chevron-left"></i></div>
                <div :class="'item ' + (popularSongs.length < 5 ? 'disabled' : '')" v-on:click="popularNext()"><i class="mdi mdi-chevron-right"></i></div>
            </template>
            <template v-slot:song-list>
                <SongItemPlaceholder
                    v-if="isPopularSongsLoading"
                    v-for="n in 6"
                    v-bind:key="n" />
                <SongItem
                    v-if="!isPopularSongsLoading"
                    v-for="song in popularSongs"
                    v-bind:key="song.id"
                    v-bind="song" />
            </template>
        </SongRow>
    </section>
</template>

<script>
    import SSAPI from '@/modules/module.api.js';
    import StaffPromo from '@/components/Startup/StaffPromo.vue';
    import StaffPromoPlaceholder from '@/components/Startup/StaffPromoPlaceholder.vue';
    import SongRow from '@/components/Song/SongRow.vue';
    import SongItem from '@/components/Song/SongItem.vue';
    import SongItemPlaceholder from '@/components/Song/SongItemPlaceholder.vue';

    export default {
        name: 'Startup',
        data: function() {
            return {
                isPromoLoading: true,
                staffPromos: [],
                isNewSongsLoading: true,
                newSongsOffset: 0,
                newSongs: [],
                isPopularSongsLoading: true,
                popularSongsOffset: 0,
                popularSongs: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI(process.env.NODE_ENV === 'development');

            ssapi.getPromos().then((data) => {
                this.$data.isPromoLoading = false;
                this.$data.staffPromos = data;
            });
            
            ssapi.getNewSongs(this.$data.newSongsOffset).then((data) => {
                this.$data.isNewSongsLoading = false;
                this.$data.newSongs = data;
            });
            
            ssapi.getPopularSongs(this.$data.popularSongsOffset).then((data) => {
                this.$data.isPopularSongsLoading = false;
                this.$data.popularSongs = data;
            });
        },
        components: {
            StaffPromo,
            StaffPromoPlaceholder,
            SongRow,
            SongItem,
            SongItemPlaceholder
        },
        methods: {
            newNext: function() {
                if(this.$data.newSongs.length > 5) {
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
            popularNext: function() {
                if(this.$data.popularSongs.length > 5) {
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
            updateNew: function() {
                let ssapi = new SSAPI(process.env.NODE_ENV === 'development');
                this.$data.isNewSongsLoading = true;

                ssapi.getNewSongs(this.$data.newSongsOffset).then((data) => {
                    this.$data.isNewSongsLoading = false;
                    this.$data.newSongs = data;
                });
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
    section {
        padding: 50px;

        & .staff-promos {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 25px;
            width: 1114px;
            margin: 0 auto;

            &:empty {
                display: none;
            }
        }

        & .song-row {
            margin-top: 25px;
        }

    }
</style>