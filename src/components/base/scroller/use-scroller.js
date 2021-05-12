import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroller (wrapperRef, options) {
  const scroller = ref(null)

  onMounted(() => {
    scroller.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })

  onUnmounted(() => {
    scroller.value.destroy()
  })
  return {
    scroller
  }
}
