<template>
    <div class="delete-overlay">
        <div class="delete-content">
            <div class="delete-main">
                <div class="delete-title">{{ $t('library.deletemodal.title') }}</div>
                <div class="delete-text">{{ $t('library.deletemodal.text') }}</div>
                <div class="delete-files">
                    <span v-for="deleteFile in deleteFiles">{{ deleteFile }}</span>
                </div>
            </div>
            <div class="delete-actions">
                <button class="button" v-on:click="confirm()">{{ $t('library.deletemodal.delete') }}</button>
                <button class="button" v-on:click="close()">{{ $t('library.deletemodal.close') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { remote, ipcRenderer } from 'electron';
    import { path } from 'path';
    const { shell } = remote;

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
            background: #212629;
            border-radius: 6px;
            position: relative;
            overflow: hidden;

            & .delete-main {
                padding: 25px;

                & .delete-title {
                    letter-spacing: 0.25em;
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
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
                background: rgba(0,0,0,0.4);

                & button {
                    margin-left: 10px;
                }
            }
        }
    }
    .app-darwin .delete-overlay {
        top: 40px;
    }
</style>
