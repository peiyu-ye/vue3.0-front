<template>
  <div :class="data.isCollapse ? 'main-wrap-mix' : 'main-wrap'">
    <a-layout-content>
      <router-view>
        <router-view></router-view>
      </router-view>
    </a-layout-content>
  </div>
</template>

<script lang="ts">
import { reactive, computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "",
  /** 父组件传过来的值 */
  props: {},
  /** 组件 */
  components: {},
  setup() {
    interface DataType {
      isCollapse: any;
    }
    const store = useStore();
    const data: DataType = reactive({
      isCollapse: store.state.app.isCollapse
    });
    /** 声明周期函数 */
    data.isCollapse = computed(() => store.state.app.isCollapse);
    /** 返回值 */
    return {
      data
    };
  }
};
</script>

<style lang="stylus" scoped>
.main-wrap {
  background-color: #fff;
  padding: 20px;
  position: absolute;
  top: 64px;
  right: 0;
  left: 200px;
  bottom: 0;
  overflow: auto;
}

.main-wrap-mix {
  background-color: #fff;
  margin: 20px;
  position: absolute;
  top: 64px;
  right: 0;
  left: 80px;
  bottom: 0;
}


.main-wrap::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.main-wrap::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 8px;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
  background: #efefef;
}
.main-wrap::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background   : #ffffff;
}
</style>
