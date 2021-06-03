<template>
  <div>
    <m-header/>
    <tab/>
    <router-view :style="viewStyle"/>
    <router-view :style="viewStyle" name="user" v-slot="{ Component }">
      <transition appear name="slide">
        <component
          :is="Component"
        />
      </transition>
    </router-view>
    <player></player>
  </div>
</template>

<style lang="scss">

</style>
<script>
import MHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { mapState } from 'vuex'

export default {
  components: {
    Player,
    Tab,
    MHeader
  },
  computed: {
    viewStyle () {
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState([
      'playlist'
    ])
  }
}
</script>
