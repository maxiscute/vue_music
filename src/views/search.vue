<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroller class="search-content"
              ref="scrollerRef"
              v-show="!query"
    >
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item"
                v-for="item in hotKeys"
                @click="addQuery(item.key)"
                :key="item.id"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history"
             v-show="searchHistory.length"
        >
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear"
                  @click="onClearClick"
            >
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearchHistory"
          >
          </confirm>
          <search-list
            :searches="searchHistory"
            @search-history-item-click="addQuery"
            @delete-search-history-item="deleteSearchHistoryItem"
          >
          </search-list>
        </div>
      </div>
    </scroller>
    <div class="search-result"
         v-show="query"
    >
      <suggest
        :query="query"
        @result-song-click="onResultSongClick"
        @result-singer-click="onResultSingerClick"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component
          :is="Component"
          :data="clickedSinger"
        />
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import Scroller from '@/components/wrap-scroller'
import Confirm from '@/components/base/confirm/confirm'
import SearchList from '@/components/base/search-list/search-list'
import { computed, nextTick, ref, watch } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/search/use-search-history'

export default {
  name: 'search',
  components: {
    Scroller,
    SearchInput,
    Suggest,
    SearchList,
    Confirm
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const query = ref('')
    const hotKeys = ref([])
    const clickedSinger = ref(null)

    const scrollerRef = ref(null)
    const confirmRef = ref(null)

    const {
      saveSearchHistory,
      deleteSearchHistoryItem,
      clearSearchHistory
    } = useSearchHistory()

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })

    const searchHistory = computed(() => store.state.searchHistory)

    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    function refreshScroll () {
      scrollerRef.value.scroll.refresh()
    }

    const addQuery = (searchWord) => {
      query.value = searchWord
    }

    const onResultSongClick = (song) => {
      console.log('onResultSongClick', song)
      saveSearchHistory(query.value)
      store.dispatch('addSong', song)
    }

    const onResultSingerClick = (singer) => {
      console.log('onResultSongClick', singer)
      saveSearchHistory(query.value)

      clickedSinger.value = singer
      cacheSinger(singer)

      router.push({
        path: `/search/${singer.name.replace(/ /g, '_')}`
      })
    }

    const onClearClick = () => {
      confirmRef.value.show()
    }

    function cacheSinger (singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    return {
      query,
      hotKeys,
      clickedSinger,
      searchHistory,
      scrollerRef,
      confirmRef,
      addQuery,
      clearSearchHistory,
      onResultSongClick,
      onResultSingerClick,
      onClearClick,
      // use-search-history
      deleteSearchHistoryItem
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;

  .search-input-wrapper {
    margin: 20px;
  }

  .search-content {
    flex: 1;
    overflow: hidden;

    .hot-keys {
      margin: 0 20px 20px 20px;

      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: rgba(255, 255, 255, 0.8);
      }

      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: rgba(255, 255, 255, 0.75);
      }

    }

    .search-history {
      position: relative;
      margin: 0 20px;

      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: rgba(255, 255, 255, 0.75);

        .text {
          flex: 1;

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
  }

  .search-result {
    flex: 1;
    overflow: hidden;

  }
}
</style>
