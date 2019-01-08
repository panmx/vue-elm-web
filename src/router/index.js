import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/**
 *  1.路由配置项里如果设置了keepAlive: true, 说明该页面需要用Vue的keep-alive的缓存组件将其缓存起来
 *  2.路由配置项里如果设置了permission: true, 说明该页面需要权限方可进入
 *  3.路由配置项里如果设置了listPage: true, 说明该新增/编辑页面会根据listPage所对应的列表页面判断其有无新增/修改权限
 * */
export default new Router({
    routes: [
        {
            path: '/redirect',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            hidden: true,
            children: [
                {
                    path: '/redirect/:path*',
                    component: resolve => require(['../components/common/redirect.vue'], resolve),
                }
            ]
        },
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' , keepAlive: true, permission: false, listPage: ''}
                },
                {
                    path: '/my',
                    component: resolve => require(['../components/page/my/my.vue'], resolve),
                    meta: { title: '个人信息' , keepAlive: true, permission: false, listPage: ''}
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/login.vue'], resolve)
        },
        {
            path: '/register',
            component: resolve => require(['../components/page/register.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
