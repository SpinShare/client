<template>
    <div
        :class="{
            's-form-actions': actions,
            's-form-row': !actions,
            's-form-row--vertical': !actions && vertical,
            's-form-row--nolabel': !actions && !label,
        }"
    >
        <div
            v-if="!actions"
            class="label"
        >
            {{ label }}
        </div>
        <div
            class="content"
        >
            <slot />
            <div
                v-if="hint && !actions"
                class="hint"
            >
                {{ hint }}
            </div>
            <div
                v-if="error && !actions"
                class="error"
            >
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SFormRow',
    props: {
        label: {
            type: [String, Boolean],
            required: false,
            default: false,
        },
        hint: {
            type: [String, Boolean],
            required: false,
            default: false,
        },
        error: {
            type: [String, Boolean],
            required: false,
            default: false,
        },
        actions: {
            type: Boolean,
            required: false,
            default: false,
        },
        vertical: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
}
</script>

<style lang="less" scoped>
.s-form-row {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: 15px;
    align-items: center;

    & .label {
        padding: 10px 0px;
        color: rgba(255,255,255,0.6);
    }
    & .content {
        display: grid;
        grid-gap: 5px;

        & .hint {
            font-size: 12px;
            color: rgba(255,255,255,0.4);
        }
        & .error {
            font-size: 12px;
            color: var(--colorError);
        }
    }

    &.s-form-row--vertical {
        grid-template-columns: 1fr;
        grid-gap: 0px;
    }
    &.s-form-row--nolabel {
        margin-top: 10px;
    }
}
.s-form-actions {
    margin-top: 10px;

    & .content {
        display: flex;
        grid-gap: 5px;
        justify-content: flex-end;
    }
}
.s-form-row, .s-form-actions {
    & input[type=text], & input[type=search], & input[type=password], & input[type=email], & select, & textarea {
        width: 100%;
        font-size: 16px;
        background: rgba(255,255,255,0.07);
        padding: 7px 15px;
        border-radius: 4px;
        border: 2px solid transparent;
        color: #fff;

        &:hover {
            background: rgba(255,255,255,0.14);
        }
        &:focus {
            outline: 0;
            border-color: rgba(227, 91, 152, 1);
        }
        & option {
            color: rgba(0,0,0,1);

            &:disabled {
                color: rgba(0,0,0,0.4);
            }
        }
    }
    & .toggle {
        display: flex;
        grid-gap: 5px;
        align-items: center;

        & input {
            appearance: none;
            background: rgba(255,255,255,0.14);
            width: 45px;
            height: 25px;
            border-radius: 100px;
            position: relative;
            transition: 0.2s ease-in-out all;
            outline: none;
            cursor: pointer;

            &::after {
                content: '';
                display: block;
                width: 18px;
                height: 18px;
                background: rgba(255,255,255,0.21);
                border-radius: 100px;
                position: absolute;
                top: 4px;
                left: 4px;
                transition: 0.15s ease-in-out all;
            }

            & + span {
                opacity: 0.4;
            }

            &:checked {
                background: rgba(227, 91, 152, 0.4);

                &::after {
                    left: 22px;
                    background: rgba(227, 91, 152, 1);
                }

                & + span {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
