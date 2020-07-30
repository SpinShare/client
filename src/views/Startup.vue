<template>
    <section class="section-startup">
        <div class="tabs">
            <router-link to="/"><span>{{ $t('startup.tabs.frontpage') }}</span></router-link>
            <router-link to="/new"><span>{{ $t('startup.tabs.new') }}</span></router-link>
            <router-link to="/hot"><span>{{ $t('startup.tabs.hot') }}</span></router-link>
            <router-link to="/popular"><span>{{ $t('startup.tabs.popular') }}</span></router-link>
        </div>

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
        padding: 50px;

        & .tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 25px;

            & a {
                color: inherit;
                text-decoration: none;
                font-weight: bold;
                letter-spacing: 0.1em;
                padding: 10px 15px;
                margin: 0px 5px;
                text-align: center;
                text-transform: uppercase;
                opacity: 0.6;
                transition: 0.2s ease-in-out background, 0.2s ease-in-out opacity;

                & span {
                    display: block;
                    transition: 0.2s ease-in-out transform;
                    transform: translateY(4px);
                }
                &:hover {
                    background: rgba(255,255,255,0.2);
                    border-radius: 5px;
                }
                &:after {
                    transition: 0.2s ease-in-out background;
                    margin: 0 auto;
                    margin-top: 5px;
                    width: 20px;
                    height: 3px;
                    border-radius: 5px;
                    background: transparent;
                    content: "";
                    display: block;
                }

                &.router-link-exact-active {
                    opacity: 1;

                    & span {
                        transform: translateY(0px);
                    }
                    &:after {
                        background: linear-gradient(135deg, #fd2f85, #7a34ec);
                    }
                }
            }
        }
    }
</style>