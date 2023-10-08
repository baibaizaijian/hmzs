import request from '@/utils/request'
/** 获取楼宇列表 */
export function getBuildingList(params) {
  return request({
    url: '/park/building',
    params
  })
}

export function getBuildingRentListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

export function delBuilding(id) {
  return request({
    url: `park/building/${id}`,
    method: 'delete'
  })
}

