import Axios from 'axios'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import Cookies from 'js-cookie'
import cache from './cache'
import { errorCode } from './errorCode'
import store from '../store/index'

Axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const isRelogin = { show: false }

const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 20000 // 请求超时 20s
})
const cookieToken = Cookies.get('Authorization')
service.interceptors.request.use(
  async (config) => {
    // 是否需要设置 token
    const noToken = config.headers?.isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = config?.headers?.repeatSubmit === false
    if (cookieToken !== null && cookieToken !== undefined && !noToken) {
      config.headers.Authorization = 'Bearer ' + cookieToken // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const sUrl = sessionObj.url // 请求地址
        const sData = sessionObj.data // 请求数据
        const sTime = sessionObj.time // 请求时间
        const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交
        if (
          sData === requestObj.data &&
          requestObj.time - sTime < interval &&
          sUrl === requestObj.url
        ) {
          const message = '数据正在处理，请勿重复提交'
          return await Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
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
