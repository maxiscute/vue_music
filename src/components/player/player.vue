<template>
  <div class="player">
    <div
      class="full-screen-player"
      v-show="isPlayerFullScreen"
    >
      <div class="background">
        <img :src="currentPlaySong.pic" alt="">
      </div>
      <div class="top">
        <div class="back"
             @click="onBackClick"
        >
          <i class="icon-back"></i>
        </div>
      </div>
      <h1 class="song-title">{{ currentPlaySong.name }}</h1>
      <h2 class="singer-name">{{ currentPlaySong.singer }}</h2>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left" :class="disableClass">
            <i class="icon-prev"
               @click="onPrevIconClick"
            ></i>
          </div>
          <div class="icon i-center" :class="disableClass">
            <i
              @click="onPlayIconClick"
              :class="playIconStyle"
            ></i>
          </div>
          <div class="icon i-right" :class="disableClass">
            <i class="icon-next"
               @click="onNextIconClick"
            ></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>

      <audio
        ref="audioRef"
        @pause="onAudioPause"
        @canplay="onAudioCanPlay"
        @error="onAudioError"
      ></audio>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'

export default {
  name: 'player',
  setup () {
    const store = useStore()
    const audioRef = ref(null)
    // 缓冲能否播放
    const songReady = ref(false)
    // 使数据为响应式的
    const isPlayerFullScreen = computed(() => store.state.isPlayerFullScreen)
    const currentPlaySong = computed(() => store.getters.currentPlaySong)
    // 是否在播放
    const isPlaying = computed(() => store.state.playerState)
    const currentPlayIndex = computed(() => store.state.currentPlayIndex)
    const playlist = computed(() => store.state.playlist)

    const playIconStyle = computed(() => {
      return isPlaying.value ? 'icon-pause' : 'icon-play'
    })

    const disableClass = computed(() => {
      // 当不能播放（缓冲）时，禁止点击
      return songReady.value ? '' : 'disable'
    })

    // 监听是否新歌
    watch(currentPlaySong, (newSong) => {
      // 新歌无链接，不合法
      if (!newSong.id || !newSong.url) {
        return
      }
      // 新歌，需要重新缓冲
      songReady.value = false
      const audioElement = audioRef.value
      audioElement.src = newSong.url
      audioElement.play()
    })

    // 监听正在播放
    watch(isPlaying, (newIsPlaying) => {
      // 歌曲未缓冲好
      if (!songReady.value) {
        return
      }
      const audioElement = audioRef.value
      newIsPlaying ? audioElement.play() : audioElement.pause()
    })

    // 单曲循环
    const loopSingle = () => {
      const audioElement = audioRef.value
      audioElement.currentTime = 0
      audioElement.play()
    }

    // 返回按钮点击
    const onBackClick = () => {
      store.commit('setIsPlayerFullScreen', false)
    }

    // 播放按钮点击
    const onPlayIconClick = () => {
      if (!songReady.value) {
        return
      }
      store.commit('setPlayerState', !isPlaying.value)
    }

    // 上一首按钮点击
    const onPrevIconClick = () => {
      const list = playlist.value
      // 未缓冲好或播放列表长度为0，则禁止
      if (!songReady.value || !list.length) {
        return
      }

      // 播放列表长度为1，则循环单曲
      if (list.length === 1) {
        loopSingle()
      } else {
        let newIndex = currentPlayIndex.value - 1
        if (newIndex === -1) {
          newIndex = list.length - 1
        }
        store.commit('setCurrentPlayIndex', newIndex)
        // 未播放的情况
        if (!isPlaying.value) {
          store.commit('setPlayerState', true)
        }
      }
    }

    // 下一首按钮点击
    const onNextIconClick = () => {
      const list = playlist.value
      // 未缓冲、播放列表长度为0，则禁止
      if (!songReady.value || !list.length) {
        return
      }

      // 播放列表长度为1，则循环单曲
      if (list.length === 1) {
        loopSingle()
      } else {
        let newIndex = currentPlayIndex.value + 1
        if (newIndex === list.length) {
          newIndex = 0
        }
        store.commit('setCurrentPlayIndex', newIndex)
        // 未播放的情况
        if (!isPlaying.value) {
          store.commit('setPlayerState', true)
        }
      }
    }

    // 外部原因造成音乐暂停
    const onAudioPause = () => {
      store.commit('setPlayerState', false)
    }

    // 播放异常,可以切歌
    const onAudioError = () => {
      songReady.value = true
    }

    // 歌曲缓冲
    const onAudioCanPlay = () => {
      if (songReady.value) {
        return
      }
      songReady.value = true
    }

    return {
      currentPlaySong,
      isPlayerFullScreen,
      audioRef,
      playIconStyle,
      disableClass,
      onBackClick,
      onPlayIconClick,
      onPrevIconClick,
      onNextIconClick,
      onAudioPause,
      onAudioError,
      onAudioCanPlay
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .full-screen-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(50px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: #b3b3b3;
        transform: rotate(-90deg);
      }

    }

    .title {
      width: 70%;
      margin: 0 auto;
      line-height: 40px;
      text-align: center;
      @include no-wrap();
      font-size: $font-size-large;
      color: $color-text;
    }

    .subtitle {
      line-height: 20px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text;
    }

    .singer-name {
      position: absolute;
      font-size: 130%;
      width: 400px;
      text-align: center;
      left: 50%;
      @include no-wrap();
      transform: translate(-50%, 0);
      top: 470px;
      color: #ff4981;
    }

    .song-title {
      position: absolute;
      font-size: 130%;
      width: 400px;
      left: 50%;
      @include no-wrap();
      transform: translate(-50%, 0);
      text-align: center;
      top: 440px;
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
