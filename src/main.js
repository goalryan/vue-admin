import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import EcUI from './components';
import VueRouter from 'vue-router'
import Axios from 'axios'
import Qs from 'qs'
import VueAxios from './utils/vueAxios'
import VueQueryString from './utils/vueQueryString';
import routes from './routes'

import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/index.less';

Vue.use(ElementUI)
Vue.use(EcUI)
Vue.use(VueRouter)
Vue.use(VueAxios, Axios, Qs);
Vue.use(VueQueryString, Qs);


const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {

    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({path: '/login'});
    } else {
        next()
    }

    // if (!user && to.path != '/test') {
    //     next({ path: '/test' });
    // } else {
    //     next()
    // }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

