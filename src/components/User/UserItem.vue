<template>
    <router-link :to="{ name: 'UserDetail', params: { id: id } }" class="user-item">
        <div class="user-avatar" :style="'background-image: url(' + avatar + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"></div>
        <div class="user-metadata">
            <div class="user-username">{{ username }}</div>
            <div class="user-badge" v-if="isPatreon"><i class="mdi mdi-patreon"></i></div>
            <div class="user-badge" v-if="isVerified"><i class="mdi mdi-check-decagram"></i></div>
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
            'isPatreon',
            'isVerified'
        ]
    }
</script>

<style scoped lang="less">
    .user-item {
        background: #383c3f;
        transition: 0.2s ease-in-out transform, 0.2s ease-in-out box-shadow;
        overflow: hidden;
        border-radius: 6px;
        display: grid;
        padding: 10px;
        grid-gap: 15px;
        color: #fff;
        text-decoration: none;
        grid-template-columns: 32px 1fr;

        & .user-avatar {
            background: rgba(255,255,255,0.1);
            background-size: cover;
            background-position: center;
            width: 32px;
            height: 32px;
            border-radius: 32px;
        }

        & .user-metadata {
            display: flex;
            align-items: center;

            & .user-name {
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
            }
            & .user-badge {
                font-size: 18px;
                margin-left: 10px;
            }
        }

        &:hover {
            cursor: pointer;
            background: rgba(255,255,255,0.2);
            box-shadow: 0px 4px 20px 5px rgba(0, 0, 0, 0.4);
        }
    }
</style>
