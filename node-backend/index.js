const registerRecommend = require('./recommend')
const {
  registerSinger,
  registerSingerDetail
} = require('./singer')

const {
  registerSongsUrl,
  registerLyric
} = require('./song')

const registerAlbum = require('./playlist')

// 注册后端路由
function registerRouter (app) {
  // recommend
  registerRecommend(app)
  // singer
  registerSinger(app)
  registerSingerDetail(app)
  // song
  registerSongsUrl(app)
  registerLyric(app)
  // play-list
  registerAlbum(app)
}

module.exports = registerRouter
