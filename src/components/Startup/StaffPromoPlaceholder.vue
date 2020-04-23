<template>
    <div class="staff-promo-placeholder"></div>
</template>

<script>
    export default {
        name: 'StaffPromoPlaceholder'
    }
</script>

<style scoped lang="less">
    .staff-promo-placeholder {
        background: #fff;
        border-radius: 6px;
        padding: 50px;
        height: 256px;
        display: grid;
        transition: 0.2s ease all;
        grid-template-rows: auto 100px auto;
        background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.1));
        animation-name: promoLoadingShimmer;
        animation-fill-mode: forwards;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-duration: 1s;
    }

    @keyframes promoLoadingShimmer {
        from {
            background-position: 0px 0px;
        }
        to {
            background-position: 544px 0px;
        }
    }
</style>
