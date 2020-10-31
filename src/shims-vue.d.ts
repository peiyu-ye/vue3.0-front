/** 类型声明超过1个时，组件内需要import包就不能在其内部进行，需要将其写在最外层，否则会报错。 */
// 声明vue文件的导出类型
declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
// // 声明全局属性类型
// declare module "@vue/runtime-core" {
//   interface ComponentCustomProperties<T> {
//     $api: T;
//   }
// }
declare module "*.html" {
  const value: string;
  export default value;
}
declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.styl" {
  const content: any;
  export default content;
}
declare module "*.js" {
  const content: any;
  export default content;
}

declare module "*.ts" {
  const content: any;
  export default content;
}
