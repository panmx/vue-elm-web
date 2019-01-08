<template>
    <div class="el-menu-demo">
       <el-menu :default-active="activeIndex1"
               mode="horizontal"
               @select="handleSelect" class="background-top-menu nav-row">
           <div class="logo-item1 pull-left">
               <img src="../../assets/logo.png" class="logo-img"/>&nbsp;&nbsp;Vue-Element
           </div>
           <!--<span class="pull-right login-item flex-row">-->
            <!--<el-menu-item index="5" @click="toPage('/login')">登录</el-menu-item>-->
            <!--<el-menu-item index="6" @click="toPage('/register')">注册</el-menu-item>-->
           <!--</span>-->
       </el-menu>
   </div>
</template>

<script>
    import {StorageUtils} from "../../utils/StorageUtils";

    export default {
        data() {
            return {
                activeIndex1: '1',
                activeIndex2: '1',
                urlArr : [
                    {label:'/index', value: '1'},
                    {label:'/login', value: '5'},
                    {label:'/register', value: '6'},
                ],
                curUrl: '',
                userInfo: {}
            }
        },
        props: ['showmenu', 'titleStartUrl', 'titleEndUrl'],
        mounted: function () {
            this.curUrl = this.$route.path
            var value = ''
            var _this = this
            this.urlArr.filter(function (row) {
                if(_this.$route.path && _this.$route.path ===  row.label) {
                    value = row.value
                }
            })
            this.activeIndex1 = value ? value : StorageUtils.getItem(StorageUtils.storageKey.topNavActiveIndex)
            var userInfo = StorageUtils.getItem(StorageUtils.storageKey.user_loginInfo)
            this.userInfo = userInfo ? userInfo : {}
        },
        methods: {
            toPage: function (url,param) {
                this.$router.push({path: url})
            },
            handleSelect: function(key, keyPath) {
                StorageUtils.setItem(StorageUtils.storageKey.topNavActiveIndex,key)
            }
        }
    }
</script>

<style rel="stylesheet/css" scoped>
    .el-menu-demo{
        position: fixed;
        top: 0;
        z-index: 99;
        height: 60px;
        left: 0;
        width: 100%;
        background-color: rgba(0,0,0,0.001);
    }
    /*菜单激活字体颜色，背景色*/
    .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active {
        color: #4db3ff;
        border-bottom: #4db3ff solid 4px;
        background: transparent;
    }
    .logo-img{
        width: 54px;
        height: 34px;
    }
    .el-menu-item, .el-submenu__title {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        color: #48576a;
        padding: 0 15px;
        cursor: pointer;
        margin-left: 25px;
    }

    .nav-row{
        font-size: 14px;
        color:#48576a;
        line-height: 58px;
        background: rgba(0,0,0,0.001);
    }

    .logo-item1{
        margin: 0 80px 0 120px;
    }
    .logo-item1 img{
        position: relative;
        top: 12px;
    }
    .login-item{
        margin-right: 120px;
        cursor: pointer;
    }
</style>

