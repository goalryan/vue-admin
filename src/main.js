import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import EcUI from './components';
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import Axios from 'axios'
import VueAxios from './utils/vueAxios'
import routes from './routes'
import Mock from './mock'
Mock.bootstrap();
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/index.less';

Vue.use(ElementUI)
Vue.use(EcUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueAxios, Axios);

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({ path: '/login' })
    } else {
        next()
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

