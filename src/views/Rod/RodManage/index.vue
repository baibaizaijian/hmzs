<template>
  <div class="container">
    <div class="header">
      <p>一体杆名称:</p>
      <el-input
        v-model.trim="Query.poleName"
        size="mini"
        placeholder="请输入一体杆名称"
      />
      <p>一体杆编号:</p>
      <el-input
        v-model.trim="Query.poleNumber"
        size="mini"
        placeholder="请输入一体杆编号"
      />
      <p>处置状态:</p>
      <el-select
        v-model="Query.poleStatus"
        placeholder="请选择运行状态"
        size="small"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" size="mini" @click="search">查询</el-button>
    </div>
    <div class="btn">
      <el-button type="primary" size="mini" @click="add">添加一体杆</el-button>
      <el-button size="mini" @click="del">批量删除</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%" @selection-change="changSelection">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column label="序号" width="50">
          <template #default="row">
            {{ row.$index + (Query.page - 1) * Query.pageSize + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="poleName" label="一体杆名称" />
        <el-table-column prop="poleNumber" label="一体杆编号" />
        <el-table-column prop="poleIp" label="一体杆IP" />
        <el-table-column prop="areaName" label="安装区域" />

        <el-table-column prop="poleType" label="一体杆类型">
          <template #default="{ row }">
            {{ poleType[row.poleType] }}
          </template>
        </el-table-column>
        <el-table-column prop="poleStatus" label="运行状态">
          <template #default="{ row }">
            {{ poleStatus[row.poleStatus] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="put(row.id)">编辑</el-button>
            <el-button type="text" @click="del1(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="Query.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="Query.pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="id?'编辑一体杆':'添加一体杆'" :visible.sync="dialogFormVisible" width="40%" @close="close">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="一体杆名称" prop="poleName">
          <el-input v-model="form.poleName" autocomplete="off" size="mini" placeholder="请输入一体杆名称" />
        </el-form-item>
        <el-form-item label="一体杆编号" prop="poleNumber">
          <el-input v-model="form.poleNumber" autocomplete="off" size="mini" placeholder="请输入一体杆编号" :disabled="Boolean(id)" />
        </el-form-item>
        <el-form-item label="一体杆IP" prop="poleIp">
          <el-input v-model="form.poleIp" autocomplete="off" size="mini" placeholder="请输入一体杆IP" />
        </el-form-item>
        <el-form-item label="关联区域" prop="areaId">
          <el-select v-model="form.areaId" placeholder="请选择关联区域" size="mini">
            <el-option v-for="item in DropList" :key="item.areaId" :label="item.areaName" :value="item.areaId" />

          </el-select>
        </el-form-item>
        <el-form-item label="一体杆类型" prop="poleType">
          <el-select v-model="form.poleType" placeholder="请选择一体杆类型" size="mini">
            <el-option label="出口" value="export" />
            <el-option label="入口" value="entrance" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPoleList, delPoleList, addPole, getPole, putPole } from '@/api/pole'
import { getDropList } from '@/api/Area'
export default {
  data() {
    return {
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '正常'
        },
        {
          value: '1',
          label: '异常 '
        }
      ],
      tableData: [],
      total: 1,
      Query: {
        page: 1,
        pageSize: 10,
        poleName: '',
        poleNumber: '',
        poleStatus: ''
      },
      poleType: {
        entrance: '入口',
        export: '出口',
        center: '中心'
      },
      poleStatus: {
        0: '正常',
        1: '异常'
      },
      ids: {},
      dialogFormVisible: false,
      id: undefined, // 当前项id
      form: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: '',
        poleType: ''
      },
      DropList: {},
      rules: {
        poleName: [
          { required: true, message: '请选择一体杆名称', trigger: 'blur' }

        ],
        poleNumber: [
          { required: true, message: '请选择一体杆编号', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请选择一体杆IP', trigger: 'blur' },
          { pattern: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/, message: '请选择正确ip', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择关联区域', trigger: 'blur' }
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await getPoleList(this.Query)
      this.tableData = res.data.rows
      this.total = res.data.total
      // console.log(res)
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
    async del() {
      this.$confirm('是否确认删除当前选中的一体杆?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delPoleList(this.ids.join(','))
        if (res.code === 10000) {
          this.$message.success('删除成功')
        }
        this.getData()
      })
    },
    async del1(id) {
      this.$confirm('是否确认删除当前选中的一体杆?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delPoleList(id)
        if (res.code === 10000) {
          this.$message.success('删除成功')
        }
        this.getData()
      })
    },
    changSelection(a) {
      console.log(a)
      this.ids = a.map(item => item.id)
      console.log(this.ids)
    },
    async add() {
      this.dialogFormVisible = true
      const res = await getDropList()
      this.DropList = res.data
      // console.log(res)
    },
    close() {
      this.$refs.form.resetFields()
      this.form = {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: '',
        poleType: ''
      }
      this.id = undefined
    },
    async put(id) {
      this.id = id
      const res = await getPole(id)
      // console.log(res)
      this.form = res.data
      this.dialogFormVisible = true
    },
    async submit() {
      await this.$refs.form.validate()
      if (this.id) {
        const { id, poleName, poleNumber, poleIp, areaId, poleType } = this.form

        await putPole({ id, poleName, poleNumber, poleIp, areaId, poleType })
        this.dialogFormVisible = false
        this.$message.success('编辑成功')
        this.getData()
        // console.log(res)
      } else {
        await addPole(this.form)
        // console.log(res)
        this.dialogFormVisible = false
        this.$message.success('添加成功')
        this.getData()
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 15px;
}
.btn {
  margin: 20px 0;
}
.header {
  display: flex;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px #f4f6f8 solid;
  .el-input {
    width: 220px;
    margin: 10px;
  }
  .el-select {
    margin: 10px;
  }
}

 .el-dialog{

.el-form{
    display: flex;
  flex-direction: column;
  align-items: center;
  }

  .el-form-item {
    height: 50px;
    width: 350px;

  }
  .el-input{
    width: 350px;
    padding: 0;

  }

.el-select {
  width: 350px;
}
}
 ::v-deep
.el-form-item__label{
line-height: 20px;
}
 ::v-deep
  .el-form-item__error{
    padding: 0;
  }
</style>
