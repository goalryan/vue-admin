/**
 * Created by lucas on 2017/8/4.
 */

export default function plugin(Vue, axios) {
    const VueAxios = Vue;

    if (plugin.installed) {
        return;
    }
    plugin.installed = true;
    if (!axios) {
        console.error('You have to install axios');
        return;
    }
    /**
     * 全局ajax请求的loading效果
     * */
    let ajaxLinks = 0;
    let ajaxLoading = false;
    let loadDiv = document.getElementById('ecAjaxLoading');

    const showAjaxLoading = () => {
        ajaxLinks += 1;
        if (!loadDiv) {
            loadDiv = document.createElement('div');
            loadDiv.className = 'loading-mask';
            loadDiv.id = 'ecAjaxLoading';
            loadDiv.innerHTML = '<div class="ball-pulse"> <div></div> <div></div> <div></div></div>';
            if (ajaxLinks && !ajaxLoading) {
                document.body.appendChild(loadDiv);
                ajaxLoading = true;
            }
        } else if (ajaxLinks && !ajaxLoading) {
            loadDiv.style.display = 'flex';
            ajaxLoading = true;
        }
    };

    const closeAjaxLoading = () => {
        ajaxLinks -= 1;
        if (ajaxLinks <= 0) {
            if (loadDiv) {
                loadDiv.style.display = 'none';
            }
            ajaxLoading = false;
            ajaxLinks = 0;
        }
    };

    axios.interceptors.request.use((config) => {
        showAjaxLoading();
        return config;
    });

    axios.interceptors.response.use((response) => {
        const { success, errCode, errMsg } = response.data;
        if (!success) {
            if (errCode === 'unlogin') {
                window.location.href = '/ierp/logout';
            } else if (errCode === 'exception') {
                Vue.prototype.$ecConfirm({
                    message: '网络错误，请刷新后重试',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: '刷新'
                }).then(
                    () => {
                        window.location.reload();
                    },
                    () => {
                    }
                );
            } else {
                Vue.prototype.$message.error(errMsg === undefined || errMsg === null || errMsg === '' ? '服务器异常' : errMsg);
            }
        }

        closeAjaxLoading();

        return response;
    }, (error) => {
        closeAjaxLoading();
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
