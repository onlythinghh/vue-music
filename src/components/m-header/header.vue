<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
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
  @import '~common/styles/mixin.less';
  .m-header {
    position: relative;
    height: 44px;
    text-align: center;
    color: @color-theme;
    font-size: 0;
    .icon {
      display: inline-block;
      vertical-align: top;
      margin-top: 6px;
      width: 33px;
      height: 32px;
      margin-right: 9px;
      background-size: 30px 32px;
      .bg-image('logo')
    }
    .text {
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: @font-size-large
    }
    .mine {
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: @color-theme;
      }
    }
  }
</style>
