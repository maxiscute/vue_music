<template>
  <div>
    <m-header/>
    <tab/>
    <router-view/>
  </div>
</template>

<style lang="scss">

</style>
<script>
import MHeader from '@/components/header/header'
import Tab from '@/components/tab/tab'

export default {
  components: {
    Tab,
    MHeader
  }
}
</script>
