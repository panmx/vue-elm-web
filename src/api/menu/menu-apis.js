import req from './../request'

// 根据用户ID查询菜单列表
export function findMenu (data) {
    return req.post('/xxx/menus', data)
}

// 查询全部菜单接口
export function findMenuAll (data) {
    return req.post('/xxx/menus/menusInfo', data)
}
