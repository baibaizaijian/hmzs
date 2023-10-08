import request from '@/utils/request'

/** 获取工作首页信息 */
export function getInfo() {
  return request({
    url: '/home/workbench/info'
  })
}
export function getRentInfo() {
  return request({
    url: '/home/workbench/rentInfo'
  })
}
