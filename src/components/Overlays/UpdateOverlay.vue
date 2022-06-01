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
                <SButton
                    color="primary"
                    icon="download"
                    :label="$t('update.download')"
                    @click="OpenAndHideOverlay"
                />
                <SButton
                    icon="close"
                    :label="$t('update.later')"
                    @click="HideOverlay"
                />
            </div>
            <div class="update-actions update-actions-latest" v-if="!isAvailable">
                <SButton
                    icon="close"
                    :label="$t('update.close')"
                    @click="HideOverlay"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { remote, ipcRenderer } from 'electron';
    const { shell } = require('@electron/remote');

    export default {
        name: 'UpdateOverlay',
        props: [
            'isAvailable'
        ],
        mounted: function() {
            ipcRenderer.on("overlays-close", () => {
                this.HideOverlay();
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
            background: #222;
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
                    opacity: 0.4;
                }
            }

            & .update-actions {
                display: flex;
                justify-content: center;
                padding: 25px;
                grid-gap: 10px;
            }
        }
    }
    .app-darwin .update-overlay {
        top: 40px;
    }
</style>
