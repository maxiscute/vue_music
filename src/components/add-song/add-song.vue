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
          <switched
            :items="['最近播放', '搜索历史']"
            v-model="currentSwitchIndex"
          ></switched>
          <div class="list-wrapper">
            <scroller class="list-scroll"
                      v-if="currentSwitchIndex===0"
            >
              <div class="list-inner">
                <song-list
                  :songs="playHistory"
                ></song-list>
              </div>
            </scroller>

            <scroller class="list-scroll"
                      v-if="currentSwitchIndex===0"
            >
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                ></search-list>
              </div>
            </scroller>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest
            :query="query"
            :show-singer="false"
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
import { computed, ref } from 'vue';
import SearchList from '@/components/base/search-list/search-list';
import { useStore } from 'vuex';

export default {
  name: 'add-song',
  components: {
    SearchList,
    Suggest,
    SearchInput
  },
  setup () {
    const addSongVisible = ref(false)
    const query = ref('')
    const currentSwitchIndex = ref(0)

    const store = useStore()

    const searchHistory = computed(() => store.state.searchHistory)

    const showAddSong = () => {
      addSongVisible.value = true
    }

    const hideAddSong = () => {
      addSongVisible.value = false
    }

    return {
      addSongVisible,
      query,
      currentSwitchIndex,
      searchHistory,
      showAddSong,
      hideAddSong
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
