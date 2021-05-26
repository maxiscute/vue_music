import Scroller from '@/components/base/scroller/scroller'
import { computed, h, mergeProps, nextTick, ref, renderSlot, watch, withCtx } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'wrap-scroller',
  props: Scroller.props,
  emits: Scroller.emits,
  render (ctx) {
    return h(Scroller, mergeProps({ ref: 'scrollerRef' },
      ctx.$props, {
        onScroll: (e) => {
          ctx.$emit('scroll', e)
        }
      }), {
      default: withCtx(() => {
        return [renderSlot(ctx.$slots, 'default')]
      })
    })
  },
  setup () {
    const scrollerRef = ref(null)

    const scroll = computed(() => {
      return scrollerRef.value.scroll
    })

    const store = useStore()
    const playlist = computed(() => store.state.playlist)

    watch(playlist, async () => {
      await nextTick()
      scrollerRef.value.scroll.refresh()
    })

    return {
      scrollerRef,
      scroll
    }
  }
}

