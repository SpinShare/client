<template>
    <section class="section-search">
        <header>
            <div class="title">{{ $t('search.header') }}</div>
            <div class="actions">
                <input type="search" :placeholder="$t('search.input.placeholder')" v-on:input="searchInput()" v-model="searchQuery" ref="searchInput">
                <div class="button" v-on:click="searchAll()">{{ $t('search.showall.button') }}</div>
            </div>
        </header>
        <div class="search-results">
            <UserRow :title="$t('search.results.users.header')" v-show="searchResultsUsers.length > 0">
                <UserItem
                    v-for="user in searchResultsUsers"
                    v-bind:key="user.id"
                    v-bind="user" />
            </UserRow>
            <SongRow :title="$t('search.results.songs.header')" noactions="true" v-show="searchResultsSongs.length > 0">
                <template v-slot:song-list>
                    <SongItem
                        v-for="song in searchResultsSongs"
                        v-bind:key="song.id"
                        v-bind="song" />
                </template>
            </SongRow>
            <div class="search-results-noresults" v-show="searchResultsUsers.length == 0 && searchResultsSongs.length == 0 && apiFinished">
                <div class="noresults-title">{{ searchQuery }}</div>
                <div class="noresults-text">{{ $t('search.noresults.text') }}</div>
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
                searchQuery: "",
                searchResultsUsers: [],
                searchResultsSongs: [],
                apiFinished: false,
                searchTimeout: null
            }
        },
        mounted: function() {
            this.$refs.searchInput.focus();

            console.log(this.$route.params.searchQuery);

            if(this.$route.params.searchQuery != "" && this.$route.params.searchQuery != undefined) {
                this.$data.searchQuery = this.$route.params.searchQuery;
                this.search();
            }
        },
        methods: {
            searchInput: function() {
                if(this.$data.searchTimeout) {
                    clearTimeout(this.$data.searchTimeout);
                }

                this.$data.searchTimeout = setTimeout(() => {
                    this.$router.push({ name: 'Search', params: { searchQuery: this.$data.searchQuery } });
                    this.search();
                }, 500);
            },
            searchAll: function() {
                let ssapi = new SSAPI(process.env.NODE_ENV === 'development');

                this.$data.searchQuery == "";
                this.$data.apiFinished = false;

                ssapi.searchAll().then((data) => {
                    if(data.status == 200) {
                        this.$data.searchResultsUsers = data.data.users;
                        this.$data.searchResultsSongs = data.data.songs;
                        this.$data.apiFinished = true;
                    } else {
                        this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                    }
                }).catch(() => {
                    this.$router.push({ name: 'Error', params: { errorCode: 500 } });
                });
            },
            search: function() {
                let ssapi = new SSAPI(process.env.NODE_ENV === 'development');
                this.$data.apiFinished = false;

                if(this.$data.searchQuery != "") {
                    ssapi.search(this.$data.searchQuery).then((data) => {
                        if(data.status == 200) {
                            this.$data.searchResultsUsers = data.data.users;
                            this.$data.searchResultsSongs = data.data.songs;

                            this.$data.apiFinished = true;
                        } else {
                            this.$router.push({ name: 'Error', params: { errorCode: data.status } });
                        }
                    }).catch(() => {
                        this.$router.push({ name: 'Error', params: { errorCode: 500 } });
                    });
                } else {
                    this.$data.searchResultsUsers = [];
                    this.$data.searchResultsSongs = [];

                    this.$data.apiFinished = false;
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .section-search {
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
                grid-template-columns: 1fr auto;
                grid-gap: 15px;
                align-items: center;

                & .show-all {
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0px 10px;
                }

                input {
                    width: 100%;
                    font-family: 'Open Sans', sans-serif;
                    font-size: 14px;
                    background: transparent;
                    color: #fff;
                    border-radius: 4px;
                    padding: 9px 20px;
                    background: rgba(255,255,255,0.2);
                    border: 0px;
                    transition: 0.2s ease-in-out all;
                
                    &:hover {
                        background: rgba(255,255,255,0.1);
                        color: #fff;
                    }
                    &:focus {
                        outline: 0;
                        border-color: rgba(255,255,255,0.6);
                    }
                    &::placeholder {
                        color: rgba(255,255,255,0.6);
                    }
                }
            }
        }
        & .search-results {
            display: grid;
            grid-template-rows: auto auto auto 1fr;
            grid-gap: 25px;
            padding: 50px;
            padding-top: 25px;

            & .search-results-users {
                display: grid;
            }

            & .search-results-songs {
                display: grid;
            }

            & .search-results-noresults {
                background: rgba(255,255,255,0.1);
                border-radius: 6px;
                padding: 25px;
                display: block;

                & .noresults-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                & .noresults-text {
                    opacity: 0.6;
                }
            }
        }
    }
</style>