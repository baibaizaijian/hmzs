<template>

  <div class="navbar">
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-button size="mini">打开大屏</el-button>
          <!-- 用户名称 -->
          <span class="name">黑马管理员</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank">
            <el-dropdown-item> 项目地址 </el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="dialogVisible = true"> 修改密码 </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码弹框 -->
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="40%" class="dialog" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复密码" prop="Password">
          <el-input v-model="form.Password" show-password size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button type="primary" size="small" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { updatePass } from '@/api/user'
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        oldPassword: '',
        newPassword: '',
        Password: ''
      },
      // 校验规则
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码应该为6 ~ 16位', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码应该为6 ~ 16位', trigger: 'blur' }],
        Password: [{ required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码应该为6 ~ 16位', trigger: 'blur' }, {
            validator: (rule, val, cb) => {
              if (val === this.form.newPassword) {
                cb()
              } else {
                cb(new Error('两次输入的密码不一致'))
              }
            },
            trigger: 'blur'
          }
        ]

      }

    }
  },
  methods: {
    // 退出登录
    logout() {
      // 1. 询问用户
      this.$confirm('确认要退出登录吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认回调
        // 1. 清空用户数据（vuex cookie）
        this.$store.commit('user/clearUserInfo')
        // 清空路由
        this.$store.commit('menu/resetRouter')
        // 2. 跳转到登录
        this.$router.push('/login')
      }).catch(() => {
        // 取消或者.then中有错误
      })
    },
    /** 清除表单 */
    cancel() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    /** 修改密码*/
    async confirm() {
      await this.$refs.form.validate()
      const { oldPassword, newPassword } = this.form
      await updatePass({ oldPassword, newPassword })
      this.$message.success('修改密码成功')
      this.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  position: relative;

  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;

    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }

  .user-dropdown {
    color: #fff;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .name {
          margin-left: 10px;
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
  }
}

.el-input{
  width: 300px;
}

 ::v-deep .el-dialog{
    border-radius:10px;
    .el-dialog__footer{
      background-color: #f4f6f8;
      border-radius:0px 0px 10px 10px;
      padding: 0;
      .el-button{
        margin-right: 20px;
        margin-left: 0 ;

      }
    }

}
</style>
