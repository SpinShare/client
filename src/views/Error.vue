<template>
    <section class="section-error">
        <header>
            <div class="title">{{ errorCode }} - {{ errorTitle }}</div>
            <div class="description">
                {{ errorText }}
            </div>
        </header>
        <div class="error-content">
            <SButton
                icon="refresh"
                label="Try again"
                @click="retry"
            />
        </div>
    </section>
</template>

<script>
    export default {
        name: 'Error',
        data: function() {
            return {
                errorCode: 500,
                errorTitle: "",
                errorText: "",
            }
        },
        mounted: function() {
            switch(status) {
                default: 
                    this.$data.errorCode = this.$route.params.errorCode;
                    this.$data.errorTitle = this.$t('connectionerror.server.title');
                    this.$data.errorText = this.$t('connectionerror.server.text');
                    break;
                case 404:
                case 403:
                    this.$data.errorCode = this.$route.params.errorCode;
                    this.$data.errorTitle = this.$t('connectionerror.notfound.title');
                    this.$data.errorText = this.$t('connectionerror.notfound.text');
                    break;
            }
        },
        methods: {
            retry: function() {
                this.$router.back();
            }
        }
    }
</script>

<style scoped lang="less">
    .section-error {
        & header {
            background: rgba(0,0,0,0.3);
            padding: 50px;
            padding-bottom: 25px;

            & .title {
                font-size: 32px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 15px;
                font-family: 'Oswald', sans-serif;
            }
            & .actions {
                display: grid;
                grid-template-columns: auto auto auto auto 1fr;
                grid-gap: 15px;
            }
        }
        & .error-content {
            padding: 25px 50px;
            line-height: 1.5em;
            display: flex;
        }
    }
</style>