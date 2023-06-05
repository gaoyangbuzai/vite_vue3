import request from '../utils/axios.ts'
interface loginParams {
  username: string
  password: string
}
export function login(params: loginParams): any {
  return request({
    url: '/login/',
    method: 'post',
    data: params
  })
}
