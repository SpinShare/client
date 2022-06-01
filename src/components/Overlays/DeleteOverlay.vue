<template>
    <div class="delete-overlay">
        <div class="delete-content">
            <div class="delete-main">
                <header>
                    <h1>{{ $t('library.deletemodal.title') }}</h1>
                    <SButton
                        icon="close"
                        mini
                        @click="close"
                    />
                </header>
                <div class="delete-text">{{ $t('library.deletemodal.text') }}</div>
                <div class="delete-files">
                    <span v-for="deleteFile in deleteFiles">{{ deleteFile }}</span>
                </div>
            </div>
            <div class="delete-actions">
                <SButton
                    color="primary"
                    icon="delete"
                    :label="$t('library.deletemodal.delete')"
                    @click="confirm"
                />
                <SButton
                    icon="close"
                    :label="$t('library.deletemodal.close')"
                    @click="close"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { remote, ipcRenderer } from 'electron';
    import { path } from 'path';
    const { shell } = require('@electron/remote');

    export default {
        name: 'DeleteOverlay',
        props: [
            'deleteFiles'
        ],
        mounted: function() {
            ipcRenderer.on("overlays-close", () => {
                this.close();
            });
        },
        methods: {
            confirm() {
                this.$parent.$emit('deleteConfirm');
            },
            close() {
                this.$parent.$emit('deleteDeny');
            }
        }
    }
</script>

<style scoped lang="less">
    .delete-overlay {
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

        & .delete-content {
            width: 700px;
            background: #222;
            border-radius: 6px;
            position: relative;
            overflow: hidden;

            & .delete-main {
                padding: 30px 30px 0;

                & header {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    grid-gap: 15px;
                    align-items: center;

                    & h1 {
                        font-size: 18px;
                        margin: 0;
                    }
                }

                & .delete-text {
                    padding: 15px 0px;
                    opacity: 0.6;
                }
                & .delete-files {
                    font-size: 12px;
                    max-height: 50vh;
                    overflow-y: auto;

                    & span {
                        display: block;
                        padding: 5px 0px;
                    }
                }
            }

            & .delete-actions {
                display: flex;
                justify-content: flex-end;
                padding: 25px;
                grid-gap: 10px;
            }
        }
    }
    .app-darwin .delete-overlay {
        top: 40px;
    }
</style>
