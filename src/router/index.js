import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import axios from 'axios';
import ViewStartup from '../views/Startup.vue';
import ViewStartupFrontpage from '../views/StartupFrontpage.vue';
import ViewStartupNewSongs from '../views/StartupNewSongs.vue';
import ViewStartupHotSongs from '../views/StartupHotSongs.vue';
import ViewStartupPopularSongs from '../views/StartupPopularSongs.vue';
import ViewSearch from '../views/Search.vue';
import ViewLibrary from '../views/Library.vue';
import ViewSongDetail from '../views/SongDetail.vue';
import ViewSongDetailReviews from '../views/SongDetailReviews.vue';
import ViewSongDetailSpinPlays from '../views/SongDetailSpinPlays.vue';
import ViewUserDetail from '../views/UserDetail.vue';
import ViewUserDetailCharts from '../views/UserDetailCharts.vue';
import ViewUserDetailReviews from '../views/UserDetailReviews.vue';
import ViewUserDetailSpinPlays from '../views/UserDetailSpinPlays.vue';
import ViewSettings from '../views/Settings.vue';
import ViewTournament from '../views/Tournament.vue';
import ViewError from '../views/Error.vue';

Vue.use(VueRouter);
Vue.use(VueAxios, axios);

const routes = [{
    path: '/',
    name: 'Startup',
    component: ViewStartup,
    children: [
        {
            path: '',
            name: 'StartupFrontpage',
            component: ViewStartupFrontpage
        },
        {
            path: '/new',
            name: 'StartupNew',
            component: ViewStartupNewSongs
        },
        {
            path: '/hot',
            name: 'StartupHot',
            component: ViewStartupHotSongs
        },
        {
            path: '/popular',
            name: 'StartupPopular',
            component: ViewStartupPopularSongs
        }
    ]
}, {
    path: '/search/:searchQuery?',
    name: 'Search',
    component: ViewSearch
}, {
    path: '/library',
    name: 'Library',
    component: ViewLibrary
}, {
    path: '/song/:id',
    name: 'SongDetail',
    component: ViewSongDetail,
    redirect: {
      name: 'SongDetailReviews'
    },
    children: [
        {
            alias: '',
            path: 'reviews',
            name: 'SongDetailReviews',
            component: ViewSongDetailReviews
        },
        {
            path: 'spinplays',
            name: 'SongDetailSpinPlays',
            component: ViewSongDetailSpinPlays
        }
    ]
}, {
    path: '/user/:id',
    name: 'UserDetail',
    component: ViewUserDetail,
    redirect: {
      name: 'UserDetailCharts'
    },
    children: [
        {
            alias: '',
            path: 'charts',
            name: 'UserDetailCharts',
            component: ViewUserDetailCharts
        },
        {
            alias: '',
            path: 'reviews',
            name: 'UserDetailReviews',
            component: ViewUserDetailReviews
        },
        {
            alias: '',
            path: 'spinplays',
            name: 'UserDetailSpinPlays',
            component: ViewUserDetailSpinPlays
        }
    ]
}, {
    path: '/settings',
    name: 'Settings',
    component: ViewSettings
}, {
    path: '/tournament',
    name: 'Tournament',
    component: ViewTournament
}, {
    path: '/error/:errorCode',
    name: 'Error',
    component: ViewError
}];

const router = new VueRouter({
    routes
});

export default router;
