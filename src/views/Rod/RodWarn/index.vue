<template>
  <div class="container">
    <div class="header">
      <p>一体杆名称:</p>
      <el-input v-model.trim="Query.poleName" size="mini" placeholder="请输入一体杆名称" />
      <p>一体杆编号:</p>
      <el-input v-model.trim="Query.poleNumber" size="mini" placeholder="请输入一体杆编号" />
      <p>处置状态:</p>
      <el-select v-model="Query.handleStatus" placeholder="请选择" size="small">

        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" size="mini" @click="search">查询</el-button>

    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          width="100"
        >
          <template #default="row">
            {{ row.$index+(Query.page-1)*Query.pageSize+1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="poleName"
          label="一体杆名称"
        />
        <el-table-column
          prop="poleNumber"
          label="一体杆编号"
        />
        <el-table-column
          prop="errorType"
          label="故障类型"
        />
        <el-table-column
          label="处置状态"
        >
          <template #default="{row}">
            {{ handleStatus[row.handleStatus] }}
          </template>
        </el-table-column>

        <el-table-column
          prop="warningTime"
          label="告警时间"
        />
        <el-table-column
          label="操作"
        >
          <template #default="{row}">
            <el-button type="text" :disabled="row.handleStatus!=0">派单</el-button>
            <el-button type="text" @click="Detail(row.id)">详情</el-button>
            <el-button type="text" :disabled="row.handleStatus===1" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="Query.page"
        :page-sizes="[2, 5, 10, 20]"
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
import { getWarningList, delWarning } from '@/api/warning'

export default {
  data() {
    return {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '未派单'
      },
      {
        value: '1',
        label: '已派单 '
      },
      {
        value: '2',
        label: '已接单'
      },
      {
        value: '3',
        label: '已完成  '
      }],
      tableData: [],
      total: 1,
      Query: {
        page: 1,
        pageSize: 5,
        poleName: '',
        poleNumber: '',
        handleStatus: ''
      },
      handleStatus: {
        0: '未派单', 1: '已派单', 2: '已接单', 3: '已完成' }

    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await getWarningList(this.Query)
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
      this.Query.poleName = ''
      this.Query.poleNumber = ''
    },
    async del(id) {
      this.$confirm('是否确认删除当前告警记录?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delWarning(id)
        console.log(res)
        this.$message(res.msg)
        this.getData()
      })
    },
    Detail(id) {
      this.$router.push({
        path: '/warnDetail',
        query: {
          id
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.container{
  padding: 15px;
}
.header{
  display: flex;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px #f4f6f8 solid;
  .el-input{
    width: 220px;
    margin: 10px;
  }
  .el-select{
    margin: 10px;
  }
}
</style>
