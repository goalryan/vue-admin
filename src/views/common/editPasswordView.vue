<template>
    <ec-dialog :show.sync="showDialog" :title="getTitle"
               :showCancelButton="false" :showConfirmButton="false" width="400px">
        <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="120px">
            <el-form-item label="帐号：">
                <el-input v-model="userForm.userName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item prop="oldPassword" label="旧密码：">
                <el-input v-model="userForm.oldPassword" type="password" :maxlength="16"
                          placeholder=""></el-input>
            </el-form-item>
            <el-form-item prop="newPassword" label="新密码：">
                <el-input v-model="userForm.newPassword" type="password" :maxlength="16"
                          placeholder=""></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword" label="确认密码：">
                <el-input v-model="userForm.confirmPassword" type="password" :maxlength="16"
                          placeholder=""></el-input>
            </el-form-item>
            <el-form-item style="display:flex;flex: 1;justify-content:flex-end;align-items: center">
                <el-button @click.native.prevent="close">关闭</el-button>
                <el-button @click.native.prevent="handleReset">重置</el-button>
                <el-button type="primary" @click.native.prevent="handleSubmit('userForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </ec-dialog>
</template>

<script>
    import qs from 'qs';

    export default {
        components: {},
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            var validateNewPassword = (rule, value, callback) => {
                if (value.length < 5) {
                    callback(new Error('密码最少六位'));
                } else if (value.indexOf("'") !== -1 || value.indexOf(",") !== -1) {
                    callback(new Error("密码不能包含字符 ' ,"));
                } else {
                    callback();
                }
            };
            var validateConfirmPassword = (rule, value, callback) => {
                if (value !== this.userForm.newPassword) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                userForm: {
                    userName: '',
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                rules: {
                    oldPassword: [{required: true, message: '请输入旧密码', trigger: 'blur,change'}],
                    newPassword: [{required: true, message: '请输入新密码', trigger: 'blur,change'}, {
                        validator: validateNewPassword,
                        trigger: 'blur'
                    }],
                    confirmPassword: [{
                        required: true,
                        message: '请确认密码',
                        trigger: 'blur'
                    }, {validator: validateConfirmPassword, trigger: 'blur,change'}]
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
            },
            getTitle: {
                get() {
                    return "修改密码";
                }
            }
        },
        watch: {
            show(val) {
                this.handleReset();
            }
        },
        mounted() {
            this.userForm.userName = sessionStorage.getItem('userName');
        },
        methods: {
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        this.$http.post('/api/user/chagePassword', qs.stringify(this.userForm))
                            .then(res => {
                                const {msg, success} = res;
                                if (success) {
                                    this.showDialog = false;
                                    this.$message({message: '修改成功，请重新登录', type: 'success'});
                                    sessionStorage.removeItem("token");
                                    sessionStorage.removeItem("user");
                                    setTimeout(() => {
                                        this.$router.push({path: '/login'});
                                    }, 100);

                                } else {
                                    this.$message({message: res.msg, type: 'error'});
                                }

                            })
                            .catch(e => {

                            });
                    }
                });

            },
            handleReset() {
                this.$refs.userForm.resetFields();
            },
            close() {
                this.showDialog = false;
            }
        }
    };
</script>


