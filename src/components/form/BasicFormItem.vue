<template>
  <!-- <template v-for="fieldOptions in dataSource" :key="fieldOptions.fieldName">
    <template v-if="fieldOptions.type && fieldOptions.fieldName"> -->
  <a-form-item
    :label="fieldOptions.labelText"
    :label-col="fieldOptions.labelCol"
    :wrapper-col="fieldOptions.wrapperCol"
    :rules="fieldOptions.rules"
    :name="fieldOptions.fieldName"
    validateTrigger="blur"
  >
    <a-input
      v-if="fieldOptions.fieldName && fieldOptions.type === 'text'"
      v-model:value="fieldOptions.value"
      @input="inputValue"
      :disabled="fieldOptions.disabled"
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      :placeholder="fieldOptions.placeholder"
    />
    <a-textarea
      v-model:value="fieldOptions.value"
      :placeholder="fieldOptions.placeholder"
      v-else-if="fieldOptions.fieldName && fieldOptions.type === 'textarea'"
    />
    <a-select
      v-model:value="fieldOptions.value"
      v-else-if="fieldOptions.fieldName && fieldOptions.type === 'select'"
      style="width: 100%"
      showSearch
      :disabled="fieldOptions.disabled"
      :filterOption="selectFilterOption"
      :options="fieldOptions.options"
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      :mode="fieldOptions.multiple ? fieldOptions.multiple : 'default'"
      allowClear
      :placeholder="fieldOptions.placeholder"
    />
    <a-input-number
      v-model:value="fieldOptions.value"
      v-else-if="fieldOptions.fieldName && fieldOptions.type === 'number'"
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      :min="fieldOptions.min ? fieldOptions.min : 1"
      style="width: 100%"
      :placeholder="fieldOptions.placeholder"
    />
    <a-radio-group
      v-model:value="fieldOptions.value"
      v-else-if="
        fieldOptions.fieldName &&
          fieldOptions.type === 'radio-button' &&
          Array.isArray(fieldOptions.options)
      "
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      buttonStyle="solid"
    >
      <template v-for="(item, index) in fieldOptions.options" :key="index">
        <a-radio-button :value="item.value">{{ item.label }} </a-radio-button>
      </template>
    </a-radio-group>
    <a-radio-group
      v-model:value="fieldOptions.value"
      v-else-if="
        fieldOptions.fieldName &&
          fieldOptions.type === 'radio' &&
          Array.isArray(fieldOptions.options)
      "
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      buttonStyle="solid"
    >
      <template v-for="(item, index) in fieldOptions.options" :key="index">
        <a-radio :value="item.value">{{ item.label }} </a-radio>
      </template>
    </a-radio-group>
    <a-date-picker
      v-model:value="fieldOptions.value"
      v-else-if="fieldOptions.fieldName && fieldOptions.type === 'datetime'"
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      :placeholder="fieldOptions.placeholder"
      :valueFormat="
        fieldOptions.valueFormat ? fieldOptions.valueFormat : 'YYYY-MM-DD'
      "
      :format="fieldOptions.format ? fieldOptions.format : 'YYYY-MM-DD'"
      :showToday="fieldOptions.showToday"
      :show-time="fieldOptions.showTime"
      allowClear
    />
    <a-month-picker
      v-model:value="fieldOptions.value"
      v-else-if="fieldOptions.fieldName && fieldOptions.type === 'datemonth'"
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      :placeholder="fieldOptions.placeholder"
      :valueFormat="
        fieldOptions.valueFormat ? fieldOptions.valueFormat : 'YYYY-MM'
      "
      :format="fieldOptions.format ? fieldOptions.format : 'YYYY-MM'"
    />
    <a-week-picker
      v-model:value="fieldOptions.value"
      v-else-if="fieldOptions.fieldName && fieldOptions.type === 'dateweek'"
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      :placeholder="fieldOptions.placeholder"
    />
    <a-range-picker
      v-model:value="fieldOptions.value"
      v-else-if="
        fieldOptions.fieldName && fieldOptions.type === 'datetimeRange'
      "
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      :placeholder="fieldOptions.placeholder"
      :valueFormat="
        fieldOptions.valueFormat
          ? fieldOptions.valueFormat
          : 'YYYY-MM-DD HH:mm:ss'
      "
      :format="
        fieldOptions.format ? fieldOptions.format : 'YYYY-MM-DD HH:mm:ss'
      "
      :showToday="fieldOptions.showToday"
      show-time
      allowClear
    />
    <a-cascader
      v-model:value="fieldOptions.value"
      v-else-if="fieldOptions.fieldName && fieldOptions.type === 'cascader'"
      :size="fieldOptions.size ? fieldOptions.size : 'default'"
      :options="fieldOptions.options"
      :showSearch="{ cascaderFilter }"
      :placeholder="fieldOptions.placeholder"
      :disabled="fieldOptions.disabled"
      allowClear
    />
  </a-form-item>
  <!-- </template>
  </template> -->
</template>
<script lang="ts">
import { defineComponent, toRefs, watch, nextTick } from "vue";
export default defineComponent({
  name: "FormItem",
  props: {
    fieldOptions: {
      // 待渲染的对象
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  setup(props, { emit }) {
    function selectFilterOption(input: any, option: any) {
      // 下拉框过滤函数
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
    function cascaderFilter(inputValue: string, path: any[]) {
      // 级联过滤函数
      return path.some(
        option =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    }
    // const { dataSource }: any = toRefs(props); //toRefs解构不影响 响应式
    // watch(dataSource.value, (count, prevCount) => {
    //   /* ... */
    //   console.log("dataSource： count, prevCount", count, prevCount);
    // });
    function inputValue(e: any) {
      // const returnValue = e.target.value;
      console.log(e);
      // const id = e.srcElement.id;
      // emit("update:+" + id + "}", returnValue);
    }
    return {
      selectFilterOption,
      cascaderFilter,
      inputValue
    };
  }
});
</script>
