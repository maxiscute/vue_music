const registerRecommend = require('./recommend')
const {
  registerSinger,
  registerSingerDetail
} = require('./singer')

const {
  registerSongsUrl,
  registerLyric
} = require('./song')

// 注册后端路由
function registerRouter (app) {
  registerRecommend(app)

  registerSinger(app)
  registerSingerDetail(app)

  registerSongsUrl(app)
  registerLyric(app)
}

module.exports = registerRouter
