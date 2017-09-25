/**
 * Created by liushaojun on 2017/9/11.
 */
export default {
    methods: {
        getRandom() {
            return Math.random();
        },
        getDeepObj(obj){
            return JSON.parse(JSON.stringify(obj));
        }
    }
};
