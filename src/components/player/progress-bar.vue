<template>
  <div
    class="progress-bar"
    @click="onProgressClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        :style="progressStyle"
        ref="progressRef"
      ></div>
      <div class="progress-btn-wrapper">
        <div
          class="progress-btn"
          :style="btnStyle"
          :class="{ 'progress-btn-active':isSlider }"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  name: 'progress-bar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      offset: 0,
      isSlider: false
    }
  },
  watch: {
    progress (newProgress) {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * newProgress
    }
  },
  computed: {
    progressStyle () {
      return `width:${this.offset}px`
    },
    btnStyle () {
      return `transform:translate3d(${this.offset}px,0,0);`
    }
  },
  created () {
    this.touch = {}
    this.btnStyleCls = ''
  },
  methods: {
    onTouchStart (e) {
      // console.log('onTouchStart')
      // 初始点和当前播放进度
      this.isSlider = true
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progressRef.clientWidth
    },
    onTouchMove (e) {
      // 移动
      // console.log('onTouchMove')
      this.isSlider = true
      const delta = e.touches[0].pageX - this.touch.x1
      const tmpWidth = this.touch.beginWidth + delta
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const newProgress = Math.min(1,
        Math.max(0, tmpWidth / barWidth))
      this.offset = barWidth * newProgress
      this.$emit('progress-changing', newProgress)
    },
    onTouchEnd () {
      // console.log('onTouchEnd')
      this.isSlider = false
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const newProgress = this.$refs.progressRef.clientWidth / barWidth
      this.$emit('progress-changed', newProgress)
    },
    onProgressClick (e) {
      const rect = this.$el.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const newProgress = offsetWidth / barWidth
      this.$emit('progress-changed', newProgress)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: relative;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 11px; //7
        left: 7px;
        box-sizing: border-box;
        width: 8px; //16
        height: 8px; //16
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }

      .progress-btn-active {
        top: 2px; //5
        width: 25px; //20
        height: 25px; //20
      }
    }
  }
}
</style>
