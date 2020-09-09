<template>
    <section class="section-userdetail-spinplays">
        <div class="spinplays" v-if="apiFinished">
            <div class="video-list" v-if="spinplays.length > 0">
                <div class="spinplay" v-for="spinplay in spinplays" :key="spinplay.id">
                    <div v-on:click="OpenExternal(spinplay.videoUrl)" class="thumbnail" :style="'background-image: url(' + spinplay.videoThumbnail + ');'"></div>
                </div>
            </div>
            <div class="song-list-noresults" v-if="apiFinished && spinplays.length < 1">
                <div class="noresults-text">{{ this.$t('userdetail.spinplays.noresults') }}</div>
            </div>
        </div>

        <Loading v-if="!apiFinished" style="padding: 50px 0px;" />
    </section>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard, shell } = remote;

    import SSAPI from '@/modules/module.api.js';
    import Loading from '@/components/Loading.vue';

    export default {
        name: 'UserDetailSpinPlays',
        components: {
            Loading,
        },
        data: function() {
            return {
                apiFinished: false,
                spinplays: [],
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getUserSpinPlays(this.$route.params.id).then((data) => {
                if(data.status == 200) {
                    this.$data.spinplays = data.data;
                    this.$data.apiFinished = true;
                } else {
                    this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                }
            });
        },
        methods: {
            OpenExternal( url ) {
                shell.openExternal(url);
            }
        }
    }
</script>

<style scoped lang="less">
    .section-userdetail-spinplays {
        padding: 50px;

        & .spinplays {
            & .video-list {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                grid-gap: 15px;
        
                & .spinplay {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    color: #fff;
                    text-decoration: none;
        
                    & .thumbnail {
                        width: 100%;
                        display: block;
                        padding-top: 56.25%;
                        background: rgba(255,255,255,0.1);
                        background-position: center;
                        background-size: cover;
                        transition: 0.2s ease-in-out opacity;
        
                        &:hover {
                            opacity: 0.6;
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        & .song-list-noresults {
            display: block;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 25px;
            opacity: 0.6;
            text-align: center;
        }
    }
</style>