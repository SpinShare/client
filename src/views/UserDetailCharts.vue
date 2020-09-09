<template>
    <section class="section-userdetail-charts">
        <SongRow
            v-if="apiFinished && charts.length > 0">
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

        <Loading v-if="!apiFinished" style="padding: 50px 0px;" />
    </section>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard, shell } = remote;

    import SSAPI from '@/modules/module.api.js';
    import SongRow from '@/components/Song/SongRow.vue';
    import SongItem from '@/components/Song/SongItem.vue';
    import Loading from '@/components/Loading.vue';

    export default {
        name: 'UserDetailCharts',
        components: {
            SongRow,
            SongItem,
            Loading,
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
                if(data.status == 200) {
                    this.$data.charts = data.data;
                    this.$data.apiFinished = true;
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
        padding: 50px;

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