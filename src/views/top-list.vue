<template>
  <div class="top-list"
       v-loading="loading"
  >
    <scroller class="top-list-content">
      <ul>
        <li class="item"
            v-for="item in topList"
            @click="onTopListItemClick(item)"
            :key="item.id"
        >
          <div class="icon">
            <img
              width="100"
              height="100"
              v-lazy="item.pic"
              alt="topListPic"
            />
          </div>
          <ul class="song-list">
            <li class="song"
                v-for="(song, index) in item.songList"
                :key="song.id"
            >
              <span>{{ index + 1 }}. </span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroller>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component
          :is="Component"
          :data="clickedTopList"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import Scroller from '@/components/base/scroller/scroller'
import { getTopList } from '@/service/top-list'
import storage from 'good-storage'
import { TOP_LIST_KEY } from '@/assets/js/constant'

export default {
  name: 'top-list',
  components: {
    Scroller
  },
  data () {
    return {
      topList: [],
      loading: true,
      clickedTopList: null
    }
  },
  async created () {
    const result = await getTopList()
    // console.log(result)
    // console.log(result.topList)
    this.topList = result.topList
    this.loading = false
  },
  methods: {
    onTopListItemClick (item) {
      console.log('onTopListItemClick', item)
      this.clickedTopList = item
      this.cachedTopList(item)
      this.$router.push({
        path: `/top-list/${item.id}`
      })
    },
    cachedTopList (album) {
      storage.session.set(TOP_LIST_KEY, album)
    }
  }
}
</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .top-list-content {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
