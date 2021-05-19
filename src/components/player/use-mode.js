// 播放模式相关逻辑

import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode () {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  // 返回播放模式
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.shuffle
        ? 'icon-random'
        : 'icon-loop'
  })

  // 模式切换按钮点击
  const changeMode = () => {
    const nextMode = (playMode.value + 1) % 3
    // store.commit('setPlayMode', nextMode)
    store.dispatch('changeMode', nextMode)
  }

  return {
    modeIcon,
    changeMode
  }
}
