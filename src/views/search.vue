<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content"
         v-show="!query"
    >
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
    </div>
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
import { ref } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import { useRouter } from 'vue-router'

export default {
  name: 'search',
  components: {
    SearchInput,
    Suggest
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const query = ref('')
    const hotKeys = ref([])
    const clickedSinger = ref(null)

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })

    const addQuery = (searchWord) => {
      query.value = searchWord
    }

    const onResultSongClick = (song) => {
      console.log('onResultSongClick', song)
      store.dispatch('addSong', song)
    }

    const onResultSingerClick = (singer) => {
      console.log('onResultSongClick', singer)
      clickedSinger.value = singer
      cacheSinger(singer)

      router.push({
        path: `/search/${singer.name.replace(/ /g, '_')}`
      })
    }

    function cacheSinger (singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    return {
      query,
      hotKeys,
      clickedSinger,
      addQuery,
      onResultSongClick,
      onResultSingerClick
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
