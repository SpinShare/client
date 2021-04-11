<template>
    <div class="section-libraryUpdate">
        <div class="login-box login-loading">
            <Loading />
        </div>
    </div>
</template>

<script>
    import { remote, ipcRenderer } from 'electron';
    import ChartLibrary from '@/modules/module.library.js';

    import Loading from '@/components/Loading.vue';
    
    export default {
        name: 'LibraryUpdate',
        components: {
            Loading
        },
        mounted: function() {
            setTimeout(function () {
                console.log('[LibraryUpdate] Updating Library');

                let chartLibrary = new ChartLibrary();
                chartLibrary.updateLibrary();

                console.log("[LibraryUpdate] Redirect to Login");
            }, 1000);
        }
    }
</script>

<style scoped lang="less">
    .section-libraryUpdate {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        display: flex;
        justify-content: center;
        align-items: center;

        & .loading {
            background: black;
        }
        & .login-box {
            width: 500px;
            background: #000;
            border-radius: 6px;
            padding: 40px;

            & .logo {
                text-align: center;
                margin-bottom: 30px;

                & img {
                    height: 50px;
                }
            }

            & .explaination {
                line-height: 1.5;
            }

            & .error {
                border: 2px solid #fb1357;
                padding: 15px;
                background: #fb1357;
                border-radius: 4px;
                margin-bottom: 15px;
            }

            & .connectcodeInput {
                font-size: 42px;
                background: transparent;
                border: 0px;
                width: 100%;
                text-align: center;
                color: #fff;
                padding: 15px;
                margin-top: 30px;
                margin-bottom: 15px;
                letter-spacing: 0.15em;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }

            & .actions {
                display: flex;
                flex-direction: row-reverse;
            }

            &.login-loading {
                padding: 60px;
            }
        }
    }
</style>