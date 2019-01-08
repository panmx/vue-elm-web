export var StorageUtils = {
    storageKey: { // 缓存key
        user_loginInfo: 'user_loginInfo', // 登录用户
        user_encodeUser: 'user_encodeUser', // 登录用户
        user_isShowAllMenu: 'user_isShowAllMenu',
        topNavActiveIndex: 'topNavActiveIndex',
        user_menuList: 'user_menuList', // pc菜单列表
        user_miniMenuList: 'user_miniMenuList', // 小程序菜单列表
        menu_menuDetail: 'menu_menuDetail', // 菜单详情,编辑专用
        role_roleDetail: 'role_roleDetail', // 角色详情
        userdoc_userDetail: 'userdoc_userDetail', // Vue-Element-用户详情
    },
    getItem: function (key) {
        var str = localStorage.getItem(key)
        if (str && str.length > 2 && ((str.substr(0, 1) == '[' && str.substr(str.length - 1, 1) == ']') || (str.substr(0, 1) == '{' && str.substr(str.length - 1, 1) == '}'))) {
            return JSON.parse(str)
        } else {
            return str
        }
    },
    setItem: function (key, data) {
        if (data && "object" == typeof(data)) {
            localStorage.setItem(key, JSON.stringify(data))
        } else {
            localStorage.setItem(key, data)
        }
    }
}
