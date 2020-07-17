<template>
    <div :style="'background-image: url(' + image_path + ');'" :class="isLoading ? 'staff-promo promo-loading' : 'staff-promo' ">
        <div class="promo-type" :style="'color:' + color">{{ type }}</div>
        <div class="promo-title" :style="'color:' + textColor" v-html="title"></div>
        <div v-ripple class="promo-button" :style="'background-color:' + color" v-on:click="buttonClick()">{{ $t('startup.staffpromo.action') }}</div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { shell } = remote;

    export default {
        name: 'StaffPromo',
        methods: {
            buttonClick: function() {
                console.log(this.$props.button.type);
                console.log(this.$props.button.data);
                switch(this.$props.button.type) {
                    case 0:
                        // Song
                        this.$router.push({ name: 'SongDetail', params: { id: this.$props.button.data } });
                        break;
                    case 1:
                        // Playlist (unused)
                        break;
                    case 2:
                        // Search Query
                        this.$router.push({ name: 'Search', params: { searchQuery: this.$props.button.data } });
                        break;
                    case 3:
                        // External
                        shell.openExternal(this.$props.button.data);
                        break;
                    case 4:
                        // User
                        this.$router.push({ name: 'UserDetail', params: { id: this.$props.button.data } });
                        break;
                }
            }
        },
        props: [
            'isLoading',
            'image_path',
            'type',
            'title',
            'button',
            'textColor',
            'color'
        ]
    }
</script>

<style scoped lang="less">
    .staff-promo {
        background: #fff;
        background-position: right center;
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
