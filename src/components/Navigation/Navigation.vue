<template>
    <aside>
        <nav>
            <router-link to="/" exact class="item"><i class="mdi mdi-home-outline"></i></router-link>
            <router-link to="/search" class="item"><i class="mdi mdi-magnify"></i></router-link>
            <router-link to="/library" class="item"><i class="mdi mdi-music-box-multiple-outline"></i></router-link>
            <div v-on:click="openExternal('https://www.patreon.com/spinshare');" class="item"><i class="mdi mdi-patreon"></i></div>
        </nav>

        <nav>
            <div v-on:click="openExternal('steam://run/1058830');" class="item"><i class="mdi mdi-play-outline"></i></div>
            <router-link to="/settings" class="item"><i class="mdi mdi-cog-outline"></i></router-link>
        </nav>
    </aside>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    export default {
        name: 'Navigation',
        methods: {
            openExternal: function(url) {
                shell.openExternal(url);
            }
        }
    }
</script>

<style scoped lang="less">
    aside {
        background: rgba(255,255,255,0.1);
        display: grid;
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        grid-template-rows: 1fr auto;

        & .item, & .external-item {
            width: 60px;
            height: 60px;
            opacity: 0.4;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            color: #fff;
            transition: 0.2s ease opacity, 0.2s ease background;

            &:hover {
                opacity: 1;
                cursor: pointer;
            }
            &.router-link-active {
                opacity: 1;
                background: linear-gradient(135deg, #fd2f85, #7a34ec);
            }

            & .mdi {
                font-size: 22px;
            }
        }
    }
</style>
