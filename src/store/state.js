import { PLAY_MODE } from '@/assets/js/constant'

// 播放器全局参数
const state = {
  sequenceList: [], // 顺序列表
  playlist: [], // 播放列表
  playerState: false, // 正在播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentPlayIndex: 0, // 正在播放曲目
  isPlayerFullScreen: false // 播放器全屏
}

export default state
