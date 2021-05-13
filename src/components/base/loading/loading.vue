<template>
  <div className="loading">
    <div className="loading-content">
      <img width="24" height="24" src="./loading.gif">
      <p className="desc">{{ loadingMsg }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'loading',
  // data () {
  //   return {
  //     title: '正在载入...'
  //   }
  // },
  setup () {
    // 对loading directive提供的内部方法, 来动态修改loadingMessage的值
    const loadingMsg = ref('正在载入中...')

    // 对loading directive提供的内部方法, 来动态修改loadingMessage的值
    const setLoadingMsg = msg => {
      loadingMsg.value = msg
    }
    return {
      loadingMsg,
      setLoadingMsg
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  .loading-content {
    text-align: center;

    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>
