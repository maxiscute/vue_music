<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import useScroller from '@/components/base/scroller/use-scroller'
import { ref } from 'vue'

export default {
  name: 'scroller',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    // 滚动属性
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'],
  setup (props, { emit }) {
    const rootRef = ref(null)
    useScroller(rootRef, props, emit)

    return { rootRef }
  }
}
</script>

<style lang="scss" scoped>

</style>
