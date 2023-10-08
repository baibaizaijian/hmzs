import request from '@/utils/request'

// 物业费区域管理列表
export function getPropertyList(params) {
  return request({
    url: '/park/propertyfee',
    params
  })
}

/**
 * 查询所有企业
 * @returns
 */
export const getEnterpriseList = () => request.get('/park/all/enterprise')

/**
 * 删除账单
 * @param {*} id
 * @returns
 */
export const delProperty = (id) => request.delete(`park/propertyfee/${id}`)

/**
 * 获取楼宇列表
 * @param {*} id
 * @returns
 */
export const getBuildList = () => request.get(`/park/rent/building`)

/**
 * 物业费-预算金额
 * @param {*} data
 * @returns
 */
export const getPayment = (data) => request.post(`/park/propertyfee/pre/payment`, data)
/**
 * 物业费-添加账单
 * @returns
 */
export const addPropertyfee = (data) => request.post(`/park/propertyfee`, data)

/**
 * 物业费-查看账单详情
 * @returns
 */
export const getProperty = (id) => request.get(`park/propertyfee/${id}`)
