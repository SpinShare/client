<template>
    <section class="section-login">
        <div class="login-box login-loading" v-if="apiLoginLoading">
            <Loading />
        </div>
        <div class="login-box" v-if="!hasValidToken && !apiLoginLoading">
            <div class="logo"><img src="https://spinsha.re/assets/img/logo_colored_ondark.svg" alt="SpinShare Logo" /></div>
            
            <div class="explaination">{{ $t('login.explaination') }}</div>

            <input type="text" maxlength="6" class="connectcodeInput" placeholder="000000" v-model="connectCode" />

            <div class="error" v-if="apiLoginCodeError">{{ $t('login.error.code') }}</div>

            <div class="error" v-if="apiLoginServerError">{{ $t('login.error.server') }}</div>

            <div class="actions">
                <button class="button" v-on:click="connect()" :disabled="!canConnect">{{ $t('login.action.connect') }}</button>
            </div>
        </div>
    </section>
</template>

<script>
    import SSAPI from '@/modules/module.api.js';
    import UserSettings from '@/modules/module.usersettings.js';
    import ChartLibrary from '@/modules/module.library.js';

    import Loading from '@/components/Loading.vue';

    export default {
        name: 'Login',
        components: {
            Loading
        },
        data: function() {
            return {
                hasValidToken: false,
                connectCode: "",
                canConnect: false,
                apiLoginLoading: true,
                apiLoginCodeError: false,
                apiLoginServerError: false
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();
            let userSettings = new UserSettings();

            let chartLibrary = new ChartLibrary();
            chartLibrary.updateLibrary();

            if(!userSettings.get("connectToken")) {
                this.showLoginBox();
            } else {
                ssapi.validateConnectToken(userSettings.get("connectToken")).then((data) => {
                    if(data) {
                        this.loadIntoProfile();
                    } else {
                        this.showLoginBox();
                    }
                }).catch(() => {
                    this.showLoginBox();
                });
            }
        },
        methods: {
            connect: function() {
                let ssapi = new SSAPI();
                let userSettings = new UserSettings();

                this.$data.apiLoginLoading = true;
                this.$data.apiLoginCodeError = false;
                this.$data.apiLoginServerError = false;

                console.log("Trying connection with code '" + this.$data.connectCode + "'");

                try {
                    ssapi.getConnectToken(this.$data.connectCode).then((data) => {
                        console.log(data);

                        switch (data.status) {
                            case 200:
                                // Successful Token
                                userSettings.set("connectToken", data.data);
                                this.loadIntoProfile();
                                break;
                            default:
                                // Token invalid
                                this.showLoginBox();
                                this.$data.apiLoginCodeError = true;
                                break;
                        }
                    }).catch((error) => {
                        console.error(error);
                        this.showLoginBox();
                        this.$data.apiLoginServerError = true;
                    });
                } catch(error) {
                    console.error(error);
                    this.showLoginBox();
                    this.$data.apiLoginServerError = true;
                }
            },
            showLoginBox: function() {
                this.$data.apiLoginLoading = false;
                this.$data.apiLoginCodeError = false;
                this.$data.apiLoginServerError = false;
            },
            loadIntoProfile: function() {
                let ssapi = new SSAPI();
                let userSettings = new UserSettings();

                ssapi.getConnectProfile(userSettings.get("connectToken")).then((data) => {
                    userSettings.set("connectProfile", data);
                    this.$root.$emit("LoadIntoProfile", data);
                    this.$router.replace({ name: 'StartupFrontpage' });
                });
            }
        },
        watch: {
            connectCode: function(newVal) {
                if(newVal.length == 6) {
                    this.$data.canConnect = true;
                } else {
                    this.$data.canConnect = false;
                }
            }
        },
    }
</script>

<style scoped lang="less">
    .section-login {
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