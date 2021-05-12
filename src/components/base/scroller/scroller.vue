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
    }
  },
  setup (props) {
    const rootRef = ref(null)
    useScroller(rootRef, props)

    return { rootRef }
  }
}
</script>

<style lang="scss" scoped>

</style>
