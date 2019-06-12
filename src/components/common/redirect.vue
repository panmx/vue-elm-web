<script>
// 重定向空白页面，用于刷新当前组件
export default {
  beforeCreate() {
    let path = this.$route.fullPath;
    path = path.replace('/redirect/', '/');
    this.$router.replace(path)
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
