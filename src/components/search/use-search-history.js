// 搜索历史记录功能实现

import { save, remove, clear } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory () {
  // 保存条数
  const maxLen = 40

  const store = useStore()

  function saveSearchHistory (query) {
    const searches = save(query, SEARCH_KEY, (item) => {
      return item === query
    }, maxLen)

    store.commit('setSearchHistory', searches)
  }

  const deleteSearchHistoryItem = (query) => {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })

    store.commit('setSearchHistory', searches)
  }

  const clearSearchHistory = () => {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearchHistory,
    deleteSearchHistoryItem,
    clearSearchHistory
  }
}
