<template>
    <div id="app">
        <div class="header">
            <div class="tools" @click.prevent="collapse">
                <i class="fa fa-align-justify"></i>
            </div>
            <div class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><img
                            src="../assets/user.png"/> {{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>我的消息</el-dropdown-item>
                        <el-dropdown-item @click.native="showEditPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="sidebar">
            <div class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed ? '' : sysName}}
            </div>
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen"
                         @close="handleClose" @select="handleSelect"
                         unique-opened router v-show="!collapsed">
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title">
                                <i :class="item.iconCls"></i>{{item.name}}
                            </template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                                          v-if="!child.hidden">{{child.name}}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i
                                :class="item.iconCls"></i>
                            {{item.children[0].name}}
                        </el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)"
                                 @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                                @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path"
                                    class="el-menu-item" style="padding-left: 40px;"
                                    :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">
                                    {{child.name}}
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                            <ul>
                                <li class="el-submenu">
                                    <div class="el-submenu__title el-menu-item"
                                         style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                                         :class="$route.path==item.children[0].path?'is-active':''"
                                         @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i>
                                    </div>
                                </li>
                            </ul>
                        </template>
                    </li>
                </ul>
            </aside>
        </div>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <edit-password-dialog :show.sync="isShowEditPassword"></edit-password-dialog>
    </div>
</template>

<script>
    import EditPasswordDialog from './common/editPasswordView.vue';

    export default {
        components: {
            EditPasswordDialog
        },
        data() {
            return {
                sysName: '代购助手',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                isShowEditPassword: false
            }
        }
        ,
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            handleOpen() {
                console.log('handleOpen');
            },
            handleClose() {
                console.log('handleClose');
            },
            handleSelect: function (a, b) {
                console.log(a, b);
            },
            showEditPassword() {
                this.isShowEditPassword = true;
            },
            //退出登录
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem("enterpriseId");
                    sessionStorage.removeItem("userName");
                    sessionStorage.removeItem('user');
                    _this.$router.push({ path: '/login' });
                }).catch(() => {

                });
            },
            //折叠导航栏
            collapse: function () {
//                this.collapsed = !this.collapsed;
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            }
        },
        mounted() {
            this.sysUserName = sessionStorage.getItem('userName');
        }
    }

</script>
