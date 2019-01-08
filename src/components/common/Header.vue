<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">Vue-Element管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!--<div class="btn-bell">-->
                    <!--<el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">-->
                        <!--<router-link to="/tabs">-->
                            <!--<i class="el-icon-bell"></i>-->
                        <!--</router-link>-->
                    <!--</el-tooltip>-->
                    <!--<span class="btn-bell-badge" v-if="message"></span>-->
                <!--</div>-->
                <!-- 用户头像 -->
                <div class="user-avator"><img :src="userInfo.userInfo && userInfo.userInfo.logoUrl ? userInfo.userInfo.logoUrl : 'static/img/img.jpg'"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="hover" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <label class="cursor-pointer" v-if="userInfo.userInfo">{{userInfo.userInfo && userInfo.userInfo.userName ? userInfo.userInfo.userName : userInfo.userInfo.userPhone}}</label>
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="my">个人信息</el-dropdown-item>
                        <el-dropdown-item divided command="changeTheme">更换主题</el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- 换肤弹窗 -->
        <el-dialog title="更改主题颜色" :visible.sync="dialogVisible"  width="550px">
            <el-form class="theme-form" label-width="140px">
                <el-form-item label="主题颜色：">
                    <el-row>
                        <button type="button" class="theme-btn theme-red" @click="getThemeValue('theme-red')">
                            <i v-if="themeValue == 'theme-red'" class="el-icon-circle-check-outline">&nbsp;</i>红色</button>
                        <button type="button" class="theme-btn theme-orange" @click="getThemeValue('theme-orange')">
                            <i v-if="themeValue == 'theme-orange'" class="el-icon-circle-check-outline">&nbsp;</i>橙色</button>
                        <button type="button" class="theme-btn theme-yellow" @click="getThemeValue('theme-yellow')">
                            <i v-if="themeValue == 'theme-yellow'" class="el-icon-circle-check-outline">&nbsp;</i>黄色</button>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <button type="button" class="theme-btn theme-blue" @click="getThemeValue('theme-blue')">
                            <i v-if="themeValue == 'theme-blue'" class="el-icon-circle-check-outline">&nbsp;</i>蓝色</button>
                        <button type="button" class="theme-btn theme-green" @click="getThemeValue('theme-green')">
                            <i v-if="themeValue == 'theme-green'" class="el-icon-circle-check-outline">&nbsp;</i>绿色</button>
                        <button type="button" class="theme-btn theme-dark" @click="getThemeValue('theme-dark')">
                            <i v-if="themeValue == 'theme-dark'" class="el-icon-circle-check-outline">&nbsp;</i>黑色</button>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelCheckedTheme">取 消</el-button>
                <el-button type="primary" @click="handleChangeTheme">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import {ToolsUtils} from "../../utils/ToolsUtils";
    var theme = localStorage.getItem("themeValue")
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                message: 2,
                userInfo: {},
                dialogVisible: false,
                themeValue: theme ? theme : '',
            }
        },
        watch: {
            userInfo: function () {
                bus.$on('userInfo', msg => {
                    this.userInfo = msg;
                })
            }
        },
        computed: {
            // 侧边栏折叠
            isCollapse(){
                if(document.body.clientWidth < 1100){
                    this.collapseChage();
                }
            },
        },
        mounted: function () {
            this.collapse = this.isCollapse

            var _this = this
            window.onresize = function(){
                var clientWidth = document.body.clientWidth
                console.log(clientWidth)
                if(clientWidth < 1100 && !_this.collapse){
                    setTimeout(function () {
                        _this.collapse = true
                        bus.$emit('collapse', _this.collapse);
                    }, 200)
                }else if(clientWidth >= 1100){
                    setTimeout(function () {
                        _this.collapse = false
                        bus.$emit('collapse', _this.collapse);
                    }, 200)
                }
            }
            var userInfo = StorageUtils.getItem(StorageUtils.storageKey.user_loginInfo)
            this.userInfo = userInfo ? userInfo : {}
        },
        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command === 'my') { // 个人信息
                    this.$router.push({path: '/my'})
                }else if(command === 'loginout'){ // 退出
                    StorageUtils.setItem(StorageUtils.storageKey.user_loginInfo, {isLogin: false})
                    this.$router.push('/login');
                }else if(command === 'changeTheme'){
                    this.dialogVisible = true
                }
            },
            getThemeValue: function (value) {
                this.themeValue = value
            },
            //换肤
            handleChangeTheme(){
                ToolsUtils.changeTheme(this.themeValue);
                this.dialogVisible = false;
            },
            cancelCheckedTheme(){
                var _this = this
                this.dialogVisible = false;
                setTimeout(function () {
                    _this.themeValue = theme
                }, 200)
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            toPage: function (url) {
                this.$router.push(url)
            }
        }
    }


</script>
<style rel="stylesheet/css" scoped>
    .collapse-btn{
        float: left;
        padding: 0 15px 0 18.5px;
        cursor: pointer;
        line-height: 60px;
    }
    .header .logo{
        float: left;
        width:400px;
        line-height: 60px;
    }
    .header .cur-gzh{
        float: left;
        text-align: left;
        line-height: 60px;
        font-size: 14px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 60px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .theme-form{
        margin: 0;
        width: 500px;
    }
    .theme-btn{
        padding: 6px 0px;
        width: 70px;
        text-align: center;
        border: 0;
        border-radius: 3px;
        margin-right: 20px;
    }
</style>
