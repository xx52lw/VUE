<template>
  <div>
    <h1>wewe</h1>
    <el-steps :active="values" space="400px" align-center>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  data () {
    return {
      stepsData: [
        {
          title: '启动',
          date: ''
        },
        {
          title: '发布',
          date: ''
        },
        {
          title: '洽谈',
          date: ''
        },
        {
          title: '规划',
          date: ''
        },
        {
          title: '签约',
          date: ''
        },
        {
          title: '落项',
          date: ''
        }
      ],
      values: 3
    }
  }
}
</script>
<style  scoped>
/*is-process 圆圈颜色*/
.el-steps.el-steps--horizontal >>> .el-step.is-horizontal.is-center >>> .el-step__head.is-process {
  color: #ff0000;
  border-color: #ff0000;
}

/*is-wait 圆圈颜色*/
.el-steps.el-steps--horizontal >>> .el-step.is-horizontal.is-center >>> .el-step__head.is-wait {
  color: #ff0000;
  border-color: #ff0000;
}
/*is-finish title 颜色*/
.el-steps.el-steps--horizontal >>> .el-step.is-horizontal.is-center >>> .el-step__title.is-finish {
  color: #ff0000;
  font-weight: 700;
}
/*is-process  title 颜色*/
.el-steps.el-steps--horizontal[data-v-9ebad220] .el-step.is-horizontal.is-center >>> .el-step__title.is-process {
  font-weight: 700;
  color: #ff0000;
}
</style>
