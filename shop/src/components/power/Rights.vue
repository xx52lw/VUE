<template>
    <div>
      <!--   面包屑导航   -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--   卡片   -->
      <el-card>
        <el-table :data="rightsList" :border="true" :stripe="true" :header-cell-style="headerCellStyle" :row-key="getRowID">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
          <el-table-column label="路径" prop="path" align="center"></el-table-column>
          <el-table-column label="权限等级" prop="level" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.level == 0">一级</el-tag>
              <el-tag type="info" v-else-if="scope.row.level == 1">二级</el-tag>
              <el-tag type="warning" v-else-if="scope.row.level == 2">三级</el-tag>
              <el-tag type="danger" v-else-if="scope.row.level == 3">四级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  created () {
    this.getRightsList()
  },
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      console.log(res.data)
      this.rightsList = res.data
    },
    headerCellStyle (row) {
      if (row.rowIndex === 0) {
        return 'color:#ff0000'
      }
    },
    getRowID (row) {
      return row.id
    }
  }
}
</script>

<style scoped>

</style>
