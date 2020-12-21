<template>
    <div class="playlist-row">
        <div class="playlist-list">
            <slot name="playlist-list"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlaylistRow'
}
</script>

<style scoped lang="less">

.playlist-row {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-gap: 5px;

    & .playlist-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
    }
}
</style>
