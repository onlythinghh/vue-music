<template>
  <div class="Singer" ref="singer">
    <listview @select="selectSinger" :data="singers" ref="list"></listview>
    <!--挂载子页面（歌手详情）-->
    <router-view></router-view>
  </div>
</template>
<script>
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    mixins: [playlistMixin],
    components: {
      Listview
    },
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
            // console.log(this._normalizeSinger(this.singers))
          }
        })
      },
      // 数据归类（按字母）
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        // 遍历列表（list）得到热门的数据
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          // 取得歌手名的首字母
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        // 处理map 得到有序列表
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>
<style scoped type="text/css" scoped lang="less">
  .Singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
