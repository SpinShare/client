<template>
    <div class="play-overlay">
        <div class="play-content">
            <div class="play-main">
                <header>
                    <h1>{{ $t('songdetail.playmodal.title') }}</h1>
                    <SButton
                        icon="close"
                        mini
                        @click="close"
                    />
                </header>
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
                <SButton
                    icon="close"
                    :label="$t('songdetail.playmodal.actions.close')"
                    @click="close"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { remote, ipcRenderer } from 'electron';
    const { shell } = require('@electron/remote');

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
        mounted: function() {
            let difficultyObject = [
                {difficulty: 0, value: this.$props.hasEasyDifficulty},
                {difficulty: 1, value: this.$props.hasNormalDifficulty},
                {difficulty: 2, value: this.$props.hasHardDifficulty},
                {difficulty: 3, value: this.$props.hasExpertDifficulty},
                {difficulty: 4, value: this.$props.hasXDDifficulty}
            ]
            let trueCount = 0;
            let singleDiff = {};
            difficultyObject.forEach(e => {
                if (e['value'] == true) {
                    trueCount++
                    singleDiff == e
                }
            });
            if (trueCount == 1) this.play(singleDiff.difficulty);

            ipcRenderer.on("overlays-close", () => {
                this.close();
            });
        },
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
        top: 30px;
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
                padding: 25px 25px 0;

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
                        }
                        & img {
                            width: 48px;
                            padding: 20px 0px;
                        }
                    }
                }

                & .button {
                    font-family: 'Work Sans', sans-serif;
                    font-size: 12px;
                    text-decoration: none;
                    border: 0;
                    color: #fff;
                    font-weight: bold;
                    letter-spacing: 0.1em;
                    background: rgba(255,255,255,0.07);
                    padding: 10px 20px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    transition: 0.2s ease-in-out all;
                    cursor: pointer;

                    &:hover {
                        background: rgba(255,255,255,0.14);
                    }
                    &:focus {
                        outline: 0;
                    }
                    &:disabled, &.button-disabled {
                        opacity: 0.4;
                        cursor: not-allowed;
                    }
                }
            }

            & .play-actions {
                display: flex;
                justify-content: flex-end;
                padding: 25px;
                grid-gap: 10px;
            }
        }
    }
    .app-darwin .play-overlay {
        top: 40px;
    }
</style>
