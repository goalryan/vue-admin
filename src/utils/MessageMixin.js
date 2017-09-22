/**
 * Created by liushaojun on 2017/9/11.
 */
export default {
    methods: {
        doConfirm(callback, message) {
            let msg = !message ? '确定删除' : message;
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                callback();
            }).catch(() => {
                //this.$message({ type: 'success', message: '已取消删除' });
            });
        },

    }
};
