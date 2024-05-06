import axios from 'axios'
import { toast } from 'vue3-toastify'

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true
})

instance.interceptors.request.use((config) => {
  if (
    typeof window !== 'undefined' &&
    window &&
    window.localStorage &&
    window.localStorage.getItem('access_token')
  ) {
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token')
  }

  if (!config.headers.Accept && config.headers['Content-Type']) {
    config.headers.Accept = 'application/json'
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
  }

  return config
})

instance.interceptors.response.use(
  (res) => Promise.resolve(res.data),
  (error) => {
    console.log(error)
    if (error?.response?.data?.errors || error?.response?.data?.message) {
      toast.error(
        error?.response?.data?.errors
          ? Object.values(error?.response?.data?.errors)[0]
          : error.response.data.message
      )
    } else {
      toast.error(error.message)
    }
    console.log(error)
    return Promise.reject(error)
  }
)

export default instance
