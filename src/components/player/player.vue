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
        <div class="progress-wrapper">
          <div class="progress-bar-wrapper">
            <progress-bar
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            ></progress-bar>
          </div>
          <div class="time-wrapper">
            <span
              class="time time-played"
              :class="{'time-covered':isProgressChangeCoverPlayTime}"
            >
              {{
                formatTime(currentTime)
              }}</span>
            <span
              class="time time-left"
              :class="{'time-covered':isProgressChangeCoverLeftTime}"
            >
              -{{
                formatTime(currentPlaySong.duration - currentTime)
              }}</span>
          </div>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
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
            <i :class="getFavoriteIcon(currentPlaySong)"
               @click=onFavoriteIconClick(currentPlaySong)></i>
          </div>
        </div>
      </div>

      <audio
        ref="audioRef"
        @pause="onAudioPause"
        @canplay="onAudioCanPlay"
        @timeupdate="onTimeUpdate"
        @error="onAudioError"
      ></audio>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import useMode from '@/components/player/use-mode'
import useFavorite from '@/components/player/use-favorite'
import ProgressBar from '@/components/player/progress-bar'
import { formatTime } from '@/assets/js/util'

export default {
  name: 'player',
  components: {
    ProgressBar
  },
  // 主播放功能逻辑
  setup () {
    const store = useStore()
    const audioRef = ref(null)
    // 当前播放时间
    const currentTime = ref(0)
    // 缓冲能否播放
    const songReady = ref(false)
    let progressChanging = false
    const isProgressChangeCoverPlayTime = ref(false)
    const isProgressChangeCoverLeftTime = ref(false)
    // 使数据为响应式的
    const isPlayerFullScreen = computed(() => store.state.isPlayerFullScreen)
    const currentPlaySong = computed(() => store.getters.currentPlaySong)
    // 是否在播放
    const isPlaying = computed(() => store.state.playerState)
    const currentPlayIndex = computed(() => store.state.currentPlayIndex)
    const playlist = computed(() => store.state.playlist)
    const progress = computed(() => {
      return currentTime.value / currentPlaySong.value.duration
    })

    const {
      modeIcon,
      changeMode
    } = useMode()
    const {
      onFavoriteIconClick,
      getFavoriteIcon
    } = useFavorite()

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
      currentTime.value = 0
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

    const onTimeUpdate = (e) => {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // 进度条被拖动
    const onProgressChanging = (progress) => {
      progressChanging = true
      currentTime.value = currentPlaySong.value.duration * progress

      // 拖拽遮挡播放时间
      if (progress < 0.135) {
        isProgressChangeCoverPlayTime.value = true
      } else if (progress > 0.865) {
        isProgressChangeCoverLeftTime.value = true
      } else {
        isProgressChangeCoverPlayTime.value = false
        isProgressChangeCoverLeftTime.value = false
      }
    }

    // 进度条拖动松开
    const onProgressChanged = (progress) => {
      progressChanging = false
      audioRef.value.currentTime = currentTime.value =
        currentPlaySong.value.duration * progress
      isProgressChangeCoverPlayTime.value = false
      isProgressChangeCoverLeftTime.value = false
      if (!isPlaying.value) {
        store.commit('setPlayerState', true)
      }
    }

    return {
      currentPlaySong,
      isPlayerFullScreen,
      audioRef,
      playIconStyle,
      disableClass,
      progress,
      currentTime,
      isProgressChangeCoverPlayTime,
      isProgressChangeCoverLeftTime,
      onBackClick,
      onPlayIconClick,
      onPrevIconClick,
      onNextIconClick,
      onAudioPause,
      onAudioError,
      onAudioCanPlay,
      onTimeUpdate,
      onProgressChanged,
      onProgressChanging,
      // 来自use-mode
      modeIcon,
      changeMode,
      // use-favorite
      onFavoriteIconClick,
      getFavoriteIcon,
      // util
      formatTime
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

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        height: fit-content;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;

        .time {
          color: #8d8d8d;
          font-size: 80%;
          flex: 0 0 45px;
          line-height: 30px;
          width: 40px;

          &.time-played {
            text-align: left;
            float: left;
            position: relative;
            top: 0px;
            -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            -moz-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            //margin-top: -22px;
          }

          &.time-left {
            text-align: right;
            float: right;
            width: fit-content;
            position: relative;
            top: 0px;
            -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            -moz-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            //margin-top: -22px;
          }
        }

        .time-wrapper {
          width: 100%;
          margin-top: -60px;
          display: inline-block;
        }

        .time-covered {
          top: 13px !important;
        }

        .progress-bar-wrapper {
          flex: 1;
          width: 100%;
          z-index: 20;
          min-width: 100%;
          max-width: 100%;
          padding-bottom: 30px;
        }
      }
    }
  }
}
</style>
