// 上拉加载效果实现

import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad (requestData) {
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

  return {
    rootRef,
    scroller,
    isPullUpLoad
  }
}
