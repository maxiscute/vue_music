<template>
  <div class="singer" v-loading="!singers.length">
    <singer-list
      :data="singers"
      v-show="singers.length"
      @clickSinger="handleSingerClick"
    />
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
import { getSingerList } from '@/service/singer'
import { ref, onBeforeMount } from 'vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import SingerList from '@/components/singer-list/singer-list'

export default {
  name: 'singer',
  setup () {
    const singers = ref([])

    onBeforeMount(async () => {
      const result = await getSingerList()
      singers.value = result.singers
      console.log('singer result', result)
    })

    return {
      singers,
      clickedSinger: null,
      clickedSingerMid: null
    }
  },
  methods: {
    handleSingerClick (singer) {
      console.log('handleSingerClick')
      console.log(singer)
      this.clickedSinger = singer
      this.clickedSingerMid = singer.mid
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.name.replace(/ /g, '_')}`
      })
    },
    cacheSinger (singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  },
  components: {
    SingerList
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
