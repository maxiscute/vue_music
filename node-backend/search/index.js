// 搜索接口

// 请求相关函数
const { get } = require('../request')
// utils
const {
  getRandomVal,
  mergeSinger
} = require('../utils')

// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl = 'https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000'

// 响应成功code
const CODE_OK = 0
const token = 5381

// 注册热门搜索接口
function registerHotKeys (app) {
  app.get('/api/getHotKeys', (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    get(url, {
      g_tk_new_20200303: token
    }).then((response) => {
      const data = response.data
      if (data.code === CODE_OK) {
        res.json({
          code: CODE_OK,
          result: {
            hotKeys: data.data.hotkey.map((key) => {
              return {
                key: key.k,
                id: key.n
              }
            }).slice(0, 10)
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

// 注册搜索查询接口
function registerSearch (app) {
  app.get('/api/search', (req, res) => {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

    const {
      query,
      page,
      showSinger
    } = req.query

    const data = {
      _: getRandomVal(),
      g_tk_new_20200303: token,
      w: query,
      p: page,
      perpage: 20,
      n: 20,
      zhidaqu: 1,
      catZhida: showSinger === 'true' ? 1 : 0,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      remoteplace: 'txt.mqq.all',
      uin: '0',
      needNewCode: 1,
      platform: 'h5',
      format: 'json'
    }

    get(url, data).then((response) => {
      const data = response.data
      if (data.code === CODE_OK) {
        const songList = []
        const songData = data.data.song
        const list = songData.list

        list.forEach((item) => {
          const info = item
          if (info.pay.payplay !== 0 || !info.interval) {
            // 过滤付费歌曲
            return
          }

          const song = {
            id: info.songid,
            mid: info.songmid,
            name: info.songname,
            singer: mergeSinger(info.singer),
            url: '',
            duration: info.interval,
            pic: info.albummid ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.albummid}.jpg?max_age=2592000` : fallbackPicUrl,
            album: info.albumname
          }
          songList.push(song)
        })

        let singer
        const zhida = data.data.zhida
        if (zhida && zhida.type === 2) {
          singer = {
            id: zhida.singerid,
            mid: zhida.singermid,
            name: zhida.singername,
            pic: `https://y.gtimg.cn/music/photo_new/T001R800x800M000${zhida.singermid}.jpg?max_age=2592000`
          }
        }

        const {
          curnum,
          curpage,
          totalnum
        } = songData
        const hasMore = 20 * (curpage - 1) + curnum < totalnum

        res.json({
          code: CODE_OK,
          result: {
            songs: songList,
            singer,
            hasMore
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

module.exports = {
  registerHotKeys,
  registerSearch
}
