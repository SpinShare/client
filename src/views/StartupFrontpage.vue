<template>
    <div class="frontpage">
        <div class="staff-promos">
            <StaffPromoPlaceholder
                v-if="isPromoLoading"
                v-for="n in 2"
                v-bind:key="n" />
            <StaffPromo
                v-if="!isPromoLoading"
                v-for="staffPromo in staffPromos"
                v-bind:key="staffPromo.id"
                v-bind="staffPromo" />
        </div>

        <Stream v-bind="streamStatus" />
    </div>
</template>

<script>
    import SSAPI from '@/modules/module.api.js';
    import StaffPromo from '@/components/Startup/StaffPromo.vue';
    import StaffPromoPlaceholder from '@/components/Startup/StaffPromoPlaceholder.vue';
    import Stream from '@/components/Startup/Stream.vue';

    export default {
        name: 'StartupFrontpage',
        data: function() {
            return {
                isPromoLoading: true,
                staffPromos: [],
                streamStatus: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI(process.env.NODE_ENV === 'development');

            ssapi.getPromos().then((data) => {
                this.$data.isPromoLoading = false;
                this.$data.staffPromos = data;
            });

            ssapi.getStreamStatus().then((data) => {
                this.$data.streamStatus = data;
            });
        },
        components: {
            StaffPromo,
            StaffPromoPlaceholder,
            Stream
        },
        methods: {
        }
    }
</script>

<style scoped lang="less">
    .staff-promos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 25px;
        width: 1114px;
        margin: 0 auto;

        &:empty {
            display: none;
        }
    }
</style>