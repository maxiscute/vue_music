<template>
  <div class="recommend">
<!--    <div class="slider">-->
<!--      <div class="slider__wrapper">-->
<!--        <div class="slider__wrapper__content">-->
<!--          <slider v-if="sliders.length" :sliders="sliders"></slider>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="slider-wrapper">
      <div class="slider-content">
        <slider v-if="sliders.length" :sliders="sliders"></slider>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider'

export default {
  name: 'recommend',
  data () {
    return {
      sliders: []
    }
  },
  components: {
    Slider
  },
  // 创建生命周期时获取轮播图
  async created () {
    const result = await getRecommend()
    console.log(result)
    this.sliders = result.sliders
  }
}
</script>

<style lang="scss" scoped>
.recommend{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .slider{
    &__wrapper{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      &__content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
  .slider-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;
    .slider-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
