<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs" width="100%"
            :header-cell-style="{ 'color': '#555', 'font-size': '13px'}" size="mini">
    <el-table-column v-if="columns.length===0" width="150px">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right"/>
          <i v-else class="el-icon-caret-bottom"/>
        </span>
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width" :min-width="column.minWidth">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right"/>
          <i v-else class="el-icon-caret-bottom"/>
        </span>
        <span :class='column.class ? column.class : ""' v-if="column.pageUrl" @click="toPageNext(scope.row, column)">
            {{ scope.row[column.value] }}
        </span>
        <span :class='column.class ? column.class : ""' v-else>
            {{ scope.row[column.value] }}
        </span>
      </template>
    </el-table-column>
    <slot/>
  </el-table>
</template>

<script>
import treeToArray from './eval'
import CircularJSON from 'circular-json'
export default {
  name: 'TreeTable',
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
      toPageNext: function (item, column) {
          if(!item) return
          // 获取父节点名称
          var parentName = ''
          this.formatData.filter(function (row) {
              if(row[column.primaryKey] === item.parentId){
                  parentName = row[column.value]
              }
          })
          item.parentName = parentName
          // item对象循环引用，JSON.stringify()无法解析，需要用到CircularJSON.stringify()将对象转换成string
          localStorage.setItem(column.storageKey, CircularJSON.stringify(item))
          this.$router.push(column.pageUrl)
      },
  }
}
</script>
<style rel="stylesheet/css">
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #c0c4cc;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
    font-size: 14px;
  }
</style>
