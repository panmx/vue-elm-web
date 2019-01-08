<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar class="sidebar-container"></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <!--    被keep-alive包裹的路由除了页面第一次渲染时会触发created,mounted等钩子函数，其余时候不会触发vue的created,mounted钩子函数，
                            首次进来 hook 的触发顺序 created-> mounted-> activated，退出时触发 deactivated，
                            二次进来 hook 只触发 activated，退出时触发 deactivated
                      -->
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar/Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from '../common/bus';
    export default {
        name: 'home',
        data(){
            return {
                tagsList: [],
                collapse: false,
            }
        },
        components:{
            vHead, vSidebar, vTags
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++){
                    if(msg[i].name && msg[i].keepAlive && !msg[i].isFlesh){
                        arr.push(msg[i].name)
                    }
                }
                this.tagsList = arr;
            })
        },
        methods: { }
    }
</script>
