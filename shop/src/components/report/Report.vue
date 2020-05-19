<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1. 导入 echarts
import echarts from 'echarts'

export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源',
          // show: false 是否显示
          textStyle: {
            color: '#ff0000'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          align: 'right', // 文字图标方向
          // orient: 'vertical',
          data: [
            {
              name: '华东',
              icon: 'cirlce',
              textStyle: {
                color: '#00ff00'
              }
            }, '华南', '华北', '西部', '其他']
        },
        yAxis: [
          {
            type: 'value',
            position: 'top'
          }
        ],
        xAxis: [
          {
            boundaryGap: false, // x 开始留白
            data: ['2017-12-27', '2017-12-28', '2017-12-29', '2017-12-30', '2017-12-31', '2018-1-1']
          }
        ],
        series: [
          {
            name: '华东',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {}
            },
            data: [2999, 3111, 4100, 3565, 3528, 6000]
          },
          {
            name: '华南',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {}
            },
            data: [5090, 2500, 3400, 6000, 6400, 7800]
          },
          {
            name: '华北',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {}
            },
            data: [6888, 4000, 8010, 12321, 13928, 12984
            ]
          },
          {
            name: '西部',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {}
            },
            data: [9991, 4130, 7777, 12903, 13098, 14028]
          },
          {
            name: '其他',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {}
            },
            data: [15212, 5800, 10241, 14821, 15982, 14091]
          }
        ]
      }
    }
  },
  created () {
  },
  // 此时，页面上的元素，已经被渲染完毕了！
  async mounted () {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 5. 展示数据
    myChart.setOption(this.options)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
