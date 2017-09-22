/**
 * Created by liushaojun on 2017/9/8.
 */
export default{
    initBillDocNo() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? `0${month}` : `${month}`;
        let day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        return `BILL${year}${month}${day}`;
    },
    initCustomer()
    {
        return {
            id: this.getRandom(),
            customerName: '',
            quantity: '',
            inTotalPrice: '',
            outTotalPrice: '',
            profit: '',
            isPaid: false,
            remark: '',
            products: [
                this.initProduct()
            ]
        }
    },
    initProduct() {
        return {
            name: '',
            quantity: 1,
            inUnitPrice: '',
            outUnitPrice: '',
            inTotalPrice: '',
            outTotalPrice: '',
            profit: '',
            isRMB: false
        };
    },
    getRandom() {
        return Math.random();
    }
}
