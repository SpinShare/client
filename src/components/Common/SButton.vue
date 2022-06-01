<template>
    <button
        tabindex="0"
        type="button"
        :class="`color-${color} ${icon ? 'icon': ''}`"
        :disabled="disabled"
        @click="clickHandler"
    >
        <span
            v-if="icon && !loading"
            :class="`mdi mdi-${icon}`"
        />
        <span
            v-if="loading"
            class="mdi mdi-loading loading"
        />
        <span
            v-if="label"
            class="label"
        >
            {{ label }}
        </span>
    </button>
</template>

<script>
export default {
    name: 'SButton',
    props: {
        icon: {
            type: String|Boolean,
            required: false,
            default: false,
        },
        label: {
            type: String,
            required: false,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        color: {
            type: String,
            required: false,
            default: 'default',
        },
    },
    methods: {
        clickHandler () {
            this.$emit('click');
        },
    },
}
</script>

<style lang="less" scoped>
button {
    font-family: 'Work Sans', sans-serif;
    font-size: 14px;
    padding: 6px 11px;
    border: 2px solid transparent;
    border-radius: 4px;
    display: inline-flex;
    grid-gap: 7px;
    align-items: center;
    transition: 0.2s ease-in-out background, 0.2s ease-in-out color;
    max-width: none;

    &:focus {
        outline: none;
        border-color: #fb1357;
    }
    &:not(.icon) {
        padding: 12px 15px;
    }
    &.mini {
        padding: 5px 10px;

        &:not(.icon) {
            padding: 8px 15px;
        }
    }
    & .mdi {
        font-size: 16px;
    }
    & .loading {
        animation: loading 0.4s linear infinite;
    }
    & .label {
        line-height: 0.9em;
    }

    &.color-default {
        background: rgba(255,255,255,0.14);
        color: #fff;
    }
    &.color-transparent {
        background: transparent;
        color: #fff;
    }
    &.color-primary {
        background: #e22c78;
        color: #fff;
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.4;
    }
    &:not(:disabled):hover {
        cursor: pointer;

        &.color-default {
            background: rgba(255,255,255,0.21);
        }
        &.color-transparent {
            background: rgba(255,255,255,0.07);
        }
        &.color-primary {
            background: #bd2464;
            color: #fff;
        }
    }
    &:not(:disabled):active {
        &.color-default {
            background: rgba(255,255,255,0.28);
        }
        &.color-transparent {
            background: rgba(255,255,255,0.14);
        }
        &.color-primary {
            background: #961d4f;
            color: #fff;
        }
    }
}

@keyframes loading {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
