<template>
    <div class="user-row">
        <div class="user-header">
            <div class="row-title">{{ title }}</div>
        </div>
        <div class="user-list">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UserRow',
        props: [
            'title'
        ]
    }
</script>

<style scoped lang="less">
    .user-row {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-gap: 5px;

        & .user-header {
            display: grid;
            grid-template-columns: 1fr auto;

            & .row-title {
                letter-spacing: 0.25em;
                font-size: 14px;
                font-weight: bold;
                text-transform: uppercase;
                margin: 10px 0px;
            }
        }
        & .user-list {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 15px;
        }
    }
</style>
