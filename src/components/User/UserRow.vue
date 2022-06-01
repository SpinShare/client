<template>
    <div class="user-row">
        <div class="user-list">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UserRow',
    }
</script>

<style scoped lang="less">
    .user-row {
        display: grid;
        grid-template-rows: 1fr;
        grid-gap: 5px;

        & .user-list {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 15px;
        }
    }
</style>
