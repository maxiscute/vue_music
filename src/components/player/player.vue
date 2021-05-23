<template>
  <div class="player"
       v-show="playlist.length"
  >
    <transition name="trans-full">
      <div class="full-screen-player"
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

        <div class="cover"
             :style="coverStyle">
          <div class="cover-content">
            <div class="album-wrapper">
              <div class="album">
                <transition id="trans-cover" name="trans-cover">
                  <img
                    :src="currentPlaySong.pic" alt="songPic"
                    :class="{playing:isPlaying}"
                    @click="onSongPicClick"
                    v-show="!isShowLyric"
                    class="img">
                </transition>
              </div>
            </div>
          </div>
        </div>
        <transition name="trans-lyric">
          <div class="lyric"
               :style="lyricStyle"
               v-show="isShowLyric"
          >
            <scroller
              class="lyric-scroller"
              ref="lyricScrollerRef"
              :probe-type="1"
              :momentum-limit-time="300"
              :scrollX="false"
              @scroll="onLyricScroll"
            >
              <div class="frame-lyrics">
                <div
                  style="white-space:pre-wrap;"
                  v-if="currentLyric" ref="lyricListRef">
                  <div
                    class="text"
                    v-for="(line, index) in currentLyric.lines"
                    :class="{'current':currentLineNum===index}"
                    :key="line.num"
                  >
                    {{ line.txt }}
                  </div>
                </div>
              </div>
            </scroller>
          </div>
        </transition>

        <div class="info">
          <transition name="trans-cover-info">
            <div class="cover-info"
                 v-show="!isShowLyric"
            >
              <div class="song-title">{{ currentPlaySong.name }}</div>
              <div class="singer-name">{{ currentPlaySong.singer }}</div>
            </div>
          </transition>

          <div class="lyric-info"
               v-show="isShowLyric"
          >
            <div class="image">
              <img
                :src="currentPlaySong.pic"
                @click="onSongPicClick"
                alt="songPic"
              >
            </div>
            <transition name="trans-lyric-info-song">
              <div class="song-info"
                   v-show="isShowLyric">
                <div class="song-title">{{ currentPlaySong.name }}</div>
                <div class="singer-name">{{ currentPlaySong.singer }}</div>
              </div>
            </transition>
          </div>
        </div>

        <transition name="trans-bottom">
          <div class="bottom"
               v-show="bottomStyle"
          >
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
        </transition>
      </div>
    </transition>

    <mini-player></mini-player>
    <audio
      ref="audioRef"
      @pause="onAudioPause"
      @canplay="onAudioCanPlay"
      @timeupdate="onTimeUpdate"
      @error="onAudioError"
      @ended="onSongEnd"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import useMode from '@/components/player/use-mode'
import useFavorite from '@/components/player/use-favorite'
import useLyric from '@/components/player/use-lyric'
import ProgressBar from '@/components/player/progress-bar'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import Scroller from '@/components/base/scroller/scroller'
import MiniPlayer from './mini-player'

