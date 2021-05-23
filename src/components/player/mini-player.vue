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
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'mini-player',
  setup () {
    const store = useStore()
    const isPlayerFullScreen = computed(() => store.state.isPlayerFullScreen)
    const currentPlaySong = computed(() => store.getters.currentPlaySong)

    const textStyle = computed(() => {
      if (isPlayerFullScreen.value) {
        return ''
      } else {
        return ''
      }
    })
    const onMiniPlayerClick = () => {
      store.commit('setIsPlayerFullScreen', true)
    }

    return {
      isPlayerFullScreen,
      currentPlaySong,
      textStyle,
      onMiniPlayerClick
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
}


// 迷你播放器的动画
.trans-mini-player-enter-from,
.trans-mini-player-leave-to {
  background: transparent;

  visibility: hidden;
  .cover-wrapper {
    img {
      visibility: hidden;
      //position: fixed;
      //top: 35%;
      //width: 60% !important;
      //height: 60% !important;
      //left: 50%;
      //transform: translate(-50%, -50%);
    }
  }

  .song-info {
    visibility: hidden;
  }
}

.trans-mini-player-enter-to,
.trans-mini-player-leave-from {
  .song-info {
    visibility: hidden!important;
  }
}

.trans-mini-player-enter-active {
  transition: all 0.3s cubic-bezier(0.29, 1.02, 0, 1.03) !important;
  .cover-wrapper {
    img {
      transition: all 0.23s cubic-bezier(0.250, 0.460, 0.450, 0.940) !important;
    }
  }
  .song-info {
    transition: all 0.01s 0.23s;
  }
}

.trans-mini-player-leave-active {
  transition: all 0.3s ease-out !important;
  .cover-wrapper {
    img {
      transition: all 0.23s cubic-bezier(0.250, 0.460, 0.450, 0.940) !important;
    }
  }
}
</style>
