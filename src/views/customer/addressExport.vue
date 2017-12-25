<template>
    <ec-page @close="close" title="导出收件人">
        <ec-page-item>
            <el-transfer
                    v-model="selectAddresses"
                    filterable
                    :filter-method="filterMethod"
                    :left-default-checked="[]"
                    :right-default-checked="[]"
                    :render-content="renderFunc"
                    :titles="['Source', 'Target']"
                    :footer-format="{
                      noChecked: '${total}',
                      hasChecked: '${checked}/${total}'
                    }"
                    @change="handleChange"
                    :data="customers"
                    class="ec-transfer">
            </el-transfer>

        </ec-page-item>
        <ec-page-item slot="footer">
            <el-button @click="loadData" type="primary">加载收件人</el-button>
            <el-button @click="export2Excel" type="primary">导出</el-button>
        </ec-page-item>
    </ec-page>
</template>

<script>
    import MessageMixin from '../../utils/MessageMixin.js';

    export default {
        mixins: [MessageMixin],
        data() {
            return {
                addresses: [],
                selectAddresses: [],
                exportAddresses: [],
                renderFunc(createElement, option) {
                    return createElement('div', [renderFirstRow(createElement, option), renderSecondRow(createElement, option)])
                },
                filterMethod(query, item) {
                    let names = item.receiver.indexOf(query) > -1;
                    let phones = item.phone.indexOf(query) > -1;
                    return phones || names;
                }
            };

            function renderFirstRow(createElement, option) {
                return createElement('p', [renderNameCell(createElement, option), renderPhoneCell(createElement, option)])
            }

            function renderNameCell(createElement, option) {
                return createElement('h4', `${ option.receiver }`)
            }

            function renderPhoneCell(createElement, option) {
                return createElement('h6', `${ option.phone }`)
            }

            function renderSecondRow(createElement, option) {
                return createElement('h6', `${ option.deliveryAddress }`)
            }
        },
        created() {
            this.fetchData();
        },
        mounted() {

        },
        methods: {
            close() {
                this.$router.back();
            },
            fetchData() {
                this.$http.get('api/address')
                    .then(res => {
                        if (res.success) {
                            this.addresses = res.data;
                            this.addresses.forEach(item => {
                                item.key = item.id;
                                item.label = item.receiver + item.phone + item.deliveryAddress;
                                item.disabled = false;
                            })
                            console.log(this.addresses);
                        } else {
                            this.$message({ message: res.msg, type: 'error' });
                        }
                    })
            },
            loadData() {
                this.fetchData();
            },
            handleChange(value, direction, movedKeys) {
                console.log(value, direction, movedKeys);
            },
            export2Excel() {
                this.selectAddresses.forEach(item => {
                    for (let i = 0; i < this.addresses.length; i++) {
                        if (item === this.addresses[i].id) {
                            this.addresses[i].zeroCol = '';
                            this.exportAddresses.push(this.addresses[i]);
                            break;
                        }
                    }
                });
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../utils/ExportExcel');
                    const tHeader = ['订单编号', '收件人姓名（必填）', '收件人手机（二选一）', '收件人电话（二选一）', '收件人地址（必填）', '商品信息', '寄件人姓名', '寄件人手机（二选一）', '寄件人电话（二选一）', '寄件人地址'];
                    const filterVal = ['zeroCol', 'receiver', 'phone', 'zeroCol', 'deliveryAddress', 'zeroCol', 'zeroCol', 'zeroCol', 'zeroCol', 'zeroCol'];
                    const list = this.exportAddresses;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '收件人信息');//自定义打印导入数据模板
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>