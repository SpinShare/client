<template>
    <section class="section-startup">
        <header>
            <div class="tabs">
                <router-link to="/" class="tab"><span>{{ $t('startup.tabs.frontpage') }}</span></router-link>
                <router-link to="/new" class="tab"><span>{{ $t('startup.tabs.new') }}</span></router-link>
                <router-link to="/hot" class="tab"><span>{{ $t('startup.tabs.hot') }}</span></router-link>
            </div>
        </header>

        <router-view></router-view>
    </section>
</template>

<script>
    import SSAPI from '@/modules/module.api.js';

    export default {
        name: 'Startup',
    }
</script>

<style scoped lang="less">
    section {
        & header {
            background: rgba(0,0,0,0.5);
            padding: 25px 50px;
            padding-bottom: 0px;

            & .tabs {
                display: flex;

                & .tab {
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.25em;
                    padding: 15px 40px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    background: rgba(0,0,0,0.6);
                    color: rgba(255,255,255,0.4);
                    transition: 0.2s ease-in-out all;
                    text-decoration: none;

                    &:not(.active):hover {
                        cursor: pointer;
                        background: #272c2e;
                        color: rgba(255,255,255,0.75);
                    }
                    &.router-link-exact-active {
                        opacity: 1;
                        color: rgba(255,255,255,1);
                        background: #212629;
                    }
                }
            }
        }
    }
</style>