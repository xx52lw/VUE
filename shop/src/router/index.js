import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "user" */ '../components/user/Users.vue')

const Rights = () => import(/* webpackChunkName: "power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "power" */ '../components/power/Roles.vue')

const Category = () => import(/* webpackChunkName: "goods" */ '../components/goods/Category.vue')
const Params = () => import(/* webpackChunkName: "goods" */ '../components/goods/Params.vue')
const GoodsList = () => import(/* webpackChunkName: "goods" */ '../components/goods/List.vue')
const GoodsAdd = () => import(/* webpackChunkName: "goods" */ '../components/goods/add.vue')

const OrderList = () => import(/* webpackChunkName: "order" */ '../components/order/Order.vue')

const Report = () => import(/* webpackChunkName: "Report" */ '../components/report/Report.vue')

// import Login from
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Category from '../components/goods/Category.vue'
// import Params from '../components/goods/Params.vue'
// import GoodsList from '../components/goods/List.vue'
// import GoodsAdd from '../components/goods/add.vue'
// import OrderList from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/welocme', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Category },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/orders', component: OrderList },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  console.log(tokenStr)
  if (!tokenStr) {
    return next('/login')
  }
  next()
})
export default router
