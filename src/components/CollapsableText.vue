<template>
    <div class="collapsableText">
        <div :class="isCollapsed ? 'text collapsed' : 'text'" ref="text" v-html="nl2br(text)"></div>
        <div class="toggleButton" v-on:click="Toggle()" v-if="canCollapse && isCollapsed">{{ $t('songdetail.showmore') }}</div>
        <div class="toggleButton" v-on:click="Toggle()" v-if="canCollapse && !isCollapsed">{{ $t('songdetail.showless') }}</div>
    </div>
</template>

<script>
    export default {
        name: 'CollapsableText',
        props: [
            'text'
        ],
        data: function() {
            return {
                isCollapsed: false,
                canCollapse: false
            }
        },
        mounted: function() {
            if(this.$refs.text.clientHeight > 84) {
                this.$data.isCollapsed = true;
                this.$data.canCollapse = true;
            } else {
                this.$data.isCollapsed = false;
                this.$data.canCollapse = false;
            }
        },
        methods: {
            nl2br: function(text) {
                return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
            },
            Toggle: function() {
                this.$data.isCollapsed = !this.$data.isCollapsed;
            }
        }
    }
</script>

<style scoped lang="less">
    & .collapsableText {
        & .text {
            line-height: 1.5em;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
            transition: 1s ease max-height;

            &.collapsed {
                max-height: 6em;
            }
        }
        & .toggleButton {
            margin-top: 10px;
            text-transform: uppercase;
            font-weight: bold;
            color: #f74e94;
            cursor: pointer;
            transition: 0.2s ease opacity;

            &:hover {
                opacity: 0.6;
            }
        }
    }
</style>
