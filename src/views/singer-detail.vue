<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import createDetailComponent from '@/assets/js/create-detail-component'
import { SINGER_KEY } from '@/assets/js/constant'
import { getSingerDetail } from '@/service/singer'

export default createDetailComponent('singer-detail',
  SINGER_KEY, getSingerDetail)

// export default {
//   name: 'singer-detail',
//   components: {
//     MusicList
//   },
//   data () {
//     return {
//       songs: [],
//       loading: true
//     }
//   },
//   props: {
//     singer: Object
//   },
//   computed: {
//     computedSinger () {
//       // console.log('computedSinger')
//       let result = null
//       const singer = this.singer
//       // console.log('singer', this.singer)
//       // 判断是否传参，判断缓存mid和传入mid是否相同
//       if (singer) {
//         result = singer
//       } else {
//         const cachedSinger = storage.session.get(SINGER_KEY)
//         if (cachedSinger && cachedSinger.name === this.$route.params.id) {
//           result = cachedSinger
//         }
//       }
//       return result
//     },
//     pic () {
//       const singer = this.computedSinger
//       return singer && singer.pic
//     },
//     title () {
//       const singer = this.computedSinger
//       return singer && singer.name
//     }
//   },
//   async created () {
//     // console.log('singer detail')
//     // console.log(this.singer)
//     if (!this.computedSinger) {
//       const path = this.$route.matched[0].path
//       this.$router.push({
//         path
//       })
//       return
//     }
//     const result = await getSingerDetail(this.computedSinger)
//     this.songs = await processSongs(result.songs)
//     this.loading = false
//     // console.log(result)
//     console.log('singer-detail created')
//     console.log(this.computedSinger.mid)
//     console.log(this.computedSinger)
//     console.log(this.computedSinger.pic)
//     console.log(this.computedSinger.name)
//     console.log(this.songs)
//   }
// }
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
