// 详情页通用界面创建

import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent (name, key, fetchFunction) {
  return {
    name,
    components: {
      MusicList
    },
    data () {
      return {
        songs: [],
        loading: true
      }
    },
    props: {
      data: Object
    },
    computed: {
      computedData () {
        let result = null
        const data = this.data
        // 判断是否传参，判断缓存mid和传入mid是否相同
        if (data) {
          result = data
        } else {
          const cached = storage.session.get(key)
          if (cached && (cached.id + '' || cached.name) === this.$route.params.id) {
            result = cached
          }
        }
        return result
      },
      pic () {
        const data = this.computedData
        return data && data.pic
      },
      title () {
        const data = this.computedData
        return data && data.name
      }
    },
    async created () {
      const data = this.computedData
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      const result = await fetchFunction(data)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}

