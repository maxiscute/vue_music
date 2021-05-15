import { computed, ref } from 'vue'

export default function useShortcut (props, groupRef) {
  const scrollRef = ref(null)
  const ANCHOR_HEIGHT = 18
  const touch = {}
  const isTouch = ref(false)

  const shortcutList = computed(() => {
    return props.data.map((item) => {
      return item.title
    })
  })

  // 按下导航栏
  const onShortcutTouchStart = (e) => {
    console.log('touch fixed')
    const anchorIndex = parseInt(e.target.dataset.index)
    // 记录按下坐标、索引
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    isTouch.value = true
    scrollToIndex(anchorIndex)
  }

  // 在导航栏上滑动时
  const onShortcutTouchMove = (e) => {
    // touch和move的纵坐标做差
    touch.y2 = e.touches[0].pageY
    const moveY = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const newIndex = touch.anchorIndex + moveY
    isTouch.value = true
    scrollToIndex(newIndex)
  }

  // 抬起手指
  const onShortcutTouchEnd = (e) => {
    isTouch.value = false
  }

  const scrollToIndex = (index) => {
    if (isNaN(index)) {
      return
    }
    // 防止超出列表目标
    index = Math.max(0,
      Math.min(shortcutList.value.length - 1, index))

    const targetEle = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEle, 0)
  }

  return {
    shortcutList,
    scrollRef,
    isTouch,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd
  }
}
