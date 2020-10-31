# group-call-front

## 建议vscode安装stylus插件
## vue3.0 + ts + ant-design-vue + stylus

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## 项目 Vue3.0 API 知识点

### setup 
新的 setup 组件选项在创建组件之前执行，一旦 props 被解析，作为在组件内使用 Composition API 的入口点。从生命周期钩子的视角来看，它会在 beforeCreate 钩子之前被调用。
```
！注意：由于在执行 setup 时尚未创建组件实例，
因此在 setup 选项中没有 this。这意味着，除了 props 之外，
你将无法访问组件中声明的任何属性——本地状态、计算属性或方法。

响应式数据：Vue3.0则需要在setup 中通过ref或者reactive 来声明响应式数据。
```
setup 选项应该是props，context
 -  props：props 是响应式的，当传入新的 prop 时，它将被更新,但是不能使用 ES6 解构，因为它会消除 prop 的响应性，如果需要解构 prop，可以通过使用 setup 函数中的 toRefs 来安全地完成此操作
 - context：context是一个普通的对象（不是响应式的）并且暴露出3个组件属性: 1. arrts  2.emit  3.slots    

从 setup 返回的所有内容都将暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板。
```javascript
export default {
  components: {},
  props: {
    user: { type: String }
  },
  setup(props,{attrs, slots, emit}) {
    console.log(props) // { user: '' }
    return {} // 这里返回的任何内容都可以用于组件的其余部分
  }
  // 其余部分
}
```

### ref
ref 是一个函数，它接受一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性 .value。而ref只能监听简单类型的变化，不能监听复杂类型的变化（对象/数组）。 它的本质是reactive，当我们给ref函数传递一个值时，ref函数会自动将ref转换成reactive
从 setup 返回的 refs 在模板中访问时是被自动解开的，因此不应在模板中使用 .value
```javascript
import { ref } from 'vue'

const counter = ref(0)
console.log(count.value) // 0
count.value++
console.log(count.value) // 1

如果传入 ref 的是一个对象，将调用 reactive 方法进行深层响应转换。
```
### isRef
isRef用于判断变量是否为ref对象。isRef(数据)，返回true或者是false。
```javascript
import {isRef} from 'vue'
```

### reactive

接收一个普通对象然后返回该普通对象的响应式代理。
```javascript
 /** 
 *@reactive:处理的是对象的双向绑定, 对象不能被解构或展开，一旦被解构或者展开，返回的值将失去响应式
 */
 export default {
  components: {},
  props: {
    user: { type: String }
  },
  setup(props) {
    console.log(props) // { user: '' }
    const formData = reactive({
	      user: "",
	      password: "",
	      companyName: ""
	});
    return {
    	formData,
    	formData.user  //解构或展开这里将失去响应式
    } 
  }
}
```
### isReactive
检测一个数据是否是reactive类型的。可以用isReactive(数据)，返回true或者false。
```javascript
import {isReactive} from 'vue'
```
### toRefs
toRefs用于将一个reactive对象转化为属性全部为ref对象的普通对象。
```javascript
const state = reactive({
  foo: 1,
  bar: 2
})
const stateAsRefs = toRefs(state)
/*
Type of stateAsRefs:
{
  foo: Ref<number>,
  bar: Ref<number>
}
*/
// toRefs在setup或者Composition Function的返回值时可以保证在使用解构语法之后对象依旧为相应式
```
### watch 响应式更改
使用从 Vue 导入的 watch 函数执行相同的操作。它接受 3 个参数：
一个响应式引用或我们想要侦听的 getter 函数
一个回调
可选的配置选项

```javascript
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})
```

### vue-router4.0 
```
yarn add vue-router@next

```
创建 /router/index.js
```
import { createRouter, createWebHashHistory，createWebHistory } from 'vue-router'
```
createRouter 创建路由实例
```
路由模式 :
  hash模式：createWebHashHistory。
  history模式：createWebHistory。
```