import Login from './views/Login.vue'
import Test from './views/Test.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Bill from './views/bill/bill.vue'
import BillDetail from './views/bill/billDetail.vue'
import Customer from './views/customer/customer.vue'
import CustomerExport from './views/customer/customerExport.vue'
import Address from './views/customer/address.vue'
import AddressExport from './views/customer/addressExport.vue'
import Express from './views/customer/express.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/test',
        component: Test,
        name: '',
        hidden: true
    },
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '账单管理',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            // {path: '/main', component: Main, name: '主页', hidden: true},
            {
                path: '/bill', component: Bill, name: '账单清单',
                children: [{
                    path: 'detail/:status/:docNo?', component: BillDetail, name: 'billDetail'
                }]
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '客户管理',
        iconCls: 'fa fa-id-card-o',
        leaf: false,//只有一个节点
        children: [
            {
                path: '/address', component: Address, name: '收货地址',
                children: [{
                    path: 'export', component: CustomerExport, name: 'addressExport'
                }]
            },
            {
                path: '/express', component: Express, name: '快递单',
                children: []
            }
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            {path: '/echarts', component: echarts, name: '图表'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;