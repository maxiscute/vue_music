<template>
  <div
    class="suggest"
    ref="rootRef"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{ song.name }}-{{ song.singer }}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>

import { computed, nextTick, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from '@/components/search/use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)

    const loadingText = ref('')
    const noResultText = ref('抱歉，没有找到结果')

    const userScrollable = ref(false)

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })

    const preventPullUpLoad = computed(() => {
      return loading.value || userScrollable.value
    })

    const {
      rootRef,
      isPullUpLoad,
      scroller
    } = usePullUpLoad(queryMoreSearch, preventPullUpLoad)

    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await querySearch()
    })

    const onLessResult = async () => {
      if (scroller.value.maxScrollY >= -1) {
        userScrollable.value = true
        await queryMoreSearch()
        userScrollable.value = false
      }
    }

    const querySearch = async () => {
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      // 过滤数据后不满一屏的操作时
      await nextTick()
      await onLessResult()
    }

    async function queryMoreSearch () {
      if (!hasMore.value || !props.query) {
        return
      }

      page.value++

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      // 过滤数据后不满一屏的操作时
      await nextTick()
      await onLessResult()
    }

    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText,
      pullUpLoading,
      // pullUpload
      rootRef,
      isPullUpLoad
    }
  }

}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-ll;
        }
      }

      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-ll;
        overflow: hidden;

        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
