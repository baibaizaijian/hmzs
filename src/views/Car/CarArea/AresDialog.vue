<template>
  <el-dialog title="添加区域" :visible="dialogVisible" width="38%" @close="close">
    <el-form :model="form">
      <el-form-item label="区域名称" class="inputw">
        <el-input v-model="form.areaName" autocomplete="off" size="mini" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="车位数（个）" class="inputw">
        <el-input v-model="form.spaceNumber" autocomplete="off" size="mini" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="面积（m²）" class="inputw">
        <el-input v-model="form.areaProportion" autocomplete="off" size="mini" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="关联计费规则" class="inputw">

        <el-select v-model="form.ruleId" placeholder="请选择" class="inputw" size="mini">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.ruleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" class="inputw">
        <el-input
          v-model="form.remark"
          type="textarea"
          autocomplete="off"
          size="mini"
          placeholder="请输入备注"
          rows="2"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRuleListAPI } from '@/api/rule'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true

    }

  },
  data() {
    return {
      form: {
        areaName: '',
        spaceNumber: '',
        areaProportion: '',
        ruleId: '',
        remark: ''
      },
      options: []
    }
  },
  async created() {
    const res = await getRuleListAPI()
    this.options = res.data.rows
    console.log('下拉', res)
  },
  methods: {
    close() {
      this.$emit('update:dialogVisible', false)
    }

  }

}
</script>

<style lang="scss" scoped>
*{
  margin: 0;
}
.inputw{
  width: 350px;
}
::v-deep .el-form {
  display: flex;
  flex-direction: column;
  align-items: center

}
</style>
