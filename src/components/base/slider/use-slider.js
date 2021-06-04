import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider (wrapperRef) {
  const currentPageIndex = ref(0)
  const slider = ref(null)

  onMounted(() => {
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })

    sliderVal.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slider.value.destroy()
  })

  // keep-alive 优化
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    currentPageIndex
  }
}
