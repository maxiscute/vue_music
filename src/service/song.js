// 歌曲相关
import { get } from './base'

export function processSongs (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      // 存在该字段才可以播放
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

// 本地保存的歌词
const lyricMap = {}

// 获取歌词
export function getLyric (song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂无歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
