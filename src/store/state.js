import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

// 播放器全局参数
const state = {
  sequenceList: [], // 顺序列表
  playlist: [], // 播放列表
  playerState: false, // 正在播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentPlayIndex: 0, // 正在播放曲目
  isPlayerFullScreen: false, // 播放器全屏
  favoriteList: [], // 喜爱列表
  searchHistory: load(SEARCH_KEY), // 搜索记录
  playHistory: [] // 播放历史
}

export default state
