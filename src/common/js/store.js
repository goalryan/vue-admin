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
     * 保存单据
     * @param items 数据
     * @param docNo 单号，按日期生成 20170826
     */
    saveDoc(items, docNo){
        this.saveDocNo(docNo);
        window.localStorage.setItem(docNo, JSON.stringify(items));
    },
    delDoc(docNo){
        this.delDocNo(docNo);
        window.localStorage.setItem(docNo, JSON.stringify({}));
    },
    /**
     * 获取单据
     * @param docNo
     */
    fetchDoc(docNo){
        return JSON.parse(window.localStorage.getItem(
            docNo || "{}"))
    },
    /**
     * 添加单据号
     * @param docNo
     */
    saveDocNo(docNo){
        var docNoList = this.fetchDocNoList();
        if (!docNoList) {
            window.localStorage.setItem(DOC_NO_LIST, JSON.stringify([]));
        }
        // 不存在单号才添加
        if (docNoList.filter(item => item == docNo).length === 0) {
            docNoList.splice(0, 0, docNo);
            window.localStorage.setItem(DOC_NO_LIST, JSON.stringify(docNoList));
        }
    },
    /**
     * 获取单据号列表
     */
    fetchDocNoList(){
        return JSON.parse(window.localStorage.getItem(
            DOC_NO_LIST || "[]"));
    },
    delDocNo(docNo) {
        let newDocNoList = this.fetchDocNoList().filter(item => item !== docNo);
        window.localStorage.setItem(DOC_NO_LIST, JSON.stringify(newDocNoList));
    },
    delDocNoList(){
        window.localStorage.setItem(DOC_NO_LIST, JSON.stringify([]));
    }


}