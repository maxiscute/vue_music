<template>
  <div class="singer" v-loading="!singers.length">
    <singer-list :data="singers"/>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import { ref, onBeforeMount } from 'vue'
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
      singers
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
