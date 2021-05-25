import { get } from '@/service/base'

export const getTopList = () => {
  // 和后端的接口对应
  return get('/api/getTopList')
}

export const getTopListDetail = (top) => {
  // 和后端的接口对应
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}
