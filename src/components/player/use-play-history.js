// 播放历史相关实现


import { useStore } from 'vuex';
import { save } from '@/assets/js/array-store';
import { PLAY_HISTORY_KEY } from '@/assets/js/constant';

export default function usePlayHistory () {
  const store = useStore()
  const maxLen = 50

  function savePlayHistory (song) {
    const songs = save(song, PLAY_HISTORY_KEY, (item) => {
      return item.id === song.id
    }, maxLen)

    store.commit('setPlayHistory', songs)
  }

  return {
    savePlayHistory
  }
}
