<template>
    <section class="section-settings">
        <header>
            <div class="title">{{ $t('settings.header') }}</div>
        </header>
        <div class="settings">
            <div class="settings-box">
                <div class="settings-title">{{ $t('settings.client.header') }}</div>
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.client.version.label') }}</div>
                    <div class="settings-input">
                        <span class="settings-input-version">{{ version }}-{{ environment }}</span>
                    </div>
                </div>
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.client.update.label') }}</div>
                    <div class="settings-input">
                        <SButton
                            icon="refresh"
                            :label="$t('settings.client.update.button')"
                            @click="CheckForUpdates"
                            style="justify-self: flex-start"
                        />
                    </div>
                </div>
            </div>
            <div class="settings-box">
                <div class="settings-title">{{ $t('settings.general.header') }}</div>
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.general.selectLanguage.label') }}</div>
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
                
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.general.gameDirectory.label') }}</div>
                    <div class="settings-input settings-input-twobuttons">
                        <input type="text" class="settings-input-gamedirectory" disabled v-model="settingGameDirectory">
                        <SButton
                            icon="pencil"
                            :label="$t('settings.general.gameDirectory.changeButton')"
                            @click="SelectGameDirectory"
                        />
                        <SButton
                            icon="refresh"
                            :label="$t('settings.general.gameDirectory.resetButton')"
                            @click="ResetGameDirectory"
                        />
                    </div>
                </div>
                
                <div class="settings-item">
                    <div class="settings-label">{{ $t('settings.general.silentQueue.label') }}</div>
                    <div class="settings-input">
                        <label class="toggle">
                            <input type="checkbox" v-on:change="ChangeSilentQueue()" class="settings-input-silentqueue" v-model="settingSilentQueue">
                        </label>
                    </div>
                    <div class="settings-hint">{{ $t('settings.general.silentQueue.explaination') }}</div>
                </div>
            </div>
            <!-- Botch -->
            <div class="settings-box">
                <div class="settings-title">Tournament Hub</div>
                <div class="settings-item">
                    <div class="settings-label">Open</div>
                    <div class="settings-input">
                        <SButton
                            icon="tournament"
                            label="Open WarpZone"
                            @click="OpenWarpZone"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    const { app, dialog } = require('@electron/remote');

    import UserSettings from '@/modules/module.usersettings.js';
    import SSAPI from '@/modules/module.api.js';

    export default {
        name: 'Settings',
        data: function() {
            return {
                version: "",
                environment: "",
                settingLanguage: "",
                settingGameDirectory: "",
                settingSilentQueue: false
            }
        },
        mounted: function() {
            let userSettings = new UserSettings();

            this.$data.version = app.getVersion();
            this.$data.environment = process.env.NODE_ENV;

            this.$data.settingLanguage = userSettings.get('language');
            this.$data.settingGameDirectory = userSettings.get('gameDirectory');
            this.$data.settingSilentQueue = userSettings.get('silentQueue');
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
            ChangeSilentQueue: function() {
                let userSettings = new UserSettings();
                userSettings.set('silentQueue', this.$data.settingSilentQueue);

            },
            CheckForUpdates: function() {
                let ssapi = new SSAPI();

                ssapi.getLatestVersion().then((data) => {
                    if(data.stringVersion !== app.getVersion() && process.env.NODE_ENV !== 'development') {
                        this.$root.$emit('showUpdateOverlay', true);
                    } else {
                        this.$root.$emit('showUpdateOverlay', false);
                    }
                });
            },
            OpenWarpZone() {
                this.$router.push({name: 'Tournament'});
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
            display: flex;
            flex-direction: column;
            align-items: center;

            & .settings-box {
                background: rgba(255,255,255,0.07);
                width: 650px;
                padding: 25px;
                border-radius: 6px;
                margin-bottom: 25px;

                & .settings-title {
                    font-size: 18px;
                    font-weight: bold;
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
                            font-family: 'Work Sans', sans-serif;
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
                        & .toggle {
                            display: flex;
                            grid-gap: 5px;
                            align-items: center;

                            & input {
                                appearance: none;
                                background: rgba(255,255,255,0.14);
                                width: 45px;
                                height: 25px;
                                border-radius: 100px;
                                position: relative;
                                transition: 0.2s ease-in-out all;
                                outline: none;
                                cursor: pointer;

                                &::after {
                                    content: '';
                                    display: block;
                                    width: 18px;
                                    height: 18px;
                                    background: rgba(255,255,255,0.21);
                                    border-radius: 100px;
                                    position: absolute;
                                    top: 4px;
                                    left: 4px;
                                    transition: 0.15s ease-in-out all;
                                }

                                & + span {
                                    opacity: 0.4;
                                }

                                &:checked {
                                    background: rgba(227, 91, 152, 0.4);

                                    &::after {
                                        left: 22px;
                                        background: rgba(227, 91, 152, 1);
                                    }

                                    & + span {
                                        opacity: 1;
                                    }
                                }
                            }
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