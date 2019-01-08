<template>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#fff"
                 text-color="#333">
            <!--<sidebar-item v-for="(item, itemIndex) in menuList" :key="itemIndex" :item="item"/>-->
            <sidebar-item v-for="(item, itemIndex) in items" :key="itemIndex" :item="item"/>
        </el-menu>
    </el-scrollbar>
</template>

<script>
    import bus from '../../common/bus';
    import {findMenu, findMenuAll} from '../../../api/menu/menu-apis'
    import {ToolsUtils} from '../../../utils/ToolsUtils'
    import SidebarItem from './SidebarItem'

    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        menuIcon: 'el-icon-setting',
                        menuUrl: 'dashboard',
                        name: '系统首页'
                    },
                    {
                        menuIcon: 'el-icon-tickets',
                        menuUrl: 'table',
                        name: '基础表格'
                    },
                    {
                        menuIcon: 'el-icon-message',
                        menuUrl: 'tabs',
                        name: 'tab选项卡'
                    },
                    {
                        menuIcon: 'el-icon-date',
                        menuUrl: '3',
                        name: '表单相关',
                        children: [
                            {
                                menuUrl: 'form',
                                name: '基本表单'
                            },
                            {
                                menuUrl: 'editor',
                                name: '富文本编辑器'
                            },
                            {
                                menuUrl: 'markdown',
                                name: 'markdown编辑器'
                            },
                            {
                                menuUrl: 'upload',
                                name: '文件上传'
                            }
                        ]
                    },
                    {
                        menuIcon: 'el-icon-star-on',
                        menuUrl: 'charts',
                        name: 'schart图表'
                    },
                    {
                        menuIcon: 'el-icon-rank',
                        menuUrl: 'drag',
                        name: '拖拽列表'
                    },
                    {
                        menuIcon: 'el-icon-warning',
                        menuUrl: 'permission',
                        name: '权限测试'
                    },
                    {
                        menuIcon: 'el-icon-error',
                        menuUrl: '404',
                        name: '404页面'
                    }
                ],
                menuList: []
            }
        },
        components: {SidebarItem},
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            },
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        mounted: function () {
//            var menuList = StorageUtils.getItem(StorageUtils.storageKey.user_menuList)
//            this.menuList = menuList ? menuList : []
//            this.findMenu()
        },
        methods: {
            findMenu: function () { // 加载菜单
                var _this = this
                var userInfo = StorageUtils.getItem(StorageUtils.storageKey.user_loginInfo)
                userInfo = userInfo ? userInfo : {}
                if (userInfo.isLogin) {
                    var param = {
                        data: {
                            roleList: userInfo.roleInfo,
                            orgId: userInfo.userInfo.orgId,
                            adminState: userInfo.userInfo.adminState ? userInfo.userInfo.adminState : 0,
                            wx_pc: 1
                        }
                    }
                    if (userInfo.userInfo.adminState && userInfo.userInfo.adminState === 1) { // 超级管理员查询全部菜单
                        findMenuAll(param).then((res) => {
                            if (res.status && res.dataJson && res.dataJson.menus) {
                                res.dataJson.menus = res.dataJson.menus.filter(function (row) {
                                    if (row.wx_pc === param.data.wx_pc) {
                                        return true
                                    } else {
                                        return false
                                    }
                                })
                                let data = res.dataJson.menus;
                                // 属性配置信息
                                let attributes = {
                                    id: 'id',
                                    parentId: 'parentId',
                                };
                                // JS数组转tree树形结构
                                let treeData = ToolsUtils.toTreeData(data, attributes);
//                            console.log("菜单列表：" + JSON.stringify(treeData))
                                _this.menuList = treeData
                                StorageUtils.setItem(StorageUtils.storageKey.user_menuList, treeData)
                            } else {
                                if (res) {
                                    _this.$alert('菜单查询：' + JSON.stringify(res))
                                }
                            }
                        }).catch((res) => {
                            if (res) {
                                _this.$alert('菜单查询失败：' + JSON.stringify(res))
                            }
                        })
                    } else {
                        findMenu(param).then((res) => {
                            if (res.status && res.dataJson && res.dataJson.menus) {
                                res.dataJson.menus = res.dataJson.menus.filter(function (row) {
                                    if (row.wx_pc === param.data.wx_pc) {
                                        return true
                                    } else {
                                        return false
                                    }
                                })
                                let data = res.dataJson.menus;
                                // 属性配置信息
                                let attributes = {
                                    id: 'id',
                                    parentId: 'parentId',
                                };
                                // JS数组转tree树形结构
                                let treeData = ToolsUtils.toTreeData(data, attributes);
//                            console.log("菜单列表：" + JSON.stringify(treeData))
                                _this.menuList = treeData
                                StorageUtils.setItem(StorageUtils.storageKey.user_menuList, treeData)
                            } else {
                                _this.$alert('菜单查询失败！')
                            }
                        }).catch((res) => {
                            _this.$alert('菜单查询失败！')
                        })
                    }

                }
            }
        }
    }
</script>
