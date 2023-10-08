import request from '@/utils/request'
/**
 * 查看告警记录列表
 * @param {*} params
 * @returns
 */
export const getWarningList = (params) => request.get(`pole/warning/list`, { params })
/**
 * 删除告警记录
 * @param {*} id
 * @returns
 */
export const delWarning = (id) => request.delete(`pole/warning/${id}`)
/**
 * 查看告警详情
 * @param {*} id
 * @returns
 */
export const getWarning = (id) => request.get(`pole/warning/${id}`)
