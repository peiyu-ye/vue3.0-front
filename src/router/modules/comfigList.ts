const Layout = () => import("@/views/Home.vue");

const comfigList = {
  path: "/configList",
  name: "ConfigList",
  hidden: false,
  meta: {
    title: "群呼任务",
    isLogin:true    // 添加该字段，表示进入这个路由是需要登录的
  },
  component: Layout,
  children: [
    {
      path: "/dialing",
      name: "Item1",
      hidden: false,
      meta: {
        title: "号码组",
      },
      component: () => import("@/views/configList/dialing.vue"),
    },
    {
      path: "/seatgroup",
      name: "seatGroup",
      hidden: false,
      meta: {
        title: "坐席组",
      },
      component: () => import("@/views/configList/seatgroup.vue"),
    },
  ],

};

export default comfigList;
