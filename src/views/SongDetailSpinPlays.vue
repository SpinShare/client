<template>
    <div class="tab tab-spinplays">
        <div class="spinplay-overview" v-if="apiFinished">
            <div class="icon">
                <i class="mdi mdi-youtube"></i>
            </div>
            <div class="text">
                    <div class="label">{{ $t('songdetail.spinplays.add.label') }}</div>
                    <div class="disclaimer">{{ $t('songdetail.spinplays.add.text') }}</div>
            </div>
            <div v-on:click="OpenSubmitVideo()" class="action-button">{{ $t('songdetail.spinplays.add.submitVideo') }}</div>
        </div>
        <div class="spinplays" v-if="apiFinished && spinPlays.length > 0">
            <SongSpinPlay
                v-for="spinPlay in spinPlays"
                v-bind:key="spinPlay.id"
                v-bind="spinPlay" />
        </div>
        <div class="no-spinplays" v-if="apiFinished && spinPlays.length == 0">
            <div class="icon">
                <i class="mdi mdi-youtube"></i>
            </div>
            <div class="text">
                <div class="title">{{ $t('songdetail.spinplays.noresults.title') }}</div>
                <div class="explaination">{{ $t('songdetail.spinplays.noresults.explaination') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard, shell } = remote;

    import SSAPI from '@/modules/module.api.js';

    import SongSpinPlay from '@/components/Song/SongSpinPlay.vue';

    export default {
        name: 'SongDetailSpinPlays',
        data: function() {
            return {
                apiFinished: false,
                spinPlays: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI(process.env.NODE_ENV === 'development');

            ssapi.getSongDetailSpinPlays(this.$route.params.id).then((data) => {
                this.$data.apiFinished = true;
                this.$data.spinPlays = data.data.spinPlays ? data.data.spinPlays : [];
            });
        },
        components: {
            SongSpinPlay
        },
        methods: {
            OpenSubmitVideo: function() {
                shell.openExternal("https://spinsha.re/song/" + this.$route.params.id + "?tab=spinplays");
            },
        }
    }
</script>

<style scoped lang="less">
    .tab-spinplays {
        & .spinplay-overview {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            padding: 20px 30px;
            display: grid;
            grid-template-columns: auto 1fr auto;
            grid-gap: 25px;
            align-items: center;

            & .icon {
                color: #fff;
                font-size: 48px;
            }
            & .text {
                & .label {
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 0.05em;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }
                & .disclaimer {
                    opacity: 0.6;
                }
            }
            & .action-button {
                text-decoration: none;
                color: #fff;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.1em;
                background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
                padding: 10px 20px;
                border-radius: 4px;
                text-transform: uppercase;
                transition: 0.2s ease-in-out all;
                cursor: pointer;

                &:hover {
                    opacity: 0.6;
                }
            }
        }
        & .spinplays {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 15px;
        }
        & .no-spinplays {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            padding: 20px 30px;
            display: grid;
            grid-template-columns: auto 1fr;
            grid-gap: 25px;
            align-items: center;

            & .icon {
                color: #fff;
                font-size: 48px;
            }
            & .text {
                & .title {
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 0.05em;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }
                & .explaination {
                    opacity: 0.6;
                }
            }
        }
    }
</style>