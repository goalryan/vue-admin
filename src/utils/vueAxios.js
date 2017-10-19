/**
 * Created by liushaojun on 2017/8/4.
 */

export default function plugin(Vue, axios, qs) {
    const VueAxios = Vue;

    if (plugin.installed) {
        return;
    }
    plugin.installed = true;
    if (!axios) {
        console.error('You have to install axios');
        return;
    }

    //响应时间
    // axios.defaults.timeout = 5000;
    //配置请求头
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    //配置接口地址
    axios.defaults.baseURL = 'http://localhost:5000';


    axios.interceptors.request.use((config) => {
        //在发送请求之前做某件事（以表单形式提交数据）
        // if (config.method === 'post') {
        //     config.data = qs.stringify(config.data);
        // }
        return config;
    }, (error) => {
        console.log("错误的传参");
        return Promise.reject(error);
    });

    axios.interceptors.response.use((response) => {
        //对响应数据做些事
        if (!response.data.success) {
            return Promise.reject(response);
        }
        return response;
    }, (error) => {
        console.log("网络异常");
        return Promise.reject(error);
    });

    VueAxios.axios = axios;
    Object.defineProperties(VueAxios.prototype, {
        $http: {
            get() {
                return axios;
            }
        }
    });
}
