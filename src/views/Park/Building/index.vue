<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="20" class="header">
        <span>楼宇名称：</span>
        <el-input size="mini" placeholder="请输入楼宇名称" clearable />
        <el-button type="primary" size="mini">搜索</el-button>
      </el-col>
      <el-col
        :span="20"
      ><el-button type="primary" size="mini" @click="showDialog=true">添加楼宇</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1+(pagination.page-1)*pagination.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="楼宇名称" prop="name" />
      <el-table-column label="层数" prop="floors" />
      <el-table-column label="在观面积（m²）" prop="area" />
      <el-table-column label="物业费（元/m²）" prop="propertyFeePrice" />
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          {{ text[scope.row.status] }}
        </template></el-table-column>

      <el-table-column label="操作">
        <template #default="{row}">
          <el-button type="text" size="small" @click="put(row.id)"> 编辑</el-button>
          <el-button type="text" size="small" :disabled="row.status === 1" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      small
      :current-page="pagination.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.pageSize"
      :layout="layout.join(',')"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加弹框 -->
    <AddBuild ref="add" :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getBuildingList, delBuilding } from '@/api/building'
import AddBuild from './AddBuild.vue'
export default {

  components: {
    AddBuild
  },
  data() {
    return {
      // 弹框显示
      showDialog: false,
      // 表格数据
      tableData: [],

      pagination: {
        name: '',
        page: 1,
        pageSize: 10
      },

      total: 1,
      text: ['空置中', '租赁中']
      // layout: ['total', 'prev', 'pager', 'next', 'sizes', 'jumper']

    }
  },
  computed: {
    layout() {
      if (parseInt(this.total / this.pagination.pageSize) <= 0) {
        return ['total', 'prev', 'pager', 'next', 'sizes']
      }
      console.log(this.total / this.pagination.pageSize)
      return [['total', 'prev', 'pager', 'next', 'sizes', 'jumper']]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await getBuildingList(this.pagination)
      console.log('楼宇', res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    handleSizeChange(e) {
      this.pagination.pageSize = e
      this.getData()
    },
    handleCurrentChange(e) {
      this.pagination.page = e
      this.getData()
    },

    // 增删改查业务

    async del(id) {
      this.$confirm('确认删除当前楼宇吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delBuilding(id)
        this.$message.success('删除成功')
        this.getData()
      }).catch(() => {
      })
    },

    async put() {

    }
  }
}

</script>

<style lang="scss" scoped>

.container {

  padding: 20px;

.header {
  display: flex;
  align-items: center;
  padding: 10px;
  span {
    font-size: 12px;
    width: 66px;
  }
  .el-input {
    width: 200px;
  }
  .el-button {
    margin-left: 25px;
  }
}
.el-form{
  padding: 0 80px;
  .el-form-item{
    margin: 0;
  margin-bottom: 20px;

}}

}

</style>
