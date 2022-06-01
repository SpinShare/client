<template>
    <div class="song-item-loading">
        <div class="song-cover"></div>
        <div class="meta">
            <h1></h1>
            <h2></h2>
            <div class="difficulties">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SongItemPlaceholder',
    }
</script>

<style scoped lang="less">
    .song-item-loading {
        overflow: hidden;
        border-radius: 4px;
        background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.1));
        animation-name: songLoadingShimmer;
        animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-duration: 2s;
        height: 104px;
    }
    @keyframes songLoadingShimmer {
        from {
            background-position: 0px 0px;
        }
        to {
            background-position: 300px 0px;
        }
    }
</style>
