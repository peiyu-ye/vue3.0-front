<template>
  <div class="errPage404">
    <a-row
      type="flex"
      justify="space-around"
      align="middle"
      style="height:100vh;"
    >
      <a-col :span="12" :offset="6">
        <p>
          <img class="err-img height-120" src="@/assets/err/404.png" />
          <a class="err-title">未找到当前页面</a>
        </p>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
export default {
  name: "",
  /** 父组件传过来的值 */
  props: {},
  /** 组件 */
  components: {},
  setup() {
    /** 返回值 */
    return {};
  }
};
</script>
<style lang="stylus" scoped>
.errPage404 {
  .err{
    &-img{
      text-align: center;
    }
    &-title{
      color: blue;
      font-size: 20px;
      text-align: center;
      display: block;
    }
  }
}
</style>