export default {
  name: 'player',
  components: {
    ProgressBar,
    Scroller,
    MiniPlayer
  },
  // 主播放功能逻辑
  setup () {
    const store = useStore()
    const audioRef = ref(null)
    // 当前播放时间
    const currentTime = ref(0)
    // 缓冲能否播放
    const songReady = ref(false)
    const isScrollLyric = ref(false)
    const isShowLyric = ref(false)

    let progressChanging = false
    let styleTimeOut = true
    let timer = null
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
    const playMode = computed(() => store.state.playMode)

    const {
      modeIcon,
      changeMode
    } = useMode()
    const {
      onFavoriteIconClick,
      getFavoriteIcon
    } = useFavorite()

    const {
      currentLineNum,
      currentLyric,
      pureMusicLyric,
      lyricScrollerRef,
      lyricListRef,
      playLyric,
      stopLyric
    } = useLyric({
      songReady,
      currentTime
    })

    const coverStyle = computed(() => {
      if (isShowLyric.value) {
        return 'z-index: 0;'
      } else {
        return 'z-index: 25;'
      }
    })

    const lyricStyle = computed(() => {
      if (isPlaying.value) {
        if (isScrollLyric.value) {
          return 'bottom:170px'
        } else {
          return 'bottom:20px'
        }
      } else {
        return 'bottom:170px'
      }
    })

    const bottomStyle = computed(() => {
      if (isShowLyric.value) {
        if (isPlaying.value) {
          return !!isScrollLyric.value
        } else {
          return true
        }
      } else {
        return true
      }
    })

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

      if (newIsPlaying) {
        audioElement.play()
        playLyric()
      } else {
        audioElement.pause()
        stopLyric()
      }
    })

    watch(lyricStyle, () => {
      if (!styleTimeOut) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        isScrollLyric.value = false
        styleTimeOut = true
      }, 12000)
    })

    // 单曲循环
    const loopSingle = () => {
      const audioElement = audioRef.value
      audioElement.currentTime = 0
      audioElement.play()
      store.commit('setPlayerState', true)
    }

    // 播放下一首
    const nextTrack = () => {
      const list = playlist.value
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
        nextTrack()
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
      playLyric()
    }

    const onTimeUpdate = (e) => {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // 点击图片实现封面、歌词界面切换
    const onSongPicClick = () => {
      isShowLyric.value = !isShowLyric.value
      isScrollLyric.value = true
    }

    // 歌曲播放完后
    const onSongEnd = () => {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.repeat) {
        loopSingle()
      } else {
        nextTrack()
      }
    }

    // 进度条被拖动
    const onProgressChanging = (progress) => {
      progressChanging = true
      currentTime.value = currentPlaySong.value.duration * progress
      playLyric()
      stopLyric()

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
      playLyric()
    }

    // 滑动歌词
    const onLyricScroll = () => {
      console.log('onscroll')
      isScrollLyric.value = true
    }

    return {
      currentPlaySong,
      isPlayerFullScreen,
      audioRef,
      playIconStyle,
      disableClass,
      playlist,
      progress,
      currentTime,
      isProgressChangeCoverPlayTime,
      isProgressChangeCoverLeftTime,
      isPlaying,
      isShowLyric,
      lyricStyle,
      bottomStyle,
      coverStyle,
      onBackClick,
      onPlayIconClick,
      onPrevIconClick,
      onNextIconClick,
      onAudioPause,
      onAudioError,
      onAudioCanPlay,
      onSongEnd,
      onTimeUpdate,
      onProgressChanged,
      onProgressChanging,
      onLyricScroll,
      onSongPicClick,
      // 来自use-mode
      modeIcon,
      changeMode,
      // use-favorite
      onFavoriteIconClick,
      getFavoriteIcon,
      // util
      formatTime,
      // use-lyric
      lyricScrollerRef,
      lyricListRef,
      currentLineNum,
      currentLyric,
      pureMusicLyric
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

    .cover {
      position: relative;
      width: 100%;
      top: 80px;
      z-index: 0;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .cover-content {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .album-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .album {
            width: 100%;
            height: 100%;

            img {
              position: absolute;
              left: 30px; // 30px
              top: 30px; // 30px
              width: 80%; // 80%
              height: 80%; // 80%
              box-sizing: border-box;
              border-radius: 8px;
              transition: all 0.4s cubic-bezier(0.09, 0.57, 0.58, 1);
            }

            .playing {
              left: 0; // 30px
              top: 0; // 30px
              width: 100%; // 80%
              height: 100%; // 80%
              box-shadow: 0 15px 50px 0 rgb(0 0 0 / 80%);
              transition: all 0.4s cubic-bezier(0.18, 0.89, 0.61, 1.64);
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
    }

    .lyric {
      position: fixed;
      width: 100%;
      top: 130px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      transition: all 0.37s ease-out;

      .lyric-scroller {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          white-space: pre-wrap;

          .text {
            line-height: 32px;
            color: rgba(255, 255, 255, 0.75);
            font-size: $font-size-medium;
            margin-top: 1.4em;
            word-wrap: break-word;
            word-break: break-all;


            &.current {
              color: white;
              font-size: 3rem;
              margin-top: 0.8em;
            }

            &:not(.current) {
              filter: blur(0.05px);
            }
          }
        }

        .frame-lyrics {
          position: relative;
          z-index: 10;
          flex-grow: 1;
          padding: 0 2rem 2rem;
          overflow-y: auto;

          .text {
            color: rgba(255, 255, 255, 0.75);
            font-size: 23px;

            + div {
              margin-top: 1.4em;
            }

            &.current {
              color: white;
              font-size: 28px;
              margin-top: 40px;
              font-weight: bold;

              + div {
                margin-top: 40px;
              }
            }

            &:not(.current) {
              filter: blur(0.4px);
            }
          }
        }
      }
    }

    .info {
      .cover-info {
        position: absolute;
        bottom: 25%;
        display: flex;
        flex-direction: column;
        width: 100%;

        .singer-name {
          font-size: 115%;
          text-align: center;
          font-weight: 500;
          margin-top: 6px;
          opacity: 0.88;
          color: #ff4981;
        }

        .song-title {
          font-size: 130%;
          font-weight: 550;
          text-align: center;
        }
      }

      .lyric-info {
        position: absolute;
        top: 5%;
        z-index: 10;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        padding: 1rem 2rem;

        .image {
          margin-right: 12px;

          img {
            width: 50px;
            border-radius: 3px;
            box-shadow: 0 3px 30px rgba(0, 0, 0, 0.2), 0 3px 10px rgba(0, 0, 0, 0.4);
          }

        }

        .song-info {
          position: relative;
          top: 0;

          .song-title {
            font-size: 26px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
          }

          .singer-name {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.65);
            font-weight: 500;
            margin-top: 5px;
          }
        }
      }
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
        margin: 0 auto;
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
            top: 0;
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
            top: 0;
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

    &.trans-full-enter-from,
    &.trans-full-leave-to {
      bottom: -200px;
      top: 200px;
      opacity: 0.2;

      .background {
        opacity: 0.2;
        top: 200px;
      }

      .cover, .info {
        visibility: hidden;
      }
    }

    &.trans-full-enter-to,
    &.trans-full-leave-from {
      top: 0;
      opacity: 0.8 !important;
      bottom: 0;
    }

    &.trans-full-enter-active {
      transition: all 0.23s cubic-bezier(0.29, 1.02, 0, 1.03) !important;
      .background {
        transition: all 0.23s cubic-bezier(0.29, 1.02, 0, 1.03) !important;
      }
      .cover, .info {
        transition: 0.23s 0.1s visibility ease;
      }
    }

    &.trans-full-leave-active {
      transition: all 0.06s 0.13s ease-out !important;
      .cover, .info {
        transition: 0.06s visibility;
      }
    }
  }
}

// 封面页专辑图片的动画
.trans-cover-enter-from,
.trans-cover-leave-to {
  opacity: 0.2 !important;
  left: -6px !important;
  top: -30px !important;
  box-shadow: none !important;
  width: 10px !important;
  height: 10px !important;
  z-index: 10;
}

.trans-cover-enter-to,
.trans-cover-leave-from {
  opacity: 1 !important;
  z-index: 30 !important;
}

.trans-cover-enter-active,
.trans-cover-leave-active {
  transition: all 0.3s cubic-bezier(0.29, 1.02, 0, 1.03) !important;
}

//歌词页歌曲信息的动画
.trans-lyric-info-song-enter-from,
.trans-lyric-info-song-leave-to {
  top: 70px !important;
  opacity: 0.1;
  z-index: 5;
}

.trans-lyric-info-song-enter-to,
.trans-lyric-info-song-leave-from {
  opacity: 1 !important;
  top: 0;
}

.trans-lyric-info-song-enter-active,
.trans-lyric-info-song-leave-active {
  transition: all 0.2s ease-out !important;
}

//歌词动画
.trans-lyric-enter-from,
.trans-lyric-leave-to {
  bottom: 170px !important;
  top: 210px !important;
  opacity: 0.1 !important;
  filter: blur(2px) !important;
  z-index: 5 !important;
}

.trans-lyric-enter-to,
.trans-lyric-leave-from {
  opacity: 0.3 !important;
}

.trans-lyric-enter-active,
.trans-lyric-leave-active {
  transition: bottom 0.1s ease-in, top 0.1s ease-in,
  opacity 0.2s ease-in, filter 0.2s ease-in !important;
}

//封面页歌曲信息动画
.trans-cover-info-enter-from,
.trans-cover-info-leave-to {
  bottom: 400px !important;
  opacity: 0.2 !important;
  filter: blur(2px) !important;
}

.trans-cover-info-enter-to,
.trans-cover-info-leave-from {
  opacity: 1 !important;
  bottom: 175px !important;
}

.trans-cover-info-enter-active,
.trans-cover-info-leave-active {
  transition: all 0.23s cubic-bezier(0, 0.92, 0.48, 1.15) !important;
}

//底部控制栏动画
.trans-bottom-enter-from,
.trans-bottom-leave-to {
  bottom: 10px !important;
  filter: blur(1px);
  opacity: 0.2 !important;
}

.trans-bottom-enter-to,
.trans-bottom-leave-from {
  opacity: 0.7 !important;
  bottom: 50px !important;
}

.trans-bottom-enter-active {
  transition: all 0.3s cubic-bezier(0, 0.92, 0.48, 1.15) !important;
}

.trans-bottom-leave-active {
  transition: all 0.13s cubic-bezier(0, 0.92, 0.48, 1.15) !important;
}
</style>
