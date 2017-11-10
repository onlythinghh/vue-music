<template>
  <transition name="slid">
    <div class="singer-detail"></div>
  </transition>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters(['singer'])
    },
    created () {
      this._getDetail()
    },
    methods: {
      // 如果用户在歌手详情页刷新的时候就返回到歌手列表
      _getDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        // 获取歌手详情的数据
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let { musicData } = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>
<style scoped type="text/css" scoped lang="less">
  @import "~common/styles/variabe";
  .singer-detail {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background: @color-background;
  }
  .slid-enter-active,
  .slid-leave-active {
    transition: all 0.3s;
  }
  .slid-enter,
  .slid-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
