import request from '@/utils/request'
/**
 * 查看一体杆列表
 * @param {*} params
 * @returns
 */
export const getPoleList = (params) => request.get(`pole/info/list`, { params })
/**
 * 删除一体杆
 * @param {*} id
 * @returns
 */
export const delPoleList = (id) => request.delete(`pole/info/${id}`)

/**
 * 添加一体杆
 * @param {*} id
 * @returns
 */
export const addPole = (data) => request.post(`pole/info/`, data)

/**
 * 查看一体杆
 * @param {*} id
 * @returns
 */
export const getPole = (id) => request.get(`pole/info/${id}`)
/**
 * 编辑一体杆
 * @param {*} id
 * @returns
 */
export const putPole = (data) => request.put(`pole/info/`, data)
