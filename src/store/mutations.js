// vuex 状态修改

const mutations = {
  setPlayerState (state, playerState) {
    state.playerState = playerState
  },
  setSequenceList (state, sequenceList) {
    state.sequenceList = sequenceList
  },
  setPlayList (state, playlist) {
    state.playlist = playlist
  },
  setPlayMode (state, playMode) {
    state.playMode = playMode
  },
  setCurrentPlayIndex (state, currentPlayIndex) {
    state.currentPlayIndex = currentPlayIndex
  },
  setIsPlayerFullScreen (state, isPlayerFullScreen) {
    state.isPlayerFullScreen = isPlayerFullScreen
  },
  setFavoriteList (state, favoriteList) {
    state.favoriteList = favoriteList
  },
  setSongLyric (state, {
    song,
    lyric
  }) {
    state.sequenceList.map((item) => {
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return item
    })
  },
  setSearchHistory (state, searchHistory) {
    state.searchHistory = searchHistory
  },
  setPlayHistory (state, songs) {
    state.playHistory = songs
  }
}

export default mutations
