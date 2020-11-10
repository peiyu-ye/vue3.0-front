import Vue, { VNode } from 'vue'


declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    interface ElementAttributesProperty {
      $props: any; // 定义要使用的属性名称
    }
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      // ['v-if']?: unknown;
      // ['v-else-if']?: unknown;
      // ['v-else']?: unknown;
      // need
      // ['v-show']?: unknown;
      [elem: string]: any;
      // ['v-html']?: unknown;
      // ['v-text']?: unknown;
      // ['v-model']?: unknown;
    }
  }
}
