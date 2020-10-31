<template>
  <a-form v-bind="$attrs" ref="formElRef" :model="formModel">
    <slot name="formHeader" />
    <template v-for="(formItemData, index) in formData" :key="index">
      <a-form-item
        :label="formItemData.label"
        :rules="{
          required: formItemData.required,
          validator: validateFormItem,
          trigger: formItemData.trigger || 'change'
        }"
      >
        <a-input v-model:value="formItemData.value" />
      </a-form-item>
    </template>
    <slot name="formFooter" />
  </a-form>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  ref,
  unref,
  toRaw,
  onMounted,
  computed
} from "vue";
import { useForm } from "@ant-design-vue/use";

export default defineComponent({
  name: "BasicForm",
  /** 父组件传过来的值 */
  props: {
    // layout	表单布局
    layout: {
      type: String as PropType<"horizontal" | "vertical" | "inline">,
      default: "horizontal"
    },
    // label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}
    labelCol: {
      type: Object as PropType<any>,
      default: { span: 5 }
    },
    //wrapperCol	需要为输入控件设置布局样式时
    wrapperCol: {
      type: Object as PropType<any>,
      default: { span: 16 }
    },
    // // rules	表单验证规则	object | array
    rules: {
      type: [Object, Array] as PropType<any>
    },
    //表单数据对象
    formData: {
      type: Array as PropType<any>
    }
  },
  emits: [],
  /** 所有的代码逻辑将在setup方法中实现，并且不再有this */
  setup(props, { emit }) {
    const ruleForm: any = ref<any>(null);
    /** 方法 */
    function validateFormItem(rule: any, value: any, callback: () => void) {
      callback();
    }

    // 生命周期
    onMounted(() => {});
    // 计算属性
    computed(() => {
      // handleTableTreeData;
    });

    /** 返回值  */
    return {
      ruleForm,
      validateFormItem
    };
  }
});
</script>
<style lang="stylus" scoped></style>
