<template>
  <div class="form-list-wrapper">
    <a-form ref="formRef" :layout="formLayout" v-model:model="fromData">
      {{ fromData }}
      {{ renderDataSource }}
      <template v-for="item in renderDataSource" :key="item.fieldName">
        <template v-if="item.type && item.fieldName">
          <field-render :fieldOptions="item" />
          <!-- <field-render v-model:dataSource="renderDataSource" /> -->
        </template>
      </template>
      <slot name="field" :options="GlobalOptions" />
      <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
        <a-tooltip placement="bottom">
          <template v-slot:title>
            <span>提交表单</span>
          </template>
          <a-button type="primary" :size="size" @click="handleSubmit">
            提交
          </a-button>
        </a-tooltip>

        <a-tooltip placement="bottom">
          <template v-slot:title>
            <span>清空所有控件的值</span>
          </template>
          <a-button
            :size="size"
            style="margin-left: 8px"
            @click="resetSearchForm"
            >重置</a-button
          >
        </a-tooltip>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  unref,
  toRefs,
  computed,
  watch,
  watchEffect,
  triggerRef,
  nextTick
} from "vue";
import FieldRender from "./BasicFormItem.vue";
export default defineComponent({
  name: "FormList",
  components: {
    FieldRender
  },
  props: {
    formLayout: {
      // 表单布局
      type: String, // 'horizontal'|'vertical'|'inline'
      default: "horizontal"
    },
    datetimeTotimeStamp: {
      // 是否把时间控件的返回值全部转为时间戳
      type: Boolean,
      default: false
    },
    size: {
      // 全局控件大小
      type: String,
      default: "default"
    },
    responsive: {
      // 表单项的响应布局
      type: Object,
      default: function() {
        return {
          labelCol: { span: 5 },
          wrapperCol: { span: 16 }
        };
      }
    },
    dataSource: {
      type: Array,
      default: () => []
      // function() {
      // return []
      // return [
      //   {
      //     type: "text", // 控件类型
      //     labelText: "控件名称", // 控件显示的文本
      //     fieldName: "formField1",
      //     value: "",
      //     placeholder: "文本输入区域", // 默认控件的空值文本
      //     rules: [
      //       {
      //         required: true,
      //         message: "必填"
      //       }
      //     ]
      //   },
      //   {
      //     labelText: "数字输入框",
      //     type: "number",
      //     fieldName: "formField2",
      //     value: "",
      //     placeholder: "这只是一个数字的文本输入框"
      //   },
      //   {
      //     labelText: "单选框",
      //     type: "radio",
      //     fieldName: "formField3",
      //     value: "",
      //     defaultValue: "0",
      //     options: [
      //       {
      //         label: "选项1",
      //         value: "0"
      //       },
      //       {
      //         label: "选项2",
      //         value: "1"
      //       }
      //     ]
      //   },
      //   {
      //     labelText: "日期选择",
      //     type: "datetime",
      //     fieldName: "formField4",
      //     value: "",
      //     placeholder: "选择日期"
      //   },
      //   {
      //     labelText: "日期范围",
      //     type: "datetimeRange",
      //     fieldName: "formField5",
      //     value: [],
      //     placeholder: ["开始日期", "选择日期"]
      //   },
      //   {
      //     labelText: "文本区域",
      //     type: "textarea",
      //     fieldName: "formField6",
      //     value: "",
      //     placeholder: "请输入文本了内容"
      //   },
      //   {
      //     type: "select",
      //     labelText: "角色",
      //     fieldName: "role",
      //     value: [],
      //     multiple: "multiple",
      //     defaultValue: [],
      //     rules: [
      //       {
      //         required: true,
      //         message: "必须选择一种角色"
      //       }
      //     ],
      //     options: [
      //       {
      //         label: "系统管理员",
      //         value: "0"
      //       },
      //       {
      //         label: "风控管理员",
      //         value: "1"
      //       },
      //       {
      //         label: "催收管理员",
      //         value: "2"
      //       },
      //       {
      //         label: "催收员",
      //         value: "3"
      //       },
      //       {
      //         label: "审核员",
      //         value: "4"
      //       },
      //       {
      //         label: "财务",
      //         value: "5"
      //       }
      //     ]
      //   },
      //   {
      //     labelText: "下拉框",
      //     type: "select",
      //     fieldName: "formField7",
      //     value: "",
      //     placeholder: "下拉选择你要的",
      //     options: [
      //       {
      //         label: "text1",
      //         value: "0"
      //       },
      //       {
      //         label: "text2",
      //         value: "1"
      //       }
      //     ]
      //   },
      //   {
      //     labelText: "联动",
      //     type: "cascader",
      //     fieldName: "formField8",
      //     value: [],
      //     placeholder: "级联选择",
      //     options: [
      //       {
      //         value: "zhejiang",
      //         label: "Zhejiang",
      //         children: [
      //           {
      //             value: "hangzhou",
      //             label: "Hangzhou",
      //             children: [
      //               {
      //                 value: "xihu",
      //                 label: "West Lake"
      //               },
      //               {
      //                 value: "xiasha",
      //                 label: "Xia Sha",
      //                 disabled: true
      //               }
      //             ]
      //           }
      //         ]
      //       },
      //       {
      //         value: "jiangsu",
      //         label: "Jiangsu",
      //         children: [
      //           {
      //             value: "nanjing",
      //             label: "Nanjing",
      //             children: [
      //               {
      //                 value: "zhonghuamen",
      //                 label: "Zhong Hua men"
      //               }
      //             ]
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ];
      // }
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const formRef = ref<any>(null);
    const {
      datetimeTotimeStamp,
      size,
      formLayout,
      dataSource, //原数据没变
      responsive
    }: any = toRefs(props); //toRefs解构不影响 响应式

    function handleParams(obj: { [s: string]: any } | ArrayLike<unknown>) {
      // 判断必须为obj
      if (!(Object.prototype.toString.call(obj) === "[object Object]")) {
        return {};
      }
      const tempObj: any = {};
      for (let [key, value] of Object.entries(obj)) {
        if (Array.isArray(value) && value.length <= 0) continue;
        if (Object.prototype.toString.call(value) === "[object Function]")
          continue;

        if (datetimeTotimeStamp.value) {
          // 若是为true,则转为时间戳
          if (
            Object.prototype.toString.call(value) === "[object Object]" &&
            value._isAMomentObject
          ) {
            // 判断moment
            value = value.valueOf();
          }
          if (
            Array.isArray(value) &&
            value[0]._isAMomentObject &&
            value[1]._isAMomentObject
          ) {
            // 判断moment
            value = value.map(item => item.valueOf());
          }
        }
        // 若是为字符串则清除两边空格
        if (value && typeof value === "string") {
          value = value.trim();
        }
        tempObj[key] = value;
      }
      console.log("tempObj处理后", tempObj);
      return tempObj;
    }

    function handleSubmit(e: any) {
      // 触发表单提交，也就是搜索按钮
      e.preventDefault();
      const form = unref(formRef);
      form
        .validate()
        .then((res: any) => {
          console.log("处理前的表单数据", res);
          const queryParams = handleParams(res);
          emit("change", queryParams);
        })
        .catch((err: any) => {
          console.log("error: ", err);
        });
    }

    function resetSearchForm() {
      // 重置整个查询表单
      const form = unref(formRef);
      console.log("cz:", form);
      dataSource.value.map((item: any) => {
        if (typeof item.value == "object") {
          item.value = [];
        } else {
          item.value = "";
        }
      });
      form.resetFields();
      emit("change", null);
    }
    const formItemLayout = computed(() => {
      if (formLayout.value === "horizontal") {
        return responsive.value;
      } else {
        return {};
      }
    });
    const GlobalOptions = computed(() => {
      return {
        size: size.value,
        ...formItemLayout.value
      };
    });
    // 重组传入的数据，合并全局配置，子项的配置优先全局
    const renderDataSource = reactive(
      computed({
        get: () => {
          const renderData = dataSource.value.map((item: any) => ({
            ...GlobalOptions.value,
            ...item
          }));
          return renderData;
        },
        set: val => {
          console.log("renderDataSource-  set: ", val);
          // return val;
        }
      })
    );
    //表单验证 数据对象
    const fromData = reactive(
      computed({
        get: () => {
          const Datas: any = [];
          renderDataSource.value.forEach((e: any) => {
            console.log("e.value", e.value ? e.value : e.value);
            Datas.push(
              '"' +
                e.fieldName.replace(/[\s\n\r]/g, "") +
                '"' +
                ":" +
                '"' +
                e.value +
                '"'
            );
          });
          const obj = `{${Datas.join()}}`;
          console.log("obj", obj);
          return JSON.parse(obj);
        },
        set: val => {
          console.log("fromData set: ", val);
        }
      })
    );
    // watchEffect(() => renderDataSource, {
    //   flush: "sync"
    // });

    // watch(renderDataSource.value, (newValue, oldValue) => {
    //   /* ... */
    //   console.log("newValue: ", newValue);
    // });
    // 提交按钮布局
    const buttonItemLayout = computed(() => {
      return formLayout.value === "horizontal"
        ? { wrapperCol: { span: 14, offset: 4 } }
        : {};
    });

    return {
      formRef,
      fromData,
      handleParams,
      handleSubmit,
      resetSearchForm,
      formItemLayout,
      GlobalOptions,
      renderDataSource,
      buttonItemLayout
    };
  }
});
</script>

<style lang="stylus" scoped>
.form-list-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 12px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .ant-form-item-children {
          min-width: 160px;
        }
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
