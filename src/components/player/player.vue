<template>
  <!--播放器-->
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal" @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   v-for="(line, index) in currentLyric.lines"
                   :class="{'current': currentLineNum === index}"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper"><!--播放进度条-->
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @progressChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!--收缩的播放器-->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" height="40" width="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon" ></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!--播放功能-->
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    data () {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    computed: {
      cdCls () {
        // cd 旋转动画的class
        return this.playing ? 'play' : 'play pause'
      },
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      // 播放模式icon
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      // 当歌曲切换不能点击时的样式
      disableCls () {
        return this.songReady ? '' : 'disable'
      },
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'sequenceList',
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode'
      ])
    },
    created () {
      this.touch = {}
    },
    methods: {
      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      // 动画事件
      enter (el, done) {
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        // 定义动画参数
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        // 执行动画
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter () {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave (el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave () {
        this.$refs.cdWrapper.style = ''
        this.$refs.cdWrapper.style[transform] = ' '
      },
      // 暂停/播放
      togglePlaying () {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        // 暂停的时候歌词也暂停
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      // 播放完 切换到下一首
      end () {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      // 循环播放
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        // 循环播放歌词调回开始的位置
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      // 下一首
      next () {
        if (!this.songReady) {
          return
        }
        // 如果歌曲列表只有一（首）条数据 就循环播放
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      // 上一首
      prev () {
        // 是否准备完成
        if (!this.songReady) {
          return
        }
        // 如果歌曲列表只有一（首）条数据 就循环播放
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          // （暂停时切换歌曲）改变播放按钮的状态
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      ready () {
        // 歌曲准备是否完成
        this.songReady = true
      },
      error () {
        // 防止断网或者某歌曲连接不对的时无法切换到下一首
        this.songReady = true
      },
      updateTime (e) {
        // 获取当前播放时间
        this.currentTime = e.target.currentTime
      },
      // 求时间格式
      format (interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      // 歌曲播放到拖动进度条位置
      onProgressBarChange (percent) {
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        // 如果在暂停状态就重新调用togglePlaying事件
        if (!this.playing) {
          this.togglePlaying()
        }
        // 如果拖动了进度条 歌词应该调到相对应的位置
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 改变播放模式
      changeMode () {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlaylist(list)
      },
      resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      getLyric () {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
//          console.log(this.currentLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          // 数据异常的时候
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      // 歌词实现
      handleLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum
        // 当前播放行保持在中间
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      // 歌词和cd部分的滑动
      middleTouchStart (e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd (e) {
        // 向左滑
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          // 向右滑
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      // 定义（ing）运动的左边
      _getPosAndScale () {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlaylist: 'SET_PLAYLIST'
      })
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      // 监听 播放状态
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
    }
  }
</script>
<style scoped type="text/css" scoped lang="less">
  @import '~common/styles/variabe.less';
  @import '~common/styles/mixin.less';
  .player{
    .normal-player{
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 50;
      background: @color-background;
      .background{
        position: absolute;
        left:0;
        top:0;
        width: 100%;
        height:100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20ps);
      }
      .top{
        position: relative;
        margin-bottom: 25px;
        .back{
          position: absolute;
          top:0;
          left:6px;
          z-index: 50;
          .icon-back{
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
        .title{
          width: 70%;
          margin:0 auto;
          line-height: 40px;
          text-align: center;
          .no-wrap();
          font-size: @font-size-large;
          color: @color-text;
        }
        .subtitle{
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }
      .middle{
        position: fixed;
        width: 100%;
        top:80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l{
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height:0;
          padding-top: 80%;
          .cd-wrapper{
            position: absolute;
            left: 10%;
            top:0;
            width: 80%;
            height:100%;
            .cd{
              width: 100%;
              height:100%;
              box-sizing: border-box;
              border:10px solid rgba(255,255,255,0.1);
              -webkit-border-radius:;
              -moz-border-radius:;
              border-radius:50%;
              &.play{
                animation: rotate 20s linear infinite;
              }
              &.pause{
                animation-play-state: paused;
              }
              .image{
                position: absolute;
                left:0;
                top:0;
                width: 100%;
                height:100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper{
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
              height:20px;
              line-height: 20px;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }
        .middle-r{
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height:100%;
          overflow: hidden;
          text-align: center;
          .text{
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
            &.current{
              color: @color-text;
            }
          }
        }
      }
      .bottom{
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper{
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;
            &.active{
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }
        .progress-wrapper{
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;
          .item{
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l{
              text-align: left;
            }
            &.time-r{
              text-align: right;
            }
          }
          .progress-bar-wrapper{
            flex:1;
          }
        }
        .operators{
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            color: @color-theme;
            &.disable{
              color: @color-theme-d;
            }
            i{
              font-size: 30px;
            }
          }
          .i-left{
            text-align: right;
          }
          .i-center{
            padding: 0 20px;
            text-align: center;
            i{
              font-size: 40px;
            }
          }
          .i-right{
            text-align: left;
          }
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active{
        transition: all 0.4s;
        .top, .bottom{
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 0.32);
        }
      }
      &.normal-enter, &.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -100px, 0);
        }
        .bottom{
          transform: translate3d(0, 100, 0);
        }
      }
    }
    .mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left:0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height:60px;
      background: @color-highlight-background;
      &.mini-enter-active, &.mini-leave-active{
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to{
        opacity: 0;
      }
      .icon{
        flex:0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img{
          border-radius: 50%;
          &.play{
            animation: rotate 10s linear infinite;
          }
          &.pause{
            animation-play-state: paused;
          }
        }
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          margin-bottom: 2px;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text;
        }
        .disc{
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-theme-d;
        }
      }
      .control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 30px;
          color: @color-theme-d;
        }
        .icon-mini{
          font-size: 32px;
          position: absolute;
          left:0;
          top:0;
        }
      }
    }
    @keyframes rotate {
      0%{transform: rotate(0);}
      100%{transform: rotate(360deg);}
    }
  }

</style>
