// 喜欢功能实现

import { useStore } from 'vuex'
import { computed } from 'vue'
import { FAVORITE_KEY } from '@/assets/js/constant'
import { save, remove } from '@/assets/js/array-store'

export default function useFavorite () {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  // 设置喜欢图标
  const getFavoriteIcon = (song) => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 判断歌曲是否在喜欢歌单中
  const isFavorite = (song) => {
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
  }

  const onFavoriteIconClick = song => {
    let newFavoriteList

    const compare = item => {
      return item.id === song.id
    }

    if (isFavorite(song)) {
      // 移除
      newFavoriteList = remove(FAVORITE_KEY, compare)
    } else {
      // 添加
      newFavoriteList = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', newFavoriteList)
  }

  return {
    getFavoriteIcon,
    onFavoriteIconClick
  }
}
