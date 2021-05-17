import { createLogger, createStore } from 'vuex'

import state from '@/store/state'
import mutations from '@/store/mutations'
import * as getters from '@/store/getter'
import * as actions from '@/store/actions'

// 开发者模式时输出所有store日志
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
