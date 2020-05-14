<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary" :class="[ 'btnRight' ]" @click="showAddCateDialog">添加分类</el-button>
      </el-row>
    </el-card>
    <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
                :show-index="true" index-text="序号" :border="true"
    >
      <!--   是否有效   -->
      <template slot="isOK" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
        <i class="el-icon-error" v-else style="color:red;"></i>
      </template>
      <!--   排序   -->
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" type="primary" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </template>
      <!--   操作   -->
      <template slot="opt">
        <el-button type="primasy" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </template>
    </tree-table>
    <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pagesize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" :before-close="addCateDialogClose">
      <!--   添加分类的表单   -->
      <el-form :model="addCateForm" label-width="100px" ref="addCateFormRef" :rules="addCateFormRules">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader :props="{expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: 'false',}"
                       :options="parentCateList" v-model="selectedKeys" @change="parentCateChanged" clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getCateData()
  },
  data () {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 为table指定列
      columns: [
        {
          headerAlign: 'center',
          label: '分类姓名',
          prop: 'cat_name'
        },
        // 使用自定义模板
        {
          headerAlign: 'center',
          label: '是否有效',
          type: 'template',
          template: 'isOK'
        },
        {
          headerAlign: 'center',
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          headerAlign: 'center',
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 级联选择
      parentCateList: [],
      // 选的id[1,2]
      selectedKeys: [],
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCateData () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      console.log(res.data)
      // 把数据列表，赋值给 catelist
      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateData()
    },
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateData()
    },
    addCateDialogClose () {
      console.log('addCateDialogClose')
      this.addCateDialogVisible = false
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async showAddCateDialog () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
      this.addCateDialogVisible = true
    },
    parentCateChanged () {
      console.info(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.addCateDialogClose()
        this.$message.success('添加分类成功！')
        this.getCateData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .btnRight {
    float: right;
  }

  .treeTable {
    margin-top: 15px;
  }
</style>
