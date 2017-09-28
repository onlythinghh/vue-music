<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif">
    <p class="disc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入......'
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/styles/variabe.less';
  .loading {
    width: 100%;
    text-align: center;
    .disc {
      line-height: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
    }
  }
</style>
