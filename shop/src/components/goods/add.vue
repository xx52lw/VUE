<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card>
      <!--   提示区域   -->
      <el-alert title="添加商品" type="info" center show-icon :closable="false"></el-alert>
      <!--   步骤条   -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数">
          <template></template>
        </el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--   表单 嵌套tabs   -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!--   tab侧边栏   -->
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_name">
              <el-cascader :props="{expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children'}"
                           :options="catelist" v-model="addForm.goods_cat" @change="cascaderCateChanged" clearable @visible-change="cascaderVisibleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item, index) in item.attr_vals" :label="item" :key="index" border size="small"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item, index) in item.attr_vals" :label="item" :key="index" border size="small"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <h1>商品图片</h1>
            <el-upload :action="uploadURL" :on-preview="imageHandlePreview" :on-remove="imageHandleRemove" list-type="picture" :headers="headerObj" :on-success="imageHandleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--   富文本编辑器组件         -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览 -->
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
        <img :src="previewPath" alt="" class="previewImg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      catelist: [],
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  methods: {
    beforeTabLeave (activeName, oldActiveName) {
      console.info(oldActiveName)
      console.info(activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
      if (activeName === '1') {
        console.info(this.manyTableData.length === 0)
        if (this.manyTableData.length === 0) {
          this.getManyTableData()
          console.info(this.getManyTableData())
        }
      } else if (activeName === '2') {
        if (this.onlyTableData.length === 0) {
          this.getOnlyTableData()
        }
      }
    },
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.catelist = res.data
    },
    async getManyTableData () {
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        {
          params: { sel: 'many' }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取动态参数列表失败！')
      }
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
      })
      this.manyTableData = res.data
    },
    async getOnlyTableData () {
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        {
          params: { sel: 'only' }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取动态参数列表失败！')
      }
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
      })
      this.onlyTableData = res.data
    },
    cascaderCateChanged () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    cascaderVisibleChange (value) {
      if (value) {
        if (this.catelist.length === 0) {
          this.getCateList()
        }
      }
    },
    imageHandlePreview (file) {
      console.info('点击文件列表中已上传的文件')
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    imageHandleRemove (file) {
      console.info('文件列表移除文件')
    },
    imageHandleSuccess () {
      console.info('文件上传成功时')
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.info(form)
        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateID () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 10px 0px 10px 0px;
}
.el-cascader {
  width: 300px;
}
.el-checkbox {
  margin: 0px 10px 0px 0px !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
