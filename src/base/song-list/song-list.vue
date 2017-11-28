<template>
  <div class="song-list"><!--歌曲列表基础组件-->
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="index">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="disc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem (item, index) {
        // item歌曲(当前) inex歌曲的索引
        this.$emit('select', item, index)
      },
      //  歌曲 详情（歌手名）
      getDesc (song) {
        return `${song.singer}/${song.album}`
      }
    }
  }
</script>
<style type="styles" rel="stylesheet/less" lang="less">
  @import "~common/styles/variabe";
  @import "~common/styles/mixin";

  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 46px;
      font-size: @font-size-medium;
      .rank {
        flex: 0 0 25px;
        width: 25px;
        text-align: center;
        .icon {
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          &.icon0 {
            .bg-image("first");
          }
          &.icon1 {
            .bg-image("second");
          }
          &.icon2 {
            .bg-image("third");
          }
        }
        .text {
          color: @color-theme;
          font-size: @font-size-large;
        }
      }
      .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          .no-wrap();
          color: @color-text
        }
        .disc {
          .no-wrap();
          margin-top: 4px;
          color: @color-text-d;
        }
      }
    }
  }
</style>
