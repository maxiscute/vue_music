<template>
  <div class="recommend">
    推荐
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'

export default {
  name: 'recommend',
  // 创建生命周期时获取轮播图
  async created () {
    const result = await getRecommend()
    console.log(result)
  }
}
</script>

<style lang="sass" scoped>

</style>
