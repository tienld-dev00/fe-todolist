import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { callGetCurrentUserInfo, callLogin } from '@/common/api'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const authData = reactive({
    user: {
      id: 0,
      name: '',
      email: '',
      email_verified_at: '',
      created_at: '',
      updated_at: ''
    }
  })

  const login = (data: any) => {
    callLogin(data).then((res: any) => {
      toast.success(res.message)
      authData.user = { ...res.user }
      window.localStorage.setItem('access_token', res.access_token)
      router.replace('/tasks/all')
    })
  }

  const logout = () => {
    window.localStorage.removeItem('access_token')
    router.replace('/login')
  }

  const fetchUserInfo = () => {
    callGetCurrentUserInfo().then((res: any) => {
      authData.user = res.user
    })
  }

  fetchUserInfo()

  return { authData, login, logout }
})
