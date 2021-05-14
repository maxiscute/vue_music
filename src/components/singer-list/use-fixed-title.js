import { nextTick, ref, watch, computed } from 'vue'

export default function useFixedTitle (props) {
  // 固定栏高
  const TITLE_HEIGHT = 30
  // 列表对象
  const groupRef = ref(null)
  // 区间高度
  const listHeights = ref([])
  // 纵向滚动值
  const scrollY = ref(0)
  // 当前滑动到的区间
  const currentIndex = ref(0)
  const nextIndexDistance = ref(0)
  // const colors = ref(['#ffcd32'])

  // 当前应固定的索引
  const currentTitle = computed(() => {
    // 页面顶部向上拉动时无固定标题
    if (scrollY.value < 0) {
      return ''
    }

    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 固定栏切换
  const currentStyle = computed(() => {
    const nextIndexDistanceVal = nextIndexDistance.value
    const diff = (nextIndexDistanceVal > 0 &&
      nextIndexDistanceVal < TITLE_HEIGHT)
      ? nextIndexDistanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px, 0)`
    }
  })

  // 数据监听器，歌单数据改变时触发
  const stop = watch(() => props.data,
    async () => {
      await nextTick()
      calculateListHeights()
      stop()
    })

  // 滑动监听器
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      // 滚动到当前组区间
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        // 下一固定栏距顶部距离
        nextIndexDistance.value = heightBottom - newY
      }
    }
  })

  // 实时获取滑动值
  const onScroll = (pos) => {
    scrollY.value = -pos.y
  }

  // 计算每个区间的height
  const calculateListHeights = () => {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    // 当前高度
    let height = 0

    // 重算高度前清空
    listHeightsVal.length = 0
    // 添加新高度
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      // 高度累加
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  return {
    groupRef,
    onScroll,
    currentTitle,
    currentIndex,
    currentStyle
  }
}
