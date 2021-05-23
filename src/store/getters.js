// Vuex获得状态函数

export const currentPlaySong = (state) => {
  return state.playlist[state.currentPlayIndex] || {}
}
