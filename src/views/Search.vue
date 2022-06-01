<template>
    <section class="section-search">
        <aside>
            <SFormRow
                :label="$t('search.sidebar.searchType')"
                vertical
            >
                <select
                    v-model="searchType"
                    @change="clearSearch"
                >
                    <option value="charts">Charts</option>
                    <option value="users">Users</option>
                    <!-- <option value="playlists">Playlists</option> -->
                </select>
            </SFormRow>
            <SFormRow
                :label="$t('search.sidebar.searchQuery')"
                vertical
            >
                <input
                    type="search"
                    :placeholder="$t('search.input.placeholder')"
                    v-model="searchQuery"
                    @keyup.enter="search"
                    ref="searchInput"
                />
            </SFormRow>
            <SFormRow
                v-if="searchType === 'charts'"
                :label="$t('search.sidebar.difficultyIncluded')"
                vertical
            >
                <label class="toggle">
                    <input type="checkbox" v-model="searchDifficultyIncludedEasy" />
                    <span>{{ $t('search.sidebar.difficulty.easy') }}</span>
                </label>
                <label class="toggle">
                    <input type="checkbox" v-model="searchDifficultyIncludedNormal" />
                    <span>{{ $t('search.sidebar.difficulty.normal') }}</span>
                </label>
                <label class="toggle">
                    <input type="checkbox" v-model="searchDifficultyIncludedHard" />
                    <span>{{ $t('search.sidebar.difficulty.hard') }}</span>
                </label>
                <label class="toggle">
                    <input type="checkbox" v-model="searchDifficultyIncludedExpert" />
                    <span>{{ $t('search.sidebar.difficulty.expert') }}</span>
                </label>
                <label class="toggle">
                    <input type="checkbox" v-model="searchDifficultyIncludedXD" />
                    <span>{{ $t('search.sidebar.difficulty.xd') }}</span>
                </label>
            </SFormRow>
            <SFormRow
                v-if="searchType === 'charts'"
                :label="$t('search.sidebar.minimumDifficulty')"
                vertical
            >
                <input type="text" v-model="searchMinimumDifficulty">
            </SFormRow>
            <SFormRow
                v-if="searchType === 'charts'"
                :label="$t('search.sidebar.maximumDifficulty')"
                vertical
            >
                <input type="text" v-model="searchMaximumDifficulty">
            </SFormRow>
            <SFormRow
                actions
            >
                <SButton
                    icon="magnify"
                    :label="$t('search.search.button')"
                    @click="search"
                />
            </SFormRow>
        </aside>
        <div class="search-results">
            <UserRow
                v-if="searchType === 'users' && searchResults.length > 0 && apiState === 'done'"
            >
                <UserItem
                    v-for="user in searchResults"
                    v-bind:key="user.id"
                    v-bind="user" />
            </UserRow>
            <SongRow
                v-if="searchType === 'charts' && searchResults.length > 0 && apiState === 'done'"
                noactions
                with-sidebar
            >
                <template v-slot:song-list>
                    <SongItem
                        v-for="song in searchResults"
                        v-bind:key="song.id"
                        v-bind="song" />
                </template>
            </SongRow>
            <div
                v-if="searchResults.length === 0 && apiState === 'done'"
                class="search-results--noresults"
            >
                <span class="mdi mdi-help"></span>
                <p>{{ $t('search.noresults.text') }}</p>
            </div>
            <div
                class="search-results--idle"
                v-if="apiState === 'idle'"
            >
                <span class="mdi mdi-magnify"></span>
                <p>{{ $t('search.idle.text') }}</p>
            </div>
            <div
                class="search-results--loading"
                v-if="apiState === 'loading'"
            >
                <SLoadingSpinner />
            </div>
          </div>
    </section>
</template>

