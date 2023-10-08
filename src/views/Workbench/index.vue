<template>
  <div class="databoard-container">
    <div class="left">
      <div class="wrapper">
        <p class="title">园区数据</p>
        <el-row>
          <el-col
            :span="6"
          ><div>
            <p>年度累计收费（元）</p>
            <span>{{ list.annualIncome }}</span>
          </div></el-col>
          <el-col :span="6">
            <div>
              <p>入住企业总数（个）</p>
              <span>{{ list.enterpriseTotal }}</span>
            </div></el-col>
          <el-col :span="6">
            <div>
              <p>月卡车辆总数（辆）</p>
              <span>{{ list.monthCardTotal }}</span>
            </div>
          </el-col>
          <el-col
            :span="6"
          ><div>
            <p>一体杆总数（台）</p>
            <span>{{ list.chargePoleTotal }}</span>
          </div></el-col>
        </el-row>
      </div>
      <div ref="table" class="table" />
      <div class="contract">
        <h4>临期合同提醒</h4>
        <el-table

          :data="tableData"
          style="width: 100%"
        >
          <template slot="empty">
            <div class="custom-empty-text">
              <svg-icon style="font-size: 150px;" icon-class="empty" />
            </div>
          </template>

          <el-table-column
            prop="date"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="name"
            label="企业名称"
            width="200"
          />
          <el-table-column
            prop="address"
            label="租凭楼宇"
          />
          <el-table-column
            prop="address"
            label="租凭时间"
          />
          <el-table-column
            prop="address"
            label="操作"
          />
        </el-table>
        <el-pagination
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total,prev, pager, next,sizes"
          :total="4"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

      </div>
    </div>
    <div class="right">
      <div class="entrance">
        <p class="title">快捷入口</p>
        <el-row>
          <el-col :span="6">
            <div>
              <img src="@/assets/add-enterprise.png" alt="">
              <span>添加企业</span>
            </div></el-col>
          <el-col
            :span="6"
          ><div>
            <img src="@/assets/employee-manage.png" alt="">
            <span>员工管理</span>
          </div></el-col>
          <el-col
            :span="6"
          ><div>
            <img src="@/assets/add-bill.png" alt="">
            <span>添加账单</span>
          </div></el-col>
          <el-col
            :span="6"
          ><div>
            <img src="@/assets/data-screen.png" alt="">
            <span>数据大屏</span>
          </div></el-col>
        </el-row>
      </div>
      <div class="alarm-card">

        <p>设备告警派单</p>
        <div class="box">
          <svg-icon style="font-size: 150px;" icon-class="empty" />
          <el-button type="primary">更多</el-button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>

import * as echarts from 'echarts'
import { getInfo, getRentInfo } from '@/api/Workbench'
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        total: 1,
        pagesize: '',
        current: ''
      },
      loading: true,
      list: {}

    }
  },
  async created() {
    const res = await getInfo()
    // console.log('工作台', res)
    this.list = res.data
    const res2 = await getRentInfo()
    // console.log(res2)
    this.tableData = res2.data.rows
    const myChart = echarts.init(this.$refs.table)
    myChart.setOption({
      'title': {
        'text': '年度收入统计'
      },
      color: [
        '#3656ff',
        '#cde4ff'

      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          var tooltipContent = ''
          let sum = 0
          // params 是一个数组，包含了所有触发 Tooltip 的数据项
          for (var i = 0; i < params.length; i++) {
            var seriesName = params[i].seriesName // 系列名称
            var dataValue = params[i].value // 数据值
            tooltipContent += seriesName + ': ' + dataValue + '<br>'
            sum += params[i].value
          }
          // 添加额外的信息或样式
          tooltipContent += `总数: ${sum}`

          return tooltipContent
        }
      },
      legend: {
        orient: 'vertical', // 图例的排列方向，设置为水平
        x: '90%', // 水平方向位于图表的中央
        y: '10%' // 垂直方向位于图表的底部
        // 可以根据需要进一步调整图例的样式和配置
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.list.annualIncomeArray.xmonth
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '物业费',
          type: 'bar',
          stack: 'Ad',
          barWidth: 15,

          emphasis: {

            focus: 'series'
          },
          data: this.list.annualIncomeArray.ybuilding
        },
        {
          name: '行车费用',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          data: this.list.annualIncomeArray.yparking
        }

      ]
    })
  },
  async mounted() {

  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }

}

</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}

.databoard-container {

  height: 900px;
  display: flex;
  background-color: #f4f6f8;
  .left {
    width: 750px;
    margin-right: 20px;
    .wrapper {
      background-color: #fff;
      padding: 20px;
      margin-bottom: 20px;
      height: 150px;
    }
  }
  .wrapper {
    .title {
      font-size: 14px;
      color: #303035;
      font-weight: 500;
      margin-bottom: 20px;
    }

    p {
      color: #909399;
      font-size: 14px;
      margin-bottom: 12px;
    }
    span {
      color: #303035;
      font-weight: 500;
      font-size: 24px;
    }

  }
  .table{
    height:350px;
    background-color: #fff;
    padding: 20px;

  }
  .contract{
         background-color: #fff;
         height: 300px;
         margin-top: 20px;
         padding: 20px;
         h4{
          font-weight: 400;
          font-size: 14px;
          margin-bottom: 20px;
         }
         }

    }

.right {
  flex: 1;
  .entrance {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    height: 150px;
    .el-col{
      padding: 10px;

    }
    img {
      width: 44px;
      height: 44px;
      margin-bottom: 9px;
    }
    span {
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
  }
  .alarm-card{
    background-color: #fff;
    height: 300px;
    padding: 20px;
     .box{
    display: flex;
    flex-direction:column;
    align-items: center;
    }
    .el-button{
    width: 250px;
    margin-top: 20px;
    border-radius: 22px;
    height: 36px;
    }
    p{
      font-size: 14px;
    color: #303035;

    }

    }

  }

::v-deep .el-table{
  th{
    background-color: #f4f6f8;
  }
    .cell{
    color: #000;
    font-size: 14px;
    font-weight: 500;
    }
}
.el-pagination{
  float: right;
}
</style>
