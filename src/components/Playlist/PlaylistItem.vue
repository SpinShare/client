<template>
    <router-link :to="{ name: 'PlaylistDetail', params: { id: id } }" class="playlist-item":style="'background-image: url(' + cover + ');'" v-on:contextmenu="showContextMenu($event)">
        <div class="shade" v-if="!isOfficial">
            <div class="content">
                <div class="title">{{ title }}<span class="official-badge" v-if="isOfficial">OFFICIAL</span></div>
                <div class="quickinfo">{{ songs.length }} Charts</div>
            </div>
        </div>
    </router-link>
</template>

<script>
import { remote } from 'electron';
const { clipboard, shell } = remote;

export default {
    name: 'SongItem',
    props: [
        'id',
        'cover',
        'title',
        'isOfficial',
        'songs'
    ],
    data: function() {
        return {
            isContextMenuActive: false
        }
    },
    mounted: function() {
    },
    methods: {
        showContextMenu: function(e) {
            if(e != undefined) {
                e.preventDefault();
            }

            this.$root.$emit('showContextMenu', {
                x: e.pageX,
                y: e.pageY,
                items: [
                    { icon: "eye", title: this.$t('contextmenu.open'), method: () => { this.$router.push({ name: 'SongDetail', params: { id: this.$props.id } }); } },
                    { icon: "earth", title: this.$t('contextmenu.openOnSpinShare'), method: () => { shell.openExternal("https://spinsha.re/playlist/" + this.$props.id); } },
                    { icon: "link", title: this.$t('contextmenu.copyLink'), method: () => { clipboard.writeText('https://spinsha.re/playlist/' + this.$props.id); } }
                ]});
        }
    }
}
</script>

<style scoped lang="less">
.playlist-item {
    height: 200px;
    background: rgba(255,255,255,0.1);
    background-position: center;
    background-size: cover;
    border-radius: 6px;
    color: #fff;
    text-decoration: none;
    transition: 0.2s ease all;

    & .shade {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0, 0.4);
        transition: 0.2s ease all;
        display: flex;
        justify-content: center;
        align-items: center;

        & .content {
            text-align: center;
            text-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);

            & .title {
                font-size: 32px;
                margin-bottom: 5px;
                font-family: 'Oswald', sans-serif;

                & .official-badge {
                    display: inline-block;
                    font-family: 'Open Sans', sans-serif;
                    font-weight: bold;
                    font-size: 10px;
                    padding: 2px 8px;
                    border-radius: 4px;
                    background: #fff;
                    color: #000;
                    text-shadow: 0px 0px 0px transparent;
                    margin-left: 10px;
                    transform: translateY(-8px);
                }
            }

            & .quickinfo {
                font-size: 18px;
                opacity: 0.6;
            }
        }
    }
    &:hover {
        cursor: pointer;
        box-shadow: 0px 4px 20px 5px rgba(0, 0, 0, 0.4);

        & .shade {
            opacity: 0;
        }
    }
}
</style>
