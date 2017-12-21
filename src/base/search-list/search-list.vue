<template>
    <div class="search-list" v-show="searches.length">
      <transition-group name="list" tag="ul">
        <li :key="item" @click="selectItem(item)" class="search-item" v-for="item in searches">
          <span class="text">{{item}}</span>
          <span class="icon" @click.stop="deleteOne(item)">
            <i class="icon-delete"></i>
          </span>
        </li>
      </transition-group>
    </div>
</template>

<script>
    export default{
      props: {
        searches: {
          type: Array,
          default: []
        }
      },
      methods: {
        // 派发点击操作事件
        selectItem (item) {
          this.$emit('select', item)
        },
        // 派发删除操作事件
        deleteOne (item) {
          this.$emit('delete', item)
        }
      }
    }
</script>

<style type="styles" rel="stylesheet/less" lang="less">
  @import "~common/styles/variabe";
  @import "~common/styles/mixin";
  .search-list{
    .search-item{
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      &.list-enter-active, &.list-leave-active{
        transition: all 0.1s;
      }
      &.list-enter, &.list-leave-to{
        height: 0;
      }
      .text{
        flex: 1;
        color: @color-text-l;
      }
      .icon{
        .extend-click();
        .icon-delete{
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
    }
  }
</style>
