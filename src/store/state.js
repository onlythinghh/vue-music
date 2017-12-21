import {playMode} from 'common/js/config'
import {loadSearch, loadPlay} from 'common/js/cache'
const state = {
  singer: {},
  playing: false, // 播放状态
  fullScreen: false,  // 播放是否展开
  playlist: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence,  // 播放模式
  currentIndex: -1,  // 当前播放索引
  disc: {}, // 推荐榜
  topList: {}, // 排行榜
  searchHistory: loadSearch(), // 历史记录
  playHistory: loadPlay() // 播放历史记录
}
export default state
