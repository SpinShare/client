<template>
    <div class="review">
        <div class="metadata">
            <router-link :to="{ name: 'UserDetail', params: { id: user.id } }" class="avatar" :style="'background-image: url(' + user.coverReference + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"></router-link>
            <div class="text">
                <router-link :to="{ name: 'UserDetail', params: { id: user.id } }" class="username">{{ user.username }}</router-link>
                <div class="subline">
                    <i :class="recommended ? 'mdi mdi-thumb-up positive' : 'mdi mdi-thumb-down negative'"></i>
                    <span>{{ reviewDate.date | formatDate }}</span>
                </div>
            </div>
            <div class="actions">
            </div>
        </div>
        <div class="comment" v-if="comment">
            {{ comment }}
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard } = remote;

    export default {
        name: 'SongReview',
        props: [
            'id',
            'user',
            'recommended',
            'comment',
            'reviewDate'
        ],
        mounted: function() {
        },
        methods: {
        }
    }
</script>

<style scoped lang="less">
    .review {
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
        padding: 20px;

        & .metadata {
            display: grid;
            grid-template-columns: auto 1fr auto;
            grid-gap: 15px;

            & .avatar {
                width: 48px;
                height: 48px;
                border-radius: 48px;
                background-position: center;
                background-size: cover;
                display: block;
                color: #fff;
                text-decoration: none;
                transition: 0.2s ease-in-out opacity;

                &:hover {
                    opacity: 0.6;
                }
            }
            & .text {
                & .username {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                    color: #fff;
                    text-decoration: none;
                    transition: 0.2s ease-in-out opacity;

                    &:hover {
                        opacity: 0.6;
                    }
                }
                & .subline {
                    display: grid;
                    grid-gap: 5px;
                    grid-template-columns: auto 1fr;
                    align-items: center;

                    & i.positive { color: #62d38a; }
                    & i.negative { color: #f73c56; }

                    & span {
                        opacity: 0.6;
                    }
                }
            }
            & .actions {
                align-self: center;

                .action {
                    color: #fff;
                    text-decoration: none;
                    font-size: 18px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
                    border-radius: 4px;
                    padding: 5px 15px;
                    transition: 0.2s ease-in-out opacity;

                    &:hover {
                        opacity: 0.6;
                    }
                }
            }
        }

        & .comment {
            margin-top: 15px;
            line-height: 1.5em;
        }
    }
</style>
