<template>
  <Form
    v-bind="{ ...$attrs, ...$props }"
    ref="formElRef"
    :model="formDatas.formModel"
    :rules="rules"
    :validate="validate"
  >
    <slot name="formHeader" />
    {{ formDatas.formModel }}
    <template v-for="(formItemData, index) in formData" :key="index">
      <a-form-item :label="formItemData.name" :name="formItemData.props">
        <a-input v-model:value="formItemData.value" />
        {{ formItemData.value }}
        {{ formItemData.name }}
        {{ formItemData.props }}
      </a-form-item>
      <!-- <FormItem></FormItem> -->
    </template>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        Create
      </a-button>
      <a-button style="margin-left: 10px;" @click="reset">
        Reset
      </a-button>
    </a-form-item>
    <slot name="formFooter" />
  </Form>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  ref,
  toRaw,
  toRefs,
  onMounted,
  computed,
  watch
} from "vue";
import { useForm } from "@ant-design-vue/use";
import { Form } from "ant-design-vue";
// import FormItem from "./BasicForm.vue";

export default defineComponent({
  name: "BasicForm",
  components: { Form },
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
      default: { span: 8 }
    },
    //wrapperCol	需要为输入控件设置布局样式时
    wrapperCol: {
      type: Object as PropType<any>,
      default: { span: 16 }
    },
    //是否在 rules 属性改变后立即触发一次验证
    validateOnRuleChange: {
      type: Boolean,
      default: false
    },
    // // rules	表单验证规则	object | array
    rules: {
      type: [Object, Array] as PropType<any>,
      default: {}
    },
    //表单数据对象
    formData: {
      type: [Array, Object] as PropType<any>,
      default: []
    }
  },
  emits: ["Submit", "resetFields"],
  /** 所有的代码逻辑将在setup方法中实现，并且不再有this */
  setup(props, { attrs, emit }) {
    const formDatas = reactive<any>({
      rulesData: "",
      formModel: computed(() => {
        const Datas: Array<any> = [];
        props.formData.forEach((e: object | any) => {
          Datas.push('"' + e.props + '"' + ":" + '"' + e.value + '"');
        });
        const obj = `{${Datas.join()}}`;
        return JSON.parse(obj);
      })
    });
    const { formData, rules }: any = toRefs(props);
    const toData = () => {
      const Datas: Array<any> = [];
      formData.value.forEach((e: any) => {
        Datas.push('"' + e.props + '"' + ":" + '"' + e.value + '"');
      });
      const obj = `{${Datas.join()}}`;
      // nextTick(()=>{
      formDatas.formModel = JSON.parse(obj);
      // })
      console.log("attrs", attrs.formData);
    };
    const formElRef = ref<any>(null);
    const { resetFields, validate, validateInfos } = useForm(
      rules.value,
      formDatas.rulesData
    );
    const onSubmit = (e: any) => {
      validate()
        .then((res: any) => {
          console.log(toRaw(res));
          emit("Submit", toRaw(res));
        })
        .catch((err: any) => {
          console.log("error", err);
        });
    };
    function updatas(newValue: any) {
      const object: any = {};
      newValue.forEach((e: any, i: any) => {
        for (const key in formDatas.formModel) {
          if (e.props == key) {
            object[key] = e.value;
          }
        }
      });
      formDatas.formModel = object;
    }
    onMounted(() => {
      toData();
    });
    watch(
      formData.value,
      (newValue, oldValue) => {
        console.log(newValue, oldValue);
        if (oldValue.length > 0) {
          updatas(newValue);
        }
      },
      {
        immediate: true
      }
    );
    return {
      toData,
      formElRef,
      validateInfos,
      validate,
      resetFields,
      formDatas,
      onSubmit
    };
  }
});
</script>
<style lang="stylus" scoped></style>
