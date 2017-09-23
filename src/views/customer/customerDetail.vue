<template>
    <ec-dialog :show.sync="showDialog" title="工序流转详情"
               :showCancelButton="false" :showConfirmButton="false" width="650px">

        <el-form label-width="120px">
            <el-form-item label="生产数量：">
                <p>{{formData.header.productQuantity}}</p>
            </el-form-item>
            <el-form-item label="登记数量：">
                <p>{{formData.header.completeQuantity}}</p>
            </el-form-item>
            <el-form-item label="待流转数量：">
                <p>{{formData.header.redirectQuantity}}</p>
            </el-form-item>
            <el-form-item label="已流转数量：">
                <p>{{formData.header.redirectedQuantity}}</p>
            </el-form-item>
        </el-form>
        </el-col>

    </ec-dialog>
</template>

<script>
    export default {
        components: {},
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                formData: {
                    header: {
                        productionQuantity: '',
                        finishedProductQuantity: '',
                        waitInboundQuantity: '',
                        inboundTotalQuantity: ''
                    }
                }
            };
        },
        computed: {
            showDialog: {
                get() {
                    return this.show;
                },
                set(val) {
                    this.$emit('update:show', val);
                }
            }
        },
        watch: {
            show(val) {
                if (val) {
                    //this.getData();
                }
            }
        },
        methods: {}
    };
</script>


