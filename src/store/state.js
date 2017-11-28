import {playMode} from 'common/js/config'
const state = {
  singer: {},
  playing: false, // 播放状态
  fullScreen: false,  // 播放是否展开
  playlist: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence,  // 播放模式
  currentIndex: -1  // 当前播放索引
}
export default state
