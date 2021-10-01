<template>
    <div class="card-overlay">
        <div class="close" v-on:click="close()"><i class="mdi mdi-close"></i></div>

        <div class="overlay-content">
            <img :src="card.icon" class="card-icon" v-tilt="{glare: true, 'max-glare': 0.8, reverse: true, max: 15}" />

            <div class="card-title">{{ card.title }}</div>
            <div class="card-description">{{ card.description }}</div>
            <div class="card-given">{{ renderDate(card.givenDateFormat) }}</div>
            <div class="button" v-on:click="close()">Close</div>
        </div>
    </div>
</template>

<script>
    import { remote, ipcRenderer } from 'electron';
    import { path } from 'path';
    import moment from 'moment';
    const { shell } = require('@electron/remote');

    export default {
        name: 'CardOverlay',
        props: [
            'card'
        ],
        mounted: function() {
            ipcRenderer.on("overlays-close", () => {
                this.close();
            });
        },
        methods: {
            close() {
                this.$parent.$emit('cardClose');
            },
            renderDate( date ) {
                return moment( date ).format(this.$t('locale.dateFormat'));
            }
        }
    }
</script>

<style scoped lang="less">
    .card-overlay {
        display: flex;
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 1200;
        background: rgba(0,0,0,0.6);
        justify-content: center;
        align-items: center;

        & .close {
            font-size: 32px;
            color: #fff;
            position: absolute;
            top: 40px;
            right: 40px;
            cursor: pointer;
            transition: 0.2s ease-in-out opacity;

            &:hover {
                opacity: 0.6;
            }
        }

        & .overlay-content {
            max-width: 320px;
            text-align: center;

            & img {
                width: 200px;
                height: 200px;
                margin-bottom: 50px;
            }

            & .card-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            & .card-description {
                line-height: 1.5em;
                opacity: 0.75;
                margin-bottom: 10px;
            }

            & .card-given {
                margin-bottom: 25px;
                font-weight: bold;
            }

            & .button {
                display: inline-block;
            }
        }
    }
</style>
