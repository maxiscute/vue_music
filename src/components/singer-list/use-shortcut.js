import { computed, ref } from 'vue'

export default function useShortcut (props, groupRef) {
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map((item) => {
      return item.title
    })
  })

  // 按下导航栏
  const onShortcutTouchStart = (e) => {
    console.log('touch fixed')
    const anchorIndex = parseInt(e.target.dataset.index)
    console.log(anchorIndex)
    const targetEle = groupRef.value.children[anchorIndex]
    const scroll = scrollRef.value.scroll
    // console.log('scroll', scroll)
    // console.log('scroll value', scrollRef.value)
    // console.log(targetEle)
    scroll.scrollToElement(targetEle, 0)
  }

  const onShortcutTouchMove = (e) => {

  }

  const onShortcutTouchEnd = (e) => {

  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd
  }
}
