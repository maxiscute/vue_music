const registerRecommend = require('./recommend')
const {
  registerSinger,
  registerSingerDetail
} = require('./singer')

// 注册后端路由
function registerRouter (app) {
  registerRecommend(app)

  registerSinger(app)
  registerSingerDetail(app)
}

module.exports = registerRouter
