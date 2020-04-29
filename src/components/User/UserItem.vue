<template>
    <div class="user-item">
        <div class="user-avatar" :style="'background-image: url(' + avatar + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"></div>
        <div class="user-metadata">
            <div class="user-username">{{ username }}</div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard } = remote;

    export default {
        name: 'Useritem',
        props: [
            'id',
            'avatar',
            'username',
            'isPatreon',
            'isVerified'
        ],
        data: function() {
            return {
                isContextMenuActive: false
            }
        },
        mounted: function() {
        },
        methods: {
            showContextMenu: function(e) {
                this.$root.$emit('showContextMenu', {
                    x: e.pageX,
                    y: e.pageY,
                    items: [
                        { icon: "eye", title: "Open", method: function() { alert('TODO') }.bind(this) },
                        { icon: "link", title: "Copy Link", method: function() { clipboard.writeText('https://spinsha.re/song/' + this.$props.id) }.bind(this) },
                        { icon: "download", title: "Download", method: function() { this.$root.$emit('download', this.$props.isVerified); }.bind(this) }
                    ]});
            }
        }
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
            transform: scale(1.1);
            cursor: pointer;
            box-shadow: 0px 4px 20px 5px rgba(0, 0, 0, 0.4);
        }
    }
</style>
