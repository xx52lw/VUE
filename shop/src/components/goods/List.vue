<template>
    <div>
      <!--  面包屑导航  -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: 'home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <pre>{{$route.meta}}</pre>
      <!-- 卡片视图区域 -->
      <el-card>
        <el-row>
          <el-col :span="8">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" class="input-with-select" :clearable="true" @keyup.enter.native="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodslist" border stripe>
          <el-table-column type="index" label="序号" header-align="center" align="center"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name" header-align="center"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price" width="95px" header-align="center" align="center"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="70px" header-align="center" align="center"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="180px" header-align="center" align="center">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormatFilter}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px" header-align="center" align="center">
            <template>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
        </el-pagination>
      </el-card>
    </div>

</template>

<script>
export default {
  data () {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0
    }
  },
  beforeRouteEnter(to, from, next) {
    console.info(from)
    console.info(to)
    if (from.path === "/goods/add") {
      to.meta.needRefresh = false;
    } else {
      to.meta.needRefresh = true;
    }
    next();
  },
  created () {
    console.info('created')

  },
  mounted() {
    console.info('mounted')
  },
  activated() {
    console.info('activated')
    if (!this.$route.meta.needRefresh) { // 不需要刷新
      console.info('不刷新')
    }else{
      this.$route.meta.needRefresh = true;
      console.info('清空筛选内容并且刷新')
      this.queryInfo.query = ''
      this.getGoodsList()
    }

  },
  deactivated() {
    console.info('good --deactivated')
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.$message.success('获取商品列表成功！')
      console.log(res.data)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getGoodsList()
    },
    handleCurrentChange (page) {
      this.queryInfo.pagenum = page
      this.getGoodsList()
    },
    addGoods () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
