<template>
  <transition name="trans-mini-player">
    <div class="mini-player"
         v-show="!isPlayerFullScreen"
         @click="onMiniPlayerClick">
      <div class="cover-wrapper">
        <div class="cover">
          <img :src="currentPlaySong.pic" alt="songPic">
        </div>
      </div>
      <div class="song-info">
        <div class="song-title"
             :style="textStyle">
          {{ currentPlaySong.name }}
        </div>
        <div class="singer-name"
             :style="textStyle">
          {{ currentPlaySong.singer }}
        </div>
      </div>
      <div class="button-wrapper">
        <div class="button-content">
          <i class="icon-mini"
             :class="miniPlayIconCls"
             @click.stop="onPlayIconClick"
          ></i>
        </div>
        <div class="button-content"
             @click.stop="onShowPlaylistClick">
          <i class="icon-playlist"></i>
        </div>
      </div>
      <Playlist ref="playlistRef"></Playlist>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import Playlist from '@/components/player/playlist'

export default {
  name: 'mini-player',
  props: {
    onPlayIconClick: Function
  },
  components: {
    Playlist
  },
  setup () {
    const store = useStore()
    const isPlayerFullScreen = computed(() => store.state.isPlayerFullScreen)
    const currentPlaySong = computed(() => store.getters.currentPlaySong)
    const playerState = computed(() => store.state.playerState)

    const playlistRef = ref(null)
    const textStyle = computed(() => {
      if (isPlayerFullScreen.value) {
        return ''
      } else {
        return ''
      }
    })

    const miniPlayIconCls = computed(() => {
      return playerState.value ? 'icon-pause-mini' : 'icon-play-mini'
    })

    const onMiniPlayerClick = () => {
      store.commit('setIsPlayerFullScreen', true)
    }

    const onShowPlaylistClick = () => {
      playlistRef.value.show()
    }

    return {
      isPlayerFullScreen,
      playlistRef,
      currentPlaySong,
      miniPlayIconCls,
      textStyle,
      onMiniPlayerClick,
      onShowPlaylistClick
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;

  .cover-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;

    .cover {
      height: 100%;
      width: 100%;

      img {
        width: 40px;
        border-radius: 5px;
      }
    }
  }

  .song-info {
    width: 60%;

    .song-title {
      margin-bottom: 8px;
      font-weight: 450;
      font-size: $font-size-medium;
      color: $color-text;
      @include no-wrap();
      transition: all 0.23s ease;
    }

    .singer-name {
      font-size: $font-size-small;
      color: $color-text-d;
      @include no-wrap();
      transition: all 0.23s ease;
    }
  }

  .button-wrapper {
    display: flex;

    .button-content {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-playlist {
        position: relative;
        top: -2px;
        font-size: 28px;
        color: $color-theme-d;
      }

      .icon-mini {
        position: relative;
        top: -2px;
        font-size: 30px;
        color: $color-theme-d;
      }
    }
  }
}


// 迷你播放器的动画
.trans-mini-player-enter-from,
.trans-mini-player-leave-to {
  bottom: 100px;
  opacity: 0.45;
  background: transparent;

  .cover-wrapper {
    img {
      display: none !important;
    }
  }

}

.trans-mini-player-enter-to,
.trans-mini-player-leave-from {
  .cover-wrapper {
    img {
      display: none !important;
    }
  }
}

.trans-mini-player-enter-active {
  transition: all 0.3s cubic-bezier(0.45, 0, 0.55, 1) !important;

  .cover-wrapper {
    img {
      transition: all 0.01s 0.3s ease !important;
    }
  }
}

.trans-mini-player-leave-active {
  transition: all 0.3s ease-out !important;

  .cover-wrapper {
    img {
      transition: all 0.01s ease !important;
    }
  }
}
</style>
