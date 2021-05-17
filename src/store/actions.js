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
