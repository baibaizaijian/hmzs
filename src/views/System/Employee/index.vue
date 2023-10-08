<template>
  <div class="employee-container">
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input
        v-model="params.name"
        clearable
        placeholder="请输入员工姓名"
        class="search-main"
        size="mini"
      />
      <el-button type="primary" size="mini" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button
        type="primary"
        size="mini"
        @click="addEmployee"
      >添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="员工姓名" width="120" prop="name" />
        <el-table-column label="登录账号" width="120" prop="userName" />
        <el-table-column label="联系方式" width="120" prop="phonenumber" />
        <el-table-column label="角色" width="120" prop="roleName" />
        <el-table-column label="状态">
          <template #default="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              size="mini"
              type="text"
              @click="put(row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="delEmployee(row.id)"
            >删除</el-button>
            <el-button size="mini" type="text" @click="resetPassword(row.id)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total,  prev, pager, next,sizes, jumper"
        :page-size="params.pageSize"
        :total="total"
        :current-page="params.page"
        :page-sizes="[5, 10, 20, 50]"
        @current-change="pageChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 添加员工 -->
    <el-dialog
      title="添加员工"
      :visible="dialogVisible"
      width="480px"
      @close="closeDialog"
      @open="openDialog"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="员工姓名" prop="name">
            <el-input
              v-model="addForm.name"
              size="mini"
              placeholder="请输入员工姓名"
            />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input
              v-model="addForm.userName"
              size="mini"
              placeholder="请输入登录账号"
            />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input
              v-model="addForm.phonenumber"
              size="mini"
              placeholder="请输入联系方式"
            />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select
              v-model="addForm.roleId"
              placeholder="请选择角色"
              size="mini"
            >
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEmployeeListAPI,
  getRoleListAPI,
  createEmployeeAPI,
  delEmployeeAPI,
  putEmployee,
  resetPwd
} from '@/api/system'
export default {
  name: 'Employee',
  data() {
    return {
      employeeList: [],
      params: {
        page: 1,
        pageSize: 5,
        name: '' // 员工姓名
      },
      total: 0,
      dialogVisible: false,
      roleList: [], // 角色列表
      addForm: {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      },
      addFormRules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        roleId: [{ required: true, message: '请分配角色', trigger: 'blur' }],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.params)
      this.employeeList = res.data.rows
      this.total = res.data.total
    },
    pageChange(page) {
      this.params.page = page
      this.getEmployeeList()
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getEmployeeList()
    },
    async search() {
      await this.getEmployeeList()
      this.params.name = ''
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
      // this.$refs.addForm.resetFields()
      this.addForm = {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      }
    },
    // 打开弹框
    addEmployee() {
      this.dialogVisible = true
    },
    async openDialog() {
      const res = await getRoleListAPI()
      this.roleList = res.data
    },
    // 确认添加
    async submit() {
      await this.$refs.addForm.validate()
      if (this.addForm.id) {
        const { name, phonenumber, roleId, status, userName, id } = this.addForm
        await putEmployee({ name, phonenumber, roleId, status, userName, id })
        this.$message.success('修改成功')
        this.getEmployeeList()
      } else {
        await createEmployeeAPI(this.addForm)
        this.dialogVisible = false
        this.$message.success('添加成功')
        this.getEmployeeList()
      }
      this.closeDialog()
    },
    async put(row) {
      this.addForm = row
      this.dialogVisible = true
    },
    delEmployee(id) {
      this.$confirm('删除员工后将不可登录，确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delEmployeeAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getEmployeeList()
      })
    },
    async resetPassword(id) {
      this.$confirm('确定将密码重置为“123456”？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await resetPwd({ id })
        this.$message({
          type: 'success',
          message: '重置成功'
        })
        this.getEmployeeList()
      })
    },
    // 适配员工状态
    formatStatus(status) {
      return status === 1 ? '启用' : '禁用'
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px;
}
.el-form {
  width: 380px;
  margin: 0 auto;
  .el-form-item {
    margin: 0;
    width: 380px;
    .el-input,
    .el-select {
      width: 380px;
    }
    ::v-deep .el-form-item__error {
      padding: 0;
    }
  }
}
</style>
