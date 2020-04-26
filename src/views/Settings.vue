<template>
    <section class="section-settings">
        <div class="settings-box">
            <div class="settings-title" locale="">SpinShare</div>
            <div class="settings-item">
                <div class="settings-label" locale="">Version</div>
                <div class="settings-input">
                    <span class="settings-input-version">{{ version }}-{{ environment }}</span>
                </div>
            </div>
            <div class="settings-item">
                <div class="settings-label" locale="">Update</div>
                <div class="settings-input">
                    <button onclick="CheckForUpdates(true)" locale="">Check for Updates</button>
                </div>
            </div>
        </div>
        <div class="settings-box">
            <div class="settings-title" locale="">Language</div>
            <div class="settings-item">
                <div class="settings-label" locale="">Select Language</div>
                <div class="settings-input">
                    <select onchange="SettingsChangeLanguage()" class="settings-input-language">
                        <option value="en">English (English)</option>
                        <option value="de">Deutsch (German)</option>
                        <option value="nl">Nederlands (Dutch)</option>
                        <option value="pl">Polski (Polish)</option>
                        <option value="fr">Français (French)</option>
                        <option value="pt-BR">Português Brasileiro (Brazilian Portuguese)</option>
                        <option value="es">Español (Spanish)</option>
                        <option value="ru">Русский (Russian)</option>
                        <option value="kr">한국어 (Korean)</option>
                        <option value="zh-CN">简体中文 (Simplified Chinese)</option>
                        <option value="speen">Speen (Speen)</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="settings-box">
            <div class="settings-title" locale="">Directories</div>
            <div class="settings-item">
                <div class="settings-label" locale="">Game Directory</div>
                <div class="settings-input settings-input-twobuttons">
                    <input type="text" disabled="" class="settings-input-gamedirectory">
                    <button onclick="SettingsSelectGameDirectory()" locale="">Change</button>
                    <button onclick="SettingsResetGameDirectory()" locale="">Reset</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { remote } from 'electron';
    const { app } = remote;

    export default {
        name: 'Settings',
        data: function() {
            return {
                version: "",
                environment: ""
            }
        },
        mounted: function() {
            this.$data.version = app.getVersion();
            this.$data.environment = process.env.NODE_ENV;
        }
    }
</script>

<style scoped lang="less">
    .section-settings {
        padding: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;

        & .settings-title {
            font-size: 14px;
            letter-spacing: 0.25em;
            font-weight: bold;
            text-transform: uppercase;
        }
        & .settings-box {
            width: 600px;
            padding: 25px;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            margin-bottom: 25px;

            & .settings-item {
                display: grid;
                grid-template-columns: 170px 1fr;
                grid-gap: 15px;
                margin-top: 15px;

                & .settings-label {
                    align-self: center;
                    opacity: 0.6;
                }
                & .settings-input {
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-gap: 5px;

                    &.settings-input-twobuttons {
                        grid-template-columns: 1fr auto auto;
                    }

                    & select, input[type="text"] {
                        width: 100%;
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
                    
                        &:not(:disabled):hover {
                            background: rgba(255,255,255,0.4);
                            color: #fff;
                            cursor: pointer;
                        }
                        &:focus {
                            outline: 0;
                        }
                        &::placeholder {
                            color: rgba(255,255,255,0.6);
                        }
                        & option {
                            background: #222;
                            text-transform: initial;
                        }
                        &:disabled {
                            opacity: 0.4;
                        }
                    }
                    & input[type="text"] {
                        text-transform: initial;
                        font-weight: normal;
                    }
                }
            }
        }
    }
</style>