<template>
    <section class="section-search">
        <div class="search-bar">
            <div class="show-all">
                <div class="button button-label" v-on:click="searchAll()" locale="">Show all</div>
            </div>
            <input type="search" placeholder="Search for songs, tags &amp; profiles..." v-on:input="search()" v-model="searchQuery">
        </div>
        <div class="search-results">
            <UserRow title="Users" v-show="searchResultsUsers.length > 0">
                <UserItem
                    v-for="user in searchResultsUsers"
                    v-bind:key="user.id"
                    v-bind="user" />
            </UserRow>
            <SongRow title="Songs" noactions="true" v-show="searchResultsSongs.length > 0">
                <template v-slot:song-list>
                    <SongItem
                        v-for="song in searchResultsSongs"
                        v-bind:key="song.id"
                        v-bind="song" />
                </template>
            </SongRow>
            <div class="search-results-noresults" v-show="searchResultsUsers.length == 0 && searchResultsSongs.length == 0 && apiFinished">
                <div class="noresults-title">{{ searchQuery }}</div>
                <div class="noresults-text">Your search did not match any songs or users. Make sure, that all words are spelled correctly or try a different query.</div>
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
                apiFinished: false
            }
        },
        methods: {
            searchAll: function() {
                let ssapi = new SSAPI(process.env.NODE_ENV === 'development');

                this.$data.searchQuery == "";
                this.$data.apiFinished = false;

                ssapi.searchAll().then((data) => {
                    if(data.status == 200) {
                        this.$data.searchResultsUsers = data.data.users;
                        this.$data.searchResultsSongs = data.data.songs;
                        this.$data.apiFinished = true;
                    }
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
                        }
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
        grid-template-rows: auto 1fr;
        grid-gap: 25px;
        padding: 50px;
        display: grid;

        & .search-bar {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            display: grid;
            grid-template-columns: auto 1fr;

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
                padding: 14px 28px;
                border: 0px;
                transition: 0.2s ease-in-out all;
            
                &:hover {
                    background: rgba(255,255,255,0.2);
                    color: #fff;
                }
                &:focus {
                    outline: 0;
                }
                &::placeholder {
                    color: rgba(255,255,255,0.6);
                }
            }
        }
        & .search-results {
            display: grid;
            grid-template-rows: auto auto auto 1fr;
            grid-gap: 25px;

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