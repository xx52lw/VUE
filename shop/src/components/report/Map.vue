<template>
  <div class="map"></div>
</template>

<script>
import echarts from 'echarts';
import cqJson from '@/assets/chongqing.json';
export default {
  name: '',
  data() {
    return {
      echartObj: null,
      radioList: {
        A: '年度总项目数据查询',
        B: '军转干部在岗培训项目',
        C: '专技人员公需科目项目',
        D: '专技人员新取得中级职称岗前培训项目',
        E: '事业单位新进人员岗前培训项目'
      },
      radioActive: 'B',
      option: {
        tooltip: {
          padding: 0,
          backgroundColor: 'transparent',
          formatter: params => {
            // params.data
            return `<table class="map__tooltip o_font20">
                                    <thead>
                                       <tr>
                                           <th>总购买人数</th>
                                           <th>本年度总购买人数</th>
                                           <th>本月度总购买人数</th>
                                           <th>总完成人数</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>${params.data.obj.a}</th>
                                            <th>${params.data.obj.b}</th>
                                            <th>${params.data.obj.c}</th>
                                            <th>${params.data.obj.d}</th>
                                         </tr>
                                    </tbody>
                                </table>`;
          }
        },
        legend: {
          orient: 'vertical',
          top: '9%',
          left: '5%',
          icon: 'circle',
          data: [],
          selectedMode: 'single',
          selected: {},
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 30,
          inactiveColor: '#b6d7ff',
          textStyle: {
            color: '#ec808d',
            fontSize: 14,
            fontWeight: 300,
            padding: [0, 0, 0, 15]
          }
        },
        visualMap: {
          min: 0,
          max: 500,
          show: true,
          // splitNumber: 5,
          // inRange: {
          //   color: ['#FACD91', '#74DFB2', '#81D3F8', '#768FDE', '#e9969f'].reverse()
          // },
          pieces: [
            {
              value: 0,
              color: '#ffffff'
            },
            {
              gt: 1,
              lt: 100,
              label: '1 - 100',
              color: 'green'
            },
            {
              gt: 100,
              lt: 200,
              label: '100 - 200',
              color: '#ffd768'
            },
            {
              gt: 200,
              lt: 300,
              label: '200 - 300',
              color: '#ff8c71'
            },
            {
              gt: 300,
              lt: 400,
              label: '300 - 400',
              color: '#ff5428'
            },
            {
              gt: 400,
              label: '> 4000',
              color: '7f1100'
            }
          ],
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: '重庆',
          label: {
            normal: {
              show: true,
              color: '#000'
            },
            emphasis: {
              show: true,
              color: '#fff'
            }
          },
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#8db200',
              borderColor: '#6367ad',
              borderWidth: 1
            },
            emphasis: {
              areaColor: '#feb6aa' // hover效果
            }
          },
          left: '5%',
          right: '5%',
          top: '5%',
          bottom: '5%'
        },
        series: [{
          name: '年度总项目数据查询',
          type: 'map',
          geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
          data: []
        }]
      }
    };
  },
  mounted() {
    this.echartObj = echarts.init(document.querySelector('.map'));
    echarts.registerMap('重庆', cqJson);
    this.echartObj.setOption(this.getEchartOption());
  },
  methods: {
    getEchartOption() {
      const seriesArray = [];
      console.info('getEchartOption');
      Object.values(this.radioList).map((item) => {
        const obj = {
          name: item,
          type: 'map',
          geoIndex: 0, // 不可缺少，否则无tooltip
          data: this.getSeriesData(item)
        };
        if (this.radioList[this.radioActive] === item) {
          seriesArray.unshift(obj);
        } else {
          seriesArray.push(obj);
        }
      });
      console.info(seriesArray);
      this.option.series = seriesArray;
      return this.option;
    },
    getSeriesData(item) {
      return this.radioList[this.radioActive] === item ? cqJson.features.map(item => {
        return {
          name: item.properties.name,
          value: Math.ceil(Math.random() * 500),
          obj: {
            a: Math.ceil(Math.random() * 500),
            b: Math.ceil(Math.random() * 500),
            c: Math.ceil(Math.random() * 500),
            d: Math.ceil(Math.random() * 500)
          }
        };
      }) : [];
    }
  }
};
</script>

<style lang="less" scoped>
  .map {
    height: 100%;
  }
</style>
