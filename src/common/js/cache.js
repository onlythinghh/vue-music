/* 缓存 存取相关逻辑 */
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray (arr, val, compare, maxLen) {
  // 获得arr数组中第compare 条数据
  const index = arr.findIndex(compare)
  if (index === 0) {
    // 如果index 是数组中的第一条不做任何事
    return
  }
  if (index > 0) {
    // 如果index 不是第一条 就从index位置删除这条数据
    arr.splice(index, 1)
  }
  // 然后再将数据插入到最前面
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    // 如果数组长度大于最大限度 多余就pop出去
    arr.pop()
  }
}

// 删除方法
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 将query 插入到当前的历史列表中 然后保存 再返回新的数组
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 读取本地列表的缓存
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

// 删除(一条)缓存
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清除（所有）缓存
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}
// 播放记录的缓存（写入）
export function saveplay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 播放记录的缓存（读取）
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 收藏
export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 取消收藏
export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 初始化的收藏数据
export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
