<template>
    <div id="app">
        <main>
            <Navigation />
            <router-view ref="currentView" />
        </main>

        <ContextMenu>
        </ContextMenu>
    </div>
</template>

<script>
    import fs from 'fs';
    import glob from 'glob';
    import path from 'path';

    import UserSettings from '@/modules/module.usersettings.js';

    import Navigation from '@/components/Navigation/Navigation.vue';
    import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';

    export default {
        name: 'App',
        components: {
            Navigation,
            ContextMenu
        },
        data: function() {
            return {
                downloadQueue: []
            }
        },
        mounted: function() {
            this.$root.$on('download', (url) => {
                this.addToQueue(url);
            });
        },
        methods: {
            addToQueue: function(url) {
                this.$data.downloadQueue.push(url);
                console.log("Added " + url + " to queue");
            }
        },
        watch: {
            downloadQueue: function(queue) {
                console.log("Downloading first item");
                console.log(this.$data.downloadQueue);
            }
        }
    }
</script>

<style lang="less">
    html {
        box-sizing: border-box;
        -webkit-user-select: none;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    html {
        width: 100%;
        height: 100%;
    }
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        background: #212629;
        color: #fff;
        overflow-x: hidden;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
    }
    ::-webkit-scrollbar {
        background: #212529;
        width: 5px;
    }
    ::-webkit-scrollbar-thumb {
        background: #fff;
    }
    main {
        display: grid;
        margin-left: 60px;
        min-height: 100vh;
        overflow-y: scroll;
    }
    section {
        &.section-library {
            padding: 50px;
        }
    }
    button, .button {
        font-family: 'Open Sans', sans-serif;
        font-size: 12px;
        color: #fff;
        background: rgba(255,255,255,0.2);
        text-transform: uppercase;
        font-weight: 700;
        border-radius: 4px;
        padding: 7px 14px;
        border: 0px;
        transition: 0.2s ease-in-out all;

        &:hover {
            background: #fff;
            color: #222;
            cursor: pointer;
        }
        &:focus {
            outline: 0;
        }

        &.button-label {
            background: transparent;

            &:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
            }
            &:active {
                background: #fff;
                color: #222;
                cursor: pointer;
            }
        }
    }
</style>
