<template>
<div>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <!--  警告区域  -->
    <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" ></el-alert>
    <!--  选择商品区域  -->
    <el-row :class="['cate_class']">
      <span>选择商品分类：</span>
      <el-cascader :props="{expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: 'true',}"
                   :options="goodCateList" v-model="selectedKeys" @change="selectGoodCateChanged" clearable :style="{width: 250 + 'px'}">
      </el-cascader>
    </el-row>
    <!--  页签区域  -->
    <el-tabs v-model="tabName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamBtnClick">添加参数</el-button>
        <el-table :data="manyTableData" border stripe>
          <!--     展开行     -->
          <el-table-column type="expand">
            <template slot-scope="scop">
              <el-tag :class="['tag_attr_vals']" v-for="(item, index) in scop.row.attr_vals" :key="index">{{item}}</el-tag>
              <el-input
                class="tag_add"
                v-if="scop.row.inputVisible"
                v-model="scop.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="tagHandleInputConfirm(scop.row)"
                @blur="tagHandleInputConfirm(scop.row)"
              >
              </el-input>
              <el-button v-else class="tag_add" size="small" @click="tagShowInput(scop.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamBtnClick">添加参数</el-button>
        <el-table :data="onlyTableData" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scop">
              <el-tag :class="['tag_attr_vals']" v-for="(item, index) in scop.row.attr_vals" :key="index">{{item}}</el-tag>
              <el-input
                class="tag_add"
                v-if="scop.row.inputVisible"
                v-model="scop.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="tagHandleInputConfirm(scop.row)"
                @blur="tagHandleInputConfirm(scop.row)"
              >
              </el-input>
              <el-button v-else class="tag_add" size="small" @click="tagShowInput(scop.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <!-- 添加参数的对话框 -->
  <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
    <!-- 添加参数的对话框 -->
    <el-form :model="addParamForm" :rules="addParamRules" ref="addParamFormRef" label-width="100px">
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="addParamForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
  </el-dialog>
  <!-- 修改参数的对话框 -->
  <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
    <!-- 添加参数的对话框 -->
    <el-form :model="editParamForm" :rules="editParamRules" ref="editParamFormRef" label-width="100px">
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="editParamForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 级联选择
      goodCateList: [],
      // 选的id[1,2]
      selectedKeys: [],
      // 选择页
      tabName: 'many',
      manyTableData: [],
      onlyTableData: [],
      cateID: null,
      titleText: '',
      addDialogVisible: false,
      addParamForm: {
        attr_name: ''
      },
      addParamRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', triangle: 'blur' }
        ]
      },
      editDialogVisible: false,
      editParamForm: {
        attr_name: ''
      },
      editParamRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', triangle: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGoodsCateList()
  },
  methods: {
    async getGoodsCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.goodCateList = res.data
      console.log(this.goodCateList)
    },
    selectGoodCateChanged () {
      this.getParamsData()
    },
    handleTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      // 证明选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return
      }
      this.cateID = this.selectedKeys[2]
      // 证明选中的是三级分类
      console.log(this.selectedKeys)
      // 根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        {
          params: { sel: this.tabName }
        }
      )
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制添加标签的显示
        item.inputVisible = false
        // 添加标签的内容
        item.inputValue = ''
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      if (this.tabName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    showEditDialog (row) {
      if (this.tabName === 'many') {
        this.titleText = '动态参数'
      } else {
        this.titleText = '静态属性'
      }
      console.info(row)
      this.editParamForm = row
      this.editDialogVisible = true
    },
    removeParams (id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除的业务逻辑
        const { data: res } = await this.$http.delete(
          `categories/${this.cateID}/attributes/${id}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败！')
        }
        this.$message.success('删除成功!')
        this.getParamsData()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    addParamBtnClick () {
      if (this.tabName === 'many') {
        this.titleText = '动态参数'
      } else {
        this.titleText = '静态属性'
      }
      this.addDialogVisible = true
    },
    addDialogClosed () {
      this.addDialogVisible = false
      this.$refs.addParamFormRef.resetFields()
    },
    addParams () {
      this.$refs.addParamFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateID}/attributes`,
          {
            attr_name: this.addParamForm.attr_name,
            attr_sel: this.tabName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    editDialogClosed () {
      this.editDialogVisible = false
      this.$refs.editParamFormRef.resetFields()
    },
    editParams () {
      this.$refs.editParamFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateID}/attributes/${this.editParamForm.attr_id}`,
          {
            attr_name: this.editParamForm.attr_name,
            attr_sel: this.tabName
          }
        )
        console.info(res)
        if (res.meta.status !== 200) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    // 添加标签 失去焦点或者回车键触发
    tagHandleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      console.info(res)
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },
    tagShowInput (row) {
      row.inputVisible = true
      // 让文本自动获得焦点
      // $nextTick方法左右，就是当页面上的元素被重新渲染之后，才会被指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cate_class {
  margin: 10px 0px;
}
.el-cascader {
  width: 300px;
}
.tag_attr_vals {
  margin: 10px;
}
.tag_add {
  width: 120px;
  margin: 10px;
}
</style>
