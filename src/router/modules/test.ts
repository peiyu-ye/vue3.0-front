const index = () => import("@/views/info/item1.vue");

const test = {
  path: "/home",
  name: "Home",
  hidden: false,
  meta: {
    icon: "mdi:home",
    title: "主页"
  },
  component: () => import("@/views/configList/seatgroup.vue"),
};

export default test;
