import Axios from 'axios'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { errorCode } from './errorCode'
import store from '../store/index'

Axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const isRelogin = { show: false }

const service = Axios.create({
  baseURL: 'https://www.fastmock.site/mock/7c57f1519f6b660fe7702221e5061f30/vue3',
  timeout: 20000 // 请求超时 20s
})
service.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = localStorage.getItem('Authorization')
    return config
  },
  (err) => {
    void Promise.reject(err)
  }
)

service.interceptors.response.use(
  async (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code ?? 200
    // 获取错误信息
    const msg = errorCode[code] ?? res.data.msg ?? errorCode.default
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            isRelogin.show = false
            await store.dispatch('LogOut')
            location.href = '/index'
          })
          .catch(() => {
            isRelogin.show = false
          })
      }
      return await Promise.reject(new Error('无效的会话，或者会话已过期，请重新登录。'))
    } else if (code === 500) {
      ElMessage({
        message: msg,
        type: 'error'
      })
      return await Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElNotification.error({
        title: msg
      })
      return await Promise.reject(new Error('error'))
    } else {
      return res.data
    }
  },
  async (error: Record<string, string>) => {
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = `'系统接口' + ${message.substr(message.length - 3)} + '异常'`
    }
    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    return await Promise.reject(error)
  }
)

export default service
