<template>
<div class="top-list-detail">
  <music-list
    :songs="songs"
    :title="title"
    :pic="pic"
    :loading="loading"
    rank
  ></music-list>
</div>
</template>

<script>
import createDetailComponent from '@/assets/js/create-detail-component'
import { TOP_LIST_KEY } from '@/assets/js/constant'
import { getTopListDetail } from '@/service/top-list'

export default createDetailComponent('top-list-detail',
  TOP_LIST_KEY, getTopListDetail)
// export default {
//   name: 'top-list-detail'
// }
</script>

<style lang="scss" scoped>
.top-list-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
