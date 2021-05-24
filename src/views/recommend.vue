<template>
  <div class="recommend" v-loading:[message]="loading">
    <!--    滚动组件-->
    <scroller class="scroller_wrapper">
      <div>
        <!--    轮播图-->
        <div class="slider">
          <div class="slider__wrapper">
            <div class="slider__wrapper__content">
              <slider v-if="sliders.length" :sliders="sliders"></slider>
            </div>
          </div>
        </div>
        <!--   热门歌单推荐-->
        <div class="recommend__list">
          <h1 class="recommend__list__title"
              v-show="!loading">热门歌单</h1>
          <ul>
            <li
              v-for="item in albums"
              class="recommend__list__item"
              @click.stop="onAlbumItemClick(item)"
              :key="item.id"
            >
              <div class="recommend__list__item__icon">
                <img
                  width="60" height="60"
                  v-lazy="item.pic" alt="">
              </div>
              <div class="recommend__list__item__text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component
          :is="Component"
          :data="clickedAlbum"
        />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider/slider'
import Scroller from '@/components/base/scroller/scroller'
import storage from 'good-storage'
import { ALBUM_KEY } from '@/assets/js/constant'

export default {
  name: 'recommend',
  data () {
    return {
      // banner
      sliders: [],
      // 歌单
      albums: [],
      // 加载文字
      message: '正在载入中...',
      clickedAlbum: null
    }
  },
  computed: {
    loading () {
      return !this.sliders.length && !this.albums.length
    }
  },
  components: {
    Slider,
    Scroller
  },
  methods: {
    onAlbumItemClick (album) {
      console.log('onAlbumItemClick', album)
      // console.log(album.id)
      this.clickedAlbum = album
      this.cachedAlbum(album)
      // console.log('push')
      this.$router.push({
        path: `/recommend/${album.id}`
      })
    },
    cachedAlbum (album) {
      storage.session.set(ALBUM_KEY, album)
    }
  },
  // 创建生命周期时获取轮播图、歌单
  async created () {
    // 使用请求服务返回处理后的结果
    const result = await getRecommend()
    console.log('recommend.vue created', result)
    this.sliders = result.sliders
    this.albums = result.albums
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .scroller_wrapper {
    height: 100%;
    overflow: hidden;

    .slider {
      &__wrapper {
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

    .recommend__list {
      &__title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      &__item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        &__icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        &__text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }

        .name {
          margin-bottom: 10px;
          color: $color-text;
        }

        .title {
          color: $color-text-d;
        }
      }
    }
  }

}
</style>
