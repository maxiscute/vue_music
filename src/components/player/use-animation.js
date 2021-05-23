import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import animations from 'create-keyframe-animation'

export default function useAnimation () {
  const coverWrapperRef = ref(null)
  const store = useStore()
  const playerState = computed(() => store.state.playerState)

  const enter = (el, done) => {
    const {
      x,
      y,
      scale
    } = getPosAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0,0,0) scale(1)'
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 300,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })

    animations.runAnimation(coverWrapperRef.value, 'move', done)
  }

  const afterEnter = () => {
    animations.unregisterAnimation('move')
    coverWrapperRef.value.animation = ''
  }

  const leave = (el, done) => {
    const {
      x,
      y,
      scale
    } = getPosAndScale()

    // const coverWrapperEle = coverWrapperRef.value
    //
    // coverWrapperEle.style.transition = 'all .3s cubic-bezier(0.45, 0, 0.55, 1)'
    //
    // coverWrapperEle.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
    //
    // coverWrapperEle.addEventListener('transitioned', next)
    //
    // function next () {
    //   coverWrapperEle.removeEventListener('transitioned', next)
    //   done()
    // }
    const animation = {
      100: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      0: {
        transform: 'translate3d(0,0,0) scale(1)'
      }
    }

    animations.registerAnimation({
      name: 'leave',
      animation,
      presets: {
        duration: 300,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })

    animations.runAnimation(coverWrapperRef.value, 'leave', done)
  }

  const afterLeave = () => {
    // const coverWrapperEle = coverWrapperRef.value
    // coverWrapperEle.style.transition = ''
    // coverWrapperEle.style.transform = ''
    animations.unregisterAnimation('leave')
    coverWrapperRef.value.animation = ''
  }

  const getPosAndScale = () => {
    const targetWidth = 40
    // 到矩形正心位置
    const targetPaddingLeft = 40
    const targetPaddingBottom = 30
    let PaddingTop
    let width
    if (playerState.value) {
      PaddingTop = 80
      width = window.innerWidth * 0.8
    } else {
      PaddingTop = 110
      width = window.innerWidth * 0.64
    }

    const x = -(window.innerWidth / 2 - targetPaddingLeft)
    const y = window.innerHeight - PaddingTop - width / 2 -
      targetPaddingBottom
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    coverWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
