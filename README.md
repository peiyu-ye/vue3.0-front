# group-call-front

## 建议vscode安装stylus插件
## vue3.0 + ts + ant-design-vue + stylus

## 安装依赖
```
yarn install
```

### 开发启动
```
yarn serve
```

### 打包
```
yarn build
```

### 格式化
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

// 如果传入 ref 的是一个对象，将调用 reactive 方法进行深层响应转换。
```
ref 就当作简单的双向绑定变量 ;
toRef 就是把不是响应式的对象转化成响应式 ;
toRefs 就是把响应式的reactive对象，分解成无数的 ref 双向绑定 ;

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
### v-model

在 3.x 中，自定义组件上的 v-model 相当于传递了 modelValue prop 并接收抛出的 update:modelValue 事件：

```javascript
<ChildComponent v-model="pageTitle" />

<!-- 简写: -->

<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
```
#### v-model 参数
若需要更改 model 名称，而不是更改组件内的 model 选项，那么现在我们可以将一个 argument 传递给 model：
```javascript
<ChildComponent v-model:title="pageTitle" />

<!-- 简写: -->

<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
v-bind anatomy
```

这也可以作为 .sync 修饰符的替代，而且允许我们在自定义组件上使用多个 v-model。
```javascript
<ChildComponent v-model:title="pageTitle" v-model:content="pageContent" />

<!-- 简写： -->

<ChildComponent
  :title="pageTitle"
  @update:title="pageTitle = $event"
  :content="pageContent"
  @update:content="pageContent = $event"
/>
```

#### v-model 修饰符
除了像 .trim 这样的 2.x 硬编码的 v-model 修饰符外，现在 3.x 还支持自定义修饰符：

```javascript
<ChildComponent v-model.capitalize="pageTitle" />
```

### 全局内部 API
在 Vue 3 中，全局和内部 API 都经过了重构，并考虑到了 tree-shaking 的支持。
因此，全局 API 现在只能作为 ES 模块构建的命名导出进行访问。例如，我们之前的片段现在应该如下所示：
```
import { nextTick } from 'vue'

nextTick(() => {
  // 一些和DOM有关的东西
})
```
3.x 版本中 v-if 总是优先于 v-for 生效

## 配置项目

### 配置Vue Router
Vue Router 4.0 ，变化请查看 [Github](https://github.com/vuejs/vue-router-next) 中完整的细节，
目前版本beta: v4.0.0-beta.13, yarn 进行安装需要带上版本号
**配置vue-router**
createRouter 创建路由实例
```
路由模式 :
  hash模式：createWebHashHistory。
  history模式：createWebHistory。
```
在项目src目录下面新建router目录内容
```typescript
// import VueRouter from 'vue-router'
import {createRouter, createWebHashHistory} from 'vue-router'
const routes:any = []
// Vue-router新版本中，需要使用createRouter来创建路由
export default  createRouter({
  // 指定路由的模式,此处使用的是hash模式
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})

// const routes :any = []
// // 3. Create the router instance and pass the `routes` option
// // You can pass in additional options here, but let's
// // keep it simple for now.
// const router = VueRouter.createRouter({
//   // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
//   history: VueRouter.createWebHashHistory(),
//   routes, // short for `routes: routes`
// })

```

### 配置Vuex
Vuex 4.0 ，变化请查看[Github](https://github.com/vuejs/vuex/tree/4.0)
目前版本beta: v4.0.0-beta.4
**配置vuex**
在项目src目录下面新建store目录index.ts文件内容
```typescript
import { createStore } from 'vuex'

interface State {
  userName: string
}
export default createStore({
  state(): State {
    return {
      userName: "vuex",
    };
  },
});
```

### 配置Ant Design Vue 
具体使用方式请参考：[官方文档](https://2x.antdv.com/docs/vue/introduce-cn/)
**1、引入ant-design-vue**
```
yarn  add ant-design-vue@next
```

**2、在main.ts中引入**
```typescript
iimport { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import AntDesignVue from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router/index'
import store from './store/index'

// import router 后创建并挂载根实例。
const app = createApp(App)
// 确保 t_use_  实例来创建router
// 整个应用程序路由器感知。
app.use(router)
app.use(store)
app.use(AntDesignVue)
app.mount('#app')
// createApp(App).mount('#app')
```


