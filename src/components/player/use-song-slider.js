import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';

BScroll.use(Slide)

export default function useSongSlider () {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const currentIndex = computed(() => store.state.currentPlayIndex)

  const store = useStore()
  const fullScreen = computed(() => store.state.isPlayerFullScreen)
  const playlist = computed(() => store.state.playlist)

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playlist.value
  })

  onMounted(() => {
    let sliderWrapperVal

    watch(sliderShow, async (newSliderShow) => {
      await nextTick()
      if (!sliderWrapperVal) {
        sliderWrapperVal = slider.value = new BScroll(sliderWrapperRef.value, {
          click: true,
          scrollX: true,
          scrollY: false,
          momentum: false,
          bounce: false,
          probeType: 2,
          slide: {
            autoplay: false,
            loop: true
          }
        })

        sliderWrapperVal.on('slidePageChanged', ({ pageX }) => {
          store.commit('setCurrentPlayIndex', pageX)
        })
      } else {
        sliderWrapperVal.refresh()
      }
      sliderWrapperVal.goToPage(currentIndex.value, 0, 0)
    })

    watch(currentIndex, (newIndex) => {
      if (sliderWrapperVal && sliderShow.value) {
        sliderWrapperVal.goToPage(newIndex, 0, 0)
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
