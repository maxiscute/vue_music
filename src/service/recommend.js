import { get } from '@/service/base'

export const getRecommend = () => {
  // 和后端的接口对应
  return get('/api/getRecommend')
}
