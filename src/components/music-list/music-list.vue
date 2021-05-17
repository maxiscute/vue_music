<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"
         @click="goBack"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div
      ref="testDiv"
    >
      <div class="bg-img"
           :style="bgImageStyle"
           ref="bgImage"
      >
        <div class="filter"
             :style="filterStyle"></div>
      </div>
      <div
        class="play-btn-wrapper"
        :style="buttonStyle"
        v-show="!noResult"
      >
        <div
          class="btn play-btn"
          @click="onPlayAllClick"
        >
          <i class="icon-play"></i>
          <span class="text">播放</span>
        </div>
        <div
          class="btn shuffle-play-btn"
          @click="onShufflePlayClick"
        >
          <i class="icon-shuffle-play"></i>
          <span class="text">随机</span>
        </div>
      </div>
    </div>

    <scroller
      class="list"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :style="scrollerStyle"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          @songItemClicked="onPlayItemClick"
        ></song-list>
      </div>
    </scroller>
  </div>
</template>

<script>
import Scroller from '@/components/base/scroller/scroller'
import SongList from '@/components/base/song-list/song-list'
import { mapActions } from 'vuex'

// 图片保留高度
const RESERVE_HEIGHT = 40

export default {
  name: 'music-list',
  components: {
    Scroller,
    SongList
  },
  data () {
    return {
      // 背景图片高度
      imageHeight: 0,
      // 滚动距离
      scrollY: 0,
      // 允许的最大滚动距离
      maxScrollY: 0
    }
  },
  mounted () {
    // this.imageHeight = this.$refs.bgImage.clientHeight
    this.imageHeight = this.$refs.testDiv.clientHeight
    this.maxScrollY = this.imageHeight - RESERVE_HEIGHT
    console.log('music-list mounted')
    //   this.imageHeight)
    // console.log(this.$refs.bgImage)
    console.log(this.loading)
    console.log(this.noResult)
    console.log(this.songs)
    console.log(this.songs.length)
  },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有可播放的歌曲'
    }
  },
  methods: {
    onPlayItemClick ({
      song,
      index
    }) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    goBack () {
      this.$router.back()
    },
    // 实时监听滚动组件位置，
    onScroll (pos) {
      this.scrollY = -pos.y
    },
    onPlayAllClick () {
      this.selectPlay({
        list: this.songs,
        index: 0
      })
    },
    onShufflePlayClick () {
      // console.log('shufflePlay')
      // console.log(this.songs)
      this.shufflePlay(this.songs)
    },
    ...mapActions([
      'selectPlay',
      'shufflePlay'
    ])
  },
  computed: {
    noResult () {
      // console.log('noResult', !this.loading && !this.songs.length)
      return !this.loading && !this.songs.length
    },
    buttonStyle () {
      const scrollY = this.scrollY
      let translateY = 0

      // 下拉优化
      if (scrollY < 0) {
        translateY = -scrollY
      }

      return {
        transform: `translateY(${translateY}px)`
      }
    },
    bgImageStyle () {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      // 对iOS 的层级优化
      let translateZ = 0
      let scale = 1

      // 上滑优化，改变图片背景层级，防止列表遮住
      if (scrollY > this.maxScrollY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVE_HEIGHT}px`
        translateZ = 1
      }

      // 下拉优化，图片放大回弹
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      return {
        paddingTop,
        height,
        zIndex,
        transform: `scale(${scale})translateZ(${translateZ}px)`,
        backgroundImage: `url(${this.pic})`
      }
    },
    scrollerStyle () {
      return {
        top: `${this.imageHeight}px`
      }
    },
    filterStyle () {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      if (scrollY >= 0) {
        blur = Math.min(this.maxScrollY / imageHeight,
          scrollY / imageHeight) * 15
      }

      return {
        backdropFilter: `blur(${blur}px)`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-img {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .play-btn-wrapper {
    top: 0;
    z-index: 10;
    width: 100%;
    padding: 0 20px;
    margin: 8px 0;

    .btn {
      box-sizing: border-box;
      width: 125px;
      text-align: center;
      border: 2px solid $color-theme;
      color: $color-theme;
      border-radius: 8px;
      line-height: 36px;
      height: 40px;
      display: inline-block;
      font-size: 0;
      margin: 0 20px;
    }

    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: 20px;
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;

    &__wrapper {
      padding: 20px 30px;
      background: $color-background;
    }

    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
