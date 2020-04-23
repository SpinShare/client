<template>
    <section class="section-startup">
        <div class="staff-promos">
            <StaffPromoPlaceholder
                v-if="isPromoLoading"
                v-for="n in 2" />
            <StaffPromo
                v-if="!isPromoLoading"
                v-for="staffPromo in staffPromos"
                v-bind:key="staffPromo.id"
                v-bind="staffPromo" />
        </div>

        <SongRow
            title="New Songs">
            <SongItemPlaceholder
                v-if="isNewSongsLoading"
                v-for="n in 6" />
            <SongItem
                v-if="!isNewSongsLoading"
                v-for="song in newSongs"
                v-bind:key="song.id"
                v-bind="song" />
        </SongRow>

        <SongRow
            title="Popular Songs">
            <SongItemPlaceholder
                v-if="isPopularSongsLoading"
                v-for="n in 6" />
            <SongItem
                v-if="!isPopularSongsLoading"
                v-for="song in popularSongs"
                v-bind:key="song.id"
                v-bind="song" />
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
            let ssapi = new SSAPI(true);

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