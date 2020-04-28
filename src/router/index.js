import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../Login.vue'),
  },
  {
    path: '/',
    name: 'Home',
    redirect: 'page1',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    children: [
      {
        path: 'about',
        name: 'About',
        component: () => import(/* webpackChunkName: "home" */ '../views/About.vue'),
      },
      {
        path: 'page1',
        name: 'page1',
        component: () => import(/* webpackChunkName: "home" */ '../views/page1.vue'),
      },
      {
        path: 'page2',
        name: 'page2',
        component: () => import(/* webpackChunkName: "home" */ '../views/page2.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
