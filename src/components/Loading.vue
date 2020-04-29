<template>
    <div class="loading">
        <video src="@/assets/img/loading.webm" autoplay loop></video>
    </div>
</template>

<script>
    export default {
        name: 'Loading'
    }
</script>

<style scoped lang="less">
    .loading {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 64px;

        & video {
            width: 128px;
            height: 128px;
        }
    }
</style>
