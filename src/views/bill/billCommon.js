/**
 * Created by liushaojun on 2017/9/8.
 */
import GuidGenerate from '../../utils/GuidGenerate.js';

export default {
    initCustomer(docNo) {
        const billCustomerId = GuidGenerate.getAddId();
        return {
            id: billCustomerId,
            docNo: docNo,
            customerId: '',
            customerNickName: '',
            quantity: 1,
            inTotalPrice: 0,
            outTotalPrice: 0,
            profit: 0,
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
            inUnitPrice: 0,
            outUnitPrice: 0,
            inTotalPrice: 0,
            outTotalPrice: 0,
            profit: 0,
            isRMB: false,
            positionId: '',
            isAdd: true
        };
    },
    getRandom() {
        return Math.random();
    }
}