<script>
    import SSAPI from '@/modules/module.api.js';
    import UserRow from '@/components/User/UserRow.vue';
    import UserItem from '@/components/User/UserItem.vue';
    import SongRow from '@/components/Song/SongRow.vue';
    import SongItem from '@/components/Song/SongItem.vue';

    export default {
        name: 'Search',
        components: {
            UserRow,
            UserItem,
            SongRow,
            SongItem
        },
        data: function() {
            return {
                searchType: "charts",
                searchQuery: "",
                searchDifficultyIncludedEasy: true,
                searchDifficultyIncludedNormal: true,
                searchDifficultyIncludedHard: true,
                searchDifficultyIncludedExpert: true,
                searchDifficultyIncludedXD: true,
                searchMinimumDifficulty: 0,
                searchMaximumDifficulty: 99,
                searchResults: [],
                apiState: 'idle',
            }
        },
        mounted: function() {
            this.$refs.searchInput.focus();

            if(this.$route.params.searchQuery !== undefined) {
                console.log(this.$route.params.searchDifficultyIncludedEasy);

                this.searchType = this.$route.params.searchType || 'charts';
                this.searchQuery = this.$route.params.searchQuery || '';
                this.searchDifficultyIncludedEasy = this.$route.params.searchDifficultyIncludedEasy !== undefined ? this.$route.params.searchDifficultyIncludedEasy : true;
                this.searchDifficultyIncludedNormal = this.$route.params.searchDifficultyIncludedNormal !== undefined ? this.$route.params.searchDifficultyIncludedNormal : true;
                this.searchDifficultyIncludedHard = this.$route.params.searchDifficultyIncludedHard !== undefined ? this.$route.params.searchDifficultyIncludedHard : true;
                this.searchDifficultyIncludedExpert = this.$route.params.searchDifficultyIncludedExpert !== undefined ? this.$route.params.searchDifficultyIncludedExpert : true;
                this.searchDifficultyIncludedXD = this.$route.params.searchDifficultyIncludedXD !== undefined ? this.$route.params.searchDifficultyIncludedXD : true;
                this.searchMinimumDifficulty = this.$route.params.searchMinimumDifficulty || 0;
                this.searchMaximumDifficulty = this.$route.params.searchMaximumDifficulty || 99;

                switch(this.searchType) {
                    case 'users':
                        this.searchUsers();
                        break;
                    case 'charts':
                        this.searchCharts();
                        break;
                }
            }
        },
        methods: {
            clearSearch() {
                this.searchResults = [];
                this.apiState = 'idle';
            },
            search() {
                this.$router.push({
                    name: 'Search',
                    params: {
                        searchType: this.searchType,
                        searchQuery: this.searchQuery,
                        searchDifficultyIncludedEasy: this.searchDifficultyIncludedEasy,
                        searchDifficultyIncludedNormal: this.searchDifficultyIncludedNormal,
                        searchDifficultyIncludedHard: this.searchDifficultyIncludedHard,
                        searchDifficultyIncludedExpert: this.searchDifficultyIncludedExpert,
                        searchDifficultyIncludedXD: this.searchDifficultyIncludedXD,
                        searchMinimumDifficulty: this.searchMinimumDifficulty,
                        searchMaximumDifficulty: this.searchMaximumDifficulty,
                    },
                    query: {
                        t: new Date().getTime()
                    }
                });
            },
            searchUsers: function() {
                let ssapi = new SSAPI();
                this.apiState = 'loading';

                if(this.searchQuery !== '') {
                    ssapi.searchUsers(this.searchQuery).then((data) => {
                        if(data.status === 200) {
                            this.searchResults = data.data;
                        } else {
                            this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                        }
                    }).catch(() => {
                        this.$router.push({ name: 'Error', params: { errorCode: 500 } });
                    }).finally(() => {
                        this.apiState = 'done';
                    });
                }
            },
            searchCharts: function() {
                let ssapi = new SSAPI();
                this.apiState = 'loading';

                ssapi.searchCharts(
                    this.searchQuery,
                    this.searchDifficultyIncludedEasy,
                    this.searchDifficultyIncludedNormal,
                    this.searchDifficultyIncludedHard,
                    this.searchDifficultyIncludedExpert,
                    this.searchDifficultyIncludedXD,
                    this.searchMinimumDifficulty,
                    this.searchMaximumDifficulty,
                ).then((data) => {
                    if(data.status === 200) {
                        this.searchResults = data.data;
                    } else {
                        this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                    }
                }).catch(() => {
                    this.$router.push({ name: 'Error', params: { errorCode: 500 } });
                }).finally(() => {
                    this.apiState = 'done';
                });
            },
        }
    }
</script>

<style scoped lang="less">
    .section-search {
        display: grid;
        grid-template-columns: 300px 1fr;
        overflow: hidden;

        & aside {
            background: #161616;
            padding: 25px;
            display: flex;
            grid-gap: 15px;
            flex-direction: column;
        }
        & .search-results {
            padding: 50px;
            display: grid;
            overflow-y: scroll;

            & .search-results--noresults, & .search-results--idle {
                align-self: center;
                justify-self: center;
                text-align: center;
                max-width: 180px;
                display: flex;
                flex-direction: column;
                grid-gap: 10px;

                & span {
                    font-size: 32px;
                }
                & p {
                    margin: 0;
                    line-height: 1.5em;
                    opacity: 0.4;
                }
            }
            & .search-results--noresults {
                max-width: 300px;
            }

            & .search-results--loading {
                align-self: center;
                justify-self: center;
                text-align: center;
            }
        }
    }
</style>