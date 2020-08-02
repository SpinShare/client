<template>
    <section class="section-settings">
        <header>
            <div class="title">{{ $t('settings.header') }}</div>
        </header>
        <div class="settings">
            <div class="settings-box">
                <div class="settings-title">{{ $t('settings.general.header') }}</div>
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.general.version.label') }}</div>
                    <div class="settings-input">
                        <span class="settings-input-version">{{ version }}-{{ environment }}</span>
                    </div>
                </div>
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.general.update.label') }}</div>
                    <div class="settings-input">
                        <button v-on:click="CheckForUpdates()">{{ $t('settings.general.update.button') }}</button>
                    </div>
                </div>
            </div>
            <div class="settings-box">
                <div class="settings-title">{{ $t('settings.language.header') }}</div>
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.language.selectLanguage.label') }}</div>
                    <div class="settings-input">
                        <select v-on:change="ChangeLanguage()" v-model="settingLanguage" class="settings-input-language">
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
                    <div class="settings-hint">{{ $t('locale.translatedBy') }}</div>
                </div>
            </div>
            <div class="settings-box">
                <div class="settings-title">{{ $t('settings.directories.header') }}</div>
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.directories.gameDirectory.label') }}</div>
                    <div class="settings-input settings-input-twobuttons">
                        <input type="text" class="settings-input-gamedirectory" disabled v-model="settingGameDirectory">
                        <button v-on:click="SelectGameDirectory()">{{ $t('settings.directories.gameDirectory.changeButton') }}</button>
                        <button v-on:click="ResetGameDirectory()">{{ $t('settings.directories.gameDirectory.resetButton') }}</button>
                    </div>
                </div>
            </div>
            <!-- Botch -->
            <div class="settings-box">
                <div class="settings-title">Tournament Hub</div>
                <div class="settings-item">
                    <div class="settings-label">Open</div>
                    <div class="settings-input">
                        <router-link to="/tournament" class="button">Open WarpZone</router-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { remote } from 'electron';
    const { app, dialog } = remote;

    import UserSettings from '@/modules/module.usersettings.js';
    import SSAPI from '@/modules/module.api.js';

    export default {
        name: 'Settings',
        data: function() {
            return {
                version: "",
                environment: "",
                settingLanguage: "",
                settingGameDirectory: ""
            }
        },
        mounted: function() {
            let userSettings = new UserSettings();

            this.$data.version = app.getVersion();
            this.$data.environment = process.env.NODE_ENV;

            this.$data.settingLanguage = userSettings.get('language');
            this.$data.settingGameDirectory = userSettings.get('gameDirectory');
        },
        methods: {
            SelectGameDirectory: function() {
                let userSettings = new UserSettings();

                dialog.showOpenDialog({ title: "Open Game Directory", properties: ['openDirectory'] }).then(result => {
                    if(!result.canceled) {
                        let directoryPath = result.filePaths[0];

                        this.$data.settingGameDirectory = directoryPath;
                        userSettings.set('gameDirectory', this.$data.settingGameDirectory);
                    }
                });
            },
            ResetGameDirectory: function() {
                let userSettings = new UserSettings();

                this.$data.settingGameDirectory = userSettings.detectGameDirectory();
                userSettings.set('gameDirectory', this.$data.settingGameDirectory);
            },
            ChangeLanguage: function() {
                let userSettings = new UserSettings();
                userSettings.set('language', this.$data.settingLanguage);
                
                this.$i18n.locale = this.$data.settingLanguage;
            },
            CheckForUpdates: function() {
                let ssapi = new SSAPI();

                ssapi.getLatestVersion().then((data) => {
                    if(data.stringVersion != app.getVersion() && process.env.NODE_ENV !== 'development') {
                        this.$root.$emit('showUpdateOverlay', true);
                    } else {
                        this.$root.$emit('showUpdateOverlay', false);
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .section-settings {
        & header {
            background: rgba(0,0,0,0.3);
            padding: 50px;
            padding-bottom: 25px;

            & .title {
                font-size: 32px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                font-family: 'Oswald', sans-serif;
            }
        }

        & .settings {
            padding: 25px 50px;

            & .settings-box {
                background: rgba(255,255,255,0.1);
                
                max-width: 650px;
                padding: 25px;
                border-radius: 6px;
                margin-bottom: 25px;

                & .settings-title {
                    font-size: 14px;
                    letter-spacing: 0.25em;
                    font-weight: bold;
                    text-transform: uppercase;
                }
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
                    & .settings-hint {
                        grid-column: 2;
                        font-size: 12px;
                        opacity: 0.4;
                    }
                }
            }
        }
    }
</style>