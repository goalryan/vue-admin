/**
 * Created by liushaojun on 2017/11/1.
 */
//因无法调用this.$http，暂时不能将数据请求提取到servic中，有空再重构

var billService = {

    updateBill(bill, callback){
        this.$http.put(`/api/bill/${bill.docNo}`, bill)
            .then(res => {
                if (res.success) {
                    callback();
                } else {
                    this.$message({ message: res.msg, type: 'error' });
                }
            });
    }
}
export default  billService;
