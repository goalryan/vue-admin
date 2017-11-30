/**
 * Created by liushaojun on 2017/9/8.
 */
import GuidGenerate from '../../utils/GuidGenerate.js';

export default {
    initCustomer(billId) {
        const billCustomerId = GuidGenerate.getAddId();
        return {
            id: billCustomerId,
            billId: billId,
            customerId: '',
            customerNickName: '',
            quantity: 1,
            inTotalPrice: 0,
            outTotalPrice: 0,
            profit: 0,
            isPaid: false,
            memo: '',
            isAdd: true,
            isNewCustomer: false,
            goodsList: [
                this.initGoods(billId, billCustomerId)
            ]
        }
    },
    initGoods(billId, billCustomerId) {
        return {
            id: GuidGenerate.getAddId(),
            billId: billId,
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
            isAdd: true,
            isNewGoods: false,
        };
    },
    getRandom() {
        return Math.random();
    },
    /**
     * 匹配模糊搜索出来的结果
     * @param key 输入值
     * @param result 匹配数组
     * @param currentRow 当前行
     * @param isCustomer 是否客户
     */
    bindSearchKey(key, result, currentRow, isCustomer) {
        // 无匹配数组，设置为新对象
        if (result.length === 0) {
            if (isCustomer) {
                currentRow.customerId = GuidGenerate.getAddId();
                currentRow.isNewCustomer = true;
            }
            else {
                currentRow.goodsId = GuidGenerate.getAddId();
                currentRow.isNewGoods = true;
            }
        } else {
            // 匹配到相同的对象
            let findItem = result.find(item => item.value.toLowerCase() === key.trim().toLowerCase());
            if (findItem !== undefined) {
                if (isCustomer) {
                    currentRow.customerId = findItem.id;
                    currentRow.isNewCustomer = false;
                }
                else {
                    currentRow.goodsId = findItem.id;
                    currentRow.isNewGoods = false;
                }

            }
        }
    }
}
