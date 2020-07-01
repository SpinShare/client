<template>
    <div class="tab tab-reviews">
        <div class="review-overview" v-if="apiFinished">
            <div class="icon">
                <i class="mdi mdi-thumbs-up-down"></i>
            </div>
            <div class="text" v-if="reviewAverage == false">
                <div class="percentage">???%</div>
                <div class="label">{{ $t('songdetail.reviews.recommended.label') }}</div>
                <div class="disclaimer">{{ $t('songdetail.reviews.recommended.notenough') }}</div>
            </div>
            <div class="text" v-if="reviewAverage != false">
                <div class="percentage">{{ reviewAverage }}%</div>
                <div class="label">{{ $t('songdetail.reviews.recommended.label') }}</div>
                <div class="disclaimer">{{ $t('songdetail.reviews.recommended.basedon', {amountOfReviews: reviews.length}) }}</div>
            </div>
            <div v-on:click="OpenAddReview()" class="action-button">{{ $t('songdetail.reviews.recommended.addReview') }}</div>
        </div>
        <div class="reviews" v-if="apiFinished && reviews.length > 0">
            <SongReview
                v-for="review in reviews"
                v-bind:key="review.id"
                v-bind="review" />
        </div>
        <div class="no-reviews" v-if="apiFinished && reviews.length == 0">
            <div class="icon">
                <i class="mdi mdi-comment-question"></i>
            </div>
            <div class="text">
                <div class="title">{{ $t('songdetail.reviews.noresults.title') }}</div>
                <div class="explaination">{{ $t('songdetail.reviews.noresults.explaination') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron';
    const { clipboard, shell } = remote;

    import SSAPI from '@/modules/module.api.js';

    import SongReview from '@/components/Song/SongReview.vue';

    export default {
        name: 'SongDetailReviews',
        data: function() {
            return {
                apiFinished: false,
                reviewAverage: 0,
                reviews: []
            }
        },
        mounted: function() {
            let ssapi = new SSAPI();

            ssapi.getSongDetailReviews(this.$route.params.id).then((data) => {
                if(data.status == 200) {
                    this.$data.apiFinished = true;
                    this.$data.reviewAverage = data.data.average;
                    this.$data.reviews = data.data.reviews ? data.data.reviews : [];
                } else {
                    this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                }
            });
        },
        components: {
            SongReview
        },
        methods: {
            OpenAddReview: function() {
                shell.openExternal("https://spinsha.re/song/" + this.$route.params.id + "?tab=reviews");
            },
        }
    }
</script>

<style scoped lang="less">
    .tab-reviews {
        & .review-overview {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            padding: 20px 30px;
            display: grid;
            grid-template-columns: auto 1fr auto;
            grid-gap: 25px;
            align-items: center;

            & .icon {
                color: #fff;
                font-size: 48px;
            }
            & .text {
                & .percentage {
                    font-size: 32px;
                }
                & .label {
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 5px;
                }
                & .disclaimer {
                    opacity: 0.6;
                }
            }
            & .action-button {
                text-decoration: none;
                color: #fff;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.1em;
                background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
                padding: 10px 20px;
                border-radius: 4px;
                text-transform: uppercase;
                transition: 0.2s ease-in-out all;
                cursor: pointer;

                &:hover {
                    opacity: 0.6;
                }
            }
        }
        & .reviews {
            display: grid;
            grid-gap: 10px;
        }
        & .no-reviews {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            padding: 20px 30px;
            display: grid;
            grid-template-columns: auto 1fr;
            grid-gap: 25px;
            align-items: center;

            & .icon {
                color: #fff;
                font-size: 48px;
            }
            & .text {
                & .title {
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 0.05em;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }
                & .explaination {
                    opacity: 0.6;
                }
            }
        }
    }
</style>