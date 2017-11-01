/**
 * Created by liushaojun on 2017/11/1.
 */
export default {

    getAddId() {
        var timestamp = new Date().getTime();
        return `${timestamp}${Math.random().toString().split('.')[1].substring(0, 5)}`;
    }

};