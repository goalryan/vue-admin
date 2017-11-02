<template>
    <ec-container-item>
        <template slot="head">
            <el-form :inline="true" class="module-form">
                <el-form-item label="查找范围">
                    <el-input v-model="searchValue" @change="filterExpress" icon="close" :on-icon-click="clearFilter"
                              placeholder="输入单号/手机号/姓名" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <ec-load-excel @success="postData"></ec-load-excel>
                </el-form-item>
            </el-form>
        </template>

        <el-table :data="searchExpress" highlight-current-row height="500">
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="id" label="单号" width="180" sortable></el-table-column>
            <el-table-column prop="receiver" label="姓名" width="80" sortable></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120" sortable></el-table-column>
            <el-table-column prop="deliveryAddress" label="地址" sortable></el-table-column>
            <!--<el-table-column label="操作" align="center" width="150">-->
            <!--<template scope="scope">-->
            <!--<el-button type="danger" size="small" @click="deleteExpress(scope.row.id)">删除</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
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
                action: "/api/express/import"
            }
        },
        mounted() {
            this.fetchExpressList();
        },
        filters: {},
        methods: {
            refresh() {
                this.fetchExpressList();
            },
            fetchExpressList() {
                this.$http.get('/api/express')
                    .then(res => {
                        if (res.success) {
                            this.expressList = res.data;
                            this.searchExpress = this.expressList;
                        } else {
                            this.$message({message: res.msg, type: 'error'});
                        }
                    });
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
            postData(data) {
                let params = [];
                for (let i = 0; i < data.length; i = i + 1) {
                    const item = data[i];
                    if (item.运单号 == '')
                        continue;
                    params.push({
                        id: item.运单号,
                        receiver: item.收件人姓名,
                        phone: item.收件人手机,
                        deliveryAddress: item.所在省份 + item.所在城市 + item.所在地区 + item.详细地址,
                        importTime: item.打印时间
                    })
                }
                this.$http.post('/api/express/import', params)
                    .then(res => {
                        if (res.success) {
                            this.$message({message: '导入成功', type: 'success'});
                        } else {
                            this.$message({message: res.msg, type: 'error'});
                        }
                    });
            }
        }
    }

</script>

<style scoped>

</style>