<template>
  <div>
    <div class="header">
      <el-button type="primary" @click="dialogVisible=true">添加区域</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        align="center"
        width="100"
      >
        <template #default="scope">
          {{ scope.$index + 1+(query.page-1)*query.pageSize }}
        </template></el-table-column>
      <el-table-column
        prop="areaName"
        label="区域名称"
      />
      <el-table-column
        prop="spaceNumber"
        label="车位数(个)"
      />
      <el-table-column
        prop="areaProportion"
        label="面积(m²)"
      />
      <el-table-column
        prop="ruleName"
        label="计费规则"
      />
      <el-table-column
        prop="remark"
        label="备注"
      />

      <el-table-column
        prop="date"
        label="操作"
      >
        <template #default="{row}">
          <el-button type="text">编辑</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      :current-page="query.page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="query.pageSize"
      :layout="layout.join(',')"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <AresDialog :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import AresDialog from './AresDialog'
import { getAresList, delAres } from '@/api/Area'

export default {
  components: {
    AresDialog
  },
  data() {
    return {
      list: [],
      query: {
        page: 1,
        pageSize: 10
      },
      total: 1,
      // 弹框
      dialogVisible: false

    }
  },
  computed: {
    layout() {
      if (parseInt(this.total / this.query.pageSize) <= 0) {
        return ['total', 'prev', 'pager', 'next', 'sizes']
      }
      return [['total', 'prev', 'pager', 'next', 'sizes', 'jumper']]
    }
  },
  created() {
    this.getdate()
  },
  methods: {
    async getdate() {
      const res = await getAresList(this.query)
      this.list = res.data.rows
      this.total = res.data.total
      console.log(res)
    },
    handleCurrentChange(e) {
      this.query.page = e
      this.getdate(this.query)
    },
    handleSizeChange(e) {
      this.query.pageSize = e
      this.getdate(this.query)
    },
    del(id) {
      this.$confirm('将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delAres(id)
        this.$message.success('删除成功')
        this.getdate(this.query)
      })
    }

  }
}
</script>

<style>

</style>
