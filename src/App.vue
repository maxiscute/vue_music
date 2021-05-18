<template>
  <div>
    <m-header/>
    <tab/>
    <router-view/>
    <player></player>
  </div>
</template>

<style lang="scss">

</style>
<script>
import MHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'

export default {
  components: {
    Player,
    Tab,
    MHeader
  }
}
</script>
