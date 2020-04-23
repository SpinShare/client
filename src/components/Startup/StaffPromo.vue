<template>
    <div :style="'background-image: url(' + image_path + ');'" :class="isLoading ? 'staff-promo promo-loading' : 'staff-promo' ">
        <div class="promo-type" :style="'color:' + color">{{ type }}</div>
        <div class="promo-title" :style="'color:' + textColor" v-html="title"></div>
        <div class="promo-button" :style="'background-color:' + color" v-on:click="buttonClick()">CHECK IT OUT</div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    export default {
        name: 'StaffPromo',
        methods: {
            buttonClick: function() {
                switch(this.$props.buttonType) {
                    case 0:
                        // Song
                        break;
                    case 1:
                        // Playlist (unused)
                        break;
                    case 2:
                        // Search Query
                        break;
                    case 3:
                        // External
                        shell.openExternal(this.$props.buttonData);
                        break;
                }
            }
        },
        props: [
            'isLoading',
            'image_path',
            'type',
            'title',
            'buttonType',
            'buttonData',
            'textColor',
            'color'
        ]
    }
</script>

<style scoped lang="less">
    .staff-promo {
        background: #fff;
        border-radius: 6px;
        padding: 50px;
        height: 256px;
        display: grid;
        transition: 0.2s ease all;
        grid-template-rows: auto 100px auto;

        & .promo-type {
            color: #aaa;
            justify-self: left;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.3em;
            text-transform: uppercase;
        }
        & .promo-title {
            font-weight: bold;
            font-size: 34px;
            justify-self: left;
            align-self: flex-start;
            letter-spacing: -0.025em;
            color: #222;
        }
        & .promo-button {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 10px 25px;
            color: #fff;
            background: #aaa;
            justify-self: left;
            border-radius: 6px;
            transition: 0.2s ease-in-out all;

            &:hover {
                cursor: pointer;
                opacity: 0.6;
            }
        }
    }
</style>
