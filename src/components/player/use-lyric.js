// 歌词逻辑

import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric ({
  songReady,
  currentTime
}) {
  // 当前歌词
  const currentLyric = ref(null)
  // 当前行号
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')

  const lyricScrollerRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentPlaySong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = null

    // 异步
    const lyric = await getLyric(newSong)
    store.commit('setSongLyric', {
      song: newSong,
      lyric
    })

    if (currentSong.value.lyric !== lyric) {
      return
    }

    // 处理歌词
    currentLyric.value = new Lyric(lyric, handleLyric)
    // 空字符串
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      pureMusicLyric.value =
        lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})]/g, '')
    }

    console.log(lyric)
  })

  const playLyric = () => {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  const stopLyric = () => {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  const handleLyric = ({ lineNum }) => {
    currentLineNum.value = lineNum

    const scrollerComponent = lyricScrollerRef.value
    const listElement = lyricListRef.value
    if (!listElement) {
      return
    }
    if (lineNum > 2) {
      const lineElement = listElement.children[lineNum - 2]
      scrollerComponent.scroll.scrollToElement(lineElement, 800)
    } else {
      scrollerComponent.scroll.scrollToElement(0, 0, 800)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    lyricScrollerRef,
    lyricListRef,
    playLyric,
    stopLyric
  }
}
