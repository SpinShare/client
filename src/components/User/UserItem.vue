<template>
    <router-link :to="{ name: 'UserDetail', params: { id: id } }" class="user-item">
        <div
            class="avatar"
            :style="'background-image: url(' + avatar + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"
        ></div>
        <div class="meta">
            <div class="username">
                <span>{{ username }}</span>
                <span
                    v-if="isPatreon"
                    class="mdi mdi-patreon"
                    v-tooltip="'Patreon Member'"
                ></span>
                <span
                    v-if="isVerified"
                    class="mdi mdi-check-decagram"
                    v-tooltip="'Verified'"
                ></span>
            </div>
            <div
                v-if="pronouns"
                class="pronouns"
            >
                {{ pronouns }}
            </div>
        </div>
    </router-link>
</template>

<script>
    export default {
        name: 'Useritem',
        props: [
            'id',
            'avatar',
            'username',
            'pronouns',
            'isPatreon',
            'isVerified'
        ]
    }
</script>

<style scoped lang="less">
    .user-item {
        padding: 7px 14px;
        border-radius: 4px;
        display: grid;
        grid-template-columns: 40px 1fr;
        grid-gap: 7px;
        align-items: center;
        transition: 0.2s ease-in-out background, 0.2s ease-in-out color;
        background: rgba(255,255,255,0.07);
        text-decoration: none;
        color: inherit;

        &:disabled {
            cursor: not-allowed;
            opacity: 0.4;
        }
        &:not(:disabled):hover {
            cursor: pointer;
            background: rgba(255,255,255,0.14);
        }
        & .avatar {
            width: 32px;
            height: 32px;
            background-color: rgba(255,255,255,0.07);
            border-radius: 100%;
            background-position: center;
            background-size: cover;
        }
        & .username {
            display: flex;
            grid-gap: 5px;
            align-items: center;
        }
        & .pronouns {
            opacity: 0.6;
            font-size: 12px;
            margin-top: 4px;
        }
    }
</style>
