/**
 * Created by liushaojun on 2017/9/22.
 */
const CUS_DOC_NO_LIST = "CusDocNoList";
export default {
    fetchCustomers(){
        return JSON.parse(window.localStorage.getItem(
            CUS_DOC_NO_LIST || "[]"))
    },
    fetchCustomersByPhone(phone){

    },
}
