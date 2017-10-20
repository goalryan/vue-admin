<template>
    <ec-container-item>
        <template slot="head">
            <el-form :inline="true" class="module-form">
                <el-form-item label="查找范围">
                    <el-input v-model="searchValue" @change="filterExpress" icon="close" :on-icon-click="clearFilter"
                              placeholder="输入单号/手机号/姓名" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <ec-upload :multiple="false" :action="action" @success="importEnd"></ec-upload>
                    <!--<el-button size="small" type="primary" @click="importExpress">导入快递单</el-button>-->
                </el-form-item>
            </el-form>
        </template>

        <el-table :data="searchExpress" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="id" label="单号" width="80" sortable></el-table-column>
            <el-table-column prop="receiver" label="姓名" width="80" sortable></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120" sortable></el-table-column>
            <el-table-column prop="deliveryAddress" label="地址" sortable></el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template scope="scope">
                    <el-button type="danger" size="small" @click="deleteExpress(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </ec-container-item>

</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';
    import CommonMixin from '../../utils/CommonMixin.js';
    import Vue from 'vue';

    export default {
        mixins: [MessageMixin, CommonMixin],
        components: {},
        data() {
            return {
                isAdd: false,
                searchExpress: [],
                searchValue: '',
                expressList: [],
                express: {},
                action:"/api/express/import"
            }
        },
        mounted() {
//            this.fetchExpressList();
        },
        filters: {},
        methods: {
            refresh() {
                this.fetchExpressList();
            },
            fetchExpressList() {
                this.$http.get('/api/express')
                    .then(res => {
                        this.expressList = res.result.data;
                    });
                this.searchExpress = this.expressList;
            },
            clearFilter() {
                this.searchValue = '';
                this.filterExpress();
            },
            deleteExpress(id) {
                let index = this.expressList.findIndex(item => item.id === id);
                this.doConfirm(() => {
                    this.expressList.splice(index, 1);
                    this.filterExpress();
                }, `确定删除快递单【${this.expressList[index].id}】?`)
            },
            filterExpress() {
                this.searchExpress = this.expressList.filter((item) => {
                    return item.id.indexOf(this.searchValue) >= 0 ||
                        item.receiver.indexOf(this.searchValue) >= 0 || item.phone.indexOf(this.searchValue) >= 0
                });
            },
            importEnd() {

            },

        }
    }

</script>

<style scoped>

</style>