<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        test0: '新建vue文件后，将该模板复制过去，然后保存关闭点击项目文件刷新。然后重启，不然alt+shift+f的代码格式化会失效',
        test1: '不要问我为什么，我也很绝望'
      }
    }
  }
</script>
<style scoped type="text/css" scoped lang="less">
  @import '~common/styles/variabe.less';
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: @font-size-medium;
    .tab-item {
      flex: 1;
      text-align: center;
      .text-link {
        padding-bottom: 5px;
        color: @color-text-l;
      }
      &.router-link-active {
        .tab-link {
          border-bottom: 2px solid @color-theme;
          color: @color-theme
        }
      }
    }
  }
</style>
