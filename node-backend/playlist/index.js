// 歌单相关后台

// 获取签名方法
const getSecuritySign = require('../sign')
// 请求相关函数
const { post } = require('../request')
// utils
const {
  getRandomVal,
  handleSongList
} = require('../utils')

const token = 5381
const CODE_OK = 0

// 注册歌单专辑接口
function registerAlbum (app) {
  app.get('/api/getAlbum', (req, res) => {
    console.log('registerAlbum', req.query.id)
    const data = {
      req_0: {
        module: 'srf_diss_info.DissInfoServer',
        method: 'CgiGetDiss',
        param: {
          disstid: Number(req.query.id),
          onlysonglist: 1,
          song_begin: 0,
          song_num: 100
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

    post(url, data).then((response) => {
      const data = response.data
      if (data.code === CODE_OK) {
        const list = data.req_0.data.songlist
        const songList = handleSongList(list)

        res.json({
          code: CODE_OK,
          result: {
            songs: songList
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}


module.exports = registerAlbum

