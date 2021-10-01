<template>
    <section class="section-userdetail-reviews">
        <div class="reviews" v-if="apiFinished">
            <div class="review-list" v-if="reviews.length > 0">
                <router-link :to="{ name: 'SongDetail', params: { id: review.song.id } }" class="review" v-for="review in reviews" :key="review.id">
                    <div class="metadata">
                        <div class="avatar" :style="'background-image: url(' + review.user.coverReference + '), url(' + require('@/assets/img/defaultAvatar.jpg') + ');'"></div>
                        <div class="text">
                            <div class="username">{{ review.user.username }}</div>
                            <div class="subline">
                                <i :class="review.recommended ? 'mdi mdi-thumb-up positive' : 'mdi mdi-thumb-down negative'"></i>
                                <span>{{ renderDate(review.reviewDate.date ) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="comment" v-if="review.comment != ''">{{ review.comment }}</div>
                </router-link>
            </div>
            <div class="song-list-noresults" v-if="apiFinished && reviews.length < 1">
                <div class="noresults-text">{{ this.$t('userdetail.reviews.noresults') }}</div>
            </div>
        </div>

        <Loading v-if="!apiFinished" style="padding: 50px 0px;" />
    </section>
</template>

<script>
    import moment from 'moment';

    import SSAPI from '@/modules/module.api.js';
    import Loading from '@/components/Loading.vue';

    export default {
        name: 'UserDetailReviews',
        components: {
            Loading,
        },
        data: function() {
            return {
                apiFinished: false,
                reviews: [],
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getUserReviews(this.$route.params.id).then((data) => {
                if(data.status == 200) {
                    console.log(data.data);
                    this.$data.reviews = data.data;
                    this.$data.apiFinished = true;
                } else {
                    this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                }
            });
        },
        methods: {
            renderDate( date ) {
                return moment( date ).format(this.$t('locale.dateFormat'));
            }
        }
    }
</script>

<style scoped lang="less">
    .section-userdetail-reviews {
        padding: 50px;

        & .review-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 25px;

            & .review {
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
                padding: 20px;
                display: block;
                transition: 0.2s ease-in-out opacity;

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
                        }
                        & .subline {
                            display: grid;
                            grid-gap: 5px;
                            grid-template-columns: auto 1fr;
                            align-items: center;
                            color: #fff;
                            text-decoration: none;

                            & i.positive { color: #62d38a; }
                            & i.negative { color: #f73c56; }

                            & span {
                                opacity: 0.6;
                            }
                        }
                    }
                }

                & .comment {
                    margin-top: 15px;
                    line-height: 1.5em;
                    word-break: normal;
                    color: #fff;
                    text-decoration: none;
                }

                &:hover {
                    opacity: 0.4;
                }
            }
        }

        & .song-list-noresults {
            display: block;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 25px;
            opacity: 0.6;
            text-align: center;
        }
    }
</style>