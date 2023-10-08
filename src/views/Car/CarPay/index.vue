<template>
  <div class="container">
    <el-row :gutter="20" type="flex" align="middle" class="header">
      <el-col :span="6"> <span>车牌号码:</span>
        <el-input v-model.trim="Query.carNumber" size="mini" placeholder="请输入车牌号码" /></el-col>
      <el-col :span="6"><span>车牌号码:</span>
        <el-select v-model="Query.paymentStatus" placeholder="请选择" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="6"><el-button type="primary" size="mini" @click="search">查询</el-button></el-col>
    </el-row>
    <div class="main">
      <el-table
        :data="tableData"
        size="mini"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
        >
          <template #default="row">
            {{ row.$index+(Query.page-1)*Query.pageSize+1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="carNumber"
          label="车牌号码"
        />
        <el-table-column
          prop="chargeType"
          label="收费类型"
        >
          <template #default="{row}">
            {{ row.chargeType ==='card'? '月卡' : '临时停车' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="parkingTime"
          label="停车总时长"
        />
        <el-table-column
          prop="actualCharge"
          label="缴费费用(元)"
        />
        <el-table-column
          prop="paymentStatus"
          label="缴纳状态"
        >
          <template #default="{row}">
            {{ row.paymentStatus ==='0'? '未缴纳' : '已缴纳' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentMethod"
          label="缴纳方式"
        >
          <template #default="{row}">
            {{ paymentMethod[row.paymentMethod]||'---' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentTime"
          label="缴纳时间"
        />
      </el-table>
      <el-pagination
        :current-page="Query.page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="Query.pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import { getPaymentList } from '@/api/card'
export default {
  data() {
    return {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '待缴纳'
      },
      {
        value: '1',
        label: '已缴纳  '
      }],
      tableData: [], // 表格数据
      // 查询数据
      Query: {
        page: 1,
        pageSize: 5,
        carNumber: '',
        paymentStatus: ''
      },
      total: 1,
      paymentMethod: {
        Alipay: '支付宝',
        WeChat: '微信',
        Cash: '线下'
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await getPaymentList(this.Query)
      this.tableData = res.data.rows
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange(e) {
      this.Query.pageSize = e
      this.getData()
    },
    handleCurrentChange(e) {
      this.Query.page = e
      this.getData()
    },
    async search() {
      await this.getData()
      this.Query.carNumber = ''
      this.Query.paymentStatus = ''
    }

  }
}

</script>

<style lang="scss" scoped>
.container{
  padding: 20px;
}
.header{
  border-bottom: 1px #f4f6f8 solid;
}
::v-deep .el-table__row{
  height: 50px;
}
</style>
