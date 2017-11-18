<template>
    <el-button @click="handleClick"
               :type="type">
        <i class="icon-left icon-loading" v-show="loading"></i>
        <slot></slot>
    </el-button>
</template>
<script>

    export default {
        components: {},
        name: 'EcButton',
        props: {
            type: {
                type: String,
                default: 'primary'
            },
            loading: {
                type: Boolean,
                default: false
            },
            nativeType: {
                type: String,
                default: ''
            }
        },
        methods: {
            handleClick(evt) {
                if (this.loading) return;
                this.$emit('click', evt);
            }
        }
    };
</script>
