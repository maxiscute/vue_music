import { get } from '@/service/base'

export const getSingerList = () => {
  return get('/api/getSingerList')
}

export const getSingerDetail = (singer) => {
  console.log('getSingerDetail', singer.mid)
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
