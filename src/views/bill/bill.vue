<template>
    <ec-container-item>
        <template slot="head">
            <el-button size="small" type="primary" @click="addBill()">添加账单</el-button>
        </template>

        <el-table :data="bills" highlight-current-row>
            <el-table-column type="index" label="序号" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="docNo" label="单号" sortable>
            </el-table-column>
            <!--<el-table-column label="操作" align="center" width="150">-->
            <!--<template scope="scope">-->
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
        </el-table>
        <router-view></router-view>
    </ec-container-item>

</template>

<script>
    export default {
        data() {
            return {
                bills: [
                    { docNo: '20170910' },
                    { docNo: '20170911' },
                    { docNo: '20170912' },
                ]
            }
        },
        methods: {
            addBill(){
                this.$router.push({
                    name: 'billAdd'
                })
            }
        }
    }

</script>

<style scoped>

</style>