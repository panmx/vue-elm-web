<template>
    <div class="my-tags" v-if="showTags">
        <v-scroll-pane class='tags-view-wrapper' ref='scrollPane'>
            <router-link ref='tag'  v-for="(item,index) in tagsList" class="tags-view-item tags-li" :class="{'active': isActive(item.path)}" :key="index" :to="item.path" :title="item.title && item.title.length >9 ? item.title : ''"
                         @contextmenu.prevent.native="openMenu(item,$event)">
                {{item.title}}
                <span @click.prevent.stop="closeTags(index)"><i class="el-icon-close"></i></span>
            </router-link>
        </v-scroll-pane>
        <div class='contextmenu' v-show="visible" :style="{'left':left +'px', 'top': '24px'}">
            <div @click="refreshClick">刷新</div>
            <div @click="closeTagsBySelectedTag()">关闭</div>
            <div @click="closeOtherBySelectedTag">关闭其他</div>
            <div @click="closeAll">关闭所有</div>
        </div>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import bus from './bus';
    import vScrollPane from './ScrollPane.vue';
    export default {
        data() {
            return {
                tagsList: [],
                visible: false,
                left: 0,
                selectedTag: {}
            }
        },
        components:{
            vScrollPane
        },
        methods: {
            isActive(path) {
                return path === this.$route.path;
            },
            // 路由刷新事件
            refreshClick: function () {
                this.tagsList = this.tagsList.filter(item => {
                    if( item.path === this.selectedTag.path){
                        item.isFlesh = true
                    }else{
                        item.isFlesh = false
                    }
                    return true
                })
                bus.$emit('tags', this.tagsList);
                var _this = this
                this.$nextTick(() => {
                    this.$router.replace({
                        path: '/redirect' + this.selectedTag.path
                    })
                })
                setTimeout(function () {
                    _this.tagsList = _this.tagsList.filter(item => {
                        item.isFlesh = false
                        return true
                    })
                    bus.$emit('tags', _this.tagsList);
                }, 500)
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.path && this.$router.push(item.path);
                }else{
                    this.$router.push('/');
                }
            },
            // 关闭单个标签
            closeTagsBySelectedTag() {
                this.tagsList = this.tagsList.filter(item => {
                    return item.path !== this.selectedTag.path;
                })
                if(this.tagsList.length && this.selectedTag.path === this.$route.path){
                    this.$router.push(this.tagsList[this.tagsList.length - 1].path);
                }else if(!this.tagsList.length){
                    this.$router.push('/');
                }
            },
            // 关闭全部标签
            closeAll(){
                this.tagsList = [];
                this.$router.push('/');
            },
            // 关闭其他标签
            closeOtherBySelectedTag(){
                this.$router.push(this.selectedTag.path)
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.selectedTag.path;
                })
                this.tagsList = curItem;
            },
            // 关闭其他标签
            closeOther(){
                this.$router.push(this.$route.path)
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.path;
                })
                this.tagsList = curItem;
            },
            // 设置标签
            setTags(route,oldValue){
                const isExist = this.tagsList.some(item => {
                    return item.path === route.path;
                })
                // 如果上一页标签路径等于想要关闭的标签路径，关闭上一页标签
                if (window.curCloseTagPath && oldValue && oldValue.fullPath) {
                    var pathArr = oldValue.fullPath.split('?')
                    if(pathArr[0] && pathArr[0] === window.curCloseTagPath){
                        this.tagsList = this.tagsList.filter(function (row) {
                            if (row.path === window.curCloseTagPath) {
                                return false
                            } else {
                                return true
                            }
                        })
                    }
                    window.curCloseTagPath = ''
                } else {
                    // 判断标签路径是否存在，如果存在，不新增标签；反之，新增标签
                    !isExist && (route.path.indexOf('/redirect/') < 0)  && this.tagsList.push({
                        title: route.meta.title,
                        keepAlive: route.meta.keepAlive ? route.meta.keepAlive : false,
                        path: route.path,
                        name: route.matched[1].components.default.name
                    })
                }
                bus.$emit('tags', this.tagsList);
            },
            handleTags(command){
                command === 'other' ? this.closeOther() : this.closeAll();
            },
            openMenu(tag, e) {
                this.visible = true
                this.selectedTag = tag
                const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
                this.left = e.clientX - offsetLeft + 15 // 15: margin right
            },
            closeMenu() {
                this.visible = false
            },
            moveToCurrentTag() {
                const tags = this.$refs.tag
                this.$nextTick(() => {
                    for (const tag of tags) {
                        if (tag.to === this.$route.path) {
                            this.$refs.scrollPane.moveToTarget(tag.$el)
                            break
                        }
                    }
                })
            },
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch:{
            $route(newValue, oldValue){
//                debugger
                this.setTags(newValue, oldValue)
                this.moveToCurrentTag()
            },
            visible(value) {
                if (value) {
                    document.body.addEventListener('click', this.closeMenu)
                } else {
                    document.body.removeEventListener('click', this.closeMenu)
                }
            }
        },
        created(){
//            debugger
            this.setTags(this.$route);
        }
    }

</script>

