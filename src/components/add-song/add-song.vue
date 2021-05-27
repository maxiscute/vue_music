<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="addSongVisible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close"
               @click="hideAddSong"
          >
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input
            v-model="query"
            placeholder="搜索歌曲"
          ></search-input>
        </div>
        <div v-show="!query">
          <switches
            :items="['最近播放', '搜索历史']"
            v-model="currentSwitchIndex"
          ></switches>
          <div class="list-wrapper">
            <scroller class="list-scroll"
                      v-if="currentSwitchIndex===0"
                      ref="scrollerRef"
            >
              <div class="list-inner">
                <song-list
                  :songs="playHistory"
                  @song-item-clicked="onHistorySongClick"
                ></song-list>
              </div>
            </scroller>

            <scroller class="list-scroll"
                      v-if="currentSwitchIndex===1"
                      ref="scrollerRef"
            >
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  :show-delete="false"
                  @search-history-item-click="addQuery"
                ></search-list>
              </div>
            </scroller>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest
            :query="query"
            :show-singer="false"
            @result-song-click="onSearchSongClick"
          >
          </suggest>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Suggest from '@/components/search/suggest'
import SearchInput from '@/components/search/search-input'
import SearchList from '@/components/base/search-list/search-list';
import Scroller from '@/components/base/scroller/scroller'
import Switches from '@/components/base/switches/switches'
import SongList from '@/components/base/song-list/song-list'
import { computed, nextTick, ref, watch } from 'vue';
import { useStore } from 'vuex';
import useSearchHistory from '@/components/search/use-search-history';

export default {
  name: 'add-song',
  components: {
    SearchList,
    Suggest,
    SearchInput,
    Scroller,
    SongList,
    Switches
  },
  setup () {
    const addSongVisible = ref(false)
    const query = ref('')
    const currentSwitchIndex = ref(0)
    const scrollerRef = ref(null)

    const store = useStore()

    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)

    const { saveSearchHistory } = useSearchHistory()

    watch(query, async () => {
      await nextTick()
      refreshScroller()
    })

    const showAddSong = async () => {
      addSongVisible.value = true

      await nextTick()
      refreshScroller()
    }

    const hideAddSong = () => {
      addSongVisible.value = false
    }

    const addQuery = (s) => {
      query.value = s
    }

    const onHistorySongClick = ({ song }) => {
      addSong(song)
    }

    const onSearchSongClick = (song) => {
      addSong(song)
      saveSearchHistory(query.value)
    }

    const addSong = (song) => {
      console.log('addSong');
      store.dispatch('addSong', song)
    }

    const refreshScroller = () => {
      scrollerRef.value.scroll.refresh()
    }

    return {
      addSongVisible,
      query,
      scrollerRef,
      currentSwitchIndex,
      searchHistory,
      playHistory,
      showAddSong,
      hideAddSong,
      addQuery,
      onHistorySongClick,
      onSearchSongClick
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-input-wrapper {
    margin: 20px
  }

  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}
</style>
