import request from '@/utils/request'
// 获取区域列表
export const getAresList = (params) => request.get('/parking/area/list', { params })
// 关联区域下拉列表
export const getDropList = () => request.get('parking/area/dropList')
// 删除区域
export const delAres = (id) => request.delete(`parking/area/${id}`)

