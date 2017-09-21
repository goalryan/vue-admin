/**
 * Created by liushaojun on 2017/8/26.
 */
const STORAGE_KEY = "todos-vuejs";
const DOC_NO_LIST = "doc_no_list";
export default{
    fetch(){
        return JSON.parse(window.localStorage.getItem(
            STORAGE_KEY || "[]"))
    },
    save(items){
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    },
    /**
     * 获取单据
     * @param docNo
     */
    fetchBill(docNo){
        return JSON.parse(window.localStorage.getItem(
            docNo || "{}"))
    },
    /**
     * 保存单据
     * @param items 数据
     * @param docNo 单号，按日期生成 20170826
     */
    saveBill(items, docNo){
        this.saveBillDocNo(docNo);
        window.localStorage.setItem(docNo, JSON.stringify(items));
    },
    delBill(docNo){
        this.delBillDocNo(docNo);
        window.localStorage.setItem(docNo, JSON.stringify({}));
    },
    /**
     * 获取单据号列表
     */
    fetchBillList(){
        return JSON.parse(window.localStorage.getItem(
            DOC_NO_LIST || "[]"));
    },
    /**
     * 添加单据号
     * @param docNo
     */
    saveBillDocNo(docNo){
        let docNoList = this.fetchBillList();
        if (!docNoList) {
            window.localStorage.setItem(DOC_NO_LIST, JSON.stringify([]));
        }
        // 不存在单号才添加
        if (docNoList.filter(item => item.docNo == docNo).length === 0) {
            docNoList.splice(0, 0, { docNo: docNo });
            window.localStorage.setItem(DOC_NO_LIST, JSON.stringify(docNoList));
        }
    },
    /**
     * 删除指单据号
     * @param docNo
     */
    delBillDocNo(docNo) {
        let newDocNoList = this.fetchBillList().filter(item => item.docNo !== docNo);
        window.localStorage.setItem(DOC_NO_LIST, JSON.stringify(newDocNoList));
    },
    /**
     * 删除所有单据号和单据数据
     */
    delAllBill(){
        let docNoList = this.fetchBillList();
        docNoList.forEach(item => {
            this.delBill(item.docNo);
        });
        window.localStorage.setItem(DOC_NO_LIST, JSON.stringify([]));
    }

}