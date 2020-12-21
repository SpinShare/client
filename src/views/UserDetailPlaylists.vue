<template>
    <section class="section-userdetail-playlists">
        <PlaylistRow
            v-if="apiFinished && playlists.length > 0">
            <template v-slot:playlist-list>
                <PlaylistItem
                    v-for="playlist in playlists"
                    v-bind:key="playlist.id"
                    v-bind="playlist" />
            </template>
        </PlaylistRow>
        <div class="playlist-list-noresults" v-if="apiFinished && playlists.length == 0">
            <div class="noresults-text">{{ this.$t('userdetail.playlists.noresults') }}</div>
        </div>

        <Loading v-if="!apiFinished" style="padding: 50px 0px;" />
    </section>
</template>

<script>
import { remote } from 'electron';
const { clipboard, shell } = remote;

import SSAPI from '@/modules/module.api.js';
import PlaylistRow from '@/components/Playlist/PlaylistRow.vue';
import PlaylistItem from '@/components/Playlist/PlaylistItem.vue';
import Loading from '@/components/Loading.vue';

export default {
    name: 'UserDetailPlaylists',
    components: {
        PlaylistRow,
        PlaylistItem,
        Loading,
    },
    data: function() {
        return {
            apiFinished: false,
            playlists: [],
        }
    },
    mounted: function() {
        let ssapi = new SSAPI();

        ssapi.getUserPlaylists(this.$route.params.id).then((data) => {
            if(data.status == 200) {
                this.$data.playlists = data.data;
                this.$data.apiFinished = true;

                console.log(data.data);
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
.section-userdetail-playlists {
    padding: 50px;

    & .playlist-list-noresults {
        display: block;
        background: rgba(255,255,255,0.1);
        border-radius: 6px;
        padding: 25px;
        opacity: 0.6;
        text-align: center;
    }
}
</style>