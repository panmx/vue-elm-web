import Vue from 'vue';
import App from './App';
import router from './router';
// import axios from 'axios';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/theme-red/index.css';    // 默认主题, 默认红色主题
import "babel-polyfill"; // 兼容IE
import {StorageUtils} from './utils/StorageUtils' // 缓存工具类
import moment from 'moment'
import NProgress from 'nprogress' // progress bar 页面顶部进度条
import 'nprogress/nprogress.css'// progress bar style
import {ToolsUtils} from './utils/ToolsUtils'

NProgress.configure({ showSpinner: false })// NProgress Configuration
window.StorageUtils = StorageUtils
window.moment = moment
Vue.use(ElementUI, { size: 'small' });
// Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    // 判断用户是否登录，没有登录只能访问首页，登录页面，注册页面
    let user = StorageUtils.getItem(StorageUtils.storageKey.user_loginInfo)
    const role = user && user.isLogin ? user.isLogin : false;

    if(to.path === '/login'){ // 跳转登录页面前清除缓存
        localStorage.removeItem(StorageUtils.storageKey.user_loginInfo)
        localStorage.removeItem(StorageUtils.storageKey.user_menuList)
    }

    // 判断用户是否拥有菜单权限
    let hasMenuPermission = false // 默认没有菜单权限
    if (user && user.userInfo && user.userInfo.adminState && user.userInfo.adminState === 1) { // 超级管理员拥有全部菜单的增删改查权限
        hasMenuPermission = true
    } else {
        // 判断是否有增删改查权限
        let permissionObj = ToolsUtils.checkPermission(to.meta && to.meta.listPage ? to.meta.listPage : to.path)
        if ((to.path.indexOf('-add') >= 0 || to.path.indexOf('-form') >= 0)) { // 新增页面必须要有添加权限才能进入
            if (permissionObj && permissionObj.isAddPermission) {
                hasMenuPermission = true
            }
        } else if (to.path.indexOf('mdm-user-bd') >= 0 || to.path.indexOf('mdm-user-msgType') >= 0) { // 部分页面需要其对应的列表页面拥有修改权限才能进
            hasMenuPermission = permissionObj.isEditPermission
        } else if (to.path.indexOf('-edit') >= 0 || (permissionObj && permissionObj.isSearchPermission)) { // 修改页面随意进入（会在修改页面判断是否能修改）；查询页面要有查询权限才能进入
            hasMenuPermission = true
        }
    }

    if(!role && to.path !== '/login' && to.path !== '/register'){
        next('/login');
    }else if(to.meta.permission){ // 路由配置项里如果设置了permission: true, 说明该菜单需要权限方可进入
        hasMenuPermission ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
