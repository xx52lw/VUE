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
          <el-table-column type="expand"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParamBtnClick">添加参数</el-button>
        <el-table :data="onlyTableData" border stripe>
          <el-table-column type="expand"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
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
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      if (this.tabName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    showEditDialog (id) {},
    removeParams (id) {},
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
      this.$refs.addParamFormRef.
    },
    addParams () {
      this.$refs.addParamFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
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
</style>
