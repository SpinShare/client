<template>
    <section class="section-userdetail-charts">
        <SongRow
            v-if="apiFinished && charts.length > 0"
            with-sidebar>
            <template v-slot:song-list>
                <SongItem
                    v-for="song in charts"
                    v-bind:key="song.id"
                    v-bind="song" />
            </template>
        </SongRow>
        <div class="song-list-noresults" v-if="apiFinished && charts.length < 1">
            <div class="noresults-text">{{ this.$t('userdetail.charts.noresults') }}</div>
        </div>

        <SLoadingSpinner v-if="!apiFinished" style="margin: 100px auto;" />
    </section>
</template>

<script>
    import SSAPI from '@/modules/module.api.js';
    import SongRow from '@/components/Song/SongRow.vue';
    import SongItem from '@/components/Song/SongItem.vue';

    export default {
        name: 'UserDetailCharts',
        components: {
            SongRow,
            SongItem,
        },
        data: function() {
            return {
                apiFinished: false,
                charts: [],
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getUserCharts(this.$route.params.id).then((data) => {
                if(data.status === 200) {
                    this.charts = data.data;
                    this.apiFinished = true;
                } else {
                    this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                }
            });
        },
        methods: {
        }
    }
</script>

<style scoped lang="less">
    .section-userdetail-charts {
        & .song-list-noresults {
            display: block;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 25px;
            opacity: 0.6;
            text-align: center;
        }
    }
</style>