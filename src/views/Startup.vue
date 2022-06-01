<template>
    <section class="section-startup">
        <div class="tabs">
            <router-link to="/" class="tab"><span>{{ $t('startup.tabs.frontpage') }}</span></router-link>
            <router-link to="/new" class="tab"><span>{{ $t('startup.tabs.new') }}</span></router-link>
            <router-link to="/updated" class="tab"><span>{{ $t('startup.tabs.updated') }}</span></router-link>
            <router-link to="/hotThisWeek" class="tab"><span>{{ $t('startup.tabs.hotThisWeek') }}</span></router-link>
            <router-link to="/hotThisMonth" class="tab"><span>{{ $t('startup.tabs.hotThisMonth') }}</span></router-link>
        </div>

        <router-view></router-view>
    </section>
</template>

<script>
    export default {
        name: 'Startup',
    }
</script>

<style scoped lang="less">
    section {
        padding: 50px;

        & .tabs {
            display: flex;
            grid-gap: 10px;
            margin-bottom: 15px;

            & .tab {
                font-size: 12px;
                font-weight: bold;
                padding: 7px 20px;
                border-radius: 100px;
                background: rgba(255,255,255,0.07);
                color: rgba(255,255,255,0.4);
                transition: 0.2s ease-in-out all;
                text-decoration: none;

                &:not(.router-link-exact-active):hover {
                    cursor: pointer;
                    background: rgba(255,255,255,0.14);
                    color: rgba(255,255,255,0.75);
                }
                &.router-link-exact-active {
                    opacity: 1;
                    color: rgba(227, 91, 152, 1);
                    background: rgba(227, 91, 152, 0.4);
                }
            }
        }
    }
</style>