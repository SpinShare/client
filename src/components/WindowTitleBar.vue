<template>
    <div class="window-title-bar">
        <div class="title">
            <div class="back" v-on:click="NavigateBack()"><i class="mdi mdi-arrow-left"></i></div>
            <div class="text">SpinShare</div>
        </div>
        <div class="actions-windows" v-if="platform != 'darwin'">
            <div class="action" v-on:click="WindowMinimize()"><i class="mdi mdi-window-minimize"></i></div>
            <div class="action" v-on:click="WindowMaximize()" v-if="!isMaximized"><i class="mdi mdi-window-maximize"></i></div>
            <div class="action" v-on:click="WindowMaximize()" v-if="isMaximized"><i class="mdi mdi-window-restore"></i></div>
            <div class="action action-close" v-on:click="WindowClose()"><i class="mdi mdi-window-close"></i></div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';

    export default {
        name: 'WindowTitleBar',
        data: function() {
            return {
                platform: "win32",
                isMaximized: false
            }
        },
        mounted: function() {
            this.$data.system = process.platform;
            if(remote.BrowserWindow.getFocusedWindow()) {
                this.$data.isMaximized = remote.BrowserWindow.getFocusedWindow().isMaximized();
            }
        },
        methods: {
            NavigateBack: function() {
                this.$router.back();
            },
            WindowMinimize: function() {
                remote.BrowserWindow.getFocusedWindow().minimize();
            },
            WindowMaximize: function() {

                if(remote.BrowserWindow.getFocusedWindow().isMaximized()) {
                    remote.BrowserWindow.getFocusedWindow().unmaximize();
                } else {
                    remote.BrowserWindow.getFocusedWindow().maximize();
                }

                if(remote.BrowserWindow.getFocusedWindow()) {
                    this.$data.isMaximized = remote.BrowserWindow.getFocusedWindow().isMaximized();
                }
            },
            WindowClose: function() {
                remote.BrowserWindow.getFocusedWindow().close();
            }
        }
    }
</script>

<style scoped lang="less">
    .window-title-bar {
        position: fixed;
        display: grid;
        grid-template-columns: 1fr auto;
        top: 0px;
        left: 0px;
        right: 0px;
        z-index: 1000;
        font-size: 12px;
        height: 30px;
        overflow: hidden;
        background: #000;
        color: #fff;
        -webkit-app-region: drag;

        & .title {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-gap: 8px;
            align-items: center;

            & .back {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 30px;
                font-size: 16px;
                padding: 0px 15px;
                -webkit-app-region: no-drag;

                &:hover {
                    cursor: pointer;
                    background: rgba(255,255,255,0.2);
                }
            }
        }

        & .actions-windows {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;

            & .action {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                padding: 0px 15px;
                -webkit-app-region: no-drag;

                &:hover {
                    background: rgba(255,255,255,0.2);
                }
                &.action-close:hover {
                    background: rgb(204, 28, 28);
                }
            }
        }
    }
</style>
