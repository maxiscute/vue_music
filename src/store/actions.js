import { PLAY_MODE } from '@/assets/js/constant'
import { shuffleArray } from '@/assets/js/util'

// 选择播放
export function selectPlay ({
  commit
}, {
  list,
  index
}) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayerState', true)
  commit('setIsPlayerFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentPlayIndex', index)
}

// 随机播放
export function shufflePlay ({
  commit
}, list) {
  commit('setPlayMode', PLAY_MODE.shuffle)
  commit('setSequenceList', list)
  commit('setPlayerState', true)
  commit('setIsPlayerFullScreen', true)
  commit('setPlayList', shuffleArray(list))
  commit('setCurrentPlayIndex', 0)
}

// 模式切换
export function changeMode ({
  commit,
  state,
  getters
}, mode) {
  const currentID = getters.currentPlaySong.id

  // 随机模式
  if (mode === PLAY_MODE.shuffle) {
    commit('setPlayList', shuffleArray(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }

  const index = state.playlist.findIndex((song) => {
    return song.id === currentID
  })

  commit('setCurrentPlayIndex', index)
  commit('setPlayMode', mode)
}

// 从列表中移除歌曲
export function removeSongFromList ({
  commit,
  state
}, song) {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playlistIndex = findIndex(playlist, song)

  // 防止多次快速点击删除
  if (sequenceIndex < 0 || playlistIndex < 0) {
    return
  }

  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playlistIndex, 1)

  let currentPlayIndex = state.currentPlayIndex
  if (playlistIndex < currentPlayIndex || currentPlayIndex === playlist.length) {
    currentPlayIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playlist)
  commit('setCurrentPlayIndex', currentPlayIndex)

  if (!playlist.length) {
    commit('setPlayerState', false)
  }
}

// 寻找索引辅助函数
const findIndex = (list, song) => {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
