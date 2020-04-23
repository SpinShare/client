<template>
    <div ref="contextMenu" :class="'context-menu ' + (isActive ? 'active' : '')" :style="'top: ' + posY + 'px; left: ' + posX + 'px;'">
        <div class="menu-item" v-for="item in items" v-on:click="item.method">
            <div class="icon"><i :class="'mdi mdi-' + item.icon"></i></div>
            <div class="text">{{ item.title }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ContextMenu',
        data: function() {
            return {
                isActive: false,
                posX: 0,
                posY: 0,
                items: []
            }
        },
        mounted() {
            this.$root.$on('showContextMenu', (data) => {
                this.show(data.x, data.y, data.items);
            });
            this.$root.$on('hideContextMenu', () => {
                this.hide();
            });
        },
        methods: {
            show: function(x, y, items) {
                this.$data.items = items;
                this.$data.posX = x;
                this.$data.posY = y;
                this.$data.isActive = true;
            },
            hide: function() {
                this.$data.isActive = false;
                this.$data.items = [];
            }
        },
        created: function() {
            document.addEventListener('click', () => {
                this.hide();
            });
        }
    }
</script>

<style scoped lang="less">
    .context-menu {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 250px;
        background: #000;
        border-radius: 6px;
        z-index: 90;
        display: none;
        overflow: hidden;
        box-shadow: 0px 2px 4px rgba(0,0,0,0.4);

        & .menu-item {
            padding: 10px;
            display: grid;
            grid-template-columns: 24px 1fr;
            grid-gap: 10px;

            & .icon {
                width: 24px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
            }
            & .text {
                display: flex;
                align-items: center;
            }

            &:hover {
                background: rgba(255,255,255,0.2);
                cursor: pointer;
            }
        }

        &.active {
            display: block;
        }
    }
</style>
