import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'

import { load, saveAllItems } from '@/assets/js/array-store';

import '@/./assets/scss/index.scss'
import { FAVORITE_KEY, PLAY_HISTORY_KEY } from '@/assets/js/constant';
import { processSongs } from '@/service/song';

// 更新本地缓存歌曲
const favoriteSongs = load(FAVORITE_KEY)
const playHistorySongs = load(PLAY_HISTORY_KEY)

if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit('setFavoriteList', songs)
    saveAllItems(songs, FAVORITE_KEY)
  })
}

if (playHistorySongs.length > 0) {
  processSongs(playHistorySongs).then((songs) => {
    store.commit('setPlayHistory', songs)
    saveAllItems(songs, PLAY_HISTORY_KEY)
  })
}

// 应用创建
createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective)
  .directive('no-result', noResultDirective)
  .mount('#app')
