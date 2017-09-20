/**
 * Created by liushaojun on 2017/9/8.
 */
export default{
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
