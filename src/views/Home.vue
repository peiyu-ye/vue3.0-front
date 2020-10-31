<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <LayoutSider />
    <a-layout>
      <LayoutHeader />
      <LayoutMain />
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import LayoutHeader from "@c/layout/layout-header.vue";
import LayoutSider from "@c/layout/layout-sider.vue";
import LayoutMain from "@c/layout/layout-main.vue";

export default {
  name: "Home",
  components: {
    LayoutHeader,
    LayoutSider,
    LayoutMain
  },
  setup() {
    return {};
  }
};
</script>
<style lang="stylus" scoped></style>
