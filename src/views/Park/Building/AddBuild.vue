<template>
  <el-dialog title="添加楼宇" :visible="showDialog" width="40%" @close="close">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="楼宇名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" size="mini" placeholder="请输入楼宇名称" />
      </el-form-item>
      <el-form-item label="楼宇层数" prop="floors">
        <el-input-number
          v-model="form.floors"
          autocomplete="off"
          controls-position="right"
          size="mini"
          placeholder="请输入楼宇楼层"
          style="width:350px;"
          class="hoverAble-input"
        />
      </el-form-item>
      <el-form-item label="在管面积" prop="area">
        <el-input v-model="form.area" autocomplete="off" size="mini" placeholder="请输入在管面积">
          <template slot="append">m²</template>
        </el-input>
      </el-form-item>
      <el-form-item label="物业费" prop="propertyFeePrice">
        <el-input v-model="form.propertyFeePrice" autocomplete="off" size="mini" placeholder="请输入物业费">
          <template slot="append">元/m²</template>
        </el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="showDialog = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddBuild',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // 弹窗
      formLabelWidth: '120px',
      form: {
        name: '',
        floors: '',
        area: null,
        propertyFeePrice: null

      },
      rules: {
        name: [{ required: true, message: '楼宇名称不能为空', trigger: 'blur' }],
        floors: [{ required: true, message: '楼层不能为空', trigger: 'blur' }],
        area: [{ required: true, message: '在管面积不能为空', trigger: 'blur' }],
        propertyFeePrice: [{ required: true, message: '物业费单价不能为空', trigger: 'blur' }]

      }
    }
  },
  methods: {
    close() {
      // 通知父组件关闭
      this.$emit('update:showDialog', false)
      this.$refs.form.resetFields()
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

.el-dialog{
.el-button{
  border-radius: 20px;
}

}
::v-deep
.el-form-item__label{
line-height: 20px;
}

::v-deep .el-input-number__decrease,
::v-deep .el-input-number__increase {
  visibility: hidden; /* 初始状态下隐藏按钮 */
}

::v-deep .hoverAble-input:hover .el-input-number__decrease,
::v-deep .hoverAble-input:hover .el-input-number__increase {
  visibility: visible; /* 鼠标悬停时显示按钮 */
}
::v-deep .el-input__inner {
  text-align: left;
}
</style>
