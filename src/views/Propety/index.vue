<template>
  <div>
    <div class="header">
      <span>企业名称：</span>
      <el-input
        v-model="params.enterpriseName"
        value
        placeholder="请输入企业名称"
        size="mini"
      />
      <span>缴费时间：</span>

      <el-date-picker
        v-model="time"
        size="mini"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
      <el-button type="primary" size="mini" @click="search">查询</el-button>
    </div>
    <div class="operating">
      <el-button type="primary" size="mini" @click="add">添加账单</el-button>
    </div>
    <div class="table">
      <el-table :data="propertyList" style="width: 100%">
        <el-table-column label="序号" width="50">
          <template #default="row">
            {{ row.$index + (params.page - 1) * params.pageSize + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="billNumber" label="账单编号	" width="180" />
        <el-table-column prop="enterpriseName" label="企业名称" width="180" />
        <el-table-column prop="buildingName" label="租赁楼宇" />
        <el-table-column prop="propertyFeePrice" label="物业费(元/m²)" />
        <el-table-column
          prop="paymentAmount"
          label="账单金额(元)"
          width="100"
        />
        <el-table-column prop="createTime" label="缴费时间" width="180" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="check(row.id)">查看</el-button>
            <el-button
              type="text"
              size="small"
              @click="del(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      :page-size="params.pageSize"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, prev,pager, next,sizes, jumper"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-dialog
      title="添加账单"
      :visible="dialogVisible"
      width="40%"
      @close="close"
    >
      <el-form
        ref="from"
        :model="addFrom"
        :rules="addFromRules"
        :inline="true"
        class="demo-form-inline"
      >
        <el-form-item label="选择租户" prop="enterpriseId">
          <el-select
            v-model="addFrom.enterpriseId"
            placeholder="请选择选择租户"
            size="mini"
          >
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="租贷楼宇" prop="buildingId">
          <el-select
            v-model="addFrom.buildingId"
            placeholder="请选择租贷楼宇"
            size="mini"
          >
            <el-option
              v-for="item in buildingList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="缴费时间" prop="createTime">
          <el-date-picker
            v-model="addFrom.createTime"
            value-format="yyyy-MM-dd"
            size="mini"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input v-model="addFrom.paymentAmount" disabled placeholder="请输入支付金额" size="mini" />
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select
            v-model="addFrom.paymentMethod"
            placeholder="请选择支付方式"
            size="mini"
          >
            <el-option label="微信" value="1" />
            <el-option label="支付宝" value="2" />
            <el-option label="现金" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加账单"
      :visible="checkVisible"
      width="40%"
      @close="closeCheck"
    >
      <div class="check">
        <p><span>租户名称:</span>{{ checkData.enterpriseName }}</p>
        <p><span>租赁楼宇:</span>{{ checkData.buildingName }}</p>
        <p><span>缴费周期</span>{{ checkData.startTime }}至{{ checkData.endTime }}</p>
        <p><span>物业费(元/m²):</span>{{ checkData.propertyFeePrice }}</p>
        <p><span>账单金额(元):</span>{{ checkData.paymentAmount }}</p>
        <p><span>支付方式:</span>{{ checkData.paymentMethodValue }}</p>
        <p><span>缴费时间:</span>{{ checkData.createTime }}</p>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import {
  getPropertyList,
  getBuildList,
  getEnterpriseList,
  delProperty,
  getPayment,
  addPropertyfee,
  getProperty
} from '@/api/property-fee'

export default {
  data() {
    return {
      total: 0,
      propertyList: [],
      buildingList: [],
      enterpriseList: [],
      dialogVisible: false,
      checkVisible: false,
      params: {
        enterpriseName: '',
        start: '',
        end: '',
        page: 1,
        pageSize: 5
      },
      time: [], // 搜索时间
      checkData: {},
      addFrom: {
        createTime: [], // 添加时间
        enterpriseId: null,
        buildingId: null,
        startTime: '',
        endTime: '',
        paymentAmount: null,
        paymentMethod: ''

      },
      addFromRules: {
        enterpriseId: [
          { required: true, message: '请选择租户', trigger: 'change' }
        ],
        buildingId: [
          { required: true, message: '请选择租贷楼宇', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择缴费周期', trigger: 'change' }
        ],
        paymentAmount: [
          { required: true, message: '请输入支付金额', trigger: 'change' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    time: {
      deep: true, // 深度监听数组的变化
      handler(newArray, oldArray) {
        this.params.start = newArray[0]
        this.params.end = newArray[1]
      }
    },
    'addFrom.createTime': {
      deep: true, // 深度监听数组的变化
      handler(newArray, oldArray) {
        this.addFrom.startTime = newArray[0]
        this.addFrom.endTime = newArray[1]
      }
    },

    // addFrom: {
    //   deep: true,
    //   async  handler(newArray, oldArray) {
    //     const { buildingId, startTime, endTime } = newArray
    //     if (buildingId && startTime && endTime) {
    //       const res = await getPayment({ buildingId, startTime, endTime })
    //       console.log(res)
    //       this.addFrom.paymentAmount = res.data
    //     }
    //   }
    // },
    'addFrom.buildingId': {
      deep: true,
      async  handler(newArray, oldArray) {
        const { buildingId, startTime, endTime } = this.addFrom
        if (buildingId && startTime && endTime) {
          const res = await getPayment({ buildingId, startTime, endTime })
          console.log(res)
          this.addFrom.paymentAmount = res.data
        }
      }
    },
    'addFrom.startTime': {
      deep: true,
      async  handler(newArray, oldArray) {
        const { buildingId, startTime, endTime } = this.addFrom
        if (buildingId && startTime && endTime) {
          const res = await getPayment({ buildingId, startTime, endTime })
          console.log(res)
          this.addFrom.paymentAmount = res.data
        }
      }
    },
    'addFrom.endTime': {
      deep: true,
      async  handler(newArray, oldArray) {
        const { buildingId, startTime, endTime } = this.addFrom
        if (buildingId && startTime && endTime) {
          const res = await getPayment({ buildingId, startTime, endTime })
          console.log(res)
          this.addFrom.paymentAmount = res.data
        }
      }
    }

  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await getPropertyList(this.params)
      // console.log(res)
      this.propertyList = res.data.rows
      this.total = res.data.total
    },
    // 分页
    handleCurrentChange(page) {
      this.params.page = page
      this.getData()
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getData()
    },
    async add() {
      this.dialogVisible = true
      const res1 = await getEnterpriseList()
      this.enterpriseList = res1.data
      const res = await getBuildList()
      this.buildingList = res.data
    },
    // 关闭弹窗
    close() {
      this.dialogVisible = false
      this.$refs.from.resetFields()
    },
    del(id) {
      this.$confirm('是否确认删除当前账单?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delProperty(id)
        if (res.code === 10000) {
          this.$message.success('删除成功')
        }
        this.getData()
      })
    },
    async submit() {
      await this.$refs.from.validate()
      const { buildingId, startTime, endTime, paymentAmount, paymentMethod, enterpriseId } = this.addFrom
      const res = await addPropertyfee({ buildingId, startTime, endTime, paymentAmount, paymentMethod, enterpriseId })
      console.log(res)
      this.$message.success('添加成功')
      this.getData()
      this.close()
    },
    search() {
      this.getData()
      this.params = {
        enterpriseName: '',
        start: '',
        end: '',
        page: 1,
        pageSize: 5
      }
      this.time = []
    },
    async check(id) {
      const res = await getProperty(id)
      console.log(res)
      this.checkData = res.data
      this.checkVisible = true
    },
    closeCheck() {
      this.checkVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  margin: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px #f4f6f8 solid;
  .el-input {
    width: 200px;
    margin-right: 20px;
  }
  .el-button {
    margin-left: 20px;
  }
  span {
    font-size: 14px;
  }
}
.operating {
  margin: 20px;
}
.table {
  padding: 0 20px;
}
::v-deep .el-table {
  td {
    padding: 5;
    .cell {
      font-size: 14px;
    }
  }
}
.el-dialog {
  .el-form {
    margin: 0 auto;
    width: 350px;
    .el-input,
    .el-select {
      width: 350px;
    }
    .el-form-item {
      height: 50px;
      width: 350px;

      ::v-deep .el-form-item__label {
        line-height: 20px;
      }
      ::v-deep
  .el-form-item__error{
    padding: 0;
  }
    }
  }
  .dialog-footer{
    padding: 20px;
  }
}
.check{

  p{
    color: #000;
    span{
      width: 200px;
      text-align: right;
      margin-right: 10px;
      display: inline-block;
      color: #9a9da2;
    }
  }
}
</style>
