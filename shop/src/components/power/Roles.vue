<template>
    <div>
      <!--   面包屑导航   -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
        <el-row style="text-align: right;">
          <el-button type="primary">添加角色</el-button>
        </el-row>
        <el-table :data="roleList" :border="true" :stripe="true">
          <el-table-column  type="expand">
            <template slot-scope="scope">
              <!--     一级渲染         -->
              <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id"
              :class="['bdBottom', index1 === 0 ? 'bdTop' : '','vcenter']"
              >
                <el-col :span="5">
                  <el-tag class="expandedTag" :closable="true" @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right" v-show="item1.children.length > 0"></i>
                </el-col>
                <!--     二级渲染, 三级渲染         -->
                <el-col :span="19">
                  <el-row v-for="(item2, index2) in item1.children" :key="item2.id"
                  :class="[ index2 !== 0 ? 'bdTop' : '','vcenter']"
                  >
                    <el-col :span="6">
                      <el-tag class="expandedTag" type="success" :closable="true" @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right" v-show="item1.children.length > 0"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="item3 in item2.children" :key="item3.id"
                              class="expandedTag" type="warning" :closable="true"
                              @close="removeRightById(scope.row, item3.id)"
                      >
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
          <el-table-column label="操作" width="300px" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--   分配权限对话框   -->
      <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" :before-close="setRightDialogVisibleClose">
        <!--   树形控件     -->
        <el-tree :data="rightsList" show-checkbox :default-expand-all="true"
                 node-key="id" :default-expanded-keys="defSeletedKeys" :default-checked-keys="defSeletedKeys" :props="treeProps"
                 ref = "treeRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRightOK">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  created () {
    this.getRolesList()
  },
  data () {
    return {
      roleList: [],
      // 控制是否显示分配权限对话框
      setRightDialogVisible: false,
      // 所以权限数组
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 当前角色ID
      currentRoleId: '',
      //  默认选择的节点
      defSeletedKeys: []
    }
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = res.data
      console.log(this.roleList.length)
    },
    async showSetRightDialog (role) {
      this.currentRoleId = role.id
      //  获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      // 把获取到的权限数据保存到 data 中
      this.rightsList = res.data
      console.log(this.rightsList)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defSeletedKeys)
      this.setRightDialogVisible = true
    },
    // 根据ID删除对应的权限
    removeRightById (role, rightID) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightID}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        }
        console.log(res.data)
        role.children = res.data
        this.$message.success('删除成功!')
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    // 设置权限关闭
    setRightDialogVisibleClose () {
      this.setRightDialogVisible = false
      this.defSeletedKeys = []
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async setRightOK () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.info(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.currentRoleId}/rights`,
        { rids: idStr }
      )
      console.info(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.expandedTag {
  margin: 5px;
}
.bdTop {
  border-top: 1px solid #eeeeee;
}
.bdBottom {
  border-bottom: 1px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
