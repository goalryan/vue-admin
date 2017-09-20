<template>
    <ec-container-item>
        <template slot="head">
            <el-button type="primary" @click="handleAdd">header</el-button>
        </template>

        <div style="height: 500px">
            <el-button type="primary" @click="handleAdd">body</el-button>
        </div>



        <template slot="footer">
            <el-button type="primary" @click="handleAdd">foot</el-button>
        </template>
    </ec-container-item>
</template>

<script>
    export default {}

</script>

<style scoped>

</style>