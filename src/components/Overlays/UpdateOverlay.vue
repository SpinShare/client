<template>
    <div class="update-overlay">
        <div class="update-content">
            <div class="update-status update-status-available" v-if="isAvailable">
                <div class="icon">
                    <i class="mdi mdi-alert-decagram"></i>
                </div>
                <div class="text">{{ $t('update.availableText') }}</div>
            </div>
            <div class="update-status update-status-latest" v-if="!isAvailable">
                <div class="icon">
                    <i class="mdi mdi-check-decagram"></i>
                </div>
                <div class="text">{{ $t('update.latestText') }}</div>
            </div>
            <div class="update-actions update-actions-available" v-if="isAvailable">
                <button class="button" v-on:click="OpenAndHideOverlay()">{{ $t('update.download') }}</button>
                <button class="button" v-on:click="HideOverlay()">{{ $t('update.later') }}</button>
            </div>
            <div class="update-actions update-actions-latest" v-if="!isAvailable">
                <button class="button" v-on:click="HideOverlay()">{{ $t('update.close') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    export default {
        name: 'UpdateOverlay',
        props: [
            'isAvailable'
        ],
        mounted: function() {
            ipcRenderer.on("overlays-close", () => {
                this.close();
            });
        },
        methods: {
            OpenAndHideOverlay: function() {
                // Open Update
                shell.openExternal("https://spinsha.re/client");
                this.$root.$emit('hideUpdateOverlay');
            },
            HideOverlay: function() {
                this.$root.$emit('hideUpdateOverlay');
            }
        }
    }
</script>

<style scoped lang="less">
    .update-overlay {
        position: fixed;
        z-index: 100;
        top: 30px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: rgba(0,0,0,0.75);
        display: flex;
        justify-content: center;
        align-items: center;

        & .update-content {
            width: 500px;
            background: #212629;
            border-radius: 6px;
            position: relative;
            overflow: hidden;

            & .update-status {
                padding: 25px;
                display: grid;
                grid-template-rows: 1fr auto;
                grid-gap: 25px;

                & .icon {
                    margin: 10px auto;
                    width: 150px;
                    height: 150px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    & .mdi {
                        font-size: 72px;
                    }
                }

                & .text {
                    text-align: center;
                }
            }

            & .update-actions {
                display: flex;
                justify-content: flex-end;
                padding: 25px;
                background: rgba(0,0,0,0.4);

                & button {
                    margin-left: 10px;
                }
            }
        }
    }
    .app-darwin .update-overlay {
        top: 40px;
    }
</style>
