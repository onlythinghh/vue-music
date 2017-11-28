/* 获取歌词 */
import {commonParams} from './config'
import axios from 'axios'

export function getLyric (mid) {
  const url = 'api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcacheitme: +new Date(),
    platform: 'tqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
