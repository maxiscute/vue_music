<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist"
           v-show="visible&&playlist.length"
           @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <div class="title">
              <i class="icon"
                 :class="modeIcon"
                 @click.stop="changeMode"
              ></i>
              <span class="text">{{ modeText }}</span>
            </div>
          </div>
          <scroller class="list-content"
                    ref="scrollerRef"
          >
            <ul>
              <transition-group name="list"
                                ref="listRef"
                                tag="ul"
              >
                <li class="list-item"
                    v-for="song in sequenceList"
                    @click="onSongItemClick(song)"
                    :key="song.id"
                >
                  <i class="current"
                     :class="getCurrentIcon(song)"
                  ></i>
                  <span class="text">{{ song.name }}</span>
                  <span class="favorite"
                        @click.stop="onFavoriteIconClick(song)"
                  >
                    <i :class="getFavoriteIcon(song)"></i>
                  </span>
                  <span class="delete"
                        @click.stop="onDeleteClick(song)"
                        :class="{'disable':removing}"
                  >
                    <i class="icon-delete"></i>
                  </span>
                </li>
              </transition-group>
            </ul>
            <span class="text"></span>
            <span class="favorite"></span>
          </scroller>
          <div class="list-footer"
               @click.stop="hide"
          >
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>

  </teleport>
</template>

<script>
import Scroller from '@/components/base/scroller/scroller'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from '@/components/player/use-mode'
import useFavorite from '@/components/player/use-favorite'

export default {
  name: 'playlist',
  components: { Scroller },
  setup () {
    const visible = ref(false)
    const scrollerRef = ref(null)
    const listRef = ref(null)
    const removing = ref(false)

    const store = useStore()
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentPlaySong = computed(() => store.getters.currentPlaySong)

    const {
      modeIcon,
      modeText,
      changeMode
    } = useMode()

    const {
      onFavoriteIconClick,
      getFavoriteIcon
    } = useFavorite()

    watch(currentPlaySong, async (newSong) => {
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    const hide = () => {
      visible.value = false
    }

    const show = async () => {
      visible.value = true

      await nextTick()
      refreshScroller()
      scrollToCurrent()
    }

    const getCurrentIcon = (song) => {
      if (song.id === currentPlaySong.value.id) {
        return 'icon-play'
      }
    }

    const refreshScroller = () => {
      scrollerRef.value.scroll.refresh()
    }

    const scrollToCurrent = () => {
      const index = sequenceList.value.findIndex((song) => {
        return currentPlaySong.value.id === song.id
      })

      if (index === -1) {
        return
      }

      const target = listRef.value.$el.children[index]
      scrollerRef.value.scroll.scrollToElement(target, 280)
    }

    const onSongItemClick = (song) => {
      const index = playlist.value.findIndex((item) => {
        return song.id === item.id
      })

      store.commit('setCurrentPlayIndex', index)
      store.commit('setPlayerState', true)
    }

    const onDeleteClick = (song) => {
      // 防止多次点击
      if (removing.value) {
        return
      }
      removing.value = true

      store.dispatch('removeSongFromList', song)
      // 定时器解除点击限制
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    return {
      visible,
      removing,
      playlist,
      sequenceList,
      scrollerRef,
      listRef,
      hide,
      show,
      getCurrentIcon,
      scrollToCurrent,
      onSongItemClick,
      onDeleteClick,
      // use-mode
      modeIcon,
      modeText,
      changeMode,
      // use-favorite
      onFavoriteIconClick,
      getFavoriteIcon
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s;

    .list-wrapper {
      transition: all .3s;
    }
  }

  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: rgba(255, 255, 255);
        }

        .clear {
          @include extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .list-item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-weight: 500;
          font-size: $font-size-small;
          color: #ffcd32;
        }

        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: rgba(255, 255, 255, 0.8);
        }

        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }

    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
