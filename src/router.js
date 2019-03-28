import Home from '@/components/Home'
import OrderList from '@/components/OrderList'
import ProductList from '@/components/ProductList'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    }, {
      path: '/:shop/products',
      name: 'ProductList',
      component: ProductList,
    }, {
      path: '/:shop/orders',
      name: 'OrderList',
      component: OrderList,
    }
  ]
})
