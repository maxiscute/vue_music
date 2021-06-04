import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroller (wrapperRef, options, emit) {
  const scroller = ref(null)

  onMounted(() => {
    const scrollerVal = scroller.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })

    if (options.probeType > 0) {
      scrollerVal.on('scroll', (pos) => {
        emit('scroll', pos)
      })
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

  return scroller
}
