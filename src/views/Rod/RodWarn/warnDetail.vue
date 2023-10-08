<template>
  <div class="detail-enterprise">
    <header class="header">
      <el-page-header content="查看详情" @back="$router.back()" />
      <div>黑马管理员</div>
    </header>
    <div class="main">
      <div class="Detail">
        <el-row :gutter="24">
          <el-col :span="12"><span> 警告时间：</span>{{ Detail.warningTime }}</el-col>
          <el-col :span="12"><span> 一体杆名称：</span>{{ Detail.poleName }}</el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12"><span> 告警区域：</span>{{ Detail.areaName }}</el-col>
          <el-col :span="12"><span> 一体杆编号：</span>{{ Detail.poleNumber }}</el-col>
        </el-row><el-row :gutter="24">
          <el-col :span="12"><span> 故障类型：</span>{{ Detail.errorType }}</el-col>
          <el-col :span="12"><span> 处置状态：</span> {{ handleStatus[Detail.handleStatus] }}</el-col>
        </el-row>
      </div>
      <div class="Contact">
        <el-row :gutter="24">
          <el-col :span="12"><span> 处理人：</span>{{ Detail.handleUser }}</el-col>
          <el-col :span="12"><span> 联系方式：</span>{{ Detail.phonenumber }}</el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12"><span> 处理结果：</span>{{ Detail.handleResult }}</el-col>
          <el-col :span="12"><span> 完成时间：</span>{{ Detail.handleTime }}</el-col>
        </el-row>
      </div>

    </div>

  </div>
</template>

<script>
import { getWarning } from '@/api/warning'
export default {
  data() {
    return {
      Detail: {},
      handleStatus: {
        0: '未派单', 1: '已派单', 2: '已接单', 3: '已完成' }

    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const res = await getWarning(this.$route.query.id)
      this.Detail = res.data
      console.log(res.data)
    }
  }

}
</script>

<style lang="scss" scoped>
.detail-enterprise{
  height: 100%;
  background-color: #f4f6f8;
  .header{
    background-color: #fff;
    display: flex;

    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    font-size: 16px;
    font-weight: 500;
    height: 64px;
  ::v-deep  .el-page-header{
    flex-wrap: wrap;
    align-content: center;
    }
  }
  .Detail ,.Contact{
    width: 1200px;
    background-color: #fff;
    margin: 20px auto;
    padding: 65px;
     font-size: 14px;
     .el-col{
      margin-bottom: 20px;
     }
    span{
      color: #909399;

      margin-left: 50px;
    }
  }
}

</style>
