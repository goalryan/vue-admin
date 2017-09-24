/**
 * Created by liushaojun on 2017/9/22.
 */
const CUS_DOC_NO_LIST = "CusDocNoList";
export default {
    fetchCustomers(){
        return [
            {
                id: 1,
                name: '张三',
                phone: '13510930357',
                address: '广东省深圳市南山区科技中二路软件园一期一栋401'
            },
            {
                id: 2,
                name: '李四',
                phone: '13510930358',
                address: '广东省深圳市南山区科技中二路软件园一期一栋402'
            },
            {
                id: 3,
                name: '王五',
                phone: '13510930359',
                address: '广东省深圳市南山区科技中二路软件园一期一栋403'
            },
            {
                id: 5,
                name: '张三',
                phone: '13510930357',
                address: '广东省深圳市南山区科技中二路软件园一期一栋401'
            },
            {
                id: 6,
                name: '李四',
                phone: '13510930358',
                address: '广东省深圳市南山区科技中二路软件园一期一栋402'
            },
            {
                id: 7,
                name: '王五',
                phone: '13510930359',
                address: '广东省深圳市南山区科技中二路软件园一期一栋403'
            },
            {
                id: 8,
                name: '张三',
                phone: '13510930357',
                address: '广东省深圳市南山区科技中二路软件园一期一栋401'
            },
            {
                id: 9,
                name: '李四',
                phone: '13510930358',
                address: '广东省深圳市南山区科技中二路软件园一期一栋402'
            },
            {
                id: 10,
                name: '王五',
                phone: '13510930359',
                address: '广东省深圳市南山区科技中二路软件园一期一栋403'
            },

        ]
        // return JSON.parse(window.localStorage.getItem(
        //     CUS_DOC_NO_LIST || "[]"))
    },
    fetchCustomersByPhone(phone){

    },
}
