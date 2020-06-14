<template>
    <div class="play-overlay">
        <div class="play-content">
            <div class="play-main">
                <div class="play-title">{{ $t('songdetail.playmodal.title') }}</div>
                <div class="play-difficulties">
                    <div :class="hasEasyDifficulty ? 'button active' : 'button'" v-on="hasEasyDifficulty ? { click: () => play(0) } : {}">
                        <img src="@/assets/img/difficultyEasy.svg" :class="hasEasyDifficulty ? 'active' : ''" />
                    </div>
                    <div :class="hasNormalDifficulty ? 'button active' : 'button'" v-on="hasNormalDifficulty ? { click: () => play(1) } : {}">
                        <img src="@/assets/img/difficultyNormal.svg" :class="hasNormalDifficulty ? 'active' : ''" />
                    </div>
                    <div :class="hasHardDifficulty ? 'button active' : 'button'" v-on="hasHardDifficulty ? { click: () => play(2) } : {}">
                        <img src="@/assets/img/difficultyHard.svg" :class="hasHardDifficulty ? 'active' : ''" />
                    </div>
                    <div :class="hasExpertDifficulty ? 'button active' : 'button'" v-on="hasExpertDifficulty ? { click: () => play(3) } : {}">
                        <img src="@/assets/img/difficultyExtreme.svg" :class="hasExpertDifficulty ? 'active' : ''" />
                    </div>
                    <div :class="hasXDDifficulty ? 'button active' : 'button'" v-on="hasXDDifficulty ? { click: () => play(4) } : {}">
                        <img src="@/assets/img/difficultyXD.svg" :class="hasXDDifficulty ? 'active' : ''" />
                    </div>
                </div>
            </div>
            <div class="play-actions">
                <div class="button" v-on:click="close()">{{ $t('songdetail.playmodal.actions.close') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    export default {
        name: 'PlayOverlay',
        props: [
            'fileReference',
            'hasEasyDifficulty',
            'hasNormalDifficulty',
            'hasHardDifficulty',
            'hasExpertDifficulty',
            'hasXDDifficulty'
        ],
        methods: {
            play: function(difficulty) {
                shell.openExternal('steam://run/1058830//play "' + this.$props.fileReference + '.srtb" difficulty ' + difficulty);
                this.close();
            },
            close: function() {
                this.$parent.$emit('closePlayOverlay');
            }
        }
    }
</script>

<style scoped lang="less">
    .play-overlay {
        position: fixed;
        z-index: 100;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: rgba(0,0,0,0.75);
        display: flex;
        justify-content: center;
        align-items: center;

        & .play-content {
            width: 700px;
            background: #212629;
            border-radius: 6px;
            position: relative;
            overflow: hidden;

            & .play-main {
                padding: 25px;

                & .play-title {
                    letter-spacing: 0.25em;
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                & .play-difficulties {
                    margin-top: 15px;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                    grid-gap: 15px;
                    grid-auto-flow: column;

                    & .button {
                        opacity: 0.4;
                        cursor: default;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        &.active {
                            opacity: 1;
                            cursor: pointer;

                            &:hover {
                                opacity: 0.6;
                            }
                        }
                        & img {
                            width: 48px;
                            padding: 20px 0px;
                        }
                    }
                }
            }

            & .play-actions {
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
</style>
