// 获取签名方法
const Base64 = require('js-base64').Base64
const getSecuritySign = require('../sign')
// 请求相关函数
const {
  post,
  get
} = require('../request')
// utils
const { getRandomVal } = require('../utils')

// const pinyin = require('pinyin')

// 响应成功code
const CODE_OK = 0

const token = 5381

// 第三方接口只支持最多处理 100 条数据，
// 所以如果超过 100 条数据，我们要把数据按每组 100 条切割，发送多个请求
function getSongMidGroup (mid) {
  let midGroup = []
  if (mid.length > 100) {
    const groupLen = Math.ceil(mid.length / 100)
    for (let i = 0; i < groupLen; i++) {
      midGroup.push(mid.slice(i * 100, (100 * (i + 1))))
    }
  } else {
    midGroup = [mid]
  }

  return midGroup
}

// 注册歌曲 url 获取接口路由
// 因为歌曲的 url 每天都在变化，所以需要单独的接口根据歌曲的 mid 获取
function registerSongsUrl (app) {
  app.get('/api/getSongsUrl', (req, res) => {
    console.log('registerSongsUrl')
    const mid = req.query.mid

    const midGroup = getSongMidGroup(mid)

    // 以歌曲的 mid 为 key，存储歌曲 URL
    const urlMap = {}

    // 处理返回的 mid
    function process (mid) {
      const data = {
        req_0: {
          module: 'vkey.GetVkeyServer',
          method: 'CgiGetVkey',
          param: {
            guid: getUid(),
            songmid: mid,
            songtype: new Array(mid.length).fill(0),
            uin: '0',
            loginflag: 0,
            platform: '23',
            h5to: 'speed'
          }
        },
        comm: {
          g_tk: token,
          uin: '0',
          format: 'json',
          platform: 'h5'
        }
      }

      const sign = getSecuritySign(JSON.stringify(data))
      const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomVal()}&sign=${sign}`

      // 发送 post 请求
      return post(url, data).then((response) => {
        const data = response.data
        if (data.code === CODE_OK) {
          const midInfo = data.req_0.data.midurlinfo
          const sip = data.req_0.data.sip
          const domain = sip[sip.length - 1]
          midInfo.forEach((info) => {
            // 获取歌曲的真实播放 URL
            urlMap[info.songmid] = domain + info.purl
          })
        }
      })
    }

    // 构造多个 Promise 请求
    const requests = midGroup.map((mid) => {
      return process(mid)
    })

    // 并行发送多个请求
    return Promise.all(requests).then(() => {
      // 所有请求响应完毕，urlMap 也就构造完毕了
      res.json({
        code: CODE_OK,
        result: {
          map: urlMap
        }
      })
    })
  })
}

// 注册歌词接口
function registerLyric (app) {
  console.log('registerLyric')
  app.get('/api/getLyric', (req, res) => {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

    get(url, {
      '-': 'MusicJsonCallback_lrc',
      pcachetime: +new Date(),
      songmid: req.query.mid,
      g_tk_new_20200303: token
    }).then((response) => {
      const data = response.data
      if (data.code === CODE_OK) {
        res.json({
          code: CODE_OK,
          result: {
            lyric: Base64.decode(data.lyric)
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

// 获取一个随机 uid
function getUid () {
  const t = (new Date()).getUTCMilliseconds()
  return '' + Math.round(2147483647 * Math.random()) * t % 1e10
}

module.exports = {
  registerSongsUrl,
  registerLyric
}
