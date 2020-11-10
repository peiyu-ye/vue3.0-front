import { createRouter, createWebHistory } from "vue-router";
import comfigList from "./modules/comfigList";
import test from "./modules/test";
const Layout = () => import("@/views/Home.vue");

const routes: Array<any> = [
  {
    // 主框架
    path: "/layout",
    name: "Home",
    hidden: false,
    meta: {
      isLogin: true, // 添加该字段，表示进入这个路由是需要登录的
    }, //路由元
    component: Layout,
    children: [
      {
        path: "/index",
        name: "index",
        hidden: false,
        meta: {
          icon: "ant-design:home-filled",
          title: "主页"
        },
        component: () => import("@/views/user/userCenter.vue"),
      },
      // 菜单一
      comfigList,
      // 用户中心
      {
        path: "/user",
        name: "User",
        hidden: true,
        component: () => import("@/views/user/userCenter.vue"),
        children: [
          {
            path: "/userCenter",
            name: "userCenter",
            hidden: true,
            component: () => import("@/views/user/userCenter.vue"),
          },
          {
            path: "/changePassword",
            name: "ChangePassword",
            hidden: true,
            component: () => import("@/views/user/changePassword.vue"),
          },
        ],
      },
    ],
  },
  {
    // login
    path: "/",
    name: "Login",
    hidden: true,
    component: () => import("@/views/login/Login.vue"),
  },
  {
    path: "/:path(.*)*",
    name: "ErrPage",
    hidden: true,
    component: () => import("@/views/errPages/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // scrollBehavior(to, from, savedPosition) scroll to id `#app` + 200px, and scroll smoothly (when supported by the browser)
    return {
      el: "#app",
      top: 0,
      left: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from, next) => {
  // if (to.path === "/") {next({ path: "/login" });}
  if (to.matched.some((res) => res.meta.isLogin)) {
    //判断是否需要登录
    if (localStorage.token) {
      next();
    } else {
      location.href = location.origin;
      // next({
      //   path: "/login",
      //   query: {
      //     redirect: '/',
      //   },
      // });
    }
  } else {
    next();
  }
});
router.afterEach(() => {});

export default router;