/**
 * Created by liushaojun on 2017/9/8.
 */
import GuidGenerate from '../../utils/GuidGenerate.js';

export default{
    initCustomer(docNo)
    {
        const billCustomerId = GuidGenerate.getAddId();
        return {
            id: billCustomerId,
            docNo: docNo,
            customerId: '',
            customerNickName: '',
            quantity: '',
            inTotalPrice: '',
            outTotalPrice: '',
            profit: '',
            isPaid: false,
            memo: '',
            isAdd: true,
            goodsList: [
                this.initGoods(docNo, billCustomerId)
            ]
        }
    },
    initGoods(docNo, billCustomerId) {
        return {
            id: GuidGenerate.getAddId(),
            docNo: docNo,
            billCustomerId: billCustomerId,
            goodsId: '',
            goodsName: '',
            quantity: 1,
            inUnitPrice: '',
            outUnitPrice: '',
            inTotalPrice: '',
            outTotalPrice: '',
            profit: '',
            isRMB: false,
            positionId: '',
            isAdd: true
        };
    },
    getRandom() {
        return Math.random();
    }
}
