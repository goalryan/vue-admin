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
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/index.less';

Vue.use(ElementUI, { size: 'mini' })
Vue.use(EcUI)
Vue.use(VueRouter)
Vue.use(VueAxios, Axios, Qs);
Vue.use(VueQueryString, Qs);


const router = new VueRouter({
    model: 'history',
    routes: routes
})

const TITLE = 'EasyGou';
router.beforeEach((to, from, next) => {
    document.title = TITLE;
    let token = sessionStorage.getItem('token');
    if (!token && to.path != '/login') {
        next({ path: '/login' });
    } else {
        next()
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

