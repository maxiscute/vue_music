// import axios from 'axios'
//
// const baseURL = '/'
// const ERR_OK = 0
//
// axios.defaults.baseURL = baseURL
//
// export function get (url, params) {
//   return axios.get(url, {
//     params
//   }).then((res) => {
//     const serverData = res.data
//     // ERR_OK
//     if (serverData.code === ERR_OK) {
//       return serverData.result
//     }
//   }).catch((e) => {
//     console.log(e)
//   })
// }
import axios from 'axios'

const CODE_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://212.129.248.183/music/' : '/'

axios.defaults.baseURL = baseURL

export const get = (url, params) => {
  return axios
    .get(url, {
      params
    })
    .then(res => {
      const serverData = res.data
      if (serverData.code === CODE_OK) {
        return serverData.result
      }
    })
    .catch(e => {
      console.log(e)
    })
}
