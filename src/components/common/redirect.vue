<script>
// 重定向空白页面，用于刷新当前组件
export default {
  beforeCreate() {
    const path = this.$route.params.path
    this.$router.replace('/' + path)
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
