import { get } from '@/service/base'

export const getSingerList = () => {
  return get('/api/getSingerList')
}
