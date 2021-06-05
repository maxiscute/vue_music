// 上拉加载效果实现

import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad (requestData, preventPullUpLoad) {
  const scroller = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollerVal = scroller.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    })

    scrollerVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler () {
      // 防止加载中上拉加载
      if (preventPullUpLoad.value) {
        scrollerVal.finishPullUp()
        return
      }

      isPullUpLoad.value = true
      await requestData()
      scrollerVal.finishPullUp()
      scrollerVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroller.value.destroy()
  })

  // keep-alive 优化
  onActivated(() => {
    scroller.value.enable()
    scroller.value.refresh()
  })

  onDeactivated(() => {
    scroller.value.disable()
  })

  return {
    rootRef,
    scroller,
    isPullUpLoad
  }
}
